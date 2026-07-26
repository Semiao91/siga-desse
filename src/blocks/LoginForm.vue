<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { SpotifyIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute()
const router = useRouter()
const { redirectToSpotifyLogin } = useAuthStore()

const isLoading = ref(false)
const message = ref<{ type: 'error' | 'success'; text: string } | null>(null)

onMounted(() => {
  if (route.query.error === 'spotify_auth_failed') {
    message.value = { type: 'error', text: 'We couldn\'t sign you in with Spotify. Please try again.' }
    router.replace({ query: {} })
  }
})

function handleSignIn() {
  message.value = null
  isLoading.value = true
  redirectToSpotifyLogin()
}
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-105">
    <!-- Heading -->
    <div>
      <h1 class="font-(family-name:--font-display) font-medium text-[36px] leading-[1.1] tracking-[-0.02em] mb-2">
        Welcome back.
      </h1>
      <p class="text-muted-foreground text-[15px]">Sign in to keep building your crate.</p>
    </div>

    <!-- Form -->
    <div class="flex flex-col gap-4">
      <!-- Message -->
      <div v-if="message" class="px-3 py-2.5 rounded-lg text-[13px]" :class="message.type === 'error'
        ? 'bg-destructive/12 text-destructive border border-destructive/25'
        : 'bg-primary/12 text-primary border border-primary/25'">
        {{ message.text }}
      </div>
      <!-- Submit -->
      <Button type="button" variant="outline" class="w-full h-12 text-[15px] rounded-xl mt-1" :disabled="isLoading"
        @click="handleSignIn">
        {{ isLoading ? 'Redirecting to Spotify…' : 'Sign in with Spotify' }}
        <HugeiconsIcon :icon="SpotifyIcon" :size="40" color="currentColor" :stroke-width="1.5" />
      </Button>
    </div>

    <!-- Legal -->
    <p class="text-[11px] text-muted-foreground text-center leading-[1.6]">
      By continuing you agree to our
      <a href="#"
        class="text-foreground no-underline border-b border-border hover:border-foreground transition-colors">Terms</a>
      and
      <a href="#"
        class="text-foreground no-underline border-b border-border hover:border-foreground transition-colors">Privacy
        Policy</a>.<br />
      We'll request read-only access to your Spotify library.
    </p>
  </div>
</template>
