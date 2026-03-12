import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: process.env.ANTHROPIC_BASE_URL,
});

export function extractJSON(text: string) {
  try {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) return text;
    return text.slice(jsonStart, jsonEnd + 1);
  } catch {
    return text;
  }
}

export async function getCompletion(prompt: string, model = 'claude-3-5-sonnet-20241022') {
  console.log('Sending prompt to AI:', prompt.substring(0, 100) + '...');
  
  try {
    const url = `${process.env.ANTHROPIC_BASE_URL}/v1/messages`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      }),
    });

    const contentType = response.headers.get('content-type') || '';
    const responseText = await response.text();

    if (!response.ok) {
      console.error('AI Proxy error:', response.status, responseText);
      throw new Error(`AI service returned error ${response.status}: ${responseText.slice(0, 100)}`);
    }

    // If the proxy forces SSE even when stream: false is set
    if (contentType.includes('text/event-stream') || responseText.includes('event: message_start')) {
      console.log('Detected forced SSE stream from proxy, parsing manually...');
      let accumulated = '';
      const lines = responseText.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'content_block_delta' && data.delta?.text) {
              accumulated += data.delta.text;
            } else if (data.type === 'message_start' && data.message?.content?.[0]?.text) {
              accumulated += data.message.content[0].text;
            } else if (data.content?.[0]?.text) {
              accumulated += data.content[0].text;
            }
          } catch (e) {
            // Not JSON or partial chunk
          }
        }
      }
      return extractJSON(accumulated || responseText);
    }

    // Standard JSON response
    try {
      const data = JSON.parse(responseText);
      const text = data.content?.[0]?.text || '';
      return extractJSON(text || responseText);
    } catch {
      // If it's not JSON, it might be the raw text
      return extractJSON(responseText);
    }
  } catch (error) {
    console.error('AI completion error:', error);
    throw error;
  }
}
