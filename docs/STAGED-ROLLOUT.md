# Staged AI Backend Rollout

This project intentionally ships in controlled phases.

## Stage 0 (Current)

- Public/admin UX is live.
- Data persistence is local-first by default, with remote Supabase mode available via `VITE_USE_REMOTE_STORAGE=true`.
- AI behavior defaults to deterministic mock mode (`VITE_USE_MOCK_AI=true`).
- Dev proxy can be enabled with `VITE_DEV_API_PROXY_TARGET`.

## Stage 1 (Enable JD Analyzer)

1. Deploy `supabase/functions/analyze-jd`.
2. Set `VITE_USE_MOCK_AI=false`.
3. Keep chat traffic restricted while analyzer telemetry is reviewed.
4. Log and review:
   - verdict distribution
   - false-positive fit cases
   - overclaim phrase violations

## Stage 2 (Enable Chat)

1. Deploy `supabase/functions/chat` with provider integration.
2. Apply instruction assembly using ordered `ai_instructions`.
3. Persist logs with `prompt_version` and `verdict_class`.
4. Enable endpoint controls before public exposure:
   - per-IP rate limiting
   - timeout + retry
   - CORS policy and input checks

## Stage 3 (Live CRUD to Supabase)

1. Keep `upsertCandidateContext()` dual-safe (remote write + local sync fallback).
2. Keep DTO field allowlists for public endpoints.
3. Enforce RLS policies and service-role function access.

