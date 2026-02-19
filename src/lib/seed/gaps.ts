import type { GapWeakness } from '../../types/domain'

export const seedGaps: GapWeakness[] = [
  {
    id: 'gap-1',
    gapType: 'experience',
    description: 'No enterprise software implementation experience',
    whyItsAGap:
      'Career focused on specification and evaluation, not hands-on system deployment. Assessment recommends implementation partners.',
    interestInLearning: false,
    roleTypesBadFit: ['ERP Implementation Lead', 'Systems Integrator'],
    environmentsToAvoid: ['Organizations expecting vendor-level implementation from an advisor'],
    pastFeedback: 'Strength is in requirements definition and vendor evaluation, not deployment.',
    improvementAreas: ['Could deepen hands-on implementation experience if needed'],
    noInterestAreas: ['Full-time implementation project management'],
  },
  {
    id: 'gap-2',
    gapType: 'skill',
    description: 'Limited to US GAAP',
    whyItsAGap:
      'No IFRS or multi-currency consolidation experience. Best fit for domestic organizations.',
    interestInLearning: false,
    roleTypesBadFit: ['International Controller', 'Global Consolidation Lead'],
    environmentsToAvoid: ['Organizations with significant IFRS reporting requirements'],
    pastFeedback: 'All career experience is US GAAP domestic.',
    improvementAreas: ['IFRS fundamentals if engagement requires it'],
    noInterestAreas: ['Full IFRS conversion projects'],
  },
]
