import { NextRequest, NextResponse } from 'next/server';
import { Innertube } from 'youtubei.js';
import Anthropic from '@anthropic-ai/sdk';
import { extractVideoId, fetchTranscriptTimedtext } from '@/lib/youtube';
import { buildStructuralAnalysisPrompt } from '@/lib/prompts';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// Node runtime: youtubei.js uses YouTube's internal API; works for auto + manual captions
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body.url;
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Invalid YouTube URL. Please paste a valid youtube.com or youtu.be link.' },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL. Please paste a valid youtube.com or youtu.be link.' },
        { status: 400 }
      );
    }

    let transcript = '';

    // 1) Try timedtext first (stable; avoids youtubei.js parser errors when YT changes their response)
    let timedtext = await fetchTranscriptTimedtext(videoId);
    if (timedtext) {
      transcript = timedtext;
    } else {
      // 2) Fallback: youtubei.js
      try {
        console.log(`[YouTube] Fetching via youtubei.js for ${videoId}`);
        // Use TV client (often more resilient to parser changes and blocks)
        // generate_session_locally: true avoids an unnecessary fetch during init
        const youtube = await Innertube.create({ 
          client_type: 'TV' as any,
          generate_session_locally: true 
        });
        
        let info;
        try {
          info = await youtube.getInfo(videoId);
        } catch (e: any) {
          // youtubei.js failed
        }

        if (info) {
          try {
            const transcriptData = await info.getTranscript();
            const segments = transcriptData?.transcript?.content?.body?.initial_segments;
            if (segments?.length) {
              const parts: string[] = [];
              for (const seg of segments) {
                const snip = (seg as any).snippet;
                const text = snip?.toString?.() ?? snip?.text;
                if (text?.trim()) parts.push(text.trim());
              }
              if (parts.length) {
                transcript = parts.join(' ');
              }
            }
          } catch (e: any) {
            console.error('[YouTube] info.getTranscript failed:', e.message);
          }
        }
        
        if (!transcript) {
          throw new Error('Fallback failed');
        }
      } catch (innerError) {
        return NextResponse.json(
          {
            error:
              'No captions found for this video. Try a video with auto-generated or manual captions.',
          },
          { status: 404 }
        );
      }
    }

    let videoTitle = 'YouTube Video';
    let channelName = '';
    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      if (oembedRes.ok) {
        const oembed = await oembedRes.json();
        videoTitle = oembed.title || videoTitle;
        channelName = oembed.author_name || '';
      }
    } catch {
      // oEmbed is best-effort; transcript is the critical data
    }

    let structuralAnalysis = '';
    try {
      const analysisResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1000,
        messages: [{ role: 'user', content: buildStructuralAnalysisPrompt(transcript) }],
      });
      const content = analysisResponse.content[0];
      if (content.type === 'text') {
        structuralAnalysis = content.text;
      }
    } catch {
      // Structural analysis is a nice-to-have; don't block on it
    }

    return NextResponse.json({
      transcript,
      videoId,
      videoTitle,
      channelName,
      wordCount: transcript.split(/\s+/).length,
      structuralAnalysis,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to fetch transcript. The video may not have captions enabled.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
