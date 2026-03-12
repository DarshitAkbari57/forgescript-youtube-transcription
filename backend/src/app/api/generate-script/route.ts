import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!BACKEND_URL) {
      return NextResponse.json({ error: 'BACKEND_API_URL not configured' }, { status: 500 });
    }

    const response = await fetch(`${BACKEND_URL}/api/generate-script`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(errorText, { status: response.status });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to proxy request';
    return new Response(`ERROR: ${message}`, { status: 500 });
  }
}
