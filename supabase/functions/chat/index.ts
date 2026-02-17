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
  const model = Deno.env.get('LLM_MODEL') || 'gpt-4o-mini'
  const apiUrl = Deno.env.get('LLM_API_URL') || 'https://api.openai.com/v1/chat/completions'

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
        }),
        signal: controller.signal,
      })
      if (res.ok) {
        const json = await res.json()
        const content = json?.choices?.[0]?.message?.content
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

  let candidateId = ''
  let profileSummary = ''
  let policyBlock = ''
  if (db) {
    const { data: profile } = await db
      .from('candidate_profile')
      .select('id, full_name, title, elevator_pitch, looking_for, not_looking_for')
      .limit(1)
      .maybeSingle()
    if (profile) {
      candidateId = String(profile.id)
      profileSummary =
        `Name: ${profile.full_name}\nTitle: ${profile.title}\n` +
        `Pitch: ${profile.elevator_pitch}\nLooking for: ${profile.looking_for || ''}\n` +
        `Not looking for: ${profile.not_looking_for || ''}`
    }
    if (candidateId) {
      const { data: instructions } = await db
        .from('ai_instructions')
        .select('instruction, priority')
        .eq('candidate_id', candidateId)
        .eq('active', true)
        .order('priority', { ascending: false })
      policyBlock = (instructions || [])
        .map((item) => `P${item.priority}: ${item.instruction}`)
        .join('\n')
    }
  }

  const systemPrompt =
    `You are the candidate's AI portfolio assistant.\n` +
    `Always be honest and concrete.\n` +
    `Never fabricate achievements.\n` +
    `If the candidate is a poor fit, state it directly.\n` +
    `Keep answers concise and specific.\n\n` +
    `Candidate summary:\n${profileSummary}\n\n` +
    `Policy instructions:\n${policyBlock}\n`

  const llmReply = await callLlmWithRetry(systemPrompt, message)
  const reply =
    llmReply ||
    "I cannot confidently answer that from current context. I'd rather say that directly than guess."

  if (db && candidateId) {
    await db.from('chat_history').insert([
      {
        candidate_id: candidateId,
        session_id: sessionId,
        role: 'user',
        content: message,
        prompt_version: Deno.env.get('PROMPT_VERSION') || 'phase2-v1',
        verdict_class: null,
        latency_ms: null,
      },
      {
        candidate_id: candidateId,
        session_id: sessionId,
        role: 'assistant',
        content: reply,
        prompt_version: Deno.env.get('PROMPT_VERSION') || 'phase2-v1',
        verdict_class: null,
        latency_ms: Date.now() - startedAt,
      },
    ])
  }

  return jsonResponse({ message: reply }, 200)
})

