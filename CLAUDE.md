# CLAUDE.md

Guidance for Claude Code working in this repo. Captures the decisions made when the project was set up.

## What this is

Static study site for Java / Spring Boot interview prep, served on Vercel. Hand-edited, no build step. One serverless function (`api/chat.js`) powers a chat assistant; everything else is static.

## File layout

- `index.html` — markup, CSS, render logic, the chat widget, and the view toggle (Topics ↔ LeetCode).
- `content.js` — `const topics = [...]` and `const extras = {...}` for the interview-topic question bank.
- `leetcode.js` — `const leetcode = [...]` with the 100 popular LeetCode problems (title, difficulty, bucket, category, URL, approach hint, complexity, Java solution). Entries are pre-sorted by `bucket` (15 buckets in display order) and `num` is 1..100 in that order.
- `api/chat.js` — Vercel **Edge** serverless function that proxies chat to Groq and streams the response back. Auto-discovered by Vercel from the `api/` folder; no `vercel.json` needed.

All three JS files are classic (non-module) scripts. `content.js` and `leetcode.js` are loaded via `<script src="...">` before the inline script; the inline script then reads `topics` / `extras` / `leetcode` from the shared script realm. Don't change any to `type="module"` — would break the cross-script reference.

## Page views

There are two top-level views, toggled by buttons in the header: **Topics** (the interview question bank — `<div id="topics-view">`) and **LeetCode 50** (`<div id="leetcode-view">`). The toggle uses the `[hidden]` attribute so only one view is in the layout at a time. URL hash routing: `#leetcode` (or `#lc`) opens the LeetCode view on load; clicking a topic-anchor link (`#core-java`, etc.) auto-switches back to the topics view. The search box and its placeholder swap behavior based on the active view.

The split was made deliberately so content can be edited without touching markup. Keep it that way; don't move questions back inline.

## Chat assistant

The floating 💬 button in the bottom-right opens a chat panel that calls `/api/chat`. The function proxies to **Groq Llama 3.3 70B Versatile** (free tier — OpenAI-compatible API) with a system prompt grounded in the site's topic list. Hard caps: `max_tokens=500` per response, per-turn input clipped to 2000 chars, last 20 turns of history sent.

**Wire format between function and client:** the function normalizes Groq's OpenAI-style SSE into simple `data: {"text": "chunk"}\n\n` events. The client just appends `evt.text` chunks. This keeps the browser code provider-agnostic — to swap providers, only `api/chat.js` needs to change.

**Required env var on Vercel:** `GROQ_API_KEY`. Get a free key at https://console.groq.com (no credit card required). Set it in Vercel Project → Settings → Environment Variables (Production + Preview), then redeploy. Without it the function returns 503 and the chat shows "Chatbot not configured".

**Provider history (why Groq):** the chat was originally wired to Anthropic Claude Haiku 4.5 (best quality, paid), then switched to Google Gemini 2.0 Flash (free tier), which started returning 429 "project quota exhausted" on a fresh key — likely a Google Cloud project-quota issue. Groq's free tier is more reliable in practice (14,400 requests/day on Llama 3.3 70B, no card required), so the chat now uses Groq. The system prompt and rate-limit logic are unchanged; only the upstream URL, auth header, request body shape, and SSE parser differ. If you ever want to swap back or try a different provider, follow the same pattern.

**Rate limiting** is per-instance in-memory (`DAILY_LIMIT = 10` messages per IP per day). Edge instances are ephemeral and there can be several, so it's a soft deterrent only. For strict global limits, swap for Vercel KV or Upstash Redis. The real cost guard is `max_tokens=500` plus Groq's free-tier daily quota.

Model id, system prompt, and token caps live at the top of `api/chat.js` — edit there.

## Adding or editing a question

Each entry in `content.js`:

```js
{ d: 'easy' | 'medium' | 'hard',
  q: 'Question text',
  a: 'Answer HTML — use <strong>, <code>, <ul><li> for structure' }
```

The `a:` field is rendered via `innerHTML`. Inline HTML is allowed; angle brackets inside the content must be HTML entities (`&lt;` / `&gt;`).

## Adding or editing a LeetCode problem

Each entry in `leetcode.js`:

```js
{ num: 1,
  title: 'Two Sum',
  d: 'easy' | 'medium' | 'hard',
  bucket: 'Arrays & Hashing',          // one of the 15 high-level groups
  category: 'Array · Hash Map',        // per-row tag shown in the table
  url: 'https://leetcode.com/problems/two-sum/',
  approach: 'One-sentence-ish explanation of the technique.',
  complexity: 'O(n) time · O(n) space',
  code: `public int[] twoSum(...) { ... }`   // template literal — multiline OK
}
```

The renderer groups consecutive entries by their `bucket` field, inserting a styled section header before each new group. **Keep entries pre-sorted by bucket** in the array — the grouping logic relies on consecutive entries sharing a bucket. The 15 buckets, in display order:

1. Arrays & Hashing · 2. Two Pointers · 3. Sliding Window · 4. Stack · 5. Binary Search · 6. Linked List · 7. Trees · 8. Tries · 9. Heap / Priority Queue · 10. Backtracking · 11. Graphs · 12. Advanced Graphs · 13. Dynamic Programming - 1D · 14. Dynamic Programming - 2D · 15. Greedy

Different from the topic answers: `approach`, `complexity`, and `code` are HTML-escaped at render time, so you can write `<`, `>`, `&` as-is inside the Java code (template literals make multi-line Java solutions readable). The renderer also re-runs highlight.js the first time a row is expanded — `pre code` blocks pick up JetBrains-Mono syntax coloring automatically.

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
