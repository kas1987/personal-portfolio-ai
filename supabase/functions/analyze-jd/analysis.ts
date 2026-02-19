import { BASE_FALLBACK_CONTEXT } from '../_shared/fitContextPolicy.ts'
import { detectOverclaimLanguage } from '../_shared/fitHonestyPolicy.ts'
import { isResultShape, type JDAnalysisResult } from './shared.ts'

export const FALLBACK_CONTEXT = BASE_FALLBACK_CONTEXT

function sanitizeJsonPayload(raw: string): unknown {
  const trimmed = raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '')
  return JSON.parse(trimmed)
}

export function fallbackAnalyze(clientDescription: string): JDAnalysisResult {
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

export async function callLlm(jobDescription: string, systemPrompt: string): Promise<JDAnalysisResult | null> {
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
    'analyzeJd',
  )
  if (overclaims.length > 0) return null
  return parsed
}
