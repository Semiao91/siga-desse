import { API_URL, apiFetch, ApiError } from '@/lib/api'

export interface AuthUser {
  id: string
  name: string | null
  email: string | null
}

export function getSpotifyLoginUrl(): string {
  return `${API_URL}/auth/spotify/login`
}

export function redirectToSpotifyLogin(): void {
  window.location.href = getSpotifyLoginUrl()
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    return await apiFetch<AuthUser>('/auth/me')
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return null
    }
    throw err
  }
}

export async function logout(): Promise<void> {
  await apiFetch<void>('/auth/spotify/logout', { method: 'POST' })
}
