# CLAUDE.md

Guidance for Claude Code working in this repo. Captures the decisions made when the project was set up.

## What this is

Static study site for Java / Spring Boot interview prep, served on Vercel. Hand-edited, no build step. One serverless function (`api/chat.js`) powers a chat assistant; everything else is static.

## File layout

- `index.html` — markup, CSS, render logic, and the chat widget. Edit for styling, layout, click behavior, or chat UI.
- `content.js` — `const topics = [...]` and `const extras = {...}`. Edit for adding, editing, or reordering topics and questions.
- `api/chat.js` — Vercel **Edge** serverless function that proxies chat to the Anthropic API and streams the response back. Auto-discovered by Vercel from the `api/` folder; no `vercel.json` needed.

`index.html` and `content.js` are classic (non-module) scripts. `content.js` is loaded first via `<script src="content.js"></script>`; the inline script in `index.html` then reads `topics` / `extras` from the shared script realm. Don't change either to `type="module"` — would break the cross-script reference.

The split was made deliberately so content can be edited without touching markup. Keep it that way; don't move questions back inline.

## Chat assistant

The floating 💬 button in the bottom-right opens a chat panel that calls `/api/chat`. The function proxies to **Anthropic Claude Haiku 4.5** with a system prompt grounded in the site's topic list. Hard caps: `max_tokens=500` per response, per-turn input clipped to 2000 chars, last 20 turns of history sent.

**Required env var on Vercel:** `ANTHROPIC_API_KEY`. Without it the function returns 503 and the chat shows "Chatbot not configured". Set it in Vercel Project → Settings → Environment Variables (Production + Preview), then redeploy.

**Rate limiting** is per-instance in-memory (`DAILY_LIMIT = 10` messages per IP per day). Edge instances are ephemeral and there can be several, so it's a soft deterrent only. For strict global limits, swap for Vercel KV or Upstash Redis. The real cost guard is `max_tokens=500`.

Model id, system prompt, and token caps live at the top of `api/chat.js` — edit there.

## Adding or editing a question

Each entry in `content.js`:

```js
{ d: 'easy' | 'medium' | 'hard',
  q: 'Question text',
  a: 'Answer HTML — use <strong>, <code>, <ul><li> for structure' }
```

The `a:` field is rendered via `innerHTML`. Inline HTML is allowed; angle brackets inside the content must be HTML entities (`&lt;` / `&gt;`).

## Code examples in answers

Only the **Multithreading & Concurrency** topic has Java code examples so far — it was the pilot. The other 10 topics are prose-only. If the user asks to expand to more topics, follow the same pattern.

Format appended after the prose:

```html
<div class="ex-label">Example</div><pre><code>// code...\n...</code></pre>
```

Writing examples inside the JS single-quoted `a:` string:

- `'` in Java → `\'` (or use `"..."` for Java string literals to avoid escaping).
- Newlines → `\n` (respected by `<pre>`).
- Angle brackets (generics, comparisons) → `&lt;` / `&gt;`.
- Keep snippets 5–12 lines. Show one concrete usage, not a tutorial.

CSS for these lives under `.q-answer pre` / `.q-answer pre code` / `.q-answer .ex-label` in `index.html`.

## Responsive design

Decisions baked in — preserve unless the user asks otherwise:

- Breakpoints at 768px (tablet) and 480px (phone).
- Sticky header relies on `html { scroll-padding-top: 80px }` so anchor scrolls aren't hidden behind it.
- Long unbreakable identifiers in `<code>` get `overflow-wrap: anywhere`; grid cells with text get `overflow-wrap: break-word` + `min-width: 0`.
- Both `-webkit-backdrop-filter` and `backdrop-filter` are set on the header for Safari.

## Click behavior

Clicking a `.q-row.q-data` toggles `.expanded`, but clicks originating inside `.q-answer` are deliberately ignored so users can select and copy answer text without collapsing the row. Don't regress this — the guard is `if (e.target.closest('.q-answer')) return;` in the row click handler.

## Deployment

- GitHub: `SYLin117/java-interview-prep` (public).
- Vercel: project `java-interview-prep` under the `ians-projects-9fd6e881` scope; production alias is `java-interview-prep-blush.vercel.app`.
- Deploys are **manual**: `vercel deploy --prod --yes` from the project root. The Git → Vercel integration was not connected during setup (Vercel CLI reported it couldn't connect to the GitHub repo). To enable auto-deploy on push, the user needs to grant the Vercel GitHub app access via the project's Git settings on vercel.com.
- Always commit and redeploy the code when there is a new change.
- Git author isn't configured globally on this machine. When committing, pass it inline:
  ```
  git -c user.email="newianlin@users.noreply.github.com" -c user.name="SYLin117" commit -m "..."
  ```

## Local preview

Opening `index.html` directly via `file://` works in Firefox but is blocked in Chrome from loading `content.js` (cross-file CORS on local files). Use any static server from this folder: `npx serve .` or `python -m http.server`.
