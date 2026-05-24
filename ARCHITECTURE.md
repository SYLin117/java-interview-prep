# Architecture

A hand-edited static interview-prep site served from Vercel. Two top-level views (a Java/Spring question bank and a LeetCode Top 50 collection), a floating chat widget backed by a Vercel Edge function that calls Groq. No build step, no bundler, no framework — three JS files plus one HTML file plus one Edge function.

## At a glance

- **Static HTML/CSS/JS.** Open `index.html` and everything is right there — no compilation.
- **Content is data, not markup.** Questions live in `content.js`; LeetCode problems live in `leetcode.js`. Adding content never touches HTML.
- **Two views, one page.** Header buttons toggle between a Topics view and a LeetCode view via the `[hidden]` attribute.
- **Single inline script** in `index.html` orchestrates everything (render, toggle, search, chat, sidebar, resize). No modules, no `defer` — order matters.
- **One serverless function** (`api/chat.js`) proxies chat to Groq with rate limiting and SSE normalization.
- **Vercel hosting** with manual `vercel deploy --prod --yes`. Auto-deploy via the GitHub integration isn't wired up.

## File map

| File | Purpose |
|---|---|
| `index.html` | Markup, CSS, render logic, view toggle, chat widget. Single inline `<script>` runs everything. |
| `content.js` | `const topics = [...]` and `const extras = {...}` — the interview question bank. |
| `leetcode.js` | `const leetcode = [...]` — 50 LeetCode problems with Java solutions. |
| `api/chat.js` | Vercel Edge function that proxies chat to Groq. Auto-discovered by Vercel from `api/`. |
| `CLAUDE.md` | Conventions for Claude Code agents working on the repo. |
| `ARCHITECTURE.md` | This file — for human developers. |
| `README.md` | Brief project overview. |
| `.gitignore` | Excludes `.vercel`, `.claude/`, etc. |

All three browser-side JS files are loaded as classic (non-module) scripts in this order: `content.js`, `leetcode.js`, then the inline script. `topics`, `extras`, and `leetcode` are all top-level `const` declarations in their files — JavaScript's classic-script global lexical scope shares them across all `<script>` tags on the page, so the inline script can read them directly.

## Page lifecycle

When the browser loads the page:

1. **HTML parses top-down.** The head loads:
   - Google Fonts (JetBrains Mono)
   - highlight.js CSS theme (atom-one-dark)
   - highlight.js JS (with `defer` — runs after document parses)
2. **Body parses.** Header (with toggle, search), `<div id="topics-view">` with placeholder containers, hidden `<div id="leetcode-view">` with an empty `<div id="leetcode-table">`, footer, and the chat widget skeleton (`<button id="chat-toggle">` plus a hidden `<div id="chat-panel">`).
3. **`content.js` runs** — `topics` and `extras` are defined.
4. **`leetcode.js` runs** — `leetcode` is defined.
5. **Inline script runs** (synchronously, blocking parse from here):
   - Merge `topics` + `extras` into `allTopics`
   - Update `#topic-count` / `#q-count` placeholders
   - Build topic cards (jump nav) and side-nav links
   - Build all 13 topic sections inside `#content`
   - Attach click handlers to `.q-row.q-data` (expand/collapse)
   - Set up `IntersectionObserver` for active-section highlighting in side-nav
   - Run highlight.js on existing topic-answer code blocks (or queue for `load` event if hljs not ready)
   - Build all 50 LeetCode rows inside `#leetcode-table`
   - Wire view-toggle buttons + URL-hash routing
   - Wire the view-aware search input
   - Wire the entire chat widget (open/close/send/cancel/resize, plus the local Q&A index)
6. **Deferred `highlight.js` finishes loading** — syntax colors apply to any existing code blocks.
7. **User interacts.** Click handlers and event listeners take over.

The whole inline script is ~600 lines, but each section has a clear `// ─── Section name ───` header.

## Two-view architecture

The header has a segmented control (`.view-toggle`) with two buttons: **Topics** and **LeetCode 50**. They're mutually exclusive — clicking one shows that view's wrapper `<div>` and hides the other via the standard HTML `hidden` attribute. URL hash routing keeps the views linkable:

| URL hash | View shown |
|---|---|
| (none) or `#core-java`, `#multithreading`, etc. | Topics |
| `#leetcode` or `#lc` | LeetCode |

The `setView(view, opts)` function does the work — toggles `.hidden`, updates active button states, swaps the search placeholder, toggles a `body.view-leetcode` class (so desktop layout can drop the left padding that's normally reserved for the side-nav), clears the search input, and scrolls to top.

A `hashchange` listener watches for users clicking topic-card anchor links (`#core-java`, etc.) while in LeetCode view — it auto-switches back to Topics view because that's where the linked section lives.

## Topics view

### Render pipeline

For each topic in `allTopics`, the inline script builds a `<section class="section topic-section" id="...">` with:
- A header (`#`, title, description)
- A `<div class="q-table">` containing one `<div class="q-row q-head">` and one `<div class="q-row q-data">` per question

The questions are **sorted by difficulty** at render time (easy → medium → hard) using a stable sort on a `{ easy: 0, medium: 1, hard: 2 }` rank map, so the displayed `01–20` numbers within each topic always run easy first.

Each row's `data-q` and `data-a` attributes hold the lowercased question text and the lowercased plain-text of the answer (HTML stripped), used by search.

### Click-to-expand

Clicking a `.q-row.q-data` toggles `.expanded` on the row, which makes the `.q-answer` child visible (it was `display: none` until then). Clicks that originate inside `.q-answer` are deliberately **ignored** so users can select and copy answer text without collapsing the row:

```js
row.addEventListener('click', (e) => {
  if (e.target.closest('.q-answer')) return;   // let users select detail text
  row.classList.toggle('expanded');
});
```

Don't regress this — it's a key UX detail.

## LeetCode view

### Render pipeline

Iterates over `leetcode[]`, building one `.lc-row.lc-data` per problem. Each row has 6 columns (number, level pill, title, category, "LeetCode ↗" link, expand toggle). At smaller viewport widths some columns collapse via media queries.

Unlike topic answers (which contain pre-escaped HTML), LeetCode `code` is stored as a plain Java string with real `<`, `>`, `&`. The renderer calls `escapeHtml()` at render time before embedding it in `<pre><code>...</code></pre>`. This means template literals in `leetcode.js` stay readable — no escape gymnastics in the source.

### Lazy syntax highlighting

Topic answers run highlight.js eagerly during the page load (queued for the `load` event since the script is `defer`-loaded). LeetCode is different — 50 blocks of Java would be wasteful work for code the user might never expand. So highlighting runs **only when a LeetCode row is first expanded**:

```js
if (row.classList.contains('expanded') && window.hljs) {
  row.querySelectorAll('pre code:not(.hljs)').forEach(b => window.hljs.highlightElement(b));
}
```

The `:not(.hljs)` selector ensures it only runs once per block (hljs adds the `.hljs` class after it processes a block).

## Header

A sticky `<header>` containing four elements: brand, view toggle, search box, stats (topic/question counts). It uses `position: sticky; top: 0;` with `backdrop-filter: blur(8px)` and a `-webkit-backdrop-filter` prefix for Safari. `html { scroll-padding-top: 80px; }` ensures that anchor jumps (clicking a topic card) don't land under the sticky header.

On viewports ≤768px the `header-inner` becomes `flex-wrap: wrap`, the stats hide, and the search box takes a full second row.

## Side navigation (desktop only)

On viewports ≥1280px, a fixed-position `<aside class="side-nav">` lists all topics on the left. It uses an `IntersectionObserver` with `rootMargin: '-100px 0px -55% 0px'` to figure out which topic-section is "currently being read" and highlight that link with the accent color and a left border.

The side-nav lives inside `<div id="topics-view">`, so it disappears with the topics view when the user switches to LeetCode. At the same breakpoint, `body { padding-left: 220px }` shifts the content right to make room — and `body.view-leetcode { padding-left: 0 }` removes that padding when LeetCode view is active, so the LeetCode table gets full width.

## Search

The search input is shared between views but **filters scope to the active view**:

| Active view | What's searched | What gets hidden |
|---|---|---|
| Topics | `data-q` (question) + `data-a` (answer text) + topic name | Non-matching `.q-row.q-data`, plus entire `.topic-section` if no row matches |
| LeetCode | `data-q` (title + category + approach) | Non-matching `.lc-row.lc-data` |

The filter listens on `input` events, lowercases + trims the term, and toggles a `.hidden` class. Switching views via `setView` clears the search input (dispatching `input` so filtered rows reappear).

## Code styling

The CSS for `.q-answer pre code` and `.lc-detail pre code` uses:

```css
font-family: "JetBrains Mono", "SF Mono", Consolas, monospace;
font-variant-ligatures: contextual;
font-feature-settings: "calt" 1;
```

That enables JetBrains Mono's contextual ligatures (e.g., `->`, `==`, `!=` fuse into single glyphs).

highlight.js is loaded with `defer` from cdnjs along with the `atom-one-dark` theme (the closest stock theme to JetBrains Darcula). Language is **auto-detected** per block — works well for the dominant Java content, occasionally mis-classifies tiny snippets (an `application.properties` block might colorize as something else). If a specific block needs pinning, the workaround is `<code class="language-properties">` etc.

## Responsive design

| Breakpoint | What changes |
|---|---|
| ≥1280px | Side-nav visible, body padding-left 220px (cleared in LeetCode view) |
| ≤1024px | LeetCode `category` column hides |
| ≤768px | Header wraps to 2 rows, stats hide, search becomes full-width, table padding shrinks, font-size drops, chat resize handle hides (mouse-only feature anyway) |
| ≤480px | Question table grid further compressed, hero meta shrinks, chat panel sized for phone |

`overflow-wrap: anywhere` on inline `<code>` ensures long unbreakable identifiers (e.g., `SPRING_PROFILES_ACTIVE`) don't cause horizontal scrolling on narrow screens.

## Chat widget

A floating 💬 button (bottom-right) opens a panel containing:
- A title bar with close button
- A scrollable message list
- A textarea + Send button form
- An optional resize handle in the top-left corner (visible only on desktop with a mouse)

### Local Q&A index

Before calling the LLM, the widget tries to answer locally using a token-overlap index built from `allTopics`. For each question, it stores a `Set<token>` (lowercase alphanumeric words ≥3 chars, minus a stopword list). On a user query, it tokenizes the same way and picks the question with the highest token overlap — but only returns a match if **≥60% of significant query tokens** overlap AND **≥2 tokens match in absolute terms**.

When that confidence threshold is met, the widget renders the matched answer + a "See *Topic* →" link, all without spending a token on the LLM. This is a meaningful cost reduction: most user queries will hit canonical questions already in the bank.

### Streaming flow

If no local match, the widget POSTs the conversation history (last 8 turns, capped at 2000 chars per turn) to `/api/chat`. The function streams back simple SSE events of the form `data: {"text": "chunk"}\n\n`, terminated by `data: [DONE]`. The widget accumulates `text` chunks into the current assistant bubble and auto-scrolls.

A `Cancel` button (replaces `Send` while streaming) aborts the in-flight `fetch()` via an `AbortController` — useful if the response is going long.

### Markdown rendering

The function returns plain text (often with Markdown). `renderChatMd()` converts it minimally — fenced code blocks (`` ```java `` etc.) become `<pre><code>` with syntax highlighting, inline backticks become `<code>`, asterisks bold/italics convert, line breaks become `<br>`. It deliberately doesn't pull in a full Markdown library — keeps the page weight tiny.

### Resize (desktop only)

CSS hides `.chat-resize-handle` unless `(pointer: fine) and (min-width: 768px)` is true — so touch-only devices never see it. On mouse-down, a `pointerdown` listener captures the pointer (so dragging stays attached even when the cursor leaves the handle), then `pointermove` calculates new dimensions based on drag delta from the anchor point (top-left corner, since the panel is anchored bottom-right). The resulting size is persisted to `localStorage['chatPanelSize']` and restored on next load.

CSS `max-width: calc(100vw - 2rem)` still wins over inline `width`, so shrinking the browser later re-clamps the panel naturally.

## Backend (api/chat.js)

A single Vercel Edge function. The full flow:

1. **Method check** — reject anything but POST with 405.
2. **Extract client IP** from `x-forwarded-for` (first hop) or `x-real-ip`.
3. **Rate limit** — `rateLimit(ip)` increments a per-IP per-day counter; returns 429 if over the daily limit (10). This is per-Edge-instance memory, so it's a soft deterrent only — for hard global limits, swap for Vercel KV or Upstash Redis.
4. **API key check** — if `GROQ_API_KEY` env var is missing, return 503 with a clear "not configured" message.
5. **Parse body** — expect `{ messages: [{ role, content }, ...] }`. Validate.
6. **Build Groq request** — system prompt first, then user/assistant turns, capped at 8 most recent and 2000 chars each. Groq uses the OpenAI chat-completion schema, so this is the same shape any OpenAI-compatible model would accept.
7. **Forward to Groq** — `POST https://api.groq.com/openai/v1/chat/completions` with `stream: true`.
8. **Handle errors** — if Groq returns non-2xx, surface the upstream message (truncated to 300 chars) in a 502.
9. **Transform SSE stream** — Groq sends `data: {"choices":[{"delta":{"content":"chunk"}}]}\n\n`. The function reads, parses each JSON, extracts `choices[0].delta.content`, and re-emits as `data: {"text": "chunk"}\n\n`. This keeps the **client wire format provider-agnostic** — to switch to Gemini or Anthropic later, only this file needs to change.
10. **Return** an SSE response with the transformed stream.

## Provider history

The chat backend went through three providers during development:

1. **Anthropic Claude Haiku 4.5** — best quality, paid (no free tier without credits).
2. **Google Gemini 2.0 Flash** — free tier in theory, but returned 429 "project quota exhausted" on a fresh key (likely a Google Cloud project-quota issue some accounts hit).
3. **Groq Llama 3.3 70B Versatile** — current. Reliable free tier (14,400 req/day, no credit card), very fast inference.

Each switch only required rewriting `api/chat.js`. The client wire format stayed the same throughout, because the function normalizes SSE on the way back. If you ever want to swap again, follow the same pattern: update upstream URL, auth header, request body shape, and SSE delta-extraction.

## Deployment

- **Repo:** https://github.com/SYLin117/java-interview-prep (public)
- **Vercel project:** `java-interview-prep` under the `ians-projects-9fd6e881` scope
- **Production alias:** https://java-interview-prep-blush.vercel.app
- **Deploy:** manual — `vercel deploy --prod --yes` from the project root

The GitHub → Vercel integration was not connected during setup (the CLI reported it couldn't connect to the GitHub repo). To enable auto-deploy on push, the user needs to install the Vercel GitHub app for the `SYLin117` account and grant it access to this repo, then connect the project via the Vercel dashboard's Git settings.

Until that's wired, the workflow is: edit → commit → `vercel deploy --prod --yes`.

## Adding content

### A new interview question

Edit `content.js`, find the topic's `questions: [...]`, and append:

```js
{ d: 'easy' | 'medium' | 'hard',
  q: 'Question text',
  a: 'Answer HTML — use <strong>, <code>, <ul><li> for structure.' }
```

The `a:` field is rendered via `innerHTML`. Angle brackets inside HTML content must be entities (`&lt;` / `&gt;`).

Optional: append a code example to any answer:

```js
'...prose...<div class="ex-label">Example</div><pre><code>// code\n...</code></pre>'
```

In an HTML-stored answer like that, code newlines are `\n`, single quotes are `\'`, angle brackets are `&lt;`/`&gt;`.

### A new LeetCode problem

Append to `leetcode.js`:

```js
{
  num: 51,
  title: 'Problem Title',
  d: 'easy' | 'medium' | 'hard',
  category: 'Array · Hash Map',
  url: 'https://leetcode.com/problems/...',
  approach: 'One-sentence-ish hint at the technique.',
  complexity: 'O(n) time · O(n) space',
  code: `public int solve(...) {
  // multi-line Java; use angle brackets directly — escaped at render time
  Map<Integer, Integer> m = new HashMap<>();
  ...
}`
}
```

Update the LeetCode count if you change the total (it's not hardcoded — the page just renders whatever is in the array).

### A new topic

Edit `content.js`, add a new object to the `topics` array between existing ones:

```js
{
  id: 'unique-id',
  name: 'Topic Name',
  desc: 'One-line description',
  questions: [ /* 20 questions */ ],
}
```

Then update the hero meta-cell counts in `index.html` (`Core Topics`, `q-count` placeholder), since the JS overwrites them at runtime but the placeholders also serve no-JS / SEO viewers.

## Conventions baked in (don't regress)

- **Sticky-header anchor offset** — `html { scroll-padding-top: 80px }` makes anchor jumps land below the header.
- **Click-on-answer-doesn't-collapse** — the guard `if (e.target.closest('.q-answer')) return;` is essential UX.
- **`overflow-wrap: anywhere`** on inline `<code>` — long identifiers must wrap on mobile.
- **`-webkit-backdrop-filter`** on the sticky header — Safari needs it.
- **Function declarations are hoisted, `const` is not** — the LeetCode renderer uses the chat widget's `escapeHtml()` (defined further down the file) and that works because `function` declarations hoist. Don't accidentally redeclare it as a `const`.
- **Both `content.js` and `leetcode.js` must stay classic scripts** (no `type="module"`) — they expose globals that the inline script reads.

## Local preview

Opening `index.html` directly via `file://` works in Firefox but is blocked in Chrome from loading `content.js` and `leetcode.js` (cross-file CORS on local files). Use any static server from this folder:

```bash
npx serve .
# or
python -m http.server
```

Then open http://localhost:8000.
