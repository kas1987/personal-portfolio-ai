import type { CandidateContext, JDAnalysisResult } from '../types/domain'

export function mockAnalyzeJobDescription(jobDescription: string): JDAnalysisResult {
  const jd = jobDescription.toLowerCase()
  const mentionsMobile = jd.includes('mobile') || jd.includes('ios') || jd.includes('android')
  const mentionsFinance = jd.includes('finance') || jd.includes('fp&a') || jd.includes('forecast')

  if (mentionsMobile && !mentionsFinance) {
    return {
      verdict: 'probably_not',
      headline: 'Probably not your person for this role',
      opening:
        "I should be direct: this role appears mobile-engineering heavy, and that's not where my experience sits.",
      gaps: [
        {
          requirement: '5+ years mobile app development',
          gapTitle: 'Mobile engineering depth',
          explanation:
            'My background is in finance transformation and systems operations, not production mobile development.',
        },
      ],
      transfers:
        'I can contribute in analytics, planning, and operating model rigor, but not as a primary mobile IC.',
      recommendation:
        "If you need immediate mobile execution, I'm probably not your person for this role.",
    }
  }

  return {
    verdict: mentionsFinance ? 'strong_fit' : 'worth_conversation',
    headline: mentionsFinance ? 'Strong fit for finance-operations scope' : 'Worth a conversation',
    opening:
      'I match strongly on finance transformation, scenario planning, and system-level operating rigor.',
    gaps: mentionsFinance
      ? []
      : [
          {
            requirement: 'Deep domain specialization not explicitly in my recent scope',
            gapTitle: 'Domain specificity',
            explanation:
              'I can transfer operating model and governance patterns quickly, but I may need domain ramp time.',
          },
        ],
    transfers:
      'My strengths include structured planning, process redesign, and decision support under uncertainty.',
    recommendation:
      mentionsFinance
        ? 'I am a strong fit. Prioritize me for strategy + execution roles that need measurable operating discipline.'
        : 'This is worth a conversation if you value systems thinking and measurable process outcomes.',
  }
}

export function mockChatMessage(message: string, context: CandidateContext): string {
  if (message.toLowerCase().includes('weakness')) {
    return (
      "My biggest weakness is that I'm direct about fit and constraints. " +
      'That can feel blunt, but it prevents misalignment and wasted cycles.'
    )
  }
  return (
    `Short answer from ${context.profile.fullName}: ` +
    'I prioritize honest fit, measurable outcomes, and explicit trade-offs in role decisions.'
  )
}
