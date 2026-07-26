<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { user, fetchCurrentUser } = useAuth()

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
