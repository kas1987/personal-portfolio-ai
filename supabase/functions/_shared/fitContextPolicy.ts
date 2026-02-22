export const BASE_FALLBACK_CONTEXT = `
## About Kris SayreSmith

Kris is a licensed CPA with 15+ years of corporate FP&A leadership at companies including Reynolds American (Fortune 500, $90M P&L ownership), Glatfelter, NBEO, and Sealed Air. Kris now runs an independent AI Finance Assessment practice helping mid-market finance teams identify where AI can improve their operations.

## The AI Finance Assessment

A fixed-fee, 2-week engagement at $3,500 that delivers:
1. Current-state workflow map — where the finance team's time actually goes
2. AI readiness score — which workflows are ready for automation now vs. later
3. Prioritized recommendation — which tools to build or buy, in what sequence
4. Implementation roadmap — a realistic 90-day action plan

## Best-Fit Clients

CFOs, Controllers, or VP Finance at companies with 50–500 employees who:
- Suspect AI can help but don't know where to start
- Have a close cycle, variance reporting, or forecasting process that feels manual
- Are evaluating finance software (Adaptive, Anaplan, Planful, Vena) and want independent guidance

## Not a Fit

- Tax compliance, audit, or attestation work
- Companies with fewer than 20 employees or no dedicated finance function
- Organizations already mid-implementation needing execution support only
- Tobacco or nicotine industry (non-compete restrictions currently apply)
`.trim()

export function withContactBlock(baseContext: string, email: string): string {
  return `${baseContext}\n\n## Contact\n\nEmail: ${email}`
}

export function buildFitPolicyLines(profile: Record<string, unknown>): string {
  return (
    `Best-fit clients: ${String(profile.looking_for || '')}\n` +
    `Not a fit: ${String(profile.not_looking_for || '')}\n` +
    `Engagement style: ${String(profile.management_style || '')}\n` +
    `How I work: ${String(profile.work_style_preferences || '')}`
  )
}

export function buildInstructionPolicyBlock(instructions: Array<Record<string, unknown>>): string {
  return instructions.map((i) => `P${String(i.priority || 0)}: ${String(i.instruction || '')}`).join('\n')
}
