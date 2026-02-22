import { describe, expect, it } from 'vitest'

import {
  mapExperiencesToRows,
  mapFaqToRows,
  mapGapsToRows,
  mapInstructionsToRows,
  mapProfileToPayload,
  mapRowsToCandidateContext,
  mapSkillsToRows,
  type ProfileRow,
} from '../../src/lib/candidateContextMappers'
import type { CandidateContext } from '../../src/types/domain'

const profileRow: ProfileRow = {
  id: 'p1',
  full_name: 'Test User',
  title: 'Engineer',
  target_titles: ['Lead Engineer'],
  target_company_stages: ['startup'],
  location: null,
  remote_preference: null,
  availability_status: null,
  availability_date: null,
  salary_min: null,
  salary_max: null,
  linkedin_url: null,
  github_url: null,
  email: null,
  elevator_pitch: 'Pitch',
  career_narrative: 'Narrative',
  known_for: null,
  looking_for: null,
  not_looking_for: null,
  management_style: null,
  work_style_preferences: null,
  must_haves: null,
  dealbreakers: null,
  team_size_preference: null,
  conflict_style: null,
  ambiguity_style: null,
  failure_style: null,
}

const context: CandidateContext = {
  profile: {
    id: 'p1',
    fullName: 'Test User',
    title: 'Engineer',
    targetTitles: ['Lead Engineer'],
    targetCompanyStages: ['startup'],
    location: '',
    remotePreference: '',
    availabilityStatus: 'open_to_conversation',
    socialLinks: {},
    elevatorPitch: 'Pitch',
    careerNarrative: 'Narrative',
    knownFor: '',
    lookingFor: '',
    notLookingFor: '',
    managementStyle: '',
    workStylePreferences: '',
  },
  experiences: [{
    id: 'e1',
    companyName: 'ACME',
    title: 'Engineer',
    dateRange: '2020-2021',
    bulletPoints: ['Built X'],
    aiContext: {
      situation: 'S',
      approach: 'A',
      technicalWork: 'T',
      lessonsLearned: 'L',
    },
  }],
  skills: [{
    id: 's1',
    skillName: 'TypeScript',
    category: 'strong',
    selfRating: 5,
    evidence: 'Years of work',
    honestNotes: 'Confident',
  }],
  gaps: [{
    id: 'g1',
    gapType: 'skill',
    description: 'Missing X',
    whyItsAGap: 'Needed for role',
    interestInLearning: true,
  }],
  faqResponses: [{
    id: 'f1',
    question: 'Why join?',
    answer: 'Impact',
  }],
  aiInstructions: [{
    id: 'i1',
    instructionType: 'honesty',
    instruction: 'Do not overclaim',
    priority: 100,
  }],
  valuesCultureFit: {
    mustHaves: [],
    dealbreakers: [],
    teamSizePreference: '',
    conflictStyle: '',
    ambiguityStyle: '',
    failureStyle: '',
  },
}

describe('candidateContextMappers', () => {
  it('maps profile rows to defaults safely', () => {
    const mapped = mapRowsToCandidateContext(profileRow, [], [], [], [], [])
    expect(mapped.profile.availabilityStatus).toBe('open_to_conversation')
    expect(mapped.profile.location).toBe('')
    expect(mapped.valuesCultureFit.mustHaves).toEqual([])
  })

  it('maps profile/context payload and child rows', () => {
    const payload = mapProfileToPayload(context, 'p1')
    expect(payload.full_name).toBe('Test User')
    expect(payload.location).toBeNull()

    expect(mapExperiencesToRows(context, 'p1')).toHaveLength(1)
    expect(mapSkillsToRows(context, 'p1')).toHaveLength(1)
    expect(mapGapsToRows(context, 'p1')).toHaveLength(1)
    expect(mapFaqToRows(context, 'p1')).toHaveLength(1)
    expect(mapInstructionsToRows(context, 'p1')).toHaveLength(1)
  })
})
