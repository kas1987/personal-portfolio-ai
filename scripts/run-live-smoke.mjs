const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'https://job-analyzer-deploy.netlify.app'
const FUNCTIONS_BASE_URL =
  process.env.SUPABASE_FUNCTIONS_BASE_URL || 'https://pxacpumgnxndwbkxkbao.supabase.co/functions/v1'
const REQUEST_TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 15000)
const RETRIES = Number(process.env.SMOKE_RETRIES || 2)

const routeChecks = [
  { path: '/', mustIncludeAny: ['personal-portfolio-ai'] },
  { path: '/admin', mustIncludeAny: ['personal-portfolio-ai'] },
  { path: '/admin/login', mustIncludeAny: ['personal-portfolio-ai'] },
]

function fail(message) {
  throw new Error(message)
}

async function withRetry(label, fn) {
  let lastErr
  for (let attempt = 1; attempt <= RETRIES + 1; attempt += 1) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (attempt <= RETRIES) {
        console.warn(`WARN ${label}: attempt ${attempt} failed, retrying...`)
      }
    }
  }
  throw lastErr
}

async function fetchWithTimeout(url, options = {}) {
  let timeoutHandle
  const timeoutPromise = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error(`timeout after ${REQUEST_TIMEOUT_MS}ms`)), REQUEST_TIMEOUT_MS)
  })
  try {
    return await Promise.race([fetch(url, options), timeoutPromise])
  } finally {
    clearTimeout(timeoutHandle)
  }
}

async function checkRoutes() {
  for (const route of routeChecks) {
    const url = `${FRONTEND_BASE_URL}${route.path}`
    const res = await withRetry(`route ${route.path}`, () => fetchWithTimeout(url))
    if (!res.ok) {
      fail(`FAIL route ${route.path}: expected 2xx, got ${res.status}`)
    }
    const text = await res.text()
    const matched = route.mustIncludeAny.some((token) => text.includes(token))
    if (!matched) {
      fail(
        `FAIL route ${route.path}: response missing expected tokens (${route.mustIncludeAny.join(', ')})`,
      )
    }
    console.log(`PASS route ${route.path}`)
  }
}

function assertAnalysisShape(json) {
  const required = ['verdict', 'headline', 'opening', 'gaps', 'transfers', 'recommendation']
  for (const key of required) {
    if (!(key in json)) {
      fail(`FAIL analyze-jd: missing key "${key}"`)
    }
  }
  if (!Array.isArray(json.gaps)) {
    fail('FAIL analyze-jd: gaps must be an array')
  }
}

function assertChatShape(json) {
  if (!json || typeof json.message !== 'string' || json.message.length === 0) {
    fail('FAIL chat: expected non-empty "message" string')
  }
}

async function checkAnalyzeJd() {
  const res = await withRetry('analyze-jd', () =>
    fetchWithTimeout(`${FUNCTIONS_BASE_URL}/analyze-jd`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobDescription:
          'Mid-market finance team needs close acceleration, forecast reliability, and AI operating model design.',
      }),
    }),
  )
  if (!res.ok) {
    fail(`FAIL analyze-jd: expected 2xx, got ${res.status}`)
  }
  const json = await res.json()
  assertAnalysisShape(json)
  console.log('PASS analyze-jd response shape')
}

async function checkChat() {
  const res = await withRetry('chat', () =>
    fetchWithTimeout(`${FUNCTIONS_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'How do you handle engagements that are not a fit?',
        sessionId: `smoke-${Date.now()}`,
      }),
    }),
  )
  if (!res.ok) {
    fail(`FAIL chat: expected 2xx, got ${res.status}`)
  }
  const json = await res.json()
  assertChatShape(json)
  console.log('PASS chat response shape')
}

async function main() {
  console.log(`Running live smoke checks against ${FRONTEND_BASE_URL}`)
  console.log(`Using functions base ${FUNCTIONS_BASE_URL}`)
  await checkRoutes()
  await checkAnalyzeJd()
  await checkChat()
  console.log('Live smoke checks passed')
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
