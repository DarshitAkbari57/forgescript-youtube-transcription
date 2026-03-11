import { NextRequest, NextResponse } from 'next/server';

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

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to proxy request';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
