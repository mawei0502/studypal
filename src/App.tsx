import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import AppLayout from './layouts/AppLayout'
import PublicLayout from './layouts/PublicLayout'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import BrandPage from './pages/BrandPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import { lazy, Suspense } from 'react'

const ChatPage = lazy(() => import('./pages/ChatPage'))
const GoalsPage = lazy(() => import('./pages/GoalsPage'))
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'))

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected dashboard routes */}
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="p-6 text-sm text-gray-400">加载中…</div>}>
                    <ChatPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="p-6 text-sm text-gray-400">加载中…</div>}>
                    <GoalsPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/achievements"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="p-6 text-sm text-gray-400">加载中…</div>}>
                    <AchievementsPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Public brand page */}
          <Route element={<PublicLayout />}>
            <Route path="/about-me" element={<BrandPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  )
}
