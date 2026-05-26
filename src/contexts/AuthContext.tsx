import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import {
  setAccessToken,
  clearAccessToken,
  setRefreshToken,
  clearRefreshToken,
} from '../services/apiClient'

interface AuthUser {
  id: string
  email: string
  display_name: string
  avatar_url: string | null
  current_streak_days: number
  level: number
}

interface TokenPair {
  access_token: string
  refresh_token: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (tokens: TokenPair, user: AuthUser) => void
  logout: () => void
  setUser: (user: AuthUser) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null)

  const login = useCallback((tokens: TokenPair, userData: AuthUser) => {
    setAccessToken(tokens.access_token)
    setRefreshToken(tokens.refresh_token)
    setUserState(userData)
  }, [])

  const logout = useCallback(() => {
    clearAccessToken()
    clearRefreshToken()
    setUserState(null)
  }, [])

  const setUser = useCallback((userData: AuthUser) => {
    setUserState(userData)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export function useMockAuth(): boolean {
  return import.meta.env.VITE_USE_MOCK_AUTH === 'true'
}
