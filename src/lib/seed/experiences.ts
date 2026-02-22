import type { Experience } from '../../types/domain'

export const seedExperiences: Experience[] = [
  {
    id: 'exp-1',
    companyName: 'Reynolds American',
    title: 'Sr. Finance Manager, Resource Allocation \u2014 Vapor',
    titleProgression: 'Finance Manager -> Sr. Finance Manager, Resource Allocation',
    dateRange: '2023 - 2025',
    startDate: '2023-01-01',
    endDate: '2025-01-01',
    isCurrent: false,
    displayOrder: 1,
    bulletPoints: [
      'Directed $90M brand P&L across the Vapor category for a Fortune 500 organization ($25B revenue).',
      'Built scenario models for pricing, regulatory, and competitive risks informing executive decision-making.',
      'Partnered with Marketing and Sales to optimize spend allocation, achieving double-digit YoY savings.',
      'Implemented reporting automation reducing close-to-forecast cycle time by 40%.',
      'Presented financial insights to senior leadership informing innovation pipeline priorities.',
    ],
    aiContext: {
      situation:
        'Vapor category needed reliable forecast confidence under regulatory uncertainty and competitive pressure.',
      approach:
        'Built scenario models tied to business drivers and executive decision points; automated execution-heavy reporting.',
      technicalWork:
        'Excel/Power BI automation, scenario modeling, resource allocation frameworks.',
      lessonsLearned:
        'The work that consumed 40% of cycle time was specification and interpretation \u2014 execution that AI agents can now handle.',
      whyJoined: 'Opportunity to own strategic planning at meaningful Fortune 500 scale.',
      whyLeft: 'Role concluded; transitioned to consulting.',
      actualContributions:
        'Built planning system and executive decision package used in operating cadence.',
      proudestAchievement:
        '40% reduction in close-to-forecast cycle time while improving forecast accuracy.',
      wouldDoDifferently:
        'Invest earlier in cross-functional training on assumption discipline.',
      challengesFaced: 'Volatile inputs and changing regulatory assumptions.',
      managerWouldSay: 'High ownership and direct on trade-offs.',
      reportsWouldSay: 'Clear expectations and fast unblock support.',
      conflictsOrChallenges:
        'Occasional friction where urgency competed with control rigor.',
      quantifiedImpact:
        '$90M P&L ownership, 40% cycle time reduction, double-digit YoY expense savings.',
    },
  },
  {
    id: 'exp-2',
    companyName: 'Glatfelter',
    title: 'Corporate Finance & Accounting Lead',
    dateRange: '2022 - 2023',
    startDate: '2022-01-01',
    endDate: '2023-01-01',
    isCurrent: false,
    displayOrder: 2,
    bulletPoints: [
      'Led FP&A team and annual budgeting/strategic planning for a publicly traded company ($1B revenue).',
      'Managed enterprise-wide monthly forecast consolidation across business units.',
      'Prepared Board of Directors and executive leadership materials.',
      'Drafted financial analysis bridges for quarterly earnings calls.',
    ],
    aiContext: {
      situation:
        'Publicly traded manufacturer needed disciplined FP&A processes and reliable Board-level reporting.',
      approach:
        'Established structured forecast consolidation cadence and standardized executive materials.',
      technicalWork:
        'Financial modeling, forecast consolidation, Board presentation development, earnings call bridge analysis.',
      lessonsLearned:
        'Board-level communication requires ruthless prioritization of signal over noise.',
      proudestAchievement:
        'Delivered reliable enterprise-wide forecast consolidation and Board materials under tight timelines.',
      quantifiedImpact:
        'Enterprise-wide forecast consolidation, Board materials, earnings call bridges.',
    },
  },
  {
    id: 'exp-3',
    companyName: 'NBEO',
    title: 'Director of Finance & Accounting',
    dateRange: '2018 - 2022',
    startDate: '2018-01-01',
    endDate: '2022-01-01',
    isCurrent: false,
    displayOrder: 3,
    bulletPoints: [
      'Drove 40% revenue growth through fee structure analysis and recommendation for a non-profit 501(c)(3) ($7M revenue).',
      'Saved $100K+ annually by leading HRIS/PEO transition and renegotiating vendor contracts.',
      'Secured $332K in PPP funding and $200K in employee retention credits during COVID.',
      'Broke predatory vendor contracts that were draining organizational resources.',
      'Built complete financial reporting system from scratch in 4 months.',
    ],
    aiContext: {
      situation:
        'Non-profit with outdated financial systems, predatory vendor relationships, and untapped revenue potential.',
      approach:
        'Conducted full financial diagnostic, rebuilt reporting infrastructure, and tackled revenue and cost levers simultaneously.',
      technicalWork:
        'Financial system build-out, fee structure modeling, federal funding applications, vendor contract analysis.',
      lessonsLearned:
        'Small organizations can achieve outsized results when finance leadership has both strategic vision and hands-on execution capability.',
      proudestAchievement:
        'Complete financial turnaround \u2014 revenue growth, cost reduction, and system modernization simultaneously.',
      quantifiedImpact:
        '40% revenue growth, $530K+ federal funding secured, $100K+ annual overhead savings.',
    },
  },
  {
    id: 'exp-4',
    companyName: 'Sealed Air',
    title: 'Plant Controller',
    dateRange: '2017 - 2018',
    startDate: '2017-01-01',
    endDate: '2018-01-01',
    isCurrent: false,
    displayOrder: 4,
    bulletPoints: [
      'Provided finance oversight for manufacturing plant facility at a $4.8B revenue organization.',
      'Conducted cost variance analysis and inventory valuation to support operational decision-making.',
      'Partnered with operations and supply chain leadership on cost management initiatives.',
    ],
    aiContext: {
      situation:
        'Manufacturing plant needed reliable financial oversight and cost management support.',
      approach:
        'Embedded with operations to provide real-time cost visibility and variance accountability.',
      technicalWork:
        'Cost accounting, inventory valuation, variance analysis, operations partnership.',
      lessonsLearned:
        'Plant-level finance requires deep operational empathy \u2014 you cannot manage costs you do not understand physically.',
      quantifiedImpact:
        'Plant-level financial oversight, cost variance analysis, and supply chain cost management.',
    },
  },
]
