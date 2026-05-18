// Vercel Edge function — proxies chat to Groq and streams normalized text
// deltas back to the client as { text: "chunk" } SSE events.
//
// Requires env var GROQ_API_KEY (free tier — get one at https://console.groq.com).
// Set it in Vercel Project → Settings → Environment Variables.

export const config = { runtime: 'edge' };

// Llama 3.3 70B on Groq — high quality, free tier, very fast.
// Alternatives: 'llama-3.1-8b-instant' (faster, smaller), 'gemma2-9b-it'.
const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are an interview prep assistant for a Java & Spring Boot study site. The user is preparing for technical interviews.

Be concise: 1-3 short paragraphs unless the user explicitly asks for depth. Use inline \`code\` for class/method/keyword names. Use fenced \`\`\`java blocks for short code samples (≤ 15 lines).

Stay focused on the topics in the user's question bank:
- Core Java & OOP (final/finally/finalize, ==/equals, String pool, OOP pillars, exceptions)
- Collections & Generics (HashMap internals, PECS, ConcurrentHashMap, Comparable/Comparator)
- Multithreading & Concurrency (volatile, synchronized, ExecutorService, virtual threads, JMM, locks)
- JVM Internals & Performance (heap/stack, GC algorithms, JIT, escape analysis, OOM diagnosis)
- Spring Core & IoC (beans, scopes, DI, AOP, circular dependencies, bean lifecycle)
- Spring Boot & Auto-config (starters, profiles, actuator, properties, conditional auto-config)
- Spring MVC & REST APIs (mappings, validation, exception handling, content negotiation, async controllers)
- Spring Data JPA & Hibernate (entity lifecycle, N+1, @Transactional propagation, locking, dirty checking)
- Spring Security (filter chain, JWT, OAuth2/OIDC, CSRF, method security, password encoding)
- Multithreading in Spring (@Async, @Scheduled, virtual threads in Boot 3.2+, async controllers, TaskDecorator)
- Microservices Patterns (circuit breaker, saga, outbox, distributed tracing, bulkhead, idempotency)
- Extras (Kafka, RabbitMQ, Redis, Docker, Kubernetes)

If asked about something off-topic, kindly say it's outside this study guide and offer to help with a related interview topic instead.`;

// Per-instance in-memory rate limit. Edge instances are ephemeral and there can
// be several, so this is a soft deterrent only. For strict global limits, swap
// for Vercel KV or Upstash Redis.
const buckets = new Map();
const DAILY_LIMIT = 10;

function rateLimit(ip) {
  const day = Math.floor(Date.now() / 86_400_000);
  const key = `${ip}:${day}`;
  const count = (buckets.get(key) || 0) + 1;
  buckets.set(key, count);
  if (buckets.size > 10_000) buckets.clear();
  return count <= DAILY_LIMIT;
}

function jsonError(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

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

  const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : null;
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
        max_tokens: 500,
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
