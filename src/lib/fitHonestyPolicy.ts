export const OVERCLAIM_TERMS = {
  analyzeJd: ['game-changing', 'world-class', 'best-in-class', 'revolutionary', 'rockstar'],
  chat: ['world-class', 'best-in-class', 'unmatched', 'game-changing', 'perfect fit'],
  honesty: ['game-changing', 'revolutionary', 'synergy', 'world-class', 'best-in-class'],
} as const

export type OverclaimPolicy = keyof typeof OVERCLAIM_TERMS

export function detectTerms(text: string, terms: readonly string[]): string[] {
  const lower = text.toLowerCase()
  return terms.filter((term) => lower.includes(term))
}

export function detectOverclaimLanguage(text: string, policy: OverclaimPolicy): string[] {
  return detectTerms(text, OVERCLAIM_TERMS[policy])
}
