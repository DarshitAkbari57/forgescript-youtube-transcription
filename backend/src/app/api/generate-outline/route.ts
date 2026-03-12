import { NextRequest, NextResponse } from 'next/server';
import { getCompletion } from '@/lib/ai';
import { buildOutlinePrompt } from '@/lib/prompts';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const state = await req.json();
    const prompt = buildOutlinePrompt(state);
    const resultRaw = await getCompletion(prompt);
    if (!resultRaw) {
      throw new Error('AI returned an empty response for the outline');
    }
    const result = JSON.parse(resultRaw);
    
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate outline';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
