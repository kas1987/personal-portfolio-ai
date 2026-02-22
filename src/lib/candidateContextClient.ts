import type { CandidateContext } from '../types/domain'
import { getRemoteCandidateContext } from './remoteCandidateContext'
import { writeRemoteCandidateContext } from './remoteCandidatePersistence'
import { loadContextFromStorage, saveContextToStorage } from './storage'
import { shouldUseRemoteStorage } from './supabase'

function getLocalContext(): CandidateContext {
  return loadContextFromStorage()
}

export async function getCandidateContextFromSources(): Promise<CandidateContext> {
  if (!shouldUseRemoteStorage) {
    return getLocalContext()
  }

  const remote = await getRemoteCandidateContext()
  if (!remote) {
    return getLocalContext()
  }

  saveContextToStorage(remote)
  return remote
}

export async function upsertCandidateContextToSources(next: CandidateContext): Promise<CandidateContext> {
  if (shouldUseRemoteStorage) {
    await writeRemoteCandidateContext(next)
  }
  return saveContextToStorage(next)
}
