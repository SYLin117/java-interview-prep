# Java Interview Prep

A hand-edited static study site for senior-track Java / Spring Boot interview preparation, served on Vercel. No build step, no framework — plain HTML/CSS/JS plus three small Vercel Edge functions.

Live site: https://java-interview-prep-blush.vercel.app

## What's inside

Four views, toggled from the header:

- **Topics** — 262 interview Q&As across 13 Java/Spring topics (collections, concurrency, JVM, Spring Boot, JPA, testing, …), each expandable with a suggested answer.
- **LeetCode** — 200 popular problems grouped into 16 buckets (Arrays & Hashing → Math & Bit Manipulation), each with a paraphrased statement (upgraded to the official one on demand), approach, complexity, named-algorithm explainers, and an editable Java solution.
- **Garmin Behavioral** — 9 behavioral question chains with STAR answers and follow-ups.
- **System Design** — 46 concept Q&As across 8 themes, plus 12 full case-study walkthroughs.

Extras:

- **Chat assistant** (💬) — a floating chat panel backed by `api/chat.js`, which proxies to Groq's free tier.
- **Editable LeetCode solutions** — solutions are `contenteditable`. Edits save locally per device; with the master key (🔑 button) they can be **published to all visitors instantly** via `api/overrides.js` (Upstash Redis), or exported as `user-overrides.js` to commit to git.

## Local preview

Serve the folder with any static server:

```
npx serve .        # or: python -m http.server
```

(Opening `index.html` via `file://` works in Firefox but Chrome blocks the data files. The `/api/*` features need a Vercel deployment — the page degrades gracefully without them.)

## Deployment

Auto-deployed by Vercel's Git integration: pushes/merges to `main` go to production, and PR branches get preview deployments (a "Vercel" status check on the PR; preview URLs require a Vercel login). Manual deploys from the project root still work as a fallback:

```
vercel deploy --prod --yes
```

Optional env vars (Vercel → Settings → Environment Variables) to enable the dynamic features:

| Var | Enables |
|---|---|
| `GROQ_API_KEY` | Chat assistant (free key at console.groq.com) |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Publishing solution edits (free DB at console.upstash.com) |
| `OVERRIDES_MASTER_KEY` | The secret that gates who can publish edits |

## Development

```
npm install        # once — fetches ESLint
npm run lint       # run after any JS edit
```

See `ARCHITECTURE.md` for how the site works and `CLAUDE.md` for editing conventions (adding questions, LeetCode entries, code examples).
