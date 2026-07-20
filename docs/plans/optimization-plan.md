# Optimization Improvement Plan

Remediation plan for the findings in
`docs/audits/performance-security-audit-2026-07-20.md`. Phases are ordered by
value-per-risk: A and B are safe to ship independently; C needs a deliberate
product/engineering call; D is the security-hardening backlog; the last
section is decisions that belong to Cat, not code.

## Status — implemented 2026-07-20

Phases A–D shipped, with these deliberate deviations:

- **A6:** window = **366 days** (exact streaks up to a year; longer displays
  capped — see `lib/utils/streak.ts` and question #4 in
  `docs/content-review/audit-questions-for-cat.md`).
- **B1:** implemented as a server-built pruned slice
  (`content/marketing/hero-slice.ts`) passed to the hero as props — the
  public bundle now carries **no** path content at all (verified against the
  built chunks). The zod-free split went further than planned: machine
  runtime helpers moved to `content/targets.ts`, so zod is out of every
  client chunk, not just the check-in's.
- **C1 shipped; C2 deferred** pending real first-token latency measurements
  under a live provider, as recommended below.
- **D1 scoped:** nonce + `strict-dynamic` CSP applies to the **authenticated
  surface** (always dynamically rendered — and where student text renders);
  the public/static surface keeps `'unsafe-inline'` because prerendered pages
  cannot carry a per-request nonce. Documented residual in `lib/utils/csp.ts`
  and `docs/security.md`.
- **Decisions for Cat** are packaged as
  `docs/content-review/audit-questions-for-cat.md`.

Every item names its finding, the fix, effort, and risk. Nothing here touches
Cat's authored content (the content-integrity lock stays byte-identical).

---

## Phase A — Quick wins, no behavior change (~1 day)

| # | Fix | Where | Effort | Risk |
|---|---|---|---|---|
| A1 | Parallelize the dashboard queries into two `Promise.all` waves: wave 1 = profile + habits (both need only `user`); wave 2 = habit_checks (needs habit ids) + ahas + horizon + goals + reflections. Cuts ~150–350ms of serialized network wait roughly in half on the primary authenticated page. | `app/(app)/dashboard/page.tsx:26–107` | S | Low — same queries, same data |
| A2 | Skip the middleware `getUser()` network call on non-protected paths: check `isProtectedPath(pathname)` *before* calling `getUser()`, keeping the existing fail-closed redirect for protected paths. Removes a Supabase Auth round-trip from every anonymous marketing visit. Keep the cookie-refresh behavior for authed paths. | `lib/supabase/middleware.ts:41`, `middleware.ts` | S | Low — verify sign-in redirect flow and cookie refresh still work on protected paths |
| A3 | `Promise.all` the two independent writes in `persistTurn` (message insert + session-state update). | `app/api/checkin/route.ts:419–422` | XS | Low |
| A4 | Dispatch multi-message `adaptMessage` calls concurrently (`Promise.all` up front), then stream results in authored order. Only affects turns emitting multiple adaptable lines. | `app/api/checkin/route.ts:454–465` | S | Low — order is preserved by awaiting in sequence over already-started promises |
| A5 | Defense-in-depth ownership filters: add explicit `.eq("user_id", user.id)` to the session load, dashboard mutations (`archiveHabit`, `setGoalStatus`, `toggleHabitToday` via its habit lookup), and the weekly-horizon read. RLS remains the primary enforcement; this is the second layer. | `app/api/checkin/route.ts:165`, `app/(app)/dashboard/actions.ts:30,47,103`, `app/api/weekly-horizon/route.ts:25` | S | Low — must not change results for legitimate owners; covered by existing tests |
| A6 | Bound the `habit_checks` fetch to a trailing window (e.g. `checked_on >= today − 90d`). **Precondition:** verify `computeStreak` semantics for streaks longer than the window first — either cap displayed streaks at the window (and say so) or fetch enough history to be exact. Don't ship a silently wrong streak. | `app/(app)/dashboard/page.tsx:46`, `lib/utils/` (streak helper) | S | Medium until the streak semantics question is answered; then Low |
| A7 | Split `FALLBACK_LABELS` + the shared TS types into a Zod-free module so the check-in client stops pulling Zod (~12KB) into its chunk; `api-schema.ts` keeps the Zod schemas for the server. | `lib/guidepost/api-schema.ts:7`, `components/guidepost/checkin-client.tsx:6` | XS | Low |

## Phase B — Bundle isolation (~1–2 days)

| # | Fix | Where | Effort | Risk |
|---|---|---|---|---|
| B1 | Give the marketing hero a dedicated minimal content slice — just the Green/Yellow first-exchange lines it actually renders — instead of importing the `@/content` barrel (which drags all four paths, quote banks, and the engine into the anonymous bundle). **This is also a content-exposure fix:** the flag-gated, safety-unreviewed Red path strings currently ship in the public JS. Options: (a) a small `content/marketing/hero-taste.ts` slice re-exporting only the needed authored lines (verbatim — same source objects, so the content lock is unaffected), or (b) render the taste server-side and hydrate only the interaction. Option (a) is simpler; take it first. | `components/marketing/hero-taste.tsx:5`, `content/index.ts` | M | Medium — must keep authored lines verbatim and the lock green; add a test asserting Red/Blue strings do not appear in the marketing chunk |
| B2 | Lazy-load the 8 in-dialogue tool components with `next/dynamic` (one import per `frame.tool.type`), so each tool's code + content loads when its node is reached. Keep a lightweight loading state consistent with the check-in's calm pacing (no spinner flash). | `components/guidepost/checkin-client.tsx:11–21` | S | Low |

## Phase C — Streaming: needs a deliberate call

The current design buffers the full LLM completion server-side
(`adaptMessage` → `provider.chat()`) *on purpose* — a mid-stream provider
failure can never yield partial-then-duplicate output, and the authored
fallback stays byte-identical (PRD §6.2). But the client also never renders
the SSE tokens incrementally, so today the whole apparatus produces zero
visible streaming and time-to-first-token equals full completion latency.

Two options, in increasing ambition:

- **C1 (recommended first): render what already arrives.** Promote the
  client's `currentText` accumulator to state so the fake-chunked tokens
  display incrementally. Server behavior unchanged; the buffering trade-off
  and its rationale in `adapt.ts` stay intact. Small, low-risk, and restores
  a perceived-latency win on every turn.
  Where: `components/guidepost/checkin-client.tsx:104–140`. Effort: S.
- **C2 (later, measure first): true end-to-end streaming.** Use
  `provider.stream()` on the adapt path so first tokens reach the client at
  provider first-token latency. Requires solving the failure mode the
  buffering deliberately avoids: on mid-stream provider failure, either
  (a) finish the line with a clean cut + authored-fallback replacement
  marker the client understands, or (b) stream into a server-side buffer
  with a short first-token deadline and fall back to buffered mode on
  trouble. Only worth it if C1 + a live provider still feels slow — measure
  first-token latency in production before building this.
  Where: `lib/llm/adapt.ts`, `app/api/checkin/route.ts:454–465`,
  `lib/llm/provider.ts:100`. Effort: M–L. Risk: Medium.

## Phase D — Security hardening backlog

| # | Fix | Where | Effort | Risk |
|---|---|---|---|---|
| D1 | Nonce-based CSP: generate a per-request nonce in middleware, thread it through headers, drop `'unsafe-inline'` from `script-src` in production. Already tracked in `docs/security.md`; requires Next.js nonce plumbing and re-testing Stripe.js. | `next.config.ts:16`, `middleware.ts` | M | Medium — CSP regressions are easy to ship; test checkout + auth flows under the new policy |
| D2 | Explicit Origin check on state-changing API routes (`/api/checkin`, `/api/checkin/close`, `/api/weekly-horizon` POST): reject cross-origin requests instead of relying on SameSite=Lax staying the default. | `app/api/*` | S | Low |
| D3 | Rate-limit `close` and `weekly-horizon` (reuse `check_rate_limit` with per-route keys; generous limits — these are cheap endpoints, the goal is abuse ceiling, not throttling students). | `app/api/checkin/close/route.ts`, `app/api/weekly-horizon/route.ts` | S | Low |
| D4 | Build Stripe success/cancel/portal-return URLs from a configured `NEXT_PUBLIC_SITE_URL` env var instead of `x-forwarded-host`/`host` headers. | `app/(app)/settings/actions.ts:12–15` | XS | Low |

## Decisions for Cat (flag, don't decide)

These are product/legal calls; the audit surfaces them but no code change
should presume the answer:

1. **LLM data flow for minors (OQ1, medium-severity audit finding):**
   students' free-text check-in input is sent to Anthropic in three flows
   (brain-dump interpretation, plan-change explanation, opt-in crisis
   classifier) when a live provider is configured. Needs an explicit
   decision: no-training/zero-retention terms (DPA) with the provider,
   and/or disclosure language. Tracked in `docs/security.md` ("LLM data
   hygiene").
2. **Crisis-detection coverage:** the lexicon floor is English/leet-only;
   the add-only classifier is opt-in via `SAFETY_CLASSIFIER`. Options with
   different cost/coverage trade-offs: enable the classifier by default,
   expand the lexicon (multilingual/paraphrase families), or both. Belongs
   with the safety-review workstream (`docs/safety/`), not a quiet code
   change.

## Verification (applies to every phase)

- `pnpm test` — full vitest suite, including `content-integrity`
  (authored lock must stay byte-identical), `rls/policies`, `rate-limit`,
  and the guidepost machine/router suites.
- Phase A: dashboard renders identical data (compare before/after HTML for a
  seeded user); check-in happy path unchanged end-to-end.
- Phase B: build and inspect the marketing route's client chunks — assert
  Red/Blue authored strings are absent; check-in tools still render at their
  nodes.
- Phase C: drive a live check-in and observe first-visible-token timing.
- Phase D: exercise sign-in, checkout, and check-in under the new CSP/Origin
  rules before merging.
