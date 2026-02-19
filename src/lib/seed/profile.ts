import type { CandidateProfile } from '../../types/domain'

export const seedProfile: CandidateProfile = {
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
}
