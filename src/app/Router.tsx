import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedAdminRoute } from '../components/admin/ProtectedAdminRoute'

const PublicPortfolioPage = lazy(() =>
  import('../pages/PublicPortfolioPage').then((module) => ({ default: module.PublicPortfolioPage }))
)
const AdminLoginPage = lazy(() =>
  import('../pages/AdminLoginPage').then((module) => ({ default: module.AdminLoginPage }))
)
const AdminDashboardPage = lazy(() =>
  import('../pages/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage }))
)

export function AppRouter() {
  return (
    <Suspense fallback={<main className="container">Loading experience...</main>}>
      <Routes>
        <Route path="/" element={<PublicPortfolioPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

