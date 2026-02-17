import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedAdminRoute } from '../components/admin/ProtectedAdminRoute'
import { AdminLoginPage } from '../pages/AdminLoginPage'
import { AdminDashboardPage } from '../pages/AdminDashboardPage'
import { PublicPortfolioPage } from '../pages/PublicPortfolioPage'

export function AppRouter() {
  return (
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
  )
}

