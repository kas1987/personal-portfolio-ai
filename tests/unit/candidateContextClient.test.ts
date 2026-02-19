import { describe, expect, it, vi } from 'vitest'
import type { CandidateContext } from '../../src/types/domain'

const sampleContext: CandidateContext = {
  profile: {
    id: 'candidate-1',
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

async function loadModule(remoteEnabled: boolean, remoteValue: CandidateContext | null) {
  vi.resetModules()

  const loadContextFromStorage = vi.fn(() => sampleContext)
  const saveContextToStorage = vi.fn((input: CandidateContext) => input)
  const getRemoteCandidateContext = vi.fn(async () => remoteValue)
  const writeRemoteCandidateContext = vi.fn(async () => true)

  vi.doMock('../../src/lib/storage', () => ({ loadContextFromStorage, saveContextToStorage }))
  vi.doMock('../../src/lib/remoteCandidateContext', () => ({ getRemoteCandidateContext }))
  vi.doMock('../../src/lib/remoteCandidatePersistence', () => ({ writeRemoteCandidateContext }))
  vi.doMock('../../src/lib/supabase', () => ({ shouldUseRemoteStorage: remoteEnabled }))

  const mod = await import('../../src/lib/candidateContextClient')
  return {
    mod,
    spies: {
      loadContextFromStorage,
      saveContextToStorage,
      getRemoteCandidateContext,
      writeRemoteCandidateContext,
    },
  }
}

describe('candidateContextClient', () => {
  it('uses local storage when remote is disabled', async () => {
    const { mod, spies } = await loadModule(false, null)
    const out = await mod.getCandidateContextFromSources()
    expect(out).toEqual(sampleContext)
    expect(spies.loadContextFromStorage).toHaveBeenCalledTimes(1)
    expect(spies.getRemoteCandidateContext).not.toHaveBeenCalled()
  })

  it('prefers remote and persists when remote data exists', async () => {
    const remoteContext = { ...sampleContext, profile: { ...sampleContext.profile, fullName: 'Remote Kris' } }
    const { mod, spies } = await loadModule(true, remoteContext)
    const out = await mod.getCandidateContextFromSources()
    expect(out.profile.fullName).toBe('Remote Kris')
    expect(spies.getRemoteCandidateContext).toHaveBeenCalledTimes(1)
    expect(spies.saveContextToStorage).toHaveBeenCalledWith(remoteContext)
  })

  it('writes remote before saving local on upsert when enabled', async () => {
    const { mod, spies } = await loadModule(true, null)
    const out = await mod.upsertCandidateContextToSources(sampleContext)
    expect(out).toEqual(sampleContext)
    expect(spies.writeRemoteCandidateContext).toHaveBeenCalledWith(sampleContext)
    expect(spies.saveContextToStorage).toHaveBeenCalledWith(sampleContext)
  })
})
