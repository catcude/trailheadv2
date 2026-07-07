# Trailhead

An adaptive daily support app that helps students regulate their nervous
systems, build executive functioning skills, and keep up academically — in one
place, grounded in peer-reviewed science.

The core product is **Guidepost**, a structured adaptive check-in led by
**Juniper**: a deterministic state machine over authored content, with
LLM-assisted adaptivity. It is not an open-ended chatbot.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in Supabase keys (see docs/SETUP.md)
pnpm dev
```

`LLM_PROVIDER=verbatim` (the default) runs the whole product with authored
content only — no LLM key required.

## Scripts

| Command          | What it does                    |
| ---------------- | ------------------------------- |
| `pnpm dev`       | Dev server                      |
| `pnpm build`     | Production build                |
| `pnpm typecheck` | TypeScript strict, no emit      |
| `pnpm lint`      | ESLint (no `any` allowed)       |
| `pnpm test`      | Vitest unit tests               |
| `pnpm format`    | Prettier                        |

## Where things live

- `CLAUDE.md` — project conventions; read first.
- `docs/` — canonical source documents (PRD, brief, authored path docs).
  **The path docs are Cat's IP: implement verbatim, never paraphrase.**
- `docs/plans/scaffolding-plan.md` — the phased build plan (milestones,
  architecture, CI/CD, security).
- `content/` — authored dialogue as versioned data. Juniper's lines are never
  hardcoded in components.
- `lib/guidepost/` — the path router + six-stage state machine (deterministic).
- `lib/llm/` — the only place LLM SDKs may be imported.

## Non-negotiables

- Privacy is a feature: users are assumed to be minors. RLS on every table,
  data minimization, no behavioral tracking, no data sale — ever.
- The Red Path is feature-flagged off and cannot ship without a dedicated
  safety review.
