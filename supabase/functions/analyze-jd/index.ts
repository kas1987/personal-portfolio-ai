import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

type FitVerdict = 'strong_fit' | 'worth_conversation' | 'probably_not' | 'needs_clarification'

type JDAnalysisResult = {
  verdict: FitVerdict
  headline: string
  opening: string
  gaps: Array<{
    requirement: string
    gapTitle: string
    explanation: string
  }>
  transfers: string
  recommendation: string
}

type CandidateBundle = {
  candidateId: string
  profile: Record<string, unknown> | null
  experiences: Array<Record<string, unknown>>
  skills: Array<Record<string, unknown>>
  gaps: Array<Record<string, unknown>>
  faq: Array<Record<string, unknown>>
  instructions: Array<Record<string, unknown>>
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function isResultShape(value: unknown): value is JDAnalysisResult {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  const verdicts = ['strong_fit', 'worth_conversation', 'probably_not', 'needs_clarification']
  const hasValidGaps = Array.isArray(v.gaps) && v.gaps.every((gap) => {
    const g = gap as Record<string, unknown>
    return typeof g.requirement === 'string' && typeof g.gapTitle === 'string' && typeof g.explanation === 'string'
  })
  return (
    typeof v.headline === 'string' &&
    typeof v.opening === 'string' &&
    typeof v.transfers === 'string' &&
    typeof v.recommendation === 'string' &&
    typeof v.verdict === 'string' &&
    verdicts.includes(v.verdict) &&
    hasValidGaps
  )
}

function sanitizeJsonPayload(raw: string): unknown {
  const trimmed = raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '')
  return JSON.parse(trimmed)
}

function detectOverclaimLanguage(text: string): string[] {
  const banned = ['game-changing', 'world-class', 'best-in-class', 'revolutionary', 'rockstar']
  const lower = text.toLowerCase()
  return banned.filter((word) => lower.includes(word))
}

function fallbackAnalyze(jobDescription: string): JDAnalysisResult {
  const jd = jobDescription.toLowerCase()
  const mentionsMobile = jd.includes('mobile') || jd.includes('ios') || jd.includes('android')
  const mentionsFinance = jd.includes('finance') || jd.includes('fp&a') || jd.includes('forecast')
  if (mentionsMobile && !mentionsFinance) {
    return {
      verdict: 'probably_not',
      headline: 'Probably not your person for this role',
      opening: 'This role appears mobile-engineering heavy, which does not match my core background.',
      gaps: [
        {
          requirement: 'Deep production mobile engineering',
          gapTitle: 'Mobile engineering depth',
          explanation: 'My background is finance transformation and systems operations.',
        },
      ],
      transfers: 'I can help with planning, analytics, and operating model rigor if needed.',
      recommendation: "If this role needs immediate mobile execution, I'm probably not your person.",
    }
  }
  return {
    verdict: mentionsFinance ? 'strong_fit' : 'worth_conversation',
    headline: mentionsFinance ? 'Strong fit for this scope' : 'Worth a conversation',
    opening: 'I align most with finance-operations systems work and measurable process outcomes.',
    gaps: mentionsFinance
      ? []
      : [
          {
            requirement: 'Domain depth not explicit in my recent scope',
            gapTitle: 'Domain specificity',
            explanation: 'Transfer is likely, but ramp-up is expected.',
          },
        ],
    transfers: 'I bring structured planning, governance, and execution discipline.',
    recommendation:
      mentionsFinance
        ? 'Proceed with conversation for strategy and execution ownership.'
        : 'Proceed only if you value systems translation and measurable process outcomes.',
  }
}

async function callLlm(jobDescription: string, systemPrompt: string): Promise<JDAnalysisResult | null> {
  const apiKey = Deno.env.get('LLM_API_KEY')
  const model = Deno.env.get('LLM_MODEL') || 'claude-sonnet-4-5'
  const apiUrl = Deno.env.get('LLM_API_URL') || 'https://api.anthropic.com/v1/messages'
  if (!apiKey) return null

  const isAnthropic = apiUrl.includes('anthropic.com')
  let raw: string | null = null
  if (isAnthropic) {
    const body = {
      model,
      max_tokens: 1400,
      temperature: 0.2,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analyze this job description and respond with strict JSON only:\n\n${jobDescription}`,
        },
      ],
    }
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) return null
    const json = await res.json()
    raw = json?.content?.[0]?.text || null
  } else {
    const body = {
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Analyze this job description and respond with strict JSON only:\n\n${jobDescription}`,
        },
      ],
    }
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) return null
    const json = await res.json()
    raw = json?.choices?.[0]?.message?.content || null
  }
  if (!raw || typeof raw !== 'string') return null
  const parsed = sanitizeJsonPayload(raw)
  if (!isResultShape(parsed)) return null

  const overclaims = detectOverclaimLanguage(
    [parsed.opening, parsed.transfers, parsed.recommendation].join(' '),
  )
  if (overclaims.length > 0) return null
  return parsed
}

async function fetchCandidateBundle(
  db: ReturnType<typeof createClient>,
): Promise<CandidateBundle | null> {
  const { data: profile } = await db.from('candidate_profile').select('*').limit(1).maybeSingle()
  if (!profile?.id) return null
  const candidateId = String(profile.id)
  const [
    { data: experiences = [] },
    { data: skills = [] },
    { data: gaps = [] },
    { data: faq = [] },
    { data: instructions = [] },
  ] = await Promise.all([
    db.from('experiences').select('*').eq('candidate_id', candidateId).order('display_order', { ascending: true }),
    db.from('skills').select('*').eq('candidate_id', candidateId),
    db.from('gaps_weaknesses').select('*').eq('candidate_id', candidateId),
    db.from('faq_responses').select('*').eq('candidate_id', candidateId),
    db.from('ai_instructions').select('*').eq('candidate_id', candidateId).eq('active', true).order('priority', { ascending: false }),
  ])
  return { candidateId, profile, experiences, skills, gaps, faq, instructions }
}

function buildContextPrompt(bundle: CandidateBundle): string {
  const profile = bundle.profile || {}
  const intro =
    `Candidate name: ${String(profile.full_name || '')}\n` +
    `Title: ${String(profile.title || '')}\n` +
    `Career narrative: ${String(profile.career_narrative || '')}\n` +
    `Looking for: ${String(profile.looking_for || '')}\n` +
    `Not looking for: ${String(profile.not_looking_for || '')}\n` +
    `Management style: ${String(profile.management_style || '')}\n` +
    `Work style preferences: ${String(profile.work_style_preferences || '')}`

  const roles = bundle.experiences
    .map((exp) => {
      const bullets = Array.isArray(exp.bullet_points) ? exp.bullet_points.map(String).join(' | ') : ''
      return (
        `Company: ${String(exp.company_name || '')}\n` +
        `Title: ${String(exp.title || '')}\n` +
        `Title progression: ${String(exp.title_progression || '')}\n` +
        `Dates: ${String(exp.date_range || '')}\n` +
        `Bullets: ${bullets}\n` +
        `Why joined: ${String(exp.why_joined || '')}\n` +
        `Why left: ${String(exp.why_left || '')}\n` +
        `Actual contributions: ${String(exp.actual_contributions || '')}\n` +
        `Proudest achievement: ${String(exp.proudest_achievement || '')}\n` +
        `Would do differently: ${String(exp.would_do_differently || '')}\n` +
        `Challenges faced: ${String(exp.challenges_faced || '')}\n` +
        `Conflicts/challenges: ${String(exp.conflicts_challenges || '')}\n` +
        `Lessons learned: ${String(exp.lessons_learned || '')}\n` +
        `Quantified impact: ${String(exp.quantified_impact || '')}`
      )
    })
    .join('\n---\n')

  const skills = bundle.skills
    .map((s) => `${String(s.skill_name || '')} [${String(s.category || '')}] :: ${String(s.honest_notes || s.evidence || '')}`)
    .join('\n')

  const gaps = bundle.gaps
    .map((g) => `${String(g.description || '')} :: ${String(g.why_its_a_gap || '')}`)
    .join('\n')

  const faq = bundle.faq.map((f) => `Q: ${String(f.question || '')}\nA: ${String(f.answer || '')}`).join('\n')
  const instructions = bundle.instructions.map((i) => `P${String(i.priority || 0)}: ${String(i.instruction || '')}`).join('\n')

  return [
    '## Candidate Profile',
    intro,
    '## Experience Deep Dive',
    roles,
    '## Skills',
    skills,
    '## Explicit Gaps',
    gaps,
    '## FAQ',
    faq,
    '## Anti-Sycophancy Instructions',
    instructions,
  ].join('\n\n')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const body = await req.json().catch(() => null)
  const jobDescription = body?.jobDescription ? String(body.jobDescription) : ''
  if (jobDescription.length < 30) {
    return jsonResponse({ error: 'jobDescription too short' }, 400)
  }

  const startedAt = Date.now()
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  const db = supabaseUrl && serviceRole ? createClient(supabaseUrl, serviceRole) : null

  const bundle = db ? await fetchCandidateBundle(db) : null
  const contextBlock = bundle ? buildContextPrompt(bundle) : ''

  const systemPrompt =
    `You are an honest career fit assessor.\n` +
    `You must avoid flattery, avoid overclaiming, and clearly state non-fit when appropriate.\n` +
    `If there are major gaps, explicitly say "I'm probably not your person" in recommendation.\n` +
    `Always return strict JSON with keys: verdict, headline, opening, gaps, transfers, recommendation.\n` +
    `Allowed verdict values: strong_fit, worth_conversation, probably_not, needs_clarification.\n` +
    `If major requirements are missing, choose probably_not or needs_clarification.\n` +
    `Gap object keys must be requirement, gapTitle, explanation.\n` +
    (contextBlock ? `\nCandidate context:\n${contextBlock}\n` : '')

  const payload = (await callLlm(jobDescription, systemPrompt)) || fallbackAnalyze(jobDescription)

  if (!isResultShape(payload)) {
    return jsonResponse({ error: 'analyzer response contract mismatch' }, 502)
  }

  if (db && bundle?.candidateId) {
    await db.from('chat_history').insert([
      {
        candidate_id: bundle.candidateId,
        session_id: 'jd-analyzer',
        role: 'user',
        content: jobDescription,
        prompt_version: Deno.env.get('PROMPT_VERSION') || 'phase2-v2',
        verdict_class: null,
        latency_ms: null,
      },
      {
        candidate_id: bundle.candidateId,
        session_id: 'jd-analyzer',
        role: 'assistant',
        content: JSON.stringify(payload),
        prompt_version: Deno.env.get('PROMPT_VERSION') || 'phase2-v2',
        verdict_class: payload.verdict,
        latency_ms: Date.now() - startedAt,
      },
    ])
  }

  return jsonResponse(payload, 200)
})

