import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'
import { fetchCandidateBundle as fetchBundleShared, type CandidateBundle } from '../_shared/candidateBundle.ts'
import { buildContextPrompt as buildSharedContextPrompt } from '../_shared/contextPrompt.ts'

export async function fetchCandidateBundle(
  db: ReturnType<typeof createClient>,
): Promise<CandidateBundle | null> {
  return fetchBundleShared(db, { includeHistory: false })
}

export function buildContextPrompt(bundle: CandidateBundle): string {
  return buildSharedContextPrompt(bundle, 'analyze')
}
