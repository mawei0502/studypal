const REFRESH_KEY = 'studypal_refresh_token'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''
export { API_BASE }

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY)
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_KEY, token)
}

export function clearRefreshToken(): void {
  localStorage.removeItem(REFRESH_KEY)
}

// In-memory access token — cleared on page reload
let _accessToken: string | null = null

export function getAccessToken(): string | null {
  return _accessToken
}

export function setAccessToken(token: string): void {
  _accessToken = token
}

export function clearAccessToken(): void {
  _accessToken = null
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${refreshToken}` },
  })

  if (!res.ok) {
    clearRefreshToken()
    clearAccessToken()
    return null
  }

  const data = await res.json()
  setAccessToken(data.access_token)
  return data.access_token
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getAccessToken()
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers })

  if (res.status === 401) {
    const newToken = await refreshAccessToken()
    if (!newToken) {
      window.location.hash = '#/login'
      return res
    }
    const retryHeaders = new Headers(init.headers)
    retryHeaders.set('Authorization', `Bearer ${newToken}`)
    return fetch(`${API_BASE}${path}`, { ...init, headers: retryHeaders })
  }

  return res
}
