// Vercel Edge function — proxies chat to the selected LLM provider and streams
// normalized text deltas back to the client as { text: "chunk" } SSE events.
//
// Supported server-side env vars: GROQ_API_KEY, GEMINI_API_KEY, OPENAI_API_KEY.
// Keys never leave this function or enter the model prompt.

export const config = { runtime: 'edge' };

const SYSTEM_PROMPT =
  "Interview prep assistant for a Java & Spring Boot study site " +
  "(core Java, Collections, Concurrency, JVM, Spring Core/Boot/MVC/Data JPA/Security, " +
  "microservices patterns, Kafka, Redis, Docker, K8s). " +
  "Be concise: 1-3 short paragraphs. Inline `code` for identifiers; fenced ```java " +
  "blocks for short samples (≤15 lines). If asked something off-topic, say it's outside " +
  "the guide and offer a related Java/Spring topic instead.";

const MAX_OUTPUT_TOKENS = 350;
const DEFAULT_PROVIDER = 'groq';

/**
 * Provider adapter contract. JavaScript has no interface keyword, so JSDoc
 * documents the shape each implementation must satisfy.
 *
 * @typedef {Object} ChatProvider
 * @property {string} label - User-facing provider name.
 * @property {string} model - Provider model ID.
 * @property {string} modelLabel - Short user-facing model name.
 * @property {() => string|undefined} apiKey - Reads the server-side API key.
 * @property {(messages: Array<{role: string, content: string}>, apiKey: string) =>
 *   {url: string, init: RequestInit}} buildRequest - Builds the upstream request.
 * @property {(event: Object) => string} readDelta - Extracts text from one SSE event.
 */

/** @type {Record<string, ChatProvider>} */
const PROVIDERS = {
  groq: {
    label: 'Groq',
    model: 'openai/gpt-oss-120b',
    modelLabel: 'GPT-OSS 120B',
    apiKey: () => process.env.GROQ_API_KEY,
    buildRequest(messages, apiKey) {
      return {
        url: 'https://api.groq.com/openai/v1/chat/completions',
        init: {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
            max_completion_tokens: MAX_OUTPUT_TOKENS,
            reasoning_effort: 'low',
            include_reasoning: false,
            temperature: 0.6,
            stream: true,
          }),
        },
      };
    },
    readDelta(event) {
      return event?.choices?.[0]?.delta?.content || '';
    },
  },

  gemini: {
    label: 'Gemini',
    model: 'gemini-3.5-flash',
    modelLabel: '3.5 Flash',
    apiKey: () => process.env.GEMINI_API_KEY,
    buildRequest(messages, apiKey) {
      const contents = messages.map((message) => ({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.content }],
      }));
      return {
        url: `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:streamGenerateContent?alt=sse`,
        init: {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: {
              maxOutputTokens: MAX_OUTPUT_TOKENS,
              thinkingConfig: { thinkingLevel: 'LOW' },
            },
          }),
        },
      };
    },
    readDelta(event) {
      const parts = event?.candidates?.[0]?.content?.parts || [];
      return parts.map((part) => part.text || '').join('');
    },
  },

  openai: {
    label: 'OpenAI',
    model: 'gpt-5.6-luna',
    modelLabel: 'GPT-5.6 Luna',
    apiKey: () => process.env.OPENAI_API_KEY,
    buildRequest(messages, apiKey) {
      return {
        url: 'https://api.openai.com/v1/responses',
        init: {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            instructions: SYSTEM_PROMPT,
            input: messages,
            max_output_tokens: MAX_OUTPUT_TOKENS,
            reasoning: { effort: 'low' },
            store: false,
            stream: true,
          }),
        },
      };
    },
    readDelta(event) {
      return event?.type === 'response.output_text.delta' ? event.delta || '' : '';
    },
  },
};

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
 * Return public provider metadata. Configuration status is safe to expose;
 * actual keys remain server-side.
 *
 * @returns {Response} Provider catalog JSON.
 */
function providerCatalogResponse() {
  const providers = Object.entries(PROVIDERS).map(([id, provider]) => ({
    id,
    label: provider.label,
    model: provider.model,
    modelLabel: provider.modelLabel,
    enabled: Boolean(provider.apiKey()),
  }));
  return new Response(JSON.stringify({ defaultProvider: DEFAULT_PROVIDER, providers }), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
}

/**
 * Normalize one provider's SSE stream into the browser's stable wire format.
 *
 * @param {Response} upstream - Successful upstream streaming response.
 * @param {ChatProvider} provider - Adapter used to parse provider events.
 * @returns {ReadableStream} Stream of `data: {"text":"..."}\n\n` events.
 */
function normalizeProviderStream(upstream, provider) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const processLine = (line) => {
        if (!line.startsWith('data:')) return;
        const data = line.slice(5).trim();
        if (!data || data === '[DONE]') return;
        try {
          const text = provider.readDelta(JSON.parse(data));
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        } catch {
          // Ignore malformed provider events; later valid deltas still stream.
        }
      };

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          lines.forEach(processLine);
        }
        buffer += decoder.decode();
        if (buffer) buffer.split('\n').forEach(processLine);
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

/**
 * Edge function entry point.
 *
 * GET returns provider/model availability without exposing credentials.
 * POST accepts `{ provider, messages }` and returns normalized streaming SSE.
 *
 * @param {Request} req - Incoming Vercel Edge request.
 * @returns {Promise<Response>} Provider catalog, JSON error, or normalized SSE.
 */
export default async function handler(req) {
  if (req.method === 'GET') return providerCatalogResponse();
  if (req.method !== 'POST') return jsonError(405, 'Method not allowed');

  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  const providerId =
    typeof body.provider === 'string' && body.provider ? body.provider : DEFAULT_PROVIDER;
  const provider = PROVIDERS[providerId];
  if (!provider) return jsonError(400, 'Unsupported chat provider');

  const rawMessages = Array.isArray(body.messages) ? body.messages.slice(-8) : null;
  if (!rawMessages || rawMessages.length === 0) {
    return jsonError(400, 'messages array required');
  }
  const messages = rawMessages.map((message) => ({
    role: message?.role === 'assistant' ? 'assistant' : 'user',
    content: String(message?.content || '').slice(0, 2000),
  }));

  const apiKey = provider.apiKey();
  if (!apiKey) {
    return jsonError(503, `${provider.label} is not configured on this site.`);
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  if (!rateLimit(ip)) {
    return jsonError(429, 'Daily message limit reached. Try again tomorrow.');
  }

  const request = provider.buildRequest(messages, apiKey);
  let upstream;
  try {
    upstream = await fetch(request.url, request.init);
  } catch (error) {
    return jsonError(502, `${provider.label} request failed: ${error.message}`);
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '');
    return jsonError(
      502,
      `${provider.label} returned ${upstream.status}: ${detail.slice(0, 300)}`,
    );
  }

  return new Response(normalizeProviderStream(upstream, provider), {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      'connection': 'keep-alive',
    },
  });
}
