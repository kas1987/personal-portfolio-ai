import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'
import { callLlm, FALLBACK_CONTEXT, fallbackAnalyze } from './analysis.ts'
import { buildContextPrompt, fetchCandidateBundle } from './candidateContext.ts'
import { corsHeaders, isResultShape, jsonResponse } from './shared.ts'

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
