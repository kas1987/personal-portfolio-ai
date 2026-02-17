export type FitVerdict = 'strong_fit' | 'worth_conversation' | 'probably_not' | 'needs_clarification'

export interface CandidateProfile {
  id: string
  fullName: string
  title: string
  targetTitles: string[]
  targetCompanyStages: string[]
  location: string
  remotePreference: string
  availabilityStatus: string
  availabilityDate?: string
  salaryMin?: number
  salaryMax?: number
  socialLinks: {
    github?: string
    linkedin?: string
    email?: string
  }
  elevatorPitch: string
  careerNarrative: string
  knownFor: string
  lookingFor: string
  notLookingFor: string
  managementStyle?: string
  workStylePreferences?: string
}

export interface Experience {
  id: string
  companyName: string
  title: string
  titleProgression?: string
  dateRange: string
  startDate?: string
  endDate?: string
  isCurrent?: boolean
  displayOrder?: number
  bulletPoints: string[]
  aiContext: {
    situation: string
    approach: string
    technicalWork: string
    lessonsLearned: string
    whyJoined?: string
    whyLeft?: string
    actualContributions?: string
    proudestAchievement?: string
    wouldDoDifferently?: string
    challengesFaced?: string
    managerWouldSay?: string
    reportsWouldSay?: string
    conflictsOrChallenges?: string
    quantifiedImpact?: string
  }
}

export type SkillCategory = 'strong' | 'moderate' | 'gap'

export interface SkillItem {
  id: string
  skillName: string
  category: SkillCategory
  selfRating: number
  evidence: string
  honestNotes: string
  yearsExperience?: number
  lastUsed?: string
}

export interface GapWeakness {
  id: string
  gapType: 'skill' | 'experience' | 'environment' | 'role_type'
  description: string
  whyItsAGap: string
  interestInLearning: boolean
  roleTypesBadFit?: string[]
  environmentsToAvoid?: string[]
  pastFeedback?: string
  improvementAreas?: string[]
  noInterestAreas?: string[]
}

export interface FAQResponse {
  id: string
  question: string
  answer: string
  isCommonQuestion?: boolean
}

export interface AIInstruction {
  id: string
  instructionType: 'honesty' | 'tone' | 'boundaries'
  instruction: string
  priority: number
}

export interface ValuesCultureFit {
  mustHaves: string[]
  dealbreakers: string[]
  teamSizePreference: string
  conflictStyle: string
  ambiguityStyle: string
  failureStyle: string
}

export interface CandidateContext {
  profile: CandidateProfile
  experiences: Experience[]
  skills: SkillItem[]
  gaps: GapWeakness[]
  faqResponses: FAQResponse[]
  aiInstructions: AIInstruction[]
  valuesCultureFit: ValuesCultureFit
}

export interface JDGap {
  requirement: string
  gapTitle: string
  explanation: string
}

export interface JDAnalysisResult {
  verdict: FitVerdict
  headline: string
  opening: string
  gaps: JDGap[]
  transfers: string
  recommendation: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface PublicPortfolioDTO {
  profile: Pick<
    CandidateProfile,
    | 'fullName'
    | 'title'
    | 'targetTitles'
    | 'targetCompanyStages'
    | 'availabilityStatus'
    | 'elevatorPitch'
    | 'socialLinks'
  >
  experiences: Array<
    Pick<Experience, 'id' | 'companyName' | 'title' | 'dateRange' | 'bulletPoints' | 'aiContext'>
  >
  skills: SkillItem[]
}

