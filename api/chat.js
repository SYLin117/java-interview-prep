// Vercel Edge function — proxies chat to Anthropic and streams back.
// Requires env var ANTHROPIC_API_KEY (set in Vercel Project → Settings → Environment Variables).

export const config = { runtime: 'edge' };

const MODEL = 'claude-haiku-4-5-20251001';

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

// Per-instance in-memory rate limit. Edge instances are ephemeral and there can be
// several, so this is a soft deterrent — not a hard guarantee. For strict global
// limits, swap for Vercel KV or Upstash Redis.
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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonError(503, 'Chatbot not configured — admin needs to set ANTHROPIC_API_KEY.');
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : null;
  if (!messages || messages.length === 0) return jsonError(400, 'messages array required');

  // Sanitize: cap each turn, normalize roles
  const trimmed = messages.map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 2000),
  }));

  let upstream;
  try {
    upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: trimmed,
        stream: true,
      }),
    });
  } catch (e) {
    return jsonError(502, `Upstream fetch failed: ${e.message}`);
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '');
    return jsonError(502, `Anthropic returned ${upstream.status}: ${detail.slice(0, 300)}`);
  }

  return new Response(upstream.body, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      'connection': 'keep-alive',
    },
  });
}
