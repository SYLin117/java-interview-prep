# CLAUDE.md

Guidance for Claude Code working in this repo. Captures the decisions made when the project was set up.

## What this is

Static study site for Java / Spring Boot interview prep. Hand-edited, no build step. Two files only.

## File layout

- `index.html` — markup, CSS, render logic. Edit for styling, layout, click behavior.
- `content.js` — `const topics = [...]` and `const extras = {...}`. Edit for adding, editing, or reordering topics and questions.

Both are classic (non-module) scripts. `content.js` is loaded first via `<script src="content.js"></script>`; the inline script in `index.html` then reads `topics` / `extras` from the shared script realm. Don't change either to `type="module"` — would break the cross-script reference.

The split was made deliberately so content can be edited without touching markup. Keep it that way; don't move questions back inline.

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
- Git author isn't configured globally on this machine. When committing, pass it inline:
  ```
  git -c user.email="newianlin@users.noreply.github.com" -c user.name="SYLin117" commit -m "..."
  ```

## Local preview

Opening `index.html` directly via `file://` works in Firefox but is blocked in Chrome from loading `content.js` (cross-file CORS on local files). Use any static server from this folder: `npx serve .` or `python -m http.server`.
