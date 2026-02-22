import { describe, expect, it } from 'vitest'
import { detectOverclaimLanguage, detectTerms, OVERCLAIM_TERMS } from '../../src/lib/fitHonestyPolicy'

describe('fitHonestyPolicy', () => {
  it('detectTerms returns matched terms case-insensitively', () => {
    const text = 'A WORLD-CLASS and revolutionary plan'
    expect(detectTerms(text, ['world-class', 'revolutionary'])).toEqual(['world-class', 'revolutionary'])
  })

  it('detectOverclaimLanguage uses policy term sets', () => {
    const text = 'This is a perfect fit and world-class approach'
    expect(detectOverclaimLanguage(text, 'chat')).toEqual(['world-class', 'perfect fit'])
    expect(detectOverclaimLanguage(text, 'honesty')).toEqual(['world-class'])
  })

  it('policy map exposes expected keys', () => {
    expect(Object.keys(OVERCLAIM_TERMS).sort()).toEqual(['analyzeJd', 'chat', 'honesty'])
  })
})
