import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'
import {
  BASE_FALLBACK_CONTEXT,
  withContactBlock,
} from '../_shared/fitContextPolicy.ts'
import { fetchCandidateBundle as fetchBundleShared, type CandidateBundle } from '../_shared/candidateBundle.ts'
import { buildContextPrompt as buildSharedContextPrompt, buildHistoryBlock } from '../_shared/contextPrompt.ts'

export const FALLBACK_CONTEXT = withContactBlock(BASE_FALLBACK_CONTEXT, 'kas41866@gmail.com')

export async function fetchCandidateBundle(
  db: ReturnType<typeof createClient>,
  sessionId: string,
): Promise<CandidateBundle | null> {
  return fetchBundleShared(db, { includeHistory: true, sessionId })
}

export function buildContextPrompt(bundle: CandidateBundle): string {
  return buildSharedContextPrompt(bundle, 'chat')
}

export { buildHistoryBlock }
