import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth'

export function AdminLoginPage() {
  const [emailInput, setEmailInput] = useState('')
  const [status, setStatus] = useState<string>('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isAuthed, sendMagicLink, authEnabled } = useAdminAuth()

  if (!authEnabled) {
    return (
      <main className="container admin-shell">
        <h1>Admin Login</h1>
        <p>Admin auth is disabled. You can access the dashboard directly.</p>
        <Link className="btn btn-primary" to="/admin">
          Go to Admin
        </Link>
      </main>
    )
  }

  if (isAuthed) {
    const next = searchParams.get('next') || '/admin'
    navigate(next, { replace: true })
  }

  return (
    <main className="container admin-shell">
      <section className="card policy-card">
        <h1>Admin Login</h1>
        <p className="section-subtext">Sign in with a magic link to access candidate context controls.</p>
        <label>
          Email
          <input value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
        </label>
        <button
          className="btn btn-primary"
          onClick={async () => {
            try {
              await sendMagicLink(emailInput)
              setStatus('Magic link sent. Check your inbox.')
            } catch (err) {
              setStatus(`Login failed: ${err instanceof Error ? err.message : 'unknown error'}`)
            }
          }}
        >
          Send Magic Link
        </button>
        {status && <p>{status}</p>}
        <Link to="/" className="btn btn-secondary">
          Back to site
        </Link>
      </section>
    </main>
  )
}

