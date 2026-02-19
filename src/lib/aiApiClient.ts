const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

async function postJson(path: string, body: unknown): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res
}

export async function requestJdAnalysis(jobDescription: string): Promise<unknown> {
  const res = await postJson('/analyze-jd', { jobDescription })
  if (!res.ok) {
    throw new Error(`JD analyzer failed: ${res.status}`)
  }
  return res.json()
}

export async function requestChatMessage(message: string, sessionId: string): Promise<unknown> {
  const res = await postJson('/chat', { message, sessionId })
  if (!res.ok) {
    throw new Error(`Chat request failed: ${res.status}`)
  }
  return res.json()
}
