# Deployment Checklist

## Supabase Setup

- [x] Create/confirm Supabase project
- [x] Apply migrations in order:
  - [x] `supabase/migrations/0001_initial_schema.sql`
  - [x] `supabase/migrations/0002_rls_policies.sql`
  - [x] `supabase/migrations/0003_lovable_spec_expansion.sql`
  - [x] `supabase/migrations/0004_security_ops_hardening.sql`
- [x] Set Supabase function secrets:
  - [x] `LLM_API_KEY`
  - [x] `LLM_MODEL`
  - [x] `LLM_API_URL`
  - [x] `PROMPT_VERSION`
- [x] Deploy edge functions:
  - [x] `supabase/functions/chat`
  - [x] `supabase/functions/analyze-jd`

## Frontend Environment

- [ ] Set `VITE_SUPABASE_URL`
- [ ] Set `VITE_SUPABASE_ANON_KEY`
- [ ] Set `VITE_USE_REMOTE_STORAGE=true` for live data
- [ ] Set `VITE_USE_MOCK_AI=false` for live AI
- [ ] Set `VITE_REQUIRE_ADMIN_AUTH=true` to protect `/admin`
- [ ] Optional: `VITE_DEV_API_PROXY_TARGET` for local API proxy

## Content Population

- [ ] Run production overwrite seeding command with guard:
  - `SUPABASE_URL=<project-url> SUPABASE_SERVICE_ROLE_KEY=<service-role-key> ALLOW_PROD_OVERWRITE=true npm run seed:remote`
- [ ] Verify script output counts match seed payload for:
  - `candidate_profile`, `experiences`, `skills`, `gaps_weaknesses`, `faq_responses`, `ai_instructions`
- [ ] Open `/admin` and confirm consulting profile/context is present
- [ ] Spot-check FAQ, gaps, and AI instructions reflect consulting positioning

## Validation Gates

- [x] `npm run calibrate`
- [x] `npm run regress`
- [x] `npm run smoke:live`
- [x] `npm run lint`
- [x] `npm run build`
- [ ] Manual UX acceptance (hero fidelity, fit panel, chat drawer, admin auth)
- [ ] Manual bad-fit JD checks against live model
- [ ] Confirm Fit Assessment copy uses client-problem framing end-to-end
