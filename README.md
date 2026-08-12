# Java Interview Prep

A hand-edited static study site for senior-track Java / Spring Boot interview preparation, served on Vercel. No build step, no framework — plain HTML/CSS/JS plus three small Vercel Edge functions.

Live site: https://java-interview-prep-blush.vercel.app

## What's inside

Five views, toggled from the header:

- **Topics** — 321 interview Q&As across 22 sections: 262 across 13 core Java/Spring topics (collections, concurrency, JVM, Spring Boot, JPA, testing, …) plus 59 in the bonus sections (message queues, Redis, SQL, Docker, Kubernetes, …), each expandable with a suggested answer.
- **LeetCode** — 225 popular problems grouped into 16 buckets (Arrays & Hashing → Math & Bit Manipulation), each with a paraphrased statement (upgraded to the official one on demand), approach, complexity, named-algorithm explainers, an editable Java solution, and a server-synced reviewed checkbox.
- **Companies** — per-company prep behind sub-tabs: **Garmin** (behavioral question chains with STAR answers and follow-ups), **Supermicro** (36 technical Q&As across 7 System-Engineer topics), and **MSI** (interview-process card plus 48 Q&As on C#/.NET, Angular and SQL Server).
- **System Design** — 46 concept Q&As across 8 themes, plus 20 full case-study walkthroughs.
- **Networking** — network-engineer prep scoped to OSI layers 1–3: 31 study-guide cards (Ethernet frame, IPv4 header, switch learning, STP, router forwarding, routing protocols, subnetting, troubleshooting), 34 Q&A drills including a subnetting practice set, and a 46-card recall drill with the answers covered.

Extras:

- **Chat assistant** (💬) — a floating chat panel with a model selector backed by pluggable Groq, Gemini, and OpenAI adapters in `api/chat.js`.
- **Editable LeetCode solutions** — solutions are `contenteditable`. Edits save locally per device; with the master key (🔑 button) they can be **published to all visitors instantly** via `api/overrides.js` (Upstash Redis), or exported as `user-overrides.js` to commit to git.
- **Reviewed progress** — each LeetCode problem has a checkbox persisted in Upstash Redis and synchronized across devices. The master key is required to change it.

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

Environment variables (Vercel → Settings → Environment Variables) for the dynamic features:

| Var | Enables |
|---|---|
| `GROQ_API_KEY` | Groq chat option (default: GPT-OSS 120B) |
| `GEMINI_API_KEY` | Gemini chat option (Gemini 3.5 Flash) |
| `OPENAI_API_KEY` | OpenAI chat option (GPT-5.6 Luna) |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Publishing solution edits and syncing reviewed status (free DB at console.upstash.com) |
| `OVERRIDES_MASTER_KEY` | The secret that gates publishing and reviewed-status changes |

## Development

```
npm install        # once — fetches ESLint
npm run lint       # run after any JS edit
```

See `ARCHITECTURE.md` for how the site works and `CLAUDE.md` for editing conventions (adding questions, LeetCode entries, code examples).
