import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

let source = await readFile(new URL('../api/chat.js', import.meta.url), 'utf8');
source = source
  .replace('process.env.GROQ_API_KEY', "'test-groq-key'")
  .replace('process.env.GEMINI_API_KEY', "'test-gemini-key'")
  .replace('process.env.OPENAI_API_KEY', "'test-openai-key'");

const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const { default: handler } = await import(moduleUrl);
const originalFetch = globalThis.fetch;
const captured = [];

globalThis.fetch = async (url, init) => {
  captured.push({ url: String(url), body: JSON.parse(init.body) });
  let payload;
  if (String(url).includes('groq.com')) {
    payload = 'data: {"choices":[{"delta":{"content":"groq-ok"}}]}\n\ndata: [DONE]\n\n';
  } else if (String(url).includes('googleapis.com')) {
    payload =
      'data: {"candidates":[{"content":{"parts":[{"text":"gemini-ok"}]}}]}\n\n';
  } else {
    payload =
      'event: response.output_text.delta\n' +
      'data: {"type":"response.output_text.delta","delta":"openai-ok"}\n\n';
  }
  return new Response(payload, {
    status: 200,
    headers: { 'content-type': 'text/event-stream' },
  });
};

try {
  const catalogResponse = await handler(new Request('https://example.test/api/chat'));
  const catalogText = await catalogResponse.text();
  const catalog = JSON.parse(catalogText);

  assert.equal(catalog.providers.length, 3);
  assert.ok(catalog.providers.every((provider) => provider.enabled));
  assert.doesNotMatch(catalogText, /test-(groq|gemini|openai)-key/);

  for (const provider of ['groq', 'gemini', 'openai']) {
    const response = await handler(
      new Request('https://example.test/api/chat', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': `test-${provider}`,
        },
        body: JSON.stringify({
          provider,
          messages: [{ role: 'user', content: 'hello' }],
        }),
      }),
    );
    const output = await response.text();
    assert.equal(response.status, 200);
    assert.match(output, new RegExp(`${provider}-ok`));
    assert.match(output, /data: \[DONE\]/);
  }

  assert.equal(captured[0].body.model, 'openai/gpt-oss-120b');
  assert.equal(
    captured[1].body.generationConfig.thinkingConfig.thinkingLevel,
    'LOW',
  );
  assert.equal(captured[2].body.model, 'gpt-5.6-luna');

  const badProvider = await handler(
    new Request('https://example.test/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        provider: 'unknown',
        messages: [{ role: 'user', content: 'hello' }],
      }),
    }),
  );
  assert.equal(badProvider.status, 400);
} finally {
  globalThis.fetch = originalFetch;
}

console.log('chat provider adapters: OK');
