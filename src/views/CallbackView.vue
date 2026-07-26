<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { fetchCurrentUser } = useAuthStore()

const errorMessage = ref<string | null>(null)

onMounted(async () => {
  try {
    const user = await fetchCurrentUser()
    if (!user) {
      router.replace({ path: '/login', query: { error: 'spotify_auth_failed' } })
      return
    }
    router.replace('/dashboard')
  } catch {
    errorMessage.value = 'Something went wrong confirming your session. Please try again.'
  }
})
</script>

<template>
  <div class="min-h-screen grid place-items-center bg-background">
    <div v-if="errorMessage" class="flex flex-col items-center gap-4 text-center px-6">
      <p class="text-destructive text-[15px]">{{ errorMessage }}</p>
      <router-link to="/login" class="text-sm text-foreground underline underline-offset-4">
        Back to login
      </router-link>
    </div>

    <div v-else class="flex flex-col items-center gap-3 text-muted-foreground">
      <svg class="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <p class="text-[14px]">Signing you in…</p>
    </div>
  </div>
</template>
