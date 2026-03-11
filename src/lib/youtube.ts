export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Fallback: fetch transcript by extracting player config from video page.
 * This is more robust than the direct timedtext API which is often restricted.
 */
import { YtCaptionKit } from 'yt-caption-kit';

export async function fetchTranscriptTimedtext(videoId: string): Promise<string | null> {
  // 1. Try yt-caption-kit library (modern, resilient to 2026 YouTube changes)
  try {
    const kit = new YtCaptionKit();
    const result = await kit.fetch(videoId);
    
    if (result && result.snippets && result.snippets.length > 0) {
      return result.snippets.map((s: any) => s.text).join(' ');
    }
  } catch (error: any) {
    // yt-caption-kit failed
  }

  // 2. Custom fallback as second level
  try {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const res = await fetch(videoUrl, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Cookie': 'CONSENT=YES+cb.20210328-17-p0.en+FX+430',
      },
    });

    if (!res.ok) return null;
    const html = await res.text();
    const cookies = res.headers.get('set-cookie');

    // Extract ytInitialPlayerResponse
    const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*({[\s\S]+?})\s*;\s*(?:var|window|\[|document|<\/script)/);
    let playerResponse: any = null;
    
    if (playerResponseMatch) {
      try {
        playerResponse = JSON.parse(playerResponseMatch[1]);
      } catch (e) {}
    }

    if (!playerResponse) {
      const simpleMatch = html.match(/ytInitialPlayerResponse\s*=\s*({[\s\S]+?});/);
      if (simpleMatch) {
        try {
          playerResponse = JSON.parse(simpleMatch[1]);
        } catch (e) {}
      }
    }

    if (!playerResponse) return null;

    const captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!captionTracks || !captionTracks.length) return null;

    // Find English track
    let track = captionTracks.find((t: any) => t.languageCode === 'en' && t.kind !== 'asr');
    if (!track) {
      track = captionTracks.find((t: any) => t.languageCode === 'en');
    }
    if (!track) {
      track = captionTracks[0];
    }

    const transcriptUrl = track.baseUrl;
    if (!transcriptUrl) return null;

    // Fetch transcript
    const transHeaders: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': `https://www.youtube.com/watch?v=${videoId}`,
    };
    if (cookies) {
      transHeaders['Cookie'] = cookies;
    }

    const xmlRes = await fetch(transcriptUrl + '&fmt=json3', {
      headers: transHeaders,
    });
    
    if (!xmlRes.ok) return null;
    const transcriptData = await xmlRes.text();

    const parts: string[] = [];
    try {
      const json = JSON.parse(transcriptData);
      if (json.events) {
        for (const event of json.events) {
          if (event.segs) {
            for (const seg of event.segs) {
              if (seg.utf8) parts.push(seg.utf8.trim());
            }
          }
        }
      }
    } catch (e) {
      const tagMatches = transcriptData.matchAll(/<(?:text|p)[^>]*>([^<]*)<\/(?:text|p)>/g);
      for (const m of tagMatches) {
        const text = decodeHtmlEntities(m[1].trim());
        if (text) parts.push(text);
      }
    }

    if (parts.length > 0) return parts.join(' ');

    // 3. Absolute last resort: simple URL
    const simpleUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&fmt=json3`;
    const simpleRes = await fetch(simpleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    if (simpleRes.ok) {
      const simpleDataString = await simpleRes.text();
      if (simpleDataString.length > 0) {
        try {
          const json = JSON.parse(simpleDataString);
          if (json.events) {
            const simpleParts: string[] = [];
            for (const event of json.events) {
              if (event.segs) {
                for (const seg of event.segs) {
                  if (seg.utf8) simpleParts.push(seg.utf8.trim());
                }
              }
            }
            if (simpleParts.length > 0) return simpleParts.join(' ');
          }
        } catch (e) {}
      }
    }

    return null;
  } catch (error) {
    console.error('[DEBUG] Error fetching transcript via fallback:', error);
    return null;
  }
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export function estimateDuration(wordCount: number): string {
  const minutes = Math.round(wordCount / 130);
  if (minutes < 1) return '< 1 min';
  return `~${minutes} min`;
}
