import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as authService from '@/services/auth.service'
import type { AuthUser } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isLoading = ref(false)

  async function fetchCurrentUser() {
    isLoading.value = true
    try {
      user.value = await authService.getCurrentUser()
      return user.value
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    await authService.logout()
    user.value = null
  }

  return {
    user,
    isLoading,
    fetchCurrentUser,
    logout,
    redirectToSpotifyLogin: authService.redirectToSpotifyLogin,
  }
})
