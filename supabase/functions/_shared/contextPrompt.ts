import { buildFitPolicyLines, buildInstructionPolicyBlock } from './fitContextPolicy.ts'
import type { CandidateBundle } from './candidateBundle.ts'

type PromptMode = 'analyze' | 'chat'

export function buildContextPrompt(bundle: CandidateBundle, mode: PromptMode): string {
  const profile = bundle.profile || {}
  const profileBlock = mode === 'analyze'
    ? (
      `Consultant name: ${String(profile.full_name || '')}\n` +
      `Title: ${String(profile.title || '')}\n` +
      `Background: ${String(profile.career_narrative || '')}\n` +
      buildFitPolicyLines(profile)
    )
    : (
      `Name: ${String(profile.full_name || '')}\n` +
      `Title: ${String(profile.title || '')}\n` +
      `Pitch: ${String(profile.elevator_pitch || '')}\n` +
      `Background: ${String(profile.career_narrative || '')}\n` +
      buildFitPolicyLines(profile)
    )

  const experienceBlock = bundle.experiences
    .map((exp) => {
      const bullets = Array.isArray(exp.bullet_points) ? exp.bullet_points.map(String).join(' | ') : ''
      if (mode === 'analyze') {
        return (
          `Company: ${String(exp.company_name || '')}\n` +
          `Title: ${String(exp.title || '')}\n` +
          `Title progression: ${String(exp.title_progression || '')}\n` +
          `Dates: ${String(exp.date_range || '')}\n` +
          `Bullets: ${bullets}\n` +
          `Why joined: ${String(exp.why_joined || '')}\n` +
          `Why left: ${String(exp.why_left || '')}\n` +
          `Actual contributions: ${String(exp.actual_contributions || '')}\n` +
          `Proudest achievement: ${String(exp.proudest_achievement || '')}\n` +
          `Would do differently: ${String(exp.would_do_differently || '')}\n` +
          `Challenges faced: ${String(exp.challenges_faced || '')}\n` +
          `Conflicts/challenges: ${String(exp.conflicts_challenges || '')}\n` +
          `Lessons learned: ${String(exp.lessons_learned || '')}\n` +
          `Quantified impact: ${String(exp.quantified_impact || '')}`
        )
      }
      return (
        `Company: ${String(exp.company_name || '')}\n` +
        `Title: ${String(exp.title || '')}\n` +
        `Date range: ${String(exp.date_range || '')}\n` +
        `Bullets: ${bullets}\n` +
        `Why joined: ${String(exp.why_joined || '')}\n` +
        `Why left: ${String(exp.why_left || '')}\n` +
        `Actual contributions: ${String(exp.actual_contributions || '')}\n` +
        `Proudest achievement: ${String(exp.proudest_achievement || '')}\n` +
        `Would do differently: ${String(exp.would_do_differently || '')}\n` +
        `Challenges: ${String(exp.challenges_faced || '')}\n` +
        `Lessons: ${String(exp.lessons_learned || '')}\n` +
        `Manager view: ${String(exp.manager_would_say || '')}\n` +
        `Reports view: ${String(exp.reports_would_say || '')}`
      )
    })
    .join('\n---\n')

  const skillsBlock = mode === 'analyze'
    ? bundle.skills.map((s) => `${String(s.skill_name || '')} [${String(s.category || '')}] :: ${String(s.honest_notes || s.evidence || '')}`).join('\n')
    : bundle.skills.map((s) => `${String(s.skill_name || '')} [${String(s.category || '')}] - ${String(s.honest_notes || s.evidence || '')}`).join('\n')

  const gapsBlock = mode === 'analyze'
    ? bundle.gaps.map((g) => `${String(g.description || '')} :: ${String(g.why_its_a_gap || '')}`).join('\n')
    : bundle.gaps.map((g) => `${String(g.description || '')} - ${String(g.why_its_a_gap || '')}`).join('\n')

  const faqBlock = bundle.faq.map((f) => `Q: ${String(f.question || '')}\nA: ${String(f.answer || '')}`).join('\n')
  const policyBlock = buildInstructionPolicyBlock(bundle.instructions)

  const heading = mode === 'analyze' ? '## Consultant Profile' : '## Consultant Summary'
  const instructionHeading = mode === 'analyze'
    ? '## Anti-Sycophancy Instructions'
    : '## Instruction Priorities'

  return [
    heading,
    profileBlock,
    '## Experience',
    experienceBlock,
    '## Skills',
    skillsBlock,
    '## Service Limits',
    gapsBlock,
    '## FAQ',
    faqBlock,
    instructionHeading,
    policyBlock,
  ].join('\n\n')
}

export function buildHistoryBlock(history: Array<Record<string, unknown>>): string {
  return history
    .slice()
    .reverse()
    .map((item) => `${String(item.role || 'user')}: ${String(item.content || '')}`)
    .join('\n')
}
