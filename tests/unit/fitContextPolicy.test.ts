import { describe, expect, it } from 'vitest'
import {
  BASE_FALLBACK_CONTEXT,
  buildFitPolicyLines,
  buildInstructionPolicyBlock,
  withContactBlock,
} from '../../supabase/functions/_shared/fitContextPolicy'

describe('fitContextPolicy', () => {
  it('withContactBlock appends contact section', () => {
    const out = withContactBlock('Context block', 'test@example.com')
    expect(out).toContain('Context block')
    expect(out).toContain('## Contact')
    expect(out).toContain('test@example.com')
  })

  it('buildFitPolicyLines composes profile policy lines', () => {
    const out = buildFitPolicyLines({
      looking_for: 'CFOs',
      not_looking_for: 'Tax work',
      management_style: 'Direct',
      work_style_preferences: 'Async',
    })
    expect(out).toContain('Best-fit clients: CFOs')
    expect(out).toContain('Not a fit: Tax work')
    expect(out).toContain('Engagement style: Direct')
    expect(out).toContain('How I work: Async')
  })

  it('buildInstructionPolicyBlock formats priority/instruction lines', () => {
    const out = buildInstructionPolicyBlock([
      { priority: 100, instruction: 'Never oversell' },
      { priority: 90, instruction: 'State uncertainty' },
    ])
    expect(out).toBe('P100: Never oversell\nP90: State uncertainty')
  })

  it('base fallback context contains core section markers', () => {
    expect(BASE_FALLBACK_CONTEXT).toContain('## About Kris SayreSmith')
    expect(BASE_FALLBACK_CONTEXT).toContain('## The AI Finance Assessment')
    expect(BASE_FALLBACK_CONTEXT).toContain('## Best-Fit Clients')
  })
})
