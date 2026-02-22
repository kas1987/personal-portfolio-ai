import { afterEach, describe, expect, it, vi } from 'vitest'
import { requestChatMessage, requestJdAnalysis } from '../../src/lib/aiApiClient'

describe('aiApiClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('requestJdAnalysis posts payload and returns parsed json', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ verdict: 'strong_fit' }),
    } as Response)

    const out = await requestJdAnalysis('Need FP&A automation support')
    expect(out).toEqual({ verdict: 'strong_fit' })
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const [url, init] = fetchSpy.mock.calls[0]
    expect(String(url)).toContain('/api/analyze-jd')
    expect(init?.method).toBe('POST')
  })

  it('requestChatMessage throws on non-OK response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 500 } as Response)
    await expect(requestChatMessage('hello', 'session-1')).rejects.toThrow('Chat request failed: 500')
  })
})
