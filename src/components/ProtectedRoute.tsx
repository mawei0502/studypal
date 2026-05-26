import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth, useMockAuth } from '../contexts/AuthContext'

interface Props {
  children: ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const mockAuth = useMockAuth()

  if (mockAuth || isAuthenticated) return <>{children}</>

  return <Navigate to="/login" state={{ from: location }} replace />
}
