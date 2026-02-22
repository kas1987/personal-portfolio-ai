import { describe, expect, it } from 'vitest'
import { mockAnalyzeJobDescription, mockChatMessage } from '../../src/lib/mockAiClient'
import type { CandidateContext } from '../../src/types/domain'

const minimalContext: CandidateContext = {
  profile: {
    id: 'id',
    fullName: 'Kris',
    title: 'Consultant',
    targetTitles: [],
    targetCompanyStages: [],
    location: '',
    remotePreference: '',
    availabilityStatus: '',
    socialLinks: {},
    elevatorPitch: '',
    careerNarrative: '',
    knownFor: '',
    lookingFor: '',
    notLookingFor: '',
    managementStyle: '',
    workStylePreferences: '',
  },
  experiences: [],
  skills: [],
  gaps: [],
  faqResponses: [],
  aiInstructions: [],
  valuesCultureFit: {
    mustHaves: [],
    dealbreakers: [],
    teamSizePreference: '',
    conflictStyle: '',
    ambiguityStyle: '',
    failureStyle: '',
  },
}

describe('mockAiClient', () => {
  it('returns probably_not for mobile-heavy non-finance description', () => {
    const out = mockAnalyzeJobDescription('Looking for senior iOS and Android mobile engineer')
    expect(out.verdict).toBe('probably_not')
    expect(out.gaps.length).toBeGreaterThan(0)
  })

  it('returns strong_fit for finance-oriented description', () => {
    const out = mockAnalyzeJobDescription('Need finance transformation and FP&A forecast process redesign')
    expect(out.verdict).toBe('strong_fit')
  })

  it('returns weakness-specific chat response', () => {
    const out = mockChatMessage('What is your biggest weakness?', minimalContext)
    expect(out.toLowerCase()).toContain('biggest weakness')
  })
})
