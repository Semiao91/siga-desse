<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { fetchCurrentUser } = authStore

onMounted(() => {
  if (!user.value) {
    fetchCurrentUser()
  }
})
</script>

<template>
  <div class="min-h-screen grid place-items-center bg-background">
    <p class="text-foreground text-[15px]">
      Welcome{{ user?.name ? `, ${user.name}` : '' }}. Dashboard coming soon.
    </p>
  </div>
</template>
