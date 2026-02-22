import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'
import { buildContextPrompt, buildHistoryBlock, FALLBACK_CONTEXT, fetchCandidateBundle } from './context.ts'
import { buildSystemPrompt } from './prompt.ts'
import { callLlmWithRetry, detectOverclaimLanguage } from './response.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const rateLimitCache = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 20

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
  const historyBlock = buildHistoryBlock(bundle?.history || [])

  const activeContext = contextBlock || FALLBACK_CONTEXT
  const systemPrompt = buildSystemPrompt(activeContext, historyBlock)

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
