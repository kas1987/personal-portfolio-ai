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

- [ ] Fill complete profile and narrative
- [ ] Populate all roles with deep private context
- [ ] Populate values and culture-fit fields
- [ ] Add explicit gaps, bad-fit role types, and no-interest areas
- [ ] Populate FAQ pairs
- [ ] Populate anti-sycophancy instruction priorities

## Validation Gates

- [x] `npm run calibrate`
- [x] `npm run regress`
- [x] `npm run lint`
- [x] `npm run build`
- [ ] Manual UX acceptance (hero fidelity, fit panel, chat drawer, admin auth)
- [ ] Manual bad-fit JD checks against live model

