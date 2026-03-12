import { NextRequest, NextResponse } from 'next/server';
import { getCompletion } from '@/lib/ai';
import { buildHookVariationsPrompt } from '@/lib/prompts';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { topic, targetAudience } = await req.json();
    const prompt = buildHookVariationsPrompt(topic, targetAudience);
    const resultRaw = await getCompletion(prompt);
    if (!resultRaw) throw new Error('AI returned an empty response for hooks');
    const result = JSON.parse(resultRaw);
    
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate hooks';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
