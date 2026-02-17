import type { JDAnalysisResult } from '../types/domain'

const BANNED_SOFTENERS = [
  'game-changing',
  'revolutionary',
  'synergy',
  'world-class',
  'best-in-class',
]

export function detectOverclaimLanguage(text: string): string[] {
  const lower = text.toLowerCase()
  return BANNED_SOFTENERS.filter((token) => lower.includes(token))
}

export function honestyChecklist(result: JDAnalysisResult): { pass: boolean; issues: string[] } {
  const issues: string[] = []
  const combined = [result.headline, result.opening, result.transfers, result.recommendation].join(' ')
  const overclaims = detectOverclaimLanguage(combined)
  if (overclaims.length > 0) {
    issues.push(`Overclaim language detected: ${overclaims.join(', ')}`)
  }

  if (result.verdict === 'probably_not' && result.gaps.length === 0) {
    issues.push("Probably-not verdict requires explicit gap rationale")
  }

  if (result.verdict !== 'strong_fit' && !result.recommendation.toLowerCase().includes('not your person')) {
    issues.push("Non-strong verdict should include direct fit language")
  }

  return { pass: issues.length === 0, issues }
}

