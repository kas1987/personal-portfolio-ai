import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../hooks/useAdminAuth'

type Props = {
  children: ReactNode
}

export function ProtectedAdminRoute({ children }: Props) {
  const location = useLocation()
  const { loading, isAuthed, authEnabled } = useAdminAuth()

  if (!authEnabled) return <>{children}</>
  if (loading) return <main className="container">Checking admin session...</main>
  if (!isAuthed) {
    return <Navigate to={`/admin/login?next=${encodeURIComponent(location.pathname)}`} replace />
  }

  return <>{children}</>
}

