# Personal Portfolio AI

AI-queryable portfolio with explicit honest-fit assessment and admin-controlled candidate context.

## What is implemented

- Public portfolio page with:
  - hero, experience cards, skills matrix, JD analyzer panel, AI chat drawer
- Admin context console at `/admin`:
  - editable profile, experiences, skills, gaps, FAQ, AI instruction policy
- Contract-first foundation:
  - TypeScript domain contracts (`src/types/domain.ts`)
  - API schemas (`src/lib/contracts.ts`)
  - Supabase SQL migrations (`supabase/migrations/0001_initial_schema.sql`, `supabase/migrations/0002_rls_policies.sql`)
  - Edge functions with staged provider fallback (`supabase/functions/*`)
- Honesty controls:
  - overclaim detection and fit-language checks in `src/lib/honesty.ts`

## Local run

```bash
npm install
npm run dev
```

Open:

- Public: `http://localhost:5173/`
- Admin: `http://localhost:5173/admin`

## Production

- Live site: `https://job-analyzer-deploy.netlify.app/`
- Admin login: `https://job-analyzer-deploy.netlify.app/admin`
- Auto deploy: push to `main` in `kas1987/personal-portfolio-ai`

## Environment

Copy `.env.example` to `.env` and adjust:

- `VITE_USE_MOCK_AI=true` keeps analyzer/chat deterministic and local-first.
- Set `VITE_USE_MOCK_AI=false` when edge functions are enabled.
- Set `VITE_USE_REMOTE_STORAGE=true` to prefer Supabase CRUD (with local fallback).
- Set `VITE_REQUIRE_ADMIN_AUTH=true` to protect `/admin` with magic-link auth.
- Set `VITE_DEV_API_PROXY_TARGET` in local dev when proxying `/api/*` to edge functions.
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` when wiring live Supabase reads/writes.

For production, use `.env.production.example` as the template and set:

- `VITE_API_BASE_URL=https://<project-ref>.supabase.co/functions/v1`
- `VITE_USE_MOCK_AI=false`
- `VITE_USE_REMOTE_STORAGE=true`
- `VITE_REQUIRE_ADMIN_AUTH=true`

## Quality gates

```bash
npm run calibrate
npm run regress
npm run lint
npm run build
```

## Launch docs

- `docs/LOVABLE-SPEC-CHECKLIST.md`
- `docs/DEPLOYMENT-CHECKLIST.md`
- `docs/LAUNCH-EVIDENCE.md`

## Contracts and boundaries

- Domain contracts: `docs/DOMAIN-CONTRACTS.md`
- API contracts: `docs/API-CONTRACTS.md`
- Public/private isolation is enforced via DTO shaping and SQL projection views.
