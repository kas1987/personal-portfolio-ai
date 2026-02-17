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

const FALLBACK_CONTEXT = `
## About Kris SayreSmith

Kris is a licensed CPA with 15+ years of corporate FP&A leadership at companies including Reynolds American (Fortune 500, $90M P&L ownership), Glatfelter, NBEO, and Sealed Air. Kris now runs an independent AI Finance Assessment practice helping mid-market finance teams identify where AI can improve their operations.

## The AI Finance Assessment

A fixed-fee, 2-week engagement at $3,500 that delivers:
1. Current-state workflow map — where the finance team's time actually goes
2. AI readiness score — which workflows are ready for automation now vs. later
3. Prioritized recommendation — which tools to build or buy, in what sequence
4. Implementation roadmap — a realistic 90-day action plan

## Best-Fit Clients

CFOs, Controllers, or VP Finance at companies with 50–500 employees who:
- Suspect AI can help but don't know where to start
- Have a close cycle, variance reporting, or forecasting process that feels manual
- Are evaluating finance software (Adaptive, Anaplan, Planful, Vena) and want independent guidance

## Not a Fit

- Tax compliance, audit, or attestation work
- Companies with fewer than 20 employees or no dedicated finance function
- Organizations already mid-implementation needing execution support only
- Tobacco or nicotine industry (non-compete restrictions currently apply)
`.trim()

function fallbackAnalyze(clientDescription: string): JDAnalysisResult {
  const desc = clientDescription.toLowerCase()
  const mentionsFinanceOps = (
    desc.includes('fp&a') || desc.includes('forecast') || desc.includes('budget') ||
    desc.includes('variance') || desc.includes('close') || desc.includes('reporting') ||
    desc.includes('automation') || desc.includes('finance') || desc.includes('controller') ||
    desc.includes('cfo') || desc.includes('excel') || desc.includes('reconciliation')
  )
  const mentionsOutOfScope = (
    desc.includes('tax') || desc.includes('audit') || desc.includes('attestation') ||
    desc.includes('compliance') || desc.includes('startup') && desc.includes('seed')
  )
  if (mentionsOutOfScope && !mentionsFinanceOps) {
    return {
      verdict: 'probably_not',
      headline: 'Outside the scope of the AI Finance Assessment',
      opening: 'The situation you described sounds like it falls outside what the AI Finance Assessment addresses.',
      gaps: [
        {
          requirement: 'Finance operations automation opportunity',
          gapTitle: 'Scope mismatch',
          explanation: 'The assessment focuses on FP&A automation — variance reporting, forecasting, close cycle, and recurring reporting. Tax, audit, or compliance work is a different scope.',
        },
      ],
      transfers: 'If there is a finance operations component alongside the compliance need, that portion may be in scope.',
      recommendation: 'Probably not the right engagement. Worth a brief conversation if there are FP&A automation needs alongside the compliance work.',
    }
  }
  return {
    verdict: mentionsFinanceOps ? 'strong_fit' : 'worth_conversation',
    headline: mentionsFinanceOps ? 'Looks like a good fit for the AI Finance Assessment' : 'Worth a conversation to assess fit',
    opening: mentionsFinanceOps
      ? 'The finance operations challenges you described align well with what the AI Finance Assessment addresses.'
      : 'There may be a fit here, but I need more information about the specific finance workflows to assess it.',
    gaps: mentionsFinanceOps
      ? []
      : [
          {
            requirement: 'Specific FP&A automation opportunity',
            gapTitle: 'Scope clarity needed',
            explanation: 'The assessment works best when there are defined recurring workflows — close cycle, variance reporting, or forecasting — that currently feel manual.',
          },
        ],
    transfers: 'The assessment methodology works across industries. Finance process maturity and data structure matter more than the specific vertical.',
    recommendation: mentionsFinanceOps
      ? 'Schedule a discovery call. I can scope the assessment and confirm fit within 30 minutes.'
      : 'Happy to have a brief conversation to see if the finance operations side of your business is a fit.',
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
          content: `Analyze this client's finance situation for consulting fit and respond with strict JSON only:\n\n${jobDescription}`,
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
          content: `Analyze this client's finance situation for consulting fit and respond with strict JSON only:\n\n${jobDescription}`,
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
    `Consultant name: ${String(profile.full_name || '')}\n` +
    `Title: ${String(profile.title || '')}\n` +
    `Background: ${String(profile.career_narrative || '')}\n` +
    `Best-fit clients: ${String(profile.looking_for || '')}\n` +
    `Not a fit: ${String(profile.not_looking_for || '')}\n` +
    `Engagement style: ${String(profile.management_style || '')}\n` +
    `How I work: ${String(profile.work_style_preferences || '')}`

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
    '## Consultant Profile',
    intro,
    '## Experience',
    roles,
    '## Skills',
    skills,
    '## Service Limits',
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
  const activeContext = contextBlock || FALLBACK_CONTEXT

  const systemPrompt =
    `You are an honest consulting fit assessor for Kris SayreSmith's AI Finance Assessment practice.\n` +
    `A potential client has described their organization's finance situation or challenges.\n` +
    `Your job: determine whether Kris's AI Finance Assessment ($3,500 fixed fee, 2-week engagement) is a good fit.\n` +
    `You must avoid flattery, avoid overclaiming, and clearly state non-fit when appropriate.\n` +
    `If the situation is outside scope, explicitly say so in the recommendation.\n` +
    `Always return strict JSON with keys: verdict, headline, opening, gaps, transfers, recommendation.\n` +
    `Allowed verdict values: strong_fit, worth_conversation, probably_not, needs_clarification.\n` +
    `strong_fit: Clear FP&A automation opportunity, appropriate company size (50-500 employees), finance team exists.\n` +
    `worth_conversation: Plausible need but scope or fit is unclear.\n` +
    `probably_not: Outside assessment scope — tax, audit, compliance, implementation support, or company too small/large.\n` +
    `needs_clarification: Not enough information to assess fit.\n` +
    `gaps[]: Key mismatches between what they described and what the assessment delivers.\n` +
    `transfers: Where Kris's background applies to their situation.\n` +
    `recommendation: Direct advice on whether to schedule a discovery call.\n` +
    `Gap object keys must be requirement, gapTitle, explanation.\n` +
    `\nConsulting context:\n${activeContext}\n`

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

