import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

export type CandidateBundle = {
  candidateId: string
  profile: Record<string, unknown> | null
  experiences: Array<Record<string, unknown>>
  skills: Array<Record<string, unknown>>
  gaps: Array<Record<string, unknown>>
  faq: Array<Record<string, unknown>>
  instructions: Array<Record<string, unknown>>
  history: Array<Record<string, unknown>>
}

type CandidateBundleOptions = {
  includeHistory?: boolean
  sessionId?: string
}

export async function fetchCandidateBundle(
  db: ReturnType<typeof createClient>,
  options: CandidateBundleOptions = {},
): Promise<CandidateBundle | null> {
  const { includeHistory = false, sessionId = 'default-session' } = options
  const { data: profile } = await db.from('candidate_profile').select('*').limit(1).maybeSingle()
  if (!profile?.id) return null

  const candidateId = String(profile.id)
  const historyQuery = includeHistory
    ? db.from('chat_history').select('role, content').eq('session_id', sessionId).order('created_at', { ascending: false }).limit(20)
    : Promise.resolve({ data: [] as Array<Record<string, unknown>> })

  const [
    { data: experiences = [] },
    { data: skills = [] },
    { data: gaps = [] },
    { data: faq = [] },
    { data: instructions = [] },
    { data: history = [] },
  ] = await Promise.all([
    db.from('experiences').select('*').eq('candidate_id', candidateId).order('display_order', { ascending: true }),
    db.from('skills').select('*').eq('candidate_id', candidateId),
    db.from('gaps_weaknesses').select('*').eq('candidate_id', candidateId),
    db.from('faq_responses').select('*').eq('candidate_id', candidateId),
    db.from('ai_instructions').select('*').eq('candidate_id', candidateId).eq('active', true).order('priority', { ascending: false }),
    historyQuery,
  ])

  return { candidateId, profile, experiences, skills, gaps, faq, instructions, history }
}
