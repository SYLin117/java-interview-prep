# CLAUDE.md

Guidance for Claude Code working in this repo. Captures the decisions made when the project was set up.

## What this is

Static study site for Java / Spring Boot interview prep, served on Vercel. Hand-edited, no build step. Three optional Vercel Edge functions power chat, official LeetCode statements, and server-persisted LeetCode edits/reviewed status.

## File layout

- `index.html` — markup, CSS, render logic, the chat widget, and the view toggle (Topics ↔ LeetCode ↔ Companies ↔ System Design; the Companies view holds the per-company sub-tabs).
- `content.js` — `const topics = [...]` and `const extras = {...}` for the interview-topic question bank. Technical questions publicly reported for a company carry a `companies: [...]` array (Temu/Pinduoduo reports as `'Temu'`, CATL/宁德时代 reports as `'CATL'`); the Topics view renders the pills and offers a company filter built dynamically from whatever companies appear in the data. **Extras questions must keep their `[MQ]` / `[Redis]` / `[SQL]` / `[NoSQL]` / `[Docker]` / `[K8s]` / `[HPC]` / `[BMC]` / `[System]` prefix** — it is the only thing deciding which section the question lands in. `extras` stays a single object in `content.js`, but `index.html` splits it at render time into **one bonus section per tag**, so adding a question is still one line in one array. The prefix is stripped from the displayed text (the section title already says it). Section order, display name, and description come from the `extrasCategories` map in `index.html`; a tag with no entry still renders — named after itself, sorted last — so it can never silently vanish, but add an entry to give it a real title. Questions flagged `setup: true` lead their section, then easy → hard.
- `systemdesign.js` — `const systemDesignThemes = [...]` (8 concept themes, each with `{ id, icon, color, bg, title, questions: [{ d, q, a }] }` — 46 Q&A total) and `const systemDesignCases = [...]` (20 full design walkthroughs, each with `{ id, icon, title, tagline, problem, requirements[], estimation, components[], deepDive, flow, tradeoffs[], tags[], companies?[] }`). All the prose fields are HTML (innerHTML) except `flow`, which is plain text rendered in a `<pre>`. Rendered in the **System Design** view. Cases 1-12 were ported from a standalone study site; 13-20 were added 2026-08-06 from publicly reported ByteDance/TikTok system-design questions. The optional `companies` array renders the same `.lc-company-pill` used elsewhere and drives the Case Studies tag filter, whose options are built from whatever companies appear in the data — tagging a case is all that's needed to make it filterable.
- `behavioral.js` — `const behavioral = [...]` of behavioral-interview *question chains* (each: `category`, main `q`, STAR `a`, and a `followups: [{q, a}]` array). Personalized to the site owner; rendered in the **Garmin Behavioral** view. Answers are HTML (innerHTML). `[Personalize: …]` notes mark spots for the user to add a real metric/detail.
- `supermicro.js` — `const supermicro = [...]` of technical topic sections for the Supermicro System Engineer track (each: `id`, `title`, `desc`, `questions: [{d, q, a}]` — 7 topics, 36 Q&A: server architecture, BMC/IPMI/Redfish, Linux, storage & RAID, networking, scripting, process/behavioral). Grounded in interview reports + Supermicro job postings; rendered in the **Supermicro** view. Answers are HTML (innerHTML) with `&lt;`/`&gt;` entities inside code samples.
- `msi.js` — `const msiProcess = {...}` (interview-process overview: `updated`, `facts[]`, `stages[]`, `notes` — rendered as the card at the top of the view) and `const msiSections = [...]` (5 prep sections, each `{ id, title, desc, questions: [{ d, q, a }] }` — 48 Q&A) for the **MSI** view: prep for the MSI Surfaces (M S International, Orange CA) Software Programmer II/III interview. Their stack is C#/.NET Core, Angular, SQL Server — the Q&A is authored against their published job postings (the Glassdoor report text is login-gated), with Java→C# translations where they help. Answers are HTML (innerHTML), same escaping rules as `content.js`.
- `leetcode.js` — `const leetcode = [...]` with the 225 popular LeetCode problems (title, difficulty, bucket, category, URL, approach hint, complexity, Java solution). Entries are pre-sorted by `bucket` (16 buckets in display order); `num` is a stable internal key (1..225, NOT in array order) that keys `user-overrides.js`, `descriptions.js` and `algorithms.js`. Existing Garmin/Temu tags live on individual entries; a dated public reported-question snapshot after the array adds CATL, CoStar, Walmart, Amazon, Home Depot, Lowe's, DoorDash, TikTok, and ByteDance tags by stable `num`. TikTok and ByteDance stay separate tags — their reported lists barely overlap, so merging them would hide which loop a problem came from. Company tags render as colored pills and filter options. Problems 201-225 were added 2026-08-06 to cover reported TikTok/ByteDance questions that had no entry; six are LeetCode premium-only, so `api/leetcode.js` can't upgrade their `descriptions.js` paraphrase and the local text is all the page shows.
- `descriptions.js` — `const leetcodeDescriptions = { <num>: '<html>', ... }`. Paraphrased problem statements (2-4 sentences + example + constraints) shown in the expanded row; upgraded to the official statement on demand via `api/leetcode.js` (premium-only problems keep the local paraphrase).
- `algorithms.js` — `const namedAlgorithms = {...}` (named-algorithm explainers with worked traces: Kadane, Dijkstra, union-find, …) and `const problemAlgorithms = { <num>: ['<key>', ...] }` mapping problems to them; the renderer shows an "Algorithm" section for mapped problems.
- `user-overrides.js` — `const leetcodeUserOverrides = { <num>: '<code>', ... }`. Committed personal edits to LeetCode Java solutions. Generated by the floating "Export edits" button on the live site (bottom-left of the LeetCode view). Replace this file with the downloaded copy, then ship it via a PR like any other change (see Deployment). Since the publish feature (`api/overrides.js`) this is the *committed fallback layer*: code display precedence is localStorage draft → published override (server) → this file → canonical `leetcode.js`.
- `api/chat.js` — Vercel **Edge** serverless function with a shared provider interface and Groq, Gemini, and OpenAI implementations. It reports configured providers and normalizes each provider's stream for the browser. Auto-discovered by Vercel from the `api/` folder; no `vercel.json` needed.
- `api/overrides.js` — Vercel **Edge** function backing published edits and reviewed status. `GET /api/overrides` returns `{ enabled, canEdit, overrides, reviewed }`; authenticated `PUT` requests accept either `{ num, code }` (`code: null` deletes) or `{ num, reviewed: true|false }`. Storage uses two Upstash Redis hashes reached over its REST API. See "Publishing solution edits from the page" below for env vars and behavior.
- `api/leetcode.js` — Vercel **Edge** function that proxies LeetCode's public GraphQL API. `GET /api/leetcode?slug=two-sum` returns `{ id, title, difficulty, content }` (the official problem-statement HTML). Used to upgrade the paraphrased blurb in the LeetCode view to the real statement on demand (fetched on first expand, cached in `localStorage` + edge-cached 7 days). Needs no env var. Must be server-side — the browser can't call leetcode.com directly (CORS), and statements live behind GraphQL, not the page HTML. The client degrades gracefully: if the fetch fails the local paraphrased description stays.

All these data files are classic (non-module) scripts loaded via `<script src="...">` before the inline script; the inline script then reads `topics` / `extras` / `leetcode` / `behavioral` / `supermicro` / `systemDesignThemes` / `systemDesignCases` / `msiProcess` / `msiSections` from the shared script realm. Don't change any to `type="module"` — would break the cross-script reference.

## Page views

There are four top-level views, toggled by buttons in the header: **Topics** (the interview question bank — `<div id="topics-view">`), **LeetCode** (`<div id="leetcode-view">`), **Companies** (`<div id="companies-view">`), and **System Design** (`<div id="system-design-view">`). The toggle uses the `[hidden]` attribute so only one view is in the layout at a time; `setView()` is data-driven via the `VIEW_EL` / `VIEW_HASH` / `VIEW_PLACEHOLDER` maps.

The **Companies** view bundles the company-specific prep tracks behind a `.company-subtab` bar (state `companySubtab`, `setCompany()`, `COMPANY_EL` / `COMPANY_HASH` / `COMPANY_PLACEHOLDER` maps): **Garmin** (`#behavioral-view` — behavioral question chains from `behavioral.js`, one `.behavioral-section` per chain with its own category dropdown), **Supermicro** (`#supermicro-view` — System-Engineer prep sections from `supermicro.js` with a per-topic dropdown), and **MSI** (`#msi-view` — the `msiProcess` overview card first, then `.msi-section`s of expandable `.q-row`s sorted easy → hard; `applyMsiFilters` hides the process card while a search term is active). The three inner divs keep their ids, heroes, filter bars, and render functions — only their visibility is managed by `setCompany()`. The `.company-subtab` buttons share the `.sd-subtab` CSS rules but deliberately NOT the class: the System Design render binds its click handler to every `.sd-subtab` on the page.

URL hash routing: `#leetcode` (or `#lc`) opens the LeetCode view, `#companies` the Companies view, `#systemdesign` (or `#sd`) the System Design view; the legacy hashes `#behavioral`, `#supermicro` (or `#smci`), and `#msi` open the Companies view with the matching sub-tab, and selecting a sub-tab rewrites the hash to that company's legacy link so it stays shareable. Clicking a topic-anchor link (`#core-java`, etc.) auto-switches back to the topics view. The search box and its placeholder swap behavior based on the active view; inside Companies it dispatches to the active sub-tab's filter (`applyBehavioralFilters` / `applySupermicroFilters` / `applyMsiFilters`), and switching sub-tabs re-applies the current term. The System Design view has a **sub-tab toggle** (`.sd-subtab`, state `sdSubtab`): *Concepts* renders the Q&A themes as topic sections of expandable `.q-row`s; *Case Studies* renders `.sd-case` cards that expand from their header into labelled `.sd-block`s. Each sub-tab has its own dropdown — `#sd-topic-row` (theme) for Concepts, `#sd-company-row` (company tag) for Case Studies — both rendered once and swapped via the `hidden` attribute. Because `.lc-filter-row` sets an explicit `display: flex`, the `.lc-filter-row[hidden] { display: none }` rule is what actually performs that swap; without it the attribute is inert. Same trap applies to filtering itself: `applySystemDesignFilters` toggles a `.hidden` class on theme sections and case cards, which needs the `.sd-concept-section.hidden` / `.sd-case.hidden` rules to have any effect. Search (`applySystemDesignFilters`) targets whichever sub-tab is active.

The split was made deliberately so content can be edited without touching markup. Keep it that way; don't move questions back inline.

## Chat assistant

The floating 💬 button in the bottom-right opens a chat panel with a model selector. `GET /api/chat` returns the public provider catalog and whether each provider is configured; `POST /api/chat` accepts `{ provider, messages, context }`. The options are **Groq GPT-OSS 120B** (default), **Gemini 3.5 Flash**, and **OpenAI GPT-5.6 Luna**. Hard caps: 800 output tokens, per-turn input clipped to 2,000 chars, context clipped to 1,500 chars, and the last 8 turns of history. On reasoning models the output cap covers reasoning *and* visible text — at the old 350 a grounded answer was cut off mid-code-block, and a reply that spent the budget reasoning arrived completely empty.

**Question-bank grounding (retrieval, not answering):** before each send, `findQbContext()` in `index.html` ranks the 279 topic questions against the user's message (IDF-weighted F0.5 over stemmed tokens, ≥0.34, top 2, and at least one shared token with IDF ≥ 2.5) and passes the matched Q&A as `context`. `buildSystemPrompt()` appends it to the system prompt, and the "See *topic* →" links under a reply come from those same matches. **The model always writes the reply.** An earlier version rendered the best match directly and skipped the LLM call, which answered "how does garbage collection work" with the stored answer to "can Java still have memory leaks?" and made follow-ups like "tell me more" re-serve the same entry — don't reintroduce a local-answer short-circuit.

Three things the scoring has to keep doing, each fixing a real bug: **IDF weighting** — unweighted tokens let "difference" (in 55 of 279 questions), "between" (57) and "spring" (46) outvote "cache" (2), so "spring cache vs redis" retrieved notes on Redis TTL and Spring Data JPA. **The distinctive-token floor** — without it, generic phrasing alone matches. **F0.5 rather than F1** — recall penalises long, specific questions for their extra words. And the client **must not render citation links when the model returns nothing**: that left a bubble containing only "See *topic* →" links, which reads exactly like the site answering from its own notes.

**Wire format between function and client:** every adapter normalizes its upstream SSE into simple `data: {"text": "chunk"}\n\n` events. The client only appends `evt.text` chunks, so provider-specific request and response formats stay inside `api/chat.js`.

**Optional Vercel env vars:** `GROQ_API_KEY`, `GEMINI_API_KEY`, and `OPENAI_API_KEY`. Set each desired key in Vercel Project → Settings → Environment Variables (Production + Preview), then redeploy. The selector disables any provider whose key is missing. API keys remain server-side and are never included in the provider catalog or model prompt.

The `ChatProvider` contract in `api/chat.js` defines the model metadata, key lookup, request builder, and stream-delta reader. Add another implementation to `PROVIDERS` to expose a new option without changing the browser's streaming logic.

**Rate limiting** is per-instance in-memory (`DAILY_LIMIT = 10` messages per IP per day). Edge instances are ephemeral and there can be several, so it's a soft deterrent only. For strict global limits, swap for Vercel KV or Upstash Redis. The shared output-token cap is the primary per-request cost guard.

Provider definitions, model IDs, the system prompt, and token caps live at the top of `api/chat.js`.

## Publishing solution edits from the page

LeetCode solutions are `contenteditable` on the live site. Edits auto-save to `localStorage` as per-device drafts; four floating controls (bottom-left) export, publish, clear, and unlock edits.

- **📥 Export edits** — the original path: downloads a merged `user-overrides.js` (committed file + published overrides + local drafts) to commit to git.
- **☁ Publish N edits** — pushes each draft to `PUT /api/overrides`, then clears the drafts. Published overrides are stored server-side and served to **every visitor on every device immediately** — no commit, no redeploy.

**Master key auth:** the 🔑 button (shown only when the API is configured) prompts for the master key, verifies it against the server (`GET` reports `canEdit`), and stores it in `localStorage` (`lc_master_key`). While unlocked it shows 🔓 (click to sign out). Without the key, visitors can still edit locally but the publish button never appears and all writes are rejected with 401. Failed key attempts are soft-rate-limited per IP (30/day, in-memory per edge instance — same caveat as the chat limiter).

**Display precedence** (client, `lcBaseCode()` + `applyRemoteOverrides()` in `index.html`): localStorage draft → published override → `user-overrides.js` → canonical `leetcode.js`. The page fetches `/api/overrides` once on load and patches rendered rows; any failure (API not deployed, offline) silently leaves the committed behavior. The "Reset to original" button discards the local draft; when unlocked and no draft exists it becomes "Remove published edit" (confirm → `PUT { code: null }`).

**Reviewed status:** every LeetCode row has a checkbox backed by the same API. `GET` returns a public `reviewed` array so status syncs across devices; checkboxes are read-only until the master key is unlocked, then changes persist with `PUT { num, reviewed: true|false }`. Failed writes roll the checkbox back.

**Required env vars on Vercel** — all three are configured in production as of July 2026 (`/api/overrides` returns `enabled: true`, so the feature is live). If any is missing the feature reports `enabled: false` and stays dormant:

- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` — create a free Redis database at https://console.upstash.com, copy both from the database's "REST API" section.
- `OVERRIDES_MASTER_KEY` — any long random secret (e.g. `openssl rand -base64 24`). Whoever holds it can publish.

They live in Vercel Project → Settings → Environment Variables (Production + Preview); changing them requires a redeploy to take effect. Storage uses `lc:overrides` for Java source and `lc:reviewed` for reviewed problem IDs. Caps: 50 KB per solution, writes require the key; reads are public (the site content is public anyway) and `no-store` so updates appear immediately.

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
{ num: 1,                              // internal display/key id (1..200), stable — keys overrides/descriptions/algorithms
  lc: 1,                               // official LeetCode problem number — shown in the table's "#" column
  title: 'Two Sum',
  d: 'easy' | 'medium' | 'hard',
  bucket: 'Arrays & Hashing',          // one of the 16 high-level groups
  category: 'Array · Hash Map',        // per-row tag shown in the table
  url: 'https://leetcode.com/problems/two-sum/',
  approach: 'One-sentence-ish explanation of the technique.',
  complexity: 'O(n) time · O(n) space',
  code: `public int[] twoSum(...) { ... }`   // template literal — multiline OK
}
```

The renderer groups consecutive entries by their `bucket` field, inserting a styled section header before each new group. **Keep entries pre-sorted by bucket** in the array — the grouping logic relies on consecutive entries sharing a bucket. The 16 buckets, in display order:

1. Arrays & Hashing · 2. Two Pointers · 3. Sliding Window · 4. Stack · 5. Binary Search · 6. Linked List · 7. Trees · 8. Tries · 9. Heap / Priority Queue · 10. Backtracking · 11. Graphs · 12. Advanced Graphs · 13. Dynamic Programming - 1D · 14. Dynamic Programming - 2D · 15. Greedy · 16. Math & Bit Manipulation

New entries get the next free `num` (never renumber existing ones — `num` keys the override/description/algorithm files) and are inserted into their bucket's group in the array, so `num` order and array order diverge; that's expected.

Different from the topic answers: `approach`, `complexity`, and `code` are HTML-escaped at render time, so you can write `<`, `>`, `&` as-is inside the Java code (template literals make multi-line Java solutions readable). The renderer also re-runs highlight.js the first time a row is expanded — `pre code` blocks pick up JetBrains-Mono syntax coloring automatically.

## Code examples in answers

Only the **Multithreading & Concurrency** topic has Java code examples so far — it was the pilot. The other topics are prose-only. If the user asks to expand to more topics, follow the same pattern.

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

## Topic question sorting

Topic table headers are multi-column sort controls with **SQL `ORDER BY` semantics — priority follows the order columns were added and is never reshuffled**:

- Plain click on an unused column → restarts the sort with that column alone, ascending.
- Plain click on a column already in the sort → flips only its direction, leaving the priority list intact (so a stray click can't destroy a multi-column sort).
- Shift / ⌘ / Ctrl-click → appends a column as the next tie-breaker; on an already-sorted column it flips direction in place, and a second time removes it.
- ↺ clears the sort. Original order is the final tie-break, via `data-sort-number`.

State lives in the `topicSortState` WeakMap keyed by section, so each topic sorts independently. Columns are declared once in `topicSortFieldByKey` (`{ key, label, value, compare }`) and listed in `topicSortFields` — that's the only place to touch when adding a sortable column. Every section now has the same three columns (No. / Level / Question); the old per-section **Category** column disappeared when the combined extras section was split into one section per tag. The priority badge is absolutely positioned in the header button's corner because the 55px No. column can't fit label + arrow + badge in flow, and it's hidden for single-column sorts.

## Linting

ESLint flat config in `eslint.config.mjs` covers every `.js` file. Run:

```
npm run lint
```

(Requires a one-time `npm install` to fetch `eslint` + `globals` into `node_modules`.)

**Convention: run `npm run lint` after any JS edit and fix every reported issue before committing.** The inline `<script>` block in `index.html` isn't linted directly — use `node --check` (or the existing syntax-check command in the harness) for that.

The config knows about our cross-script globals (`topics`, `extras`, `leetcode`, `leetcodeUserOverrides`, `leetcodeDescriptions`, `namedAlgorithms`, `problemAlgorithms`, `behavioral`, `supermicro`, `systemDesignThemes`, `systemDesignCases`, `msiProcess`, `msiSections`) so `const X = ...` in a data file doesn't trigger `no-unused-vars`. Add new data-file globals to `dataFileGlobalsPattern` in `eslint.config.mjs`.

## Deployment

- GitHub: `SYLin117/java-interview-prep` (public).
- Vercel: project `java-interview-prep` under the `ians-projects-9fd6e881` scope; production alias is `java-interview-prep-blush.vercel.app`.
- Deploys are **automatic** via the Git → Vercel integration (connected as of July 2026 — it wasn't during initial setup): every merge to `main` deploys to production. PR branches get preview deployments, surfaced as a "Vercel" commit status check on GitHub; preview URLs sit behind Vercel's deployment protection (SSO), so viewing one requires a Vercel login.
- Manual deploys still work as a fallback: `vercel deploy --prod --yes` from the project root — but they're no longer part of the normal workflow.

### Ship changes through a pull request — never push to `main`

`main` is protected by the **`protect-main`** ruleset (active, targets the default branch): pull request required, the **"Vercel"** status check must pass, and no deletions or non-fast-forward pushes. Required approving reviews is **0**, so the repo owner can merge their own PR as soon as the preview deploy goes green — a PR costs one extra command, not a review cycle.

Repository admins hold an always-bypass on that ruleset, so `git push origin main` *appears* to work and prints `Bypassed rule violations for refs/heads/main`. That is the ruleset being overridden, not satisfied — it skips the Vercel preview check entirely and ships straight to production unverified. Don't do it, and treat that "Bypassed rule violations" line as a sign something went wrong.

Normal workflow for any change:

```
git checkout -b <topic-branch>
git -c user.email="newianlin@users.noreply.github.com" -c user.name="SYLin117" commit -m "..."
git push -u origin <topic-branch>
gh pr create --fill
```

Then let the "Vercel" check pass and merge (`gh pr merge --squash --delete-branch`). Merging is what ships to production; there is no manual deploy step.

- Git author isn't configured globally on this machine, so pass it inline on every commit — the `-c` flags above are not optional boilerplate:
  ```
  git -c user.email="newianlin@users.noreply.github.com" -c user.name="SYLin117" commit -m "..."
  ```
- Committing and pushing is still expected for every new change; the only difference is that it lands on a topic branch and merges via PR rather than going straight to `main`.

## Local preview

Opening `index.html` directly via `file://` works in Firefox but is blocked in Chrome from loading `content.js` (cross-file CORS on local files). Use any static server from this folder: `npx serve .` or `python -m http.server`.
