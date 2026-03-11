import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildRefinePrompt } from '@/lib/prompts';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  const { currentScript, refinementRequest, voiceDescription } = await req.json();
  const prompt = buildRefinePrompt(currentScript, refinementRequest, voiceDescription);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = anthropic.messages.stream({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 8000,
          messages: [{ role: 'user', content: prompt }],
        });

        for await (const event of response) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Refinement failed';
        controller.enqueue(encoder.encode(`\n\nERROR: ${msg}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
