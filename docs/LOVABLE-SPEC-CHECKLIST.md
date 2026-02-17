# Lovable Spec Checklist

Source of truth: `personal/files/Lovable Prompt AI-Powered Portfolio Site with Hone 30aa0fa8553a80049f7de622a2ccae80.md`

This checklist freezes completion criteria for exact-spec delivery.

## Public Site

| Requirement | Status | Acceptance Criteria |
| --- | --- | --- |
| Dark visual system with teal + amber accents | pending | Theme tokens match prompt colors and are used consistently across sections. |
| Fixed nav with links and Ask AI CTA | pending | Header remains fixed while scrolling and anchors route to Experience/Fit Check. |
| Hero badges and CTA treatment | pending | Status badge, role/company pills, Ask AI with New marker, and scroll cue are present. |
| Experience cards with AI context toggle | pending | Each card has expandable Situation/Approach/Technical Work/Lessons panel. |
| Skills matrix three-lane treatment | pending | Strong/Moderate/Gaps columns rendered with distinct visual treatment. |
| JD Analyzer output contract panel | pending | Output contains verdict, opening, gaps, transfers, and recommendation sections. |
| Philosophy callout | pending | Explicit trust/qualification callout appears under analyzer. |
| Chat drawer interaction | pending | Right-side drawer with history, input/send, and suggested questions works. |
| Footer profile links | pending | Name, title, and social/email links render and work. |

## Admin Depth

| Requirement | Status | Acceptance Criteria |
| --- | --- | --- |
| Admin authentication | pending | `/admin` is protected and sign-in flow works using Supabase auth. |
| Basic profile completeness | pending | Full name/title/targets/location/availability/salary/social fields editable. |
| Professional narrative completeness | pending | Elevator pitch, detailed narrative, known-for, looking-for, not-looking-for, management/work style captured. |
| Experience deep-dive completeness | pending | Join/leave rationale, contributions, proudest work, do-differently, challenges, lessons, manager/report perspective, conflicts, quantified impact captured. |
| Skills self-assessment completeness | pending | Skill category/rating/evidence/honest notes/years/last-used captured. |
| Gaps & weaknesses breadth | pending | Gap types plus role/environment misfit, feedback, improvement areas, and no-interest areas captured. |
| Values & culture-fit section | pending | Must-haves, dealbreakers, team preference, conflict/ambiguity/failure styles captured. |
| FAQ section | pending | Common + custom question/answer entries editable. |
| Anti-sycophancy instructions | pending | Ordered policy instructions editable and persisted. |

## AI Product Behavior

| Requirement | Status | Acceptance Criteria |
| --- | --- | --- |
| Chat full-context prompt assembly | pending | Chat function composes profile + experiences + skills + gaps + FAQ + instructions + recent history. |
| JD analyzer full-context prompt assembly | pending | Analyzer function composes full context and returns strict JSON structure. |
| Non-sycophancy guardrails | pending | Output checks reject overclaim language and preserve explicit non-fit behavior. |
| Prompt version + audit logging | pending | Each AI response writes prompt version, latency, and verdict class metadata. |
| Schema/contract validation | pending | Runtime validation rejects malformed endpoint responses. |

## Security and Operations

| Requirement | Status | Acceptance Criteria |
| --- | --- | --- |
| RLS policies validated | pending | Base tables protected; public reads only via approved projections; admin writes authenticated. |
| Endpoint hardening | pending | Input validation, CORS policy, rate limiting, timeout/retry are active. |
| Calibration and regression coverage | pending | Strong-fit, weak-fit, and adversarial cases pass automated checks. |
| Launch gates | pending | `calibrate`, `lint`, `build`, and manual UX checks all pass before release. |

