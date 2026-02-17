import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const rateLimitCache = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 20

type CandidateBundle = {
  candidateId: string
  profile: Record<string, unknown> | null
  experiences: Array<Record<string, unknown>>
  skills: Array<Record<string, unknown>>
  gaps: Array<Record<string, unknown>>
  faq: Array<Record<string, unknown>>
  instructions: Array<Record<string, unknown>>
  history: Array<Record<string, unknown>>
}

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const current = rateLimitCache.get(ip)
  if (!current || current.resetAt < now) {
    rateLimitCache.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (current.count >= MAX_REQUESTS_PER_WINDOW) return false
  current.count += 1
  rateLimitCache.set(ip, current)
  return true
}

async function callLlmWithRetry(systemPrompt: string, userMessage: string): Promise<string | null> {
  const apiKey = Deno.env.get('LLM_API_KEY')
  if (!apiKey) return null
  const model = Deno.env.get('LLM_MODEL') || 'claude-sonnet-4-5'
  const apiUrl = Deno.env.get('LLM_API_URL') || 'https://api.anthropic.com/v1/messages'
  const isAnthropic = apiUrl.includes('anthropic.com')

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: isAnthropic
          ? {
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json',
            }
          : {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
        body: JSON.stringify(
          isAnthropic
            ? {
                model,
                max_tokens: 1000,
                temperature: 0.2,
                system: systemPrompt,
                messages: [{ role: 'user', content: userMessage }],
              }
            : {
                model,
                temperature: 0.2,
                messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: userMessage },
                ],
              },
        ),
        signal: controller.signal,
      })
      if (res.ok) {
        const json = await res.json()
        const content = isAnthropic
          ? json?.content?.[0]?.text
          : json?.choices?.[0]?.message?.content
        if (content && typeof content === 'string') return content
      }
    } catch {
      // ignore and retry
    } finally {
      clearTimeout(timeout)
    }
  }
  return null
}

function detectOverclaimLanguage(text: string): string[] {
  const banned = ['world-class', 'best-in-class', 'unmatched', 'game-changing', 'perfect fit']
  const lower = text.toLowerCase()
  return banned.filter((term) => lower.includes(term))
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

## Contact

Email: kas41866@gmail.com
`.trim()

async function fetchCandidateBundle(
  db: ReturnType<typeof createClient>,
  sessionId: string,
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
    { data: history = [] },
  ] = await Promise.all([
    db.from('experiences').select('*').eq('candidate_id', candidateId).order('display_order', { ascending: true }),
    db.from('skills').select('*').eq('candidate_id', candidateId),
    db.from('gaps_weaknesses').select('*').eq('candidate_id', candidateId),
    db.from('faq_responses').select('*').eq('candidate_id', candidateId),
    db.from('ai_instructions').select('*').eq('candidate_id', candidateId).eq('active', true).order('priority', { ascending: false }),
    db.from('chat_history').select('role, content').eq('session_id', sessionId).order('created_at', { ascending: false }).limit(20),
  ])

  return { candidateId, profile, experiences, skills, gaps, faq, instructions, history }
}

function buildContextPrompt(bundle: CandidateBundle): string {
  const profile = bundle.profile || {}
  const profileBlock =
    `Name: ${String(profile.full_name || '')}\n` +
    `Title: ${String(profile.title || '')}\n` +
    `Pitch: ${String(profile.elevator_pitch || '')}\n` +
    `Background: ${String(profile.career_narrative || '')}\n` +
    `Best-fit clients: ${String(profile.looking_for || '')}\n` +
    `Not a fit: ${String(profile.not_looking_for || '')}\n` +
    `Engagement style: ${String(profile.management_style || '')}\n` +
    `How I work: ${String(profile.work_style_preferences || '')}`

  const experienceBlock = bundle.experiences
    .map((exp) => {
      const bullets = Array.isArray(exp.bullet_points) ? exp.bullet_points.map(String).join(' | ') : ''
      return (
        `Company: ${String(exp.company_name || '')}\n` +
        `Title: ${String(exp.title || '')}\n` +
        `Date range: ${String(exp.date_range || '')}\n` +
        `Bullets: ${bullets}\n` +
        `Why joined: ${String(exp.why_joined || '')}\n` +
        `Why left: ${String(exp.why_left || '')}\n` +
        `Actual contributions: ${String(exp.actual_contributions || '')}\n` +
        `Proudest achievement: ${String(exp.proudest_achievement || '')}\n` +
        `Would do differently: ${String(exp.would_do_differently || '')}\n` +
        `Challenges: ${String(exp.challenges_faced || '')}\n` +
        `Lessons: ${String(exp.lessons_learned || '')}\n` +
        `Manager view: ${String(exp.manager_would_say || '')}\n` +
        `Reports view: ${String(exp.reports_would_say || '')}`
      )
    })
    .join('\n---\n')

  const skillsBlock = bundle.skills
    .map((s) => `${String(s.skill_name || '')} [${String(s.category || '')}] - ${String(s.honest_notes || s.evidence || '')}`)
    .join('\n')

  const gapsBlock = bundle.gaps
    .map((g) => `${String(g.description || '')} - ${String(g.why_its_a_gap || '')}`)
    .join('\n')

  const faqBlock = bundle.faq.map((f) => `Q: ${String(f.question || '')}\nA: ${String(f.answer || '')}`).join('\n')
  const policyBlock = bundle.instructions.map((i) => `P${String(i.priority || 0)}: ${String(i.instruction || '')}`).join('\n')

  return [
    '## Consultant Summary',
    profileBlock,
    '## Experience',
    experienceBlock,
    '## Skills',
    skillsBlock,
    '## Service Limits',
    gapsBlock,
    '## FAQ',
    faqBlock,
    '## Instruction Priorities',
    policyBlock,
  ].join('\n\n')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(ip)) {
    return jsonResponse({ error: 'rate limit exceeded' }, 429)
  }

  const body = await req.json().catch(() => null)
  const message = body?.message ? String(body.message) : ''
  const sessionId = body?.sessionId ? String(body.sessionId) : 'default-session'
  if (message.length < 2) {
    return jsonResponse({ error: 'message too short' }, 400)
  }

  const startedAt = Date.now()
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  const db = supabaseUrl && serviceRole ? createClient(supabaseUrl, serviceRole) : null

  const bundle = db ? await fetchCandidateBundle(db, sessionId) : null
  const contextBlock = bundle ? buildContextPrompt(bundle) : ''
  const historyBlock = (bundle?.history || [])
    .slice()
    .reverse()
    .map((item) => `${String(item.role || 'user')}: ${String(item.content || '')}`)
    .join('\n')

  const activeContext = contextBlock || FALLBACK_CONTEXT
  const systemPrompt =
    `You are the AI assistant for Kris SayreSmith's consulting portfolio.\n` +
    `Kris is an AI Finance Consultant — a CPA with 15+ years of FP&A experience who helps mid-market companies identify where AI can improve their finance operations.\n` +
    `Your job is to help potential clients understand what Kris offers, whether their organization is a good fit, and what to expect from an engagement.\n` +
    `Always be honest and concrete. Never fabricate credentials or outcomes.\n` +
    `If a potential client's situation is outside Kris's scope — tax compliance, audit, companies under 20 employees, or mid-implementation support — say so directly.\n` +
    `Use first person voice as if Kris is speaking.\n` +
    `If uncertainty is high, say so explicitly rather than guessing.\n` +
    `Keep answers concise and specific unless asked for detail.\n\n` +
    `Consulting context:\n${activeContext}\n\n` +
    `Recent conversation history:\n${historyBlock}\n`

  const llmReply = await callLlmWithRetry(systemPrompt, message)
  let reply =
    llmReply ||
    "I can't confidently answer that from the current context. I'd rather say so directly than guess."
  if (detectOverclaimLanguage(reply).length > 0) {
    reply = "I should be direct: not every finance challenge is a good fit for an AI assessment, and I'd rather be clear about that than oversell."
  }

  if (db && bundle?.candidateId) {
    await db.from('chat_history').insert([
      {
        candidate_id: bundle.candidateId,
        session_id: sessionId,
        role: 'user',
        content: message,
        prompt_version: Deno.env.get('PROMPT_VERSION') || 'phase2-v2',
        verdict_class: null,
        latency_ms: null,
      },
      {
        candidate_id: bundle.candidateId,
        session_id: sessionId,
        role: 'assistant',
        content: reply,
        prompt_version: Deno.env.get('PROMPT_VERSION') || 'phase2-v2',
        verdict_class: null,
        latency_ms: Date.now() - startedAt,
      },
    ])
  }

  return jsonResponse({ message: reply }, 200)
})

