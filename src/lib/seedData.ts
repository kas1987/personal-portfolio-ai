import type { CandidateContext } from '../types/domain'

export const seedContext: CandidateContext = {
  profile: {
    id: 'candidate-1',
    fullName: 'Kris Sayresmith',
    title: 'Strategic Ops & Finance Transformation Leader',
    targetTitles: ['Finance Transformation Lead', 'Strategic Finance', 'Systems Operations'],
    targetCompanyStages: ['Series B-D', 'Public'],
    location: 'Winston-Salem, NC',
    remotePreference: 'Hybrid / Remote',
    availabilityStatus: 'Open to conversation',
    salaryMin: 190000,
    salaryMax: 240000,
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/kris-s-b8a5869/',
      email: 'kas41866@gmail.com',
    },
    elevatorPitch:
      'I build finance-operations systems that improve decision quality and reduce recurring execution failure.',
    careerNarrative:
      'I operate at the intersection of finance, operations, HR, and systems architecture with a strong focus on process reliability and measurable business outcomes.',
    knownFor: 'Turning ambiguous operational pain into structured, governable systems.',
    lookingFor: 'High-leverage transformation roles with measurable impact.',
    notLookingFor: 'Purely transactional accounting roles with no system ownership.',
  },
  experiences: [
    {
      id: 'exp-1',
      companyName: 'Reynolds American',
      title: 'Senior Finance Manager',
      dateRange: '2023 - Present',
      bulletPoints: [
        'Directed a $90M P&L with scenario-based planning.',
        'Reduced close-to-forecast cycle time by 40% using Excel/Power BI automation.',
        'Improved spend allocation with measurable efficiency gains.',
      ],
      aiContext: {
        situation: 'Needed better forecast confidence across pricing and regulatory uncertainty.',
        approach: 'Built scenario models tied to business drivers and executive decision points.',
        technicalWork: 'Automated reporting and modeled sensitivity impacts by assumption class.',
        lessonsLearned: 'Decision quality improves when uncertainty is surfaced, not hidden.',
      },
    },
  ],
  skills: [
    {
      id: 'skill-1',
      skillName: 'Executive Financial Management',
      category: 'strong',
      selfRating: 5,
      evidence: '$90M P&L ownership and strategic planning',
      honestNotes: 'Strong in structured planning and finance-ops translation.',
    },
    {
      id: 'skill-2',
      skillName: 'AI Workflow Integration',
      category: 'moderate',
      selfRating: 3,
      evidence: 'Built staged validation frameworks',
      honestNotes: 'Strong process architecture; still deepening model-level implementation depth.',
    },
    {
      id: 'skill-3',
      skillName: 'Mobile Engineering',
      category: 'gap',
      selfRating: 1,
      evidence: 'No direct production mobile ownership',
      honestNotes: 'Not an immediate fit for mobile-heavy IC roles.',
    },
  ],
  gaps: [
    {
      id: 'gap-1',
      gapType: 'skill',
      description: 'No deep mobile engineering history',
      whyItsAGap: 'Career focus has been finance, systems operations, and cross-functional architecture.',
      interestInLearning: false,
    },
  ],
  faqResponses: [
    {
      id: 'faq-1',
      question: "What's your biggest weakness?",
      answer:
        'I am direct about fit and constraints, which can feel blunt in organizations that prefer ambiguity.',
    },
  ],
  aiInstructions: [
    {
      id: 'inst-1',
      instructionType: 'honesty',
      instruction: "Never oversell. If I am not a fit, say 'I'm probably not your person for this role.'",
      priority: 100,
    },
    {
      id: 'inst-2',
      instructionType: 'boundaries',
      instruction: 'Do not fabricate skills, metrics, or project history.',
      priority: 90,
    },
  ],
}

