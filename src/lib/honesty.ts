import type { JDAnalysisResult } from '../types/domain'
import { detectOverclaimLanguage as detectOverclaimLanguageByPolicy } from './fitHonestyPolicy'

export function detectOverclaimLanguage(text: string): string[] {
  return detectOverclaimLanguageByPolicy(text, 'honesty')
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

