// Vercel Edge function — proxies chat to Groq and streams normalized text
// deltas back to the client as { text: "chunk" } SSE events.
//
// Requires env var GROQ_API_KEY (free tier — get one at https://console.groq.com).
// Set it in Vercel Project → Settings → Environment Variables.

export const config = { runtime: 'edge' };

// Llama 3.3 70B on Groq — high quality, free tier, very fast.
// Alternatives: 'llama-3.1-8b-instant' (faster, smaller), 'gemma2-9b-it'.
const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT =
  "Interview prep assistant for a Java & Spring Boot study site " +
  "(core Java, Collections, Concurrency, JVM, Spring Core/Boot/MVC/Data JPA/Security, " +
  "microservices patterns, Kafka, Redis, Docker, K8s). " +
  "Be concise: 1-3 short paragraphs. Inline `code` for identifiers; fenced ```java " +
  "blocks for short samples (≤15 lines). If asked something off-topic, say it's outside " +
  "the guide and offer a related Java/Spring topic instead.";

// Per-instance in-memory rate limit. Edge instances are ephemeral and there can
// be several, so this is a soft deterrent only. For strict global limits, swap
// for Vercel KV or Upstash Redis.
const buckets = new Map();
const DAILY_LIMIT = 10;

/**
 * Soft per-IP daily counter held in this Edge instance's memory.
 *
 * Bumps the counter for `${ip}:${today}` and returns whether the caller is
 * still under the daily cap. Because Vercel may spin up several Edge instances
 * for the same function, the true global count can be a multiple of what's
 * tracked here — treat it as a deterrent, not a hard quota. The map self-prunes
 * when it grows beyond 10k entries to bound memory.
 *
 * @param {string} ip - Client IP address (already extracted from forwarding headers).
 * @returns {boolean} true if this request is within the daily limit.
 */
function rateLimit(ip) {
  const day = Math.floor(Date.now() / 86_400_000);
  const key = `${ip}:${day}`;
  const count = (buckets.get(key) || 0) + 1;
  buckets.set(key, count);
  if (buckets.size > 10_000) buckets.clear();
  return count <= DAILY_LIMIT;
}

/**
 * Build a JSON error response. Used for every non-streaming failure path so the
 * client always sees a parseable `{ error: "..." }` body with a meaningful HTTP
 * status code.
 *
 * @param {number} status - HTTP status code (4xx or 5xx).
 * @param {string} message - User-facing error message (surfaced in the chat UI).
 * @returns {Response} A standard Fetch Response with content-type application/json.
 */
function jsonError(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/**
 * Edge function entry point — proxies a chat request to Groq and streams the
 * normalized response back to the caller.
 *
 * Request body shape (POST):
 *   { messages: [{ role: 'user' | 'assistant', content: string }, ...] }
 *
 * Response: an `text/event-stream` of SSE events of the form
 *   data: {"text": "chunk"}\n\n
 *   ...
 *   data: [DONE]\n\n
 *
 * Both the request and the response are intentionally provider-agnostic — to
 * swap Groq for another model, you only need to change the upstream URL, auth
 * header, request body, and the JSON path used to extract the delta text. The
 * client never has to know.
 *
 * Failure modes (all return JSON errors via jsonError()):
 *   405 - non-POST method
 *   429 - per-IP daily limit reached
 *   503 - GROQ_API_KEY env var not set
 *   400 - malformed body or missing messages
 *   502 - upstream fetch failed or Groq returned non-2xx
 *
 * @param {Request} req - Incoming Fetch Request (Vercel Edge runtime).
 * @returns {Promise<Response>} JSON error on failure, or a streaming SSE response on success.
 */
export default async function handler(req) {
  if (req.method !== 'POST') return jsonError(405, 'Method not allowed');

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  if (!rateLimit(ip)) {
    return jsonError(429, 'Daily message limit reached. Try again tomorrow.');
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return jsonError(503, 'Chatbot not configured — admin needs to set GROQ_API_KEY.');
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-8) : null;
  if (!messages || messages.length === 0) return jsonError(400, 'messages array required');

  // Groq uses the OpenAI chat-completion schema: system message goes first.
  const chatMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 2000),
    })),
  ];

  let upstream;
  try {
    upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: chatMessages,
        max_tokens: 350,
        temperature: 0.7,
        stream: true,
      }),
    });
  } catch (e) {
    return jsonError(502, `Upstream fetch failed: ${e.message}`);
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '');
    return jsonError(502, `Groq returned ${upstream.status}: ${detail.slice(0, 300)}`);
  }

  // Transform Groq's SSE (OpenAI-compatible) into a simple { text: "..." }
  // SSE stream for the client. Keeps the browser code provider-agnostic.
  //
  // Groq emits chunks like:
  //   data: {"id":"...","choices":[{"delta":{"content":"hello"},...}]}
  //   data: [DONE]
  //
  // We pull out choices[0].delta.content per chunk and re-emit as:
  //   data: {"text": "hello"}
  //   data: [DONE]
  //
  // The reader-loop handles arbitrary chunk boundaries — Edge fetch may split
  // SSE events anywhere, so we accumulate a buffer and only process up to the
  // last complete line each iteration.
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (!data) continue;
            if (data === '[DONE]') {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              continue;
            }
            try {
              const evt = JSON.parse(data);
              const text = evt?.choices?.[0]?.delta?.content;
              if (text) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
              }
            } catch {
              // ignore malformed lines
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      'connection': 'keep-alive',
    },
  });
}
