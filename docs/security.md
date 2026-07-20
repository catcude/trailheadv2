# Security & privacy — living checklist

Users are assumed to be minors. This file tracks the non-negotiables from
`docs/plans/scaffolding-plan.md` §5 against current reality. Update it in the
same PR as any security-relevant change.

| Item | Status | Where |
|---|---|---|
| RLS on every table, enabled in the migration that creates it | ✅ (all 11 tables) | `supabase/migrations/` |
| Automated RLS policy tests (cross-user + anon must fail) | ✅ CI `rls` job (local Supabase stack); also verified against Postgres 16 with an auth shim | `tests/rls/policies.test.ts` |
| No parent/teacher read path into student data | ✅ by construction (no such policy exists) | migrations |
| Data minimization at signup (email only; role + display name at onboarding) | ✅ | `app/auth/`, `app/(app)/onboarding/` |
| 13+ age attestation + parental-consent slot | ⬜ M1 onboarding (OQ4 — legal input needed) | — |
| Safety layer v1 (lexicon before any LLM call, authored crisis node) | ✅ lexicon floor screens free text before any LLM call; opt-in classifier (`SAFETY_CLASSIFIER`) is add-only — can never clear a lexicon hit | `lib/llm/safety.ts`, `lib/llm/safety-classifier.ts`, `content/safety/crisis.ts` |
| Non-identifiable safety telemetry (no user_id, no text) | ✅ `safety_events` has no user_id/session_id/text column; RLS with zero policies + no grant; writes only via `log_safety_event` security-definer RPC | migration 0003 |
| No ad tracking / third-party analytics / data sale | ✅ (nothing is loaded; CSP blocks drift) | `next.config.ts` |
| Server-only secrets never `NEXT_PUBLIC_` | ✅ | `.env.example` |
| Dependency audit + Dependabot | ✅ | `.github/workflows/ci.yml`, `.github/dependabot.yml` |
| Security headers (CSP, HSTS, XFO DENY, Referrer-Policy, Permissions-Policy) | ✅ | `next.config.ts` |
| Nonce-based CSP (drop `unsafe-inline`) | ✅ authenticated surface: per-request nonce + `strict-dynamic` via middleware. Residual: public/static pages keep `'unsafe-inline'` (prerendered pages can't carry a nonce; no user content renders there) | `middleware.ts`, `lib/utils/csp.ts` |
| Rate limiting on `/api/checkin` | ✅ Postgres `check_rate_limit()` RPC (security definer; authenticated-only; counters table locked by policy-less RLS) + in-memory per-IP layer; `close` + `weekly-horizon` now limited too (generous abuse ceilings) | migration 0002, `lib/utils/rate-limit.ts` |
| Origin check on state-changing API routes (CSRF backstop beyond SameSite=Lax) | ✅ | `lib/utils/origin-check.ts` |
| Stripe webhook signature verification | ✅ raw body verified before processing; missing secret → 503, missing signature → 400; idempotent handler; service-role writes confined to this path | `app/api/webhooks/stripe/route.ts`, `lib/billing/webhook.ts` |
| LLM data hygiene (session context only; no-training terms) | ⬜ OQ1 — code confines context, but no-training/DPA terms undecided; student free text reaches the provider in three flows (see 2026-07-20 audit, MED finding) | `lib/llm/provider.ts`, `lib/llm/interpret.ts` |
| Branch protection on `main` with required CI checks | ⬜ repo setting — see `docs/SETUP.md` | GitHub |

Full point-in-time review:
`docs/audits/performance-security-audit-2026-07-20.md` (no high-severity
findings; remediation phased in `docs/plans/optimization-plan.md` — nonce CSP,
API-route Origin checks, defense-in-depth owner filters, and the OQ1 LLM
data-flow decision are the open security items).

Notes:
- `role` on `profiles` is self-descriptive (user-chosen at onboarding, PRD
  §6.1), not a permission tier. If role ever gates privileged behavior, move
  role changes server-side and re-review the RLS policies.
- Middleware fails closed: with Supabase unconfigured, protected paths
  redirect to sign-in rather than rendering.
