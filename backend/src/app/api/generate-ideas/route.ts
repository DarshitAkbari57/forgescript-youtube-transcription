import { NextRequest, NextResponse } from 'next/server';
import { getCompletion } from '@/lib/ai';
import { buildIdeaGeneratorPrompt } from '@/lib/prompts';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { niche } = await req.json();
    const prompt = buildIdeaGeneratorPrompt(niche);
    const resultRaw = await getCompletion(prompt);
    if (!resultRaw) throw new Error('AI returned an empty response for ideas');
    const result = JSON.parse(resultRaw);
    
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate ideas';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
