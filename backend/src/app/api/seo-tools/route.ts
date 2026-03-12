import { NextRequest, NextResponse } from 'next/server';
import { getCompletion } from '@/lib/ai';
import { buildSEOToolsPrompt } from '@/lib/prompts';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();
    const prompt = buildSEOToolsPrompt(topic);
    const resultRaw = await getCompletion(prompt);
    if (!resultRaw) throw new Error('AI returned an empty response for SEO');
    const result = JSON.parse(resultRaw);
    
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate SEO data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
