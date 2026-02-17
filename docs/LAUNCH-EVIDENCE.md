# Launch Evidence

## Automated Gates

- `npm run calibrate` -> pass
- `npm run regress` -> pass
- `npm run lint` -> pass
- `npm run build` -> pass

## Production Infrastructure Status

- Supabase linked to project `pxacpumgnxndwbkxkbao`
- Migrations `0001`..`0004` applied
- Edge functions deployed:
  - `chat`
  - `analyze-jd`
- Function secrets configured:
  - `LLM_API_KEY`
  - `LLM_MODEL`
  - `LLM_API_URL`
  - `PROMPT_VERSION`
- Smoke endpoint checks passed:
  - `POST /functions/v1/analyze-jd`
  - `POST /functions/v1/chat`

## Governance and Spec Artifacts

- Spec lock checklist: `docs/LOVABLE-SPEC-CHECKLIST.md`
- Domain/API contracts:
  - `docs/DOMAIN-CONTRACTS.md`
  - `docs/API-CONTRACTS.md`
- Staged rollout plan: `docs/STAGED-ROLLOUT.md`
- Deployment checklist: `docs/DEPLOYMENT-CHECKLIST.md`

## Security and Data Boundary Controls

- RLS/policy migrations:
  - `supabase/migrations/0002_rls_policies.sql`
  - `supabase/migrations/0004_security_ops_hardening.sql`
- Public DTO boundary enforcement:
  - `src/lib/dto.ts`
  - `scripts/run-regression.mjs`

## Remaining External Go-Live Steps

- Configure frontend host environment (Netlify manual path documented).
- Run manual acceptance checks on deployed frontend environment.

