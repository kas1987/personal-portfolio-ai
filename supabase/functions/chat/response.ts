import { detectOverclaimLanguage as detectOverclaimLanguageByPolicy } from '../_shared/fitHonestyPolicy.ts'

export async function callLlmWithRetry(systemPrompt: string, userMessage: string): Promise<string | null> {
  const apiKey = Deno.env.get('LLM_API_KEY')
  if (!apiKey) return null
  const model = Deno.env.get('LLM_MODEL') || 'claude-sonnet-4-5'
  const apiUrl = Deno.env.get('LLM_API_URL') || 'https://api.anthropic.com/v1/messages'
  const isAnthropic = apiUrl.includes('anthropic.com')

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: isAnthropic
          ? {
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json',
            }
          : {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
        body: JSON.stringify(
          isAnthropic
            ? {
                model,
                max_tokens: 1000,
                temperature: 0.2,
                system: systemPrompt,
                messages: [{ role: 'user', content: userMessage }],
              }
            : {
                model,
                temperature: 0.2,
                messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: userMessage },
                ],
              },
        ),
        signal: controller.signal,
      })
      if (res.ok) {
        const json = await res.json()
        const content = isAnthropic
          ? json?.content?.[0]?.text
          : json?.choices?.[0]?.message?.content
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

export function detectOverclaimLanguage(text: string): string[] {
  return detectOverclaimLanguageByPolicy(text, 'chat')
}
