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
  return (
    typeof v.headline === 'string' &&
    typeof v.opening === 'string' &&
    typeof v.transfers === 'string' &&
    typeof v.recommendation === 'string' &&
    typeof v.verdict === 'string' &&
    verdicts.includes(v.verdict) &&
    Array.isArray(v.gaps)
  )
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
  const model = Deno.env.get('LLM_MODEL') || 'gpt-4o-mini'
  const apiUrl = Deno.env.get('LLM_API_URL') || 'https://api.openai.com/v1/chat/completions'
  if (!apiKey) return null

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
  const raw = json?.choices?.[0]?.message?.content
  if (!raw || typeof raw !== 'string') return null
  const parsed = JSON.parse(raw)
  if (!isResultShape(parsed)) return null
  return parsed
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

  let candidateId = ''
  let instructions = ''
  if (db) {
    const { data: profile } = await db.from('candidate_profile').select('id').limit(1).maybeSingle()
    candidateId = String(profile?.id || '')
    if (candidateId) {
      const { data: aiInstructions } = await db
        .from('ai_instructions')
        .select('instruction, priority')
        .eq('candidate_id', candidateId)
        .eq('active', true)
        .order('priority', { ascending: false })
      instructions = (aiInstructions || [])
        .map((row) => `P${row.priority}: ${row.instruction}`)
        .join('\n')
    }
  }

  const systemPrompt =
    `You are an honest career fit assessor.\n` +
    `You must avoid flattery, avoid overclaiming, and clearly state non-fit when appropriate.\n` +
    `Always return strict JSON with keys: verdict, headline, opening, gaps, transfers, recommendation.\n` +
    `Allowed verdict values: strong_fit, worth_conversation, probably_not, needs_clarification.\n` +
    `If major requirements are missing, choose probably_not or needs_clarification.\n` +
    (instructions ? `\nCandidate policy instructions:\n${instructions}\n` : '')

  const payload = (await callLlm(jobDescription, systemPrompt)) || fallbackAnalyze(jobDescription)

  if (!isResultShape(payload)) {
    return jsonResponse({ error: 'analyzer response contract mismatch' }, 502)
  }

  if (db && candidateId) {
    await db.from('chat_history').insert({
      candidate_id: candidateId,
      session_id: 'jd-analyzer',
      role: 'assistant',
      content: JSON.stringify(payload),
      prompt_version: Deno.env.get('PROMPT_VERSION') || 'phase2-v1',
      verdict_class: payload.verdict,
      latency_ms: Date.now() - startedAt,
    })
  }

  return jsonResponse(payload, 200)
})

