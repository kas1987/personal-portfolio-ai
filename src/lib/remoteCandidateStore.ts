import { CANDIDATE_TABLES } from './candidateContextSchema'
import { supabase } from './supabase'

export type RemoteCandidateRows = {
  profile: Record<string, unknown> & { id: string | number }
  candidateId: string
  experiences: Record<string, unknown>[]
  skills: Record<string, unknown>[]
  gaps: Record<string, unknown>[]
  faqResponses: Record<string, unknown>[]
  aiInstructions: Record<string, unknown>[]
}

export async function readRemoteCandidateRows(): Promise<RemoteCandidateRows | null> {
  if (!supabase) return null

  const { data: profile, error: profileError } = await supabase
    .from(CANDIDATE_TABLES.profile)
    .select('*')
    .limit(1)
    .maybeSingle()
  if (profileError || !profile) return null

  const candidateId = String((profile as { id: string | number }).id)
  const [{ data: experiences = [] }, { data: skills = [] }, { data: gaps = [] }, { data: faqResponses = [] }, { data: aiInstructions = [] }] =
    await Promise.all([
      supabase.from(CANDIDATE_TABLES.experiences).select('*').eq('candidate_id', candidateId),
      supabase.from(CANDIDATE_TABLES.skills).select('*').eq('candidate_id', candidateId),
      supabase.from(CANDIDATE_TABLES.gaps).select('*').eq('candidate_id', candidateId),
      supabase.from(CANDIDATE_TABLES.faqResponses).select('*').eq('candidate_id', candidateId),
      supabase
        .from(CANDIDATE_TABLES.aiInstructions)
        .select('*')
        .eq('candidate_id', candidateId)
        .order('priority', { ascending: false }),
    ])

  return {
    profile: profile as Record<string, unknown> & { id: string | number },
    candidateId,
    experiences: experiences ?? [],
    skills: skills ?? [],
    gaps: gaps ?? [],
    faqResponses: faqResponses ?? [],
    aiInstructions: aiInstructions ?? [],
  }
}

export async function writeRemoteCandidateRows(
  profileId: string,
  profilePayload: Record<string, unknown>,
  collections: {
    experiences: Record<string, unknown>[]
    skills: Record<string, unknown>[]
    gaps: Record<string, unknown>[]
    faqResponses: Record<string, unknown>[]
    aiInstructions: Record<string, unknown>[]
  },
): Promise<boolean> {
  if (!supabase) return false

  const upsertResult = await supabase.from(CANDIDATE_TABLES.profile).upsert(profilePayload)
  if (upsertResult.error) return false

  await Promise.all([
    supabase.from(CANDIDATE_TABLES.experiences).delete().eq('candidate_id', profileId),
    supabase.from(CANDIDATE_TABLES.skills).delete().eq('candidate_id', profileId),
    supabase.from(CANDIDATE_TABLES.gaps).delete().eq('candidate_id', profileId),
    supabase.from(CANDIDATE_TABLES.faqResponses).delete().eq('candidate_id', profileId),
    supabase.from(CANDIDATE_TABLES.aiInstructions).delete().eq('candidate_id', profileId),
  ])

  const writeBatches = [
    collections.experiences.length
      ? supabase.from(CANDIDATE_TABLES.experiences).insert(collections.experiences)
      : Promise.resolve({ error: null }),
    collections.skills.length
      ? supabase.from(CANDIDATE_TABLES.skills).insert(collections.skills)
      : Promise.resolve({ error: null }),
    collections.gaps.length
      ? supabase.from(CANDIDATE_TABLES.gaps).insert(collections.gaps)
      : Promise.resolve({ error: null }),
    collections.faqResponses.length
      ? supabase.from(CANDIDATE_TABLES.faqResponses).insert(collections.faqResponses)
      : Promise.resolve({ error: null }),
    collections.aiInstructions.length
      ? supabase.from(CANDIDATE_TABLES.aiInstructions).insert(collections.aiInstructions)
      : Promise.resolve({ error: null }),
  ]

  const batchResults = await Promise.all(writeBatches)
  return batchResults.every((result) => !result.error)
}
