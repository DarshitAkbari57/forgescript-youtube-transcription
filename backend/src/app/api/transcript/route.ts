import { NextRequest, NextResponse } from 'next/server';
import { getCompletion } from '@/lib/ai';
import { buildStructuralAnalysisPrompt } from '@/lib/prompts';

export const runtime = 'nodejs';

const BACKEND_URL = process.env.BACKEND_API_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!BACKEND_URL) {
      return NextResponse.json({ error: 'BACKEND_API_URL not configured' }, { status: 500 });
    }

    const response = await fetch(`${BACKEND_URL}/api/transcript`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(errorData, { status: response.status });
      } catch {
        return NextResponse.json({ error: errorText }, { status: response.status });
      }
    }

    const data = await response.json();
    if (!data || !data.transcript) {
      console.warn('Backend returned empty or invalid transcript data:', data);
      return NextResponse.json(data || { error: 'Invalid response from transcript service' });
    }

    // Perform Deep Structural Analysis
    try {
      const analysisPrompt = buildStructuralAnalysisPrompt(data.transcript);
      const analysisRaw = await getCompletion(analysisPrompt);
      if (!analysisRaw) throw new Error('AI returned empty analysis');
      
      const deepAnalysis = JSON.parse(analysisRaw);
      
      return NextResponse.json({
        ...data,
        deepAnalysis,
      });
    } catch (analysisError) {
      console.error('Failed to perform deep analysis:', analysisError);
      return NextResponse.json(data);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to proxy request';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
