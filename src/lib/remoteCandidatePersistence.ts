import type { CandidateContext } from '../types/domain'
import {
  mapExperiencesToRows,
  mapFaqToRows,
  mapGapsToRows,
  mapInstructionsToRows,
  mapProfileToPayload,
  mapSkillsToRows,
} from './candidateContextMappers'
import { writeRemoteCandidateRows } from './remoteCandidateStore'

export async function writeRemoteCandidateContext(next: CandidateContext): Promise<boolean> {
  const profileId = next.profile.id || crypto.randomUUID()
  const profilePayload = mapProfileToPayload(next, profileId)

  return writeRemoteCandidateRows(profileId, profilePayload, {
    experiences: mapExperiencesToRows(next, profileId),
    skills: mapSkillsToRows(next, profileId),
    gaps: mapGapsToRows(next, profileId),
    faqResponses: mapFaqToRows(next, profileId),
    aiInstructions: mapInstructionsToRows(next, profileId),
  })
}
