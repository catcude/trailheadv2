# Performance & Security Audit — 2026-07-20

Scope: full sweep of the application code — API routes, server actions,
middleware, Supabase migrations/RLS, the LLM layer (`lib/llm/`), Stripe
billing, client bundles, server-component data fetching, database indexes,
caching/rendering config, and security headers. Every finding below was
verified against source; file:line references are as of this commit.

Companion remediation plan: `docs/plans/optimization-plan.md`.
Living checklist updated alongside this audit: `docs/security.md`.

---

## Part 1 — Security

**Headline: no high-severity vulnerabilities found.** The codebase is
unusually security-conscious for its stage. Findings are medium/low
defense-in-depth and coverage items.

### 1.1 Findings

| Sev | Finding | Where |
|---|---|---|
| MED | Production CSP includes `script-src 'unsafe-inline'` (and `style-src 'unsafe-inline'`), weakening XSS defense-in-depth. Practical surface is small (React escaping everywhere, zero `dangerouslySetInnerHTML`), but CSP is not a hard second line today. Nonce-based CSP is already a tracked backlog item in `docs/security.md`. | `next.config.ts:16` |
| MED | Crisis-detection coverage: the lexicon in `lib/llm/safety.ts` is an English/leet-normalized phrase list — paraphrase or non-English evasion is possible. The optional classifier (`SAFETY_CLASSIFIER`) is opt-in, timeout-bounded (2.5s), and fail-open — but strictly add-only: it can never clear a lexicon hit, so injection can't suppress the floor. This is a coverage limitation, not an exploit. | `lib/llm/safety.ts`, `lib/llm/safety-classifier.ts` |
| MED | Data flow to the LLM provider: when a real provider is active, students' free-text check-in input is transmitted to Anthropic in three flows (brain-dump interpretation, plan-change explanation, crisis classifier). Nothing is logged locally, but users are assumed minors — this needs an explicit data-processing decision (no-training terms / DPA). Matches open item OQ1 in `docs/security.md`. **Flagged for Cat — not a code decision.** | `lib/llm/interpret.ts`, `lib/llm/plan-change.ts`, `lib/llm/safety-classifier.ts` |
| LOW | Ownership relies on RLS alone in several queries — session load in the check-in engine, dashboard mutations (`archiveHabit`, `setGoalStatus`, `toggleHabitToday`), and the weekly-horizon read filter by row id / week only, with no application-level `user_id` filter. Correct today (RLS policies are owner-scoped), but there is no second layer if a policy ever regresses. | `app/api/checkin/route.ts:165`, `app/(app)/dashboard/actions.ts:30,47,103`, `app/api/weekly-horizon/route.ts:25` |
| LOW | The in-memory per-IP rate-limit backstop keys on the first hop of `x-forwarded-for`, which is client-controllable. The authoritative limit (Postgres `check_rate_limit` RPC keyed by authenticated `user.id`, fail-closed) is not spoofable, so impact is limited to the backstop. `/api/checkin/close` and `/api/weekly-horizon` are unthrottled (cheap, auth-gated). | `app/api/checkin/route.ts:83`, `lib/utils/rate-limit.ts` |
| LOW | CSRF on API routes is implicit: it depends on Supabase auth cookies staying `SameSite=Lax` (the default). No explicit Origin check on state-changing routes; a future cookie-config change would silently open them. (Server actions get Next.js's built-in Origin/Host check.) | `app/api/checkin/*`, `app/api/weekly-horizon/` |
| LOW | Stripe checkout/portal success- and cancel-URLs are built from `x-forwarded-host`/`host` request headers. Host-header influence, but it only affects the requesting user's own redirect target. | `app/(app)/settings/actions.ts:12–15` |

### 1.2 What is done well (verified, not assumed)

- **RLS everywhere.** All 11 tables enable RLS in the migration that creates
  them; every policy is owner-scoped via `auth.uid()`; none use `USING (true)`.
- **De-identified safety telemetry.** `safety_events` has RLS enabled with
  *zero policies* and no grant — no client path at all. The schema has no
  `user_id`, `session_id`, or text column; the only writer is the
  `log_safety_event` security-definer RPC accepting category/path/stage. The
  "no identifiable safety telemetry" rule holds in schema *and* code.
- **Security-definer hygiene.** `handle_new_user`, `check_rate_limit`, and
  `log_safety_event` all set `search_path = ''` and fully qualify names;
  execute is revoked from `public`/`anon`.
- **Service-role confinement.** `lib/supabase/service.ts` is imported in
  exactly one place — `lib/billing/webhook.ts` — reachable only from the
  signature-verified Stripe webhook. Never in a client file, never
  `NEXT_PUBLIC_`.
- **Stripe webhook.** Raw body read before `constructWebhookEvent`; missing
  secret → 503, missing signature → 400; unverified bodies never processed;
  handler idempotent via upserts; transient failures return 500 so Stripe
  retries.
- **LLM isolation.** `advance()` in `lib/guidepost/machine.ts` is
  deterministic; LLM output fills tool props and prepends grounded
  explanation text but can never move the state machine. The crisis lexicon
  runs before any LLM call and is the floor — the classifier can only add
  escalations.
- **Red Path gate.** Double env gate (`FF_RED_PATH` +
  `RED_PATH_RELEASE_APPROVED`) plus `assertPathServable` as a fail-closed
  production backstop, re-checked at mid-session path shifts.
- **Auth flow.** `getUser()` (server-validated) everywhere rather than
  `getSession()`; auth callback validates the `next` param against protected
  paths (no open redirect); middleware fails closed when Supabase is
  unconfigured.
- **No leakage.** No `console.*` in `app/` or `lib/`; generic error messages;
  no secrets committed (`.env*` ignored, `.env.example` empty-valued); no
  `dangerouslySetInnerHTML`; strong header set (HSTS+preload, XFO DENY,
  `frame-ancestors 'none'`, nosniff, Referrer-Policy, Permissions-Policy).
- **Rate limiting fails closed.** An RPC error blocks the check-in (500)
  rather than allowing it.

---

## Part 2 — Performance

**Headline: three high-impact issues** — marketing bundle weight, dashboard
query serialization, and streaming that never streams. Database indexing and
dependency discipline are strong.

### 2.1 Findings

| Impact | Finding | Where |
|---|---|---|
| HIGH | **All four authored path files ship in the marketing client bundle.** `hero-taste.tsx` is `"use client"` and imports the `@/content` barrel, which statically pulls green/yellow/blue/red (~57KB raw source) plus four quote banks and the engine into the landing page JS — for every anonymous visitor. The hero only uses Green/Yellow. This also exposes the flag-gated, safety-unreviewed Red path strings in the public bundle — a content-exposure problem, not just a byte-weight one. | `components/marketing/hero-taste.tsx:5`, `content/index.ts` |
| HIGH | **Dashboard runs 7–8 DB round-trips strictly sequentially** (`getUser` → profile → habits → habit_checks → aha_moments → weekly_horizons → goals → reflections). Everything after the profile gate is independent except `habit_checks` (needs habit ids). At ~20–50ms per round-trip this serializes into ~150–350ms of pure network wait on the primary authenticated page; two `Promise.all` waves roughly halve TTFB. | `app/(app)/dashboard/page.tsx:26–107` |
| HIGH | **Check-in streaming produces no incremental display.** Server side, `adaptMessage` uses `provider.chat()` (full buffered completion — a *deliberate, documented* choice to avoid partial-then-duplicate output on mid-stream failure) and the route re-chunks the finished string into cosmetic SSE tokens; `provider.stream()` is never used on this path. Client side, tokens accumulate in a local variable and only render on the next flush — so the whole line pops in at once regardless. Time-to-first-visible-token equals full completion latency on the product's core interaction. | `lib/llm/adapt.ts:26`, `app/api/checkin/route.ts:461`, `components/guidepost/checkin-client.tsx:104–140` |
| MED | Middleware calls `supabase.auth.getUser()` — a network round-trip to Supabase Auth — on **every** matched request, including public marketing routes where the result is unused; the branch on `isProtectedPath` happens after the call. Authenticated pages then call `getUser()` again themselves, paying the auth round-trip twice per request. | `lib/supabase/middleware.ts:41`, `middleware.ts:8–16` |
| MED | Turns that emit multiple Juniper lines run `adaptMessage` LLM calls sequentially in the SSE loop; the adaptations are independent and could be dispatched together, then streamed in order. | `app/api/checkin/route.ts:454–465` |
| MED | All 8 in-dialogue tool components are statically imported into the check-in chunk; only one renders per node. `next/dynamic` per tool would defer each until its node is reached. | `components/guidepost/checkin-client.tsx:11–21` |
| LOW | `habit_checks` fetch is unbounded by date — pulls every check ever for all habits, then filters in JS for streaks; grows with user tenure. | `app/(app)/dashboard/page.tsx:46` |
| LOW | The check-in client imports `lib/guidepost/api-schema.ts` for a label constant + type, dragging Zod (module-top-level `z.discriminatedUnion`) into the client chunk. | `components/guidepost/checkin-client.tsx:6`, `lib/guidepost/api-schema.ts:7` |
| LOW | `persistTurn`'s two writes (message insert, session-state update) are independent but awaited sequentially; the session `state` JSONB is rewritten whole every turn (small today, grows with history). | `app/api/checkin/route.ts:419–422` |
| LOW | Settings page serializes `getUser` → `isSubscribed` (two round-trips; low-traffic page). | `app/(app)/settings/page.tsx:17,20` |

### 2.2 What is done well

- **Indexes match the live query patterns** — `chat_sessions (user_id,
  started_at desc)`, `aha_moments`/`reflections (user_id, created_at desc)`,
  `chat_messages (session_id, created_at)`, `habit_checks (habit_id,
  checked_on)` unique, `weekly_horizons (user_id, week_start)` unique. No
  missing index for any current query.
- **Narrow selects with limits** on the dashboard (specific columns,
  `limit 10/20`) — no `select('*')` over-fetching.
- **Correct rendering split**: authed routes `force-dynamic`; the marketing
  landing is statically rendered (no data fetching, no dynamic export).
- **Server-only isolation**: Stripe, the Anthropic SDK, and the service-role
  client never reach a client component.
- **Zero font/image cost**: system font stack, no web fonts, no images —
  the only graphic is a tiny inline SVG.
- **Lean dependencies**: seven runtime deps, nothing unusual; no polling
  loops or refetch-in-effect patterns in client code.
- **Resilient critical path**: any LLM provider failure falls back to the
  authored line byte-identical — the product never blocks on the LLM.
