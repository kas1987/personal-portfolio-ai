import type { CandidateContext, JDAnalysisResult } from '../types/domain'
import { ChatResponseSchema, JDAnalysisSchema } from './contracts'
import { honestyChecklist } from './honesty'
import { seedContext } from './seedData'
import { loadContextFromStorage, saveContextToStorage } from './storage'
import { shouldUseRemoteStorage, supabase } from './supabase'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'
const USE_MOCK_AI = (import.meta.env.VITE_USE_MOCK_AI || 'true').toLowerCase() === 'true'

type ProfileRow = {
  id: string
  full_name: string
  title: string
  target_titles: string[] | null
  target_company_stages: string[] | null
  location: string | null
  remote_preference: string | null
  availability_status: string | null
  availability_date: string | null
  salary_min: number | null
  salary_max: number | null
  linkedin_url: string | null
  github_url: string | null
  email: string | null
  elevator_pitch: string
  career_narrative: string
  known_for: string | null
  looking_for: string | null
  not_looking_for: string | null
}

function defaultContext(): CandidateContext {
  return loadContextFromStorage()
}

function fromRows(
  profile: ProfileRow,
  experiences: Array<Record<string, unknown>>,
  skills: Array<Record<string, unknown>>,
  gaps: Array<Record<string, unknown>>,
  faqResponses: Array<Record<string, unknown>>,
  aiInstructions: Array<Record<string, unknown>>,
): CandidateContext {
  return {
    profile: {
      id: profile.id,
      fullName: profile.full_name,
      title: profile.title,
      targetTitles: profile.target_titles || [],
      targetCompanyStages: profile.target_company_stages || [],
      location: profile.location || '',
      remotePreference: profile.remote_preference || '',
      availabilityStatus: profile.availability_status || 'open_to_conversation',
      availabilityDate: profile.availability_date || undefined,
      salaryMin: profile.salary_min ?? undefined,
      salaryMax: profile.salary_max ?? undefined,
      socialLinks: {
        linkedin: profile.linkedin_url || undefined,
        github: profile.github_url || undefined,
        email: profile.email || undefined,
      },
      elevatorPitch: profile.elevator_pitch,
      careerNarrative: profile.career_narrative,
      knownFor: profile.known_for || '',
      lookingFor: profile.looking_for || '',
      notLookingFor: profile.not_looking_for || '',
    },
    experiences: experiences.map((exp) => ({
      id: String(exp.id),
      companyName: String(exp.company_name || ''),
      title: String(exp.title || ''),
      dateRange: String(exp.date_range || ''),
      bulletPoints: Array.isArray(exp.bullet_points) ? exp.bullet_points.map(String) : [],
      aiContext: {
        situation: String(exp.situation || ''),
        approach: String(exp.approach || ''),
        technicalWork: String(exp.technical_work || ''),
        lessonsLearned: String(exp.lessons_learned || ''),
        whyJoined: exp.why_joined ? String(exp.why_joined) : undefined,
        whyLeft: exp.why_left ? String(exp.why_left) : undefined,
        actualContributions: exp.actual_contributions ? String(exp.actual_contributions) : undefined,
        managerWouldSay: exp.manager_would_say ? String(exp.manager_would_say) : undefined,
        reportsWouldSay: exp.reports_would_say ? String(exp.reports_would_say) : undefined,
      },
    })),
    skills: skills.map((item) => ({
      id: String(item.id),
      skillName: String(item.skill_name || ''),
      category: (item.category as 'strong' | 'moderate' | 'gap') || 'moderate',
      selfRating: Number(item.self_rating || 3),
      evidence: String(item.evidence || ''),
      honestNotes: String(item.honest_notes || ''),
      yearsExperience: item.years_experience == null ? undefined : Number(item.years_experience),
      lastUsed: item.last_used ? String(item.last_used) : undefined,
    })),
    gaps: gaps.map((gap) => ({
      id: String(gap.id),
      gapType: (gap.gap_type as 'skill' | 'experience' | 'environment' | 'role_type') || 'skill',
      description: String(gap.description || ''),
      whyItsAGap: String(gap.why_its_a_gap || ''),
      interestInLearning: Boolean(gap.interest_in_learning),
    })),
    faqResponses: faqResponses.map((faq) => ({
      id: String(faq.id),
      question: String(faq.question || ''),
      answer: String(faq.answer || ''),
    })),
    aiInstructions: aiInstructions.map((instruction) => ({
      id: String(instruction.id),
      instructionType: (instruction.instruction_type as 'honesty' | 'tone' | 'boundaries') || 'honesty',
      instruction: String(instruction.instruction || ''),
      priority: Number(instruction.priority || 50),
    })),
  }
}

async function getRemoteCandidateContext(): Promise<CandidateContext | null> {
  if (!supabase) return null
  const { data: profile, error: profileError } = await supabase
    .from('candidate_profile')
    .select('*')
    .limit(1)
    .maybeSingle()
  if (profileError || !profile) return null

  const candidateId = String(profile.id)
  const [
    { data: experiences = [] },
    { data: skills = [] },
    { data: gaps = [] },
    { data: faqResponses = [] },
    { data: aiInstructions = [] },
  ] = await Promise.all([
    supabase.from('experiences').select('*').eq('candidate_id', candidateId),
    supabase.from('skills').select('*').eq('candidate_id', candidateId),
    supabase.from('gaps_weaknesses').select('*').eq('candidate_id', candidateId),
    supabase.from('faq_responses').select('*').eq('candidate_id', candidateId),
    supabase.from('ai_instructions').select('*').eq('candidate_id', candidateId).order('priority', { ascending: false }),
  ])

  return fromRows(
    profile as ProfileRow,
    experiences ?? [],
    skills ?? [],
    gaps ?? [],
    faqResponses ?? [],
    aiInstructions ?? [],
  )
}

async function writeRemoteCandidateContext(next: CandidateContext): Promise<boolean> {
  if (!supabase) return false
  const profileId = next.profile.id || crypto.randomUUID()

  const profilePayload = {
    id: profileId,
    full_name: next.profile.fullName,
    title: next.profile.title,
    target_titles: next.profile.targetTitles,
    target_company_stages: next.profile.targetCompanyStages,
    location: next.profile.location || null,
    remote_preference: next.profile.remotePreference || null,
    availability_status: next.profile.availabilityStatus,
    availability_date: next.profile.availabilityDate || null,
    salary_min: next.profile.salaryMin ?? null,
    salary_max: next.profile.salaryMax ?? null,
    linkedin_url: next.profile.socialLinks.linkedin || null,
    github_url: next.profile.socialLinks.github || null,
    email: next.profile.socialLinks.email || null,
    elevator_pitch: next.profile.elevatorPitch,
    career_narrative: next.profile.careerNarrative,
    known_for: next.profile.knownFor || null,
    looking_for: next.profile.lookingFor || null,
    not_looking_for: next.profile.notLookingFor || null,
  }

  const upsertResult = await supabase.from('candidate_profile').upsert(profilePayload)
  if (upsertResult.error) return false

  await Promise.all([
    supabase.from('experiences').delete().eq('candidate_id', profileId),
    supabase.from('skills').delete().eq('candidate_id', profileId),
    supabase.from('gaps_weaknesses').delete().eq('candidate_id', profileId),
    supabase.from('faq_responses').delete().eq('candidate_id', profileId),
    supabase.from('ai_instructions').delete().eq('candidate_id', profileId),
  ])

  const writeBatches = [
    next.experiences.length
      ? supabase.from('experiences').insert(
          next.experiences.map((exp) => ({
            id: exp.id,
            candidate_id: profileId,
            company_name: exp.companyName,
            title: exp.title,
            date_range: exp.dateRange,
            bullet_points: exp.bulletPoints,
            situation: exp.aiContext.situation,
            approach: exp.aiContext.approach,
            technical_work: exp.aiContext.technicalWork,
            lessons_learned: exp.aiContext.lessonsLearned,
            why_joined: exp.aiContext.whyJoined || null,
            why_left: exp.aiContext.whyLeft || null,
            actual_contributions: exp.aiContext.actualContributions || null,
            manager_would_say: exp.aiContext.managerWouldSay || null,
            reports_would_say: exp.aiContext.reportsWouldSay || null,
          })),
        )
      : Promise.resolve({ error: null }),
    next.skills.length
      ? supabase.from('skills').insert(
          next.skills.map((skill) => ({
            id: skill.id,
            candidate_id: profileId,
            skill_name: skill.skillName,
            category: skill.category,
            self_rating: skill.selfRating,
            years_experience: skill.yearsExperience ?? null,
            evidence: skill.evidence,
            honest_notes: skill.honestNotes,
            last_used: skill.lastUsed ?? null,
          })),
        )
      : Promise.resolve({ error: null }),
    next.gaps.length
      ? supabase.from('gaps_weaknesses').insert(
          next.gaps.map((gap) => ({
            id: gap.id,
            candidate_id: profileId,
            gap_type: gap.gapType,
            description: gap.description,
            why_its_a_gap: gap.whyItsAGap,
            interest_in_learning: gap.interestInLearning,
          })),
        )
      : Promise.resolve({ error: null }),
    next.faqResponses.length
      ? supabase.from('faq_responses').insert(
          next.faqResponses.map((faq) => ({
            id: faq.id,
            candidate_id: profileId,
            question: faq.question,
            answer: faq.answer,
          })),
        )
      : Promise.resolve({ error: null }),
    next.aiInstructions.length
      ? supabase.from('ai_instructions').insert(
          next.aiInstructions.map((instruction) => ({
            id: instruction.id,
            candidate_id: profileId,
            instruction_type: instruction.instructionType,
            instruction: instruction.instruction,
            priority: instruction.priority,
            active: true,
          })),
        )
      : Promise.resolve({ error: null }),
  ]

  const batchResults = await Promise.all(writeBatches)
  return batchResults.every((result) => !result.error)
}

export async function getCandidateContext(): Promise<CandidateContext> {
  if (!shouldUseRemoteStorage) {
    return defaultContext()
  }
  const remote = await getRemoteCandidateContext()
  if (!remote) {
    return defaultContext()
  }
  saveContextToStorage(remote)
  return remote
}

export async function upsertCandidateContext(next: CandidateContext): Promise<CandidateContext> {
  if (shouldUseRemoteStorage) {
    await writeRemoteCandidateContext(next)
  }
  return saveContextToStorage(next)
}

function mockAnalyze(jobDescription: string): JDAnalysisResult {
  const jd = jobDescription.toLowerCase()
  const mentionsMobile = jd.includes('mobile') || jd.includes('ios') || jd.includes('android')
  const mentionsFinance = jd.includes('finance') || jd.includes('fp&a') || jd.includes('forecast')

  if (mentionsMobile && !mentionsFinance) {
    return {
      verdict: 'probably_not',
      headline: 'Probably not your person for this role',
      opening:
        "I should be direct: this role appears mobile-engineering heavy, and that's not where my experience sits.",
      gaps: [
        {
          requirement: '5+ years mobile app development',
          gapTitle: 'Mobile engineering depth',
          explanation:
            'My background is in finance transformation and systems operations, not production mobile development.',
        },
      ],
      transfers:
        'I can contribute in analytics, planning, and operating model rigor, but not as a primary mobile IC.',
      recommendation:
        "If you need immediate mobile execution, I'm probably not your person for this role.",
    }
  }

  return {
    verdict: mentionsFinance ? 'strong_fit' : 'worth_conversation',
    headline: mentionsFinance ? 'Strong fit for finance-operations scope' : 'Worth a conversation',
    opening:
      'I match strongly on finance transformation, scenario planning, and system-level operating rigor.',
    gaps: mentionsFinance
      ? []
      : [
          {
            requirement: 'Deep domain specialization not explicitly in my recent scope',
            gapTitle: 'Domain specificity',
            explanation:
              'I can transfer operating model and governance patterns quickly, but I may need domain ramp time.',
          },
        ],
    transfers:
      'My strengths include structured planning, process redesign, and decision support under uncertainty.',
    recommendation:
      mentionsFinance
        ? 'I am a strong fit. Prioritize me for strategy + execution roles that need measurable operating discipline.'
        : 'This is worth a conversation if you value systems thinking and measurable process outcomes.',
  }
}

export async function analyzeJobDescription(
  jobDescription: string,
): Promise<{ result: JDAnalysisResult; honestyPass: boolean; honestyIssues: string[] }> {
  if (USE_MOCK_AI) {
    const result = mockAnalyze(jobDescription)
    const check = honestyChecklist(result)
    return { result, honestyPass: check.pass, honestyIssues: check.issues }
  }

  const res = await fetch(`${API_BASE}/analyze-jd`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobDescription }),
  })
  if (!res.ok) {
    throw new Error(`JD analyzer failed: ${res.status}`)
  }
  const json = await res.json()
  const result = JDAnalysisSchema.parse(json)
  const check = honestyChecklist(result)
  return { result, honestyPass: check.pass, honestyIssues: check.issues }
}

export async function sendChatMessage(
  message: string,
  sessionId: string,
  context: CandidateContext,
): Promise<string> {
  if (USE_MOCK_AI) {
    if (message.toLowerCase().includes('weakness')) {
      return (
        "My biggest weakness is that I'm direct about fit and constraints. " +
        "That can feel blunt, but it prevents misalignment and wasted cycles."
      )
    }
    return (
      `Short answer from ${context.profile.fullName}: ` +
      'I prioritize honest fit, measurable outcomes, and explicit trade-offs in role decisions.'
    )
  }

  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId }),
  })
  if (!res.ok) {
    throw new Error(`Chat request failed: ${res.status}`)
  }
  const json = await res.json()
  const parsed = ChatResponseSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error('Chat response contract mismatch')
  }
  return parsed.data.message
}

export function getSuggestedQuestions(): string[] {
  return [
    "What's your biggest weakness?",
    'Tell me about a project that failed',
    'Why did you leave your last role?',
    'What would your manager say about you?',
  ]
}

export function getDefaultContext(): CandidateContext {
  return seedContext
}

