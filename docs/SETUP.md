# SETUP — external steps (Cat)

Everything in the repo is code-complete and CI-verified, but a few things can
only be created from your accounts. Doing these in order gets the app live.

## 1. Supabase (two projects: staging + prod)

1. Create two projects at [supabase.com](https://supabase.com): `trailhead-staging` and `trailhead-prod`.
2. For each project, apply the migrations: install the [Supabase CLI](https://supabase.com/docs/guides/cli), then
   ```bash
   supabase link --project-ref <project-ref>
   supabase db push
   ```
3. **Auth → Providers → Email**: leave email confirmations ON.
4. **Auth → Providers → Google**: create an OAuth client in
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   (type: Web application). Authorized redirect URI:
   `https://<project-ref>.supabase.co/auth/v1/callback`. Paste the client ID +
   secret into Supabase.
5. **Auth → URL Configuration**: set the Site URL to the deployed URL
   (production project → production domain; staging project → the Vercel
   preview wildcard, e.g. `https://*-<team>.vercel.app`).

## 2. Vercel

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new).
   Framework auto-detects (Next.js). Production branch: `main` — previews are
   automatic for every PR.
2. Environment variables (Settings → Environment Variables):

   | Variable | Preview | Production | Notes |
   |---|---|---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | staging URL | prod URL | public |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | staging anon | prod anon | public |
   | `SUPABASE_SERVICE_ROLE_KEY` | staging | prod | **server-only — never add a NEXT_PUBLIC_ variant** |
   | `LLM_PROVIDER` | `verbatim` | `verbatim` | switch when the provider is chosen (M2) |
   | `LLM_API_KEY` | — | — | not needed while verbatim |
   | Stripe keys | test keys | live keys | needed at M2, not now |
   | Feature flags | per `.env.example` | all `false` | Red stays off everywhere |

## 3. GitHub branch protection

Settings → Branches → Add rule for `main`:
- Require a pull request before merging (1 approval).
- Require status checks: **Typecheck, lint, test, build** (and optionally
  **Dependency audit**).
- Block force pushes.

## 4. Stripe (later — M2)

Create the account now if convenient; keys and webhook endpoint
(`/api/webhooks/stripe`) are wired in Milestone 2.

## Local development

```bash
pnpm install
cp .env.example .env.local   # paste the STAGING keys
pnpm dev
```

Without keys the app still runs: public pages work, auth pages show a
"not configured" note, and protected pages redirect to sign-in.
