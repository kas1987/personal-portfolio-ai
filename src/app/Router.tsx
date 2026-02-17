import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminDashboardPage } from '../pages/AdminDashboardPage'
import { PublicPortfolioPage } from '../pages/PublicPortfolioPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<PublicPortfolioPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

