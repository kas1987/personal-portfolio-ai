import type { CandidateContext } from '../types/domain'

export const seedContext: CandidateContext = {
  profile: {
    id: 'candidate-1',
    fullName: 'Kris SayreSmith',
    title: 'AI-Native Finance Executive | CPA + SPHR + Python',
    targetTitles: [
      'AI-Native Finance Consultant',
      'CFO Advisory',
      'Finance Transformation Lead',
      'Strategic Finance Director',
    ],
    targetCompanyStages: ['Mid-Market ($10M-$500M)', 'Growth-Stage', 'Public'],
    location: 'Charlotte, NC Area',
    remotePreference: 'Remote / Hybrid (Charlotte NC area for on-site)',
    availabilityStatus: 'Accepting consulting engagements',
    salaryMin: 180000,
    salaryMax: 250000,
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/kris-s-b8a5869/',
      email: 'kas41866@gmail.com',
    },
    elevatorPitch:
      "I help CFOs who know AI matters but don't know what to specify \u2014 because I've managed $90M P&Ls, hold a CPA and SPHR, write Python, and have shipped production AI systems, which means I can translate finance strategy into technical builds that actually work.",
    careerNarrative:
      '15+ years of FP&A leadership across Fortune 500 ($25B), manufacturing ($4.8B), and mid-market organizations. I sit at the intersection of finance strategy, people operations, and technical implementation \u2014 a combination that lets me audit a chart of accounts on Monday and architect an automated reporting pipeline on Tuesday.',
    knownFor:
      'Bridging the specification bottleneck between finance operations and AI implementation.',
    lookingFor:
      'Mid-market CFOs ($10M-$500M) who need expert guidance on where AI fits in their finance function.',
    notLookingFor:
      'Pre-revenue startups, generic slide deck requests, or organizations not willing to provide real process access.',
    managementStyle:
      'Direct, evidence-based, and accountability-first. I surface risk early and document decisions explicitly.',
    workStylePreferences:
      'Structured engagement with clear deliverables, async communication, and explicit ownership boundaries.',
  },
  experiences: [
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
  ],
  skills: [
    {
      id: 'skill-1',
      skillName: 'Executive Financial Management',
      category: 'strong',
      selfRating: 5,
      evidence: '$90M P&L, 15+ years FP&A leadership',
      honestNotes:
        'Deep experience across Fortune 500, public, mid-market, and non-profit organizations.',
    },
    {
      id: 'skill-2',
      skillName: 'Scenario Modeling & Risk Analysis',
      category: 'strong',
      selfRating: 5,
      evidence: 'Pricing, regulatory, competitive risk models at Reynolds',
      honestNotes:
        'Built models that directly informed executive decision-making under uncertainty.',
    },
    {
      id: 'skill-3',
      skillName: 'Financial Planning & Analysis',
      category: 'strong',
      selfRating: 5,
      evidence: 'Budgeting, forecasting, variance analysis across 4 organizations',
      honestNotes:
        'Full-cycle FP&A ownership from annual planning through monthly close and Board reporting.',
    },
    {
      id: 'skill-4',
      skillName: 'Process Automation & Reporting',
      category: 'strong',
      selfRating: 4,
      evidence: '40% cycle time reduction, Power BI, Excel automation',
      honestNotes:
        'Strong in identifying automation opportunities and implementing reporting improvements.',
    },
    {
      id: 'skill-5',
      skillName: 'AI Orchestration & Implementation',
      category: 'moderate',
      selfRating: 4,
      evidence: '4 production AI apps, Python, Claude API integration',
      honestNotes:
        'Have shipped production AI systems; strength is in specification and orchestration rather than ML research.',
    },
    {
      id: 'skill-6',
      skillName: 'Python & Technical Development',
      category: 'moderate',
      selfRating: 4,
      evidence: 'VS Code, API integration, data pipelines',
      honestNotes:
        'Functional developer who builds working tools; not a computer science engineer.',
    },
    {
      id: 'skill-7',
      skillName: 'Stakeholder Communication',
      category: 'strong',
      selfRating: 5,
      evidence: 'Board presentations, executive briefings, cross-functional partnership',
      honestNotes:
        'Translate complex financial and technical concepts for executive and Board audiences.',
    },
    {
      id: 'skill-8',
      skillName: 'Cash Flow & Working Capital',
      category: 'strong',
      selfRating: 5,
      evidence: 'PPP funding, credit facilities, treasury management',
      honestNotes:
        'Hands-on experience securing federal funding and managing organizational cash position.',
    },
    {
      id: 'skill-9',
      skillName: 'HR Operations & People Systems',
      category: 'moderate',
      selfRating: 3,
      evidence: 'SPHR, HRIS transitions, PEO management',
      honestNotes:
        'Certified (SPHR) with practical experience; not a full-time HR leader.',
    },
    {
      id: 'skill-10',
      skillName: 'Governance & Internal Controls',
      category: 'strong',
      selfRating: 4,
      evidence: 'CPA, audit liaison, policy design',
      honestNotes:
        'Strong controls mindset from CPA training and hands-on audit coordination.',
    },
  ],
  gaps: [
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
  ],
  faqResponses: [
    {
      id: 'faq-1',
      question: 'What makes you different from McKinsey/Deloitte?',
      answer:
        "I'm not selling you a team of juniors with a partner who shows up twice. You get me \u2014 someone who has managed a $90M P&L, holds a CPA and SPHR, and writes Python. The assessment is $3,500, not $350,000.",
      isCommonQuestion: true,
    },
    {
      id: 'faq-2',
      question: 'Can you implement the recommendations?',
      answer:
        'The assessment is standalone \u2014 your team or an implementation partner can execute the roadmap. If you want ongoing advisory support, we can discuss that separately.',
      isCommonQuestion: true,
    },
    {
      id: 'faq-3',
      question: "What if AI isn't right for our finance function?",
      answer:
        "Then the assessment will say that clearly. You're paying for an honest evaluation, not a sales document.",
      isCommonQuestion: true,
    },
    {
      id: 'faq-4',
      question: "What's your biggest weakness?",
      answer:
        "I'm direct about fit and constraints. If I'm not the right person for your situation, I'll tell you and refer you to someone who is.",
      isCommonQuestion: true,
    },
  ],
  aiInstructions: [
    {
      id: 'inst-1',
      instructionType: 'honesty',
      instruction:
        "Never oversell. If the assessment isn't a fit, say so and explain why.",
      priority: 100,
    },
    {
      id: 'inst-2',
      instructionType: 'boundaries',
      instruction:
        'Do not fabricate skills, metrics, or project history. All numbers are verified from actual work.',
      priority: 90,
    },
    {
      id: 'inst-3',
      instructionType: 'tone',
      instruction:
        'Position as a consultant and advisor, not a job seeker. The portfolio demonstrates expertise, not desperation.',
      priority: 85,
    },
  ],
  valuesCultureFit: {
    mustHaves: [
      'Honest evaluation over comfortable answers',
      'Access to real processes and data',
      'Decision-maker involvement',
    ],
    dealbreakers: [
      'Checkbox exercises with no intent to act',
      'Scope restrictions that prevent honest findings',
    ],
    teamSizePreference:
      'Direct engagement with CFO or VP Finance plus 2-3 finance team members',
    conflictStyle: 'Address issues directly with evidence and clear options',
    ambiguityStyle: 'Translate ambiguity into explicit assumptions and checkpoints',
    failureStyle: 'Run post-mortem quickly, capture lessons, and tighten controls',
  },
}
