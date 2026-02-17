# Domain Contracts

This project is contract-first. Data structures are defined before UI or model behavior.

## Core Entities

- `candidate_profile`: one primary candidate record
- `experiences`: public summary + private reflective context
- `skills`: strong / moderate / gap with explicit honest notes
- `gaps_weaknesses`: first-class non-fit and risk context
- `faq_responses`: prepared answers for common interview prompts
- `ai_instructions`: policy controls for tone, honesty, boundaries
- `values_culture_fit` data is stored on `candidate_profile` columns for single-candidate deployments
- `chat_history`: auditable AI interactions

## Public vs Private Boundary

Public endpoints may expose only:

- Profile: name/title/targets/availability/elevator pitch/public links
- Experience: company/title/date/bullets and selected learning context
- Skills: category + evidence intended for public sharing

Private-only fields (never in public DTOs):

- Personal compensation bounds
- Internal rationale (`why_joined`, `why_left`)
- Evaluative freeform notes that are not explicitly marked public
- Raw prompt/context logs and provider metadata

## Source of Truth

- App-level TypeScript contracts: `src/types/domain.ts`
- Validation schemas: `src/lib/contracts.ts`
- DB schema/migration: `supabase/migrations/0001_initial_schema.sql`
- Spec expansion migration: `supabase/migrations/0003_lovable_spec_expansion.sql`

