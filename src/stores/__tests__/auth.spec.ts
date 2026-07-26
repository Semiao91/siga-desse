import * as authService from '@/services/auth.service'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../auth'

vi.mock('@/services/auth.service', () => ({
  getSpotifyLoginUrl: vi.fn<() => string>(),
  redirectToSpotifyLogin: vi.fn<() => void>(),
  getCurrentUser: vi.fn<() => Promise<authService.AuthUser | null>>(),
  logout: vi.fn<() => Promise<void>>(),
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('stores the resolved user and toggles isLoading while fetching', async () => {
    const mockUser = { id: '1', name: 'Bernardo', email: 'b@example.com', avatarUrl: 'https://example.com/me.jpg' }
    vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser)

    const store = useAuthStore()

    const pending = store.fetchCurrentUser()
    expect(store.isLoading).toBe(true)

    const result = await pending

    expect(result).toEqual(mockUser)
    expect(store.user).toEqual(mockUser)
    expect(store.isLoading).toBe(false)
  })

  it('stores null when there is no active session', async () => {
    vi.mocked(authService.getCurrentUser).mockResolvedValue(null)

    const store = useAuthStore()
    const result = await store.fetchCurrentUser()

    expect(result).toBeNull()
    expect(store.user).toBeNull()
  })

  it('clears the user after logging out', async () => {
    const mockUser = { id: '1', name: 'Bernardo', email: null, avatarUrl: null }
    vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser)
    vi.mocked(authService.logout).mockResolvedValue(undefined)

    const store = useAuthStore()
    await store.fetchCurrentUser()
    expect(store.user).toEqual(mockUser)

    await store.logout()

    expect(authService.logout).toHaveBeenCalledOnce()
    expect(store.user).toBeNull()
  })

  it('delegates sign-in to the auth service', () => {
    const store = useAuthStore()
    store.redirectToSpotifyLogin()

    expect(authService.redirectToSpotifyLogin).toHaveBeenCalledOnce()
  })

  it('keeps state isolated between separate pinia instances', async () => {
    vi.mocked(authService.getCurrentUser).mockResolvedValue({
      id: '1',
      name: 'Bernardo',
      email: null,
      avatarUrl: null,
    })
    const firstStore = useAuthStore()
    await firstStore.fetchCurrentUser()
    expect(firstStore.user).not.toBeNull()

    setActivePinia(createPinia())
    const secondStore = useAuthStore()
    expect(secondStore.user).toBeNull()
  })
})
