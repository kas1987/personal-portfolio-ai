import type { CandidateContext } from '../types/domain'
import { seedContext } from './seedData'

const STORAGE_KEY = 'portfolio_ai_candidate_context_v1'

export function loadContextFromStorage(): CandidateContext {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedContext))
    return seedContext
  }

  try {
    const parsed = JSON.parse(raw) as Partial<CandidateContext>
    return {
      ...seedContext,
      ...parsed,
      profile: { ...seedContext.profile, ...(parsed.profile || {}) },
      valuesCultureFit: {
        ...seedContext.valuesCultureFit,
        ...(parsed.valuesCultureFit || {}),
      },
    }
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedContext))
    return seedContext
  }
}

export function saveContextToStorage(context: CandidateContext): CandidateContext {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(context))
  return context
}

