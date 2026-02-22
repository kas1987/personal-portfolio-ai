export type FitVerdict = 'strong_fit' | 'worth_conversation' | 'probably_not' | 'needs_clarification'

export type JDAnalysisResult = {
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

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

export function isResultShape(value: unknown): value is JDAnalysisResult {
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
