import type { CandidateContext } from '../types/domain'
import { mapRowsToCandidateContext, type ProfileRow } from './candidateContextMappers'
import { readRemoteCandidateRows } from './remoteCandidateStore'

export async function getRemoteCandidateContext(): Promise<CandidateContext | null> {
  const rows = await readRemoteCandidateRows()
  if (!rows) return null

  return mapRowsToCandidateContext(
    rows.profile as ProfileRow,
    rows.experiences ?? [],
    rows.skills ?? [],
    rows.gaps ?? [],
    rows.faqResponses ?? [],
    rows.aiInstructions ?? [],
  )
}
