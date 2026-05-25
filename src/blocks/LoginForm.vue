<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ref } from 'vue'

const showPassword = ref(false)
const rememberMe = ref(true)
const isLoading = ref(false)
const message = ref<{ type: 'error' | 'success'; text: string } | null>(null)

function handleSubmit(e: Event) {
  e.preventDefault()
  message.value = null

  const form = e.target as HTMLFormElement
  const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
  const password = (form.elements.namedItem('password') as HTMLInputElement).value

  if (!email.includes('@') || password.length < 4) {
    message.value = { type: 'error', text: 'Check your email and password and try again.' }
    return
  }

  isLoading.value = true
  message.value = { type: 'success', text: 'Signed in. Loading your crate…' }
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
    <form class="flex flex-col gap-4" autocomplete="on" @submit="handleSubmit">
      <!-- Email field -->
      <div class="flex flex-col gap-1.5">
        <label for="email" class="text-[12px] font-medium text-muted-foreground tracking-[0.02em]">Email</label>
        <div class="relative flex items-center">
          <svg class="absolute left-3.5 text-muted-foreground pointer-events-none" width="16" height="16"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
            stroke-linejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          <Input id="email" name="email" type="email" placeholder="you@domain.com" required autocomplete="email"
            class="pl-10 h-11 rounded-[10px]" />
        </div>
      </div>

      <!-- Password field -->
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <label for="password" class="text-[12px] font-medium text-muted-foreground tracking-[0.02em]">Password</label>
          <a href="#"
            class="text-[12px] text-muted-foreground no-underline hover:text-foreground hover:underline">Forgot?</a>
        </div>
        <div class="relative flex items-center">
          <svg class="absolute left-3.5 text-muted-foreground pointer-events-none" width="16" height="16"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
            stroke-linejoin="round">
            <rect x="4" y="11" width="16" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          <Input id="password" name="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
            required autocomplete="current-password" class="pl-10 pr-11 h-11 rounded-[10px]" />
          <button type="button"
            class="absolute right-1.5 w-8 h-8 grid place-items-center bg-transparent border-0 cursor-pointer text-muted-foreground rounded-md hover:text-foreground hover:bg-accent transition-colors"
            :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
            <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Remember me -->
      <label class="flex items-center gap-2 text-[13px] text-muted-foreground cursor-pointer select-none">
        <input v-model="rememberMe" type="checkbox" class="peer sr-only" />
        <span
          class="w-4 h-4 rounded-lg border border-border bg-card grid place-items-center flex-shrink-0 peer-checked:bg-primary peer-checked:border-primary transition-colors">
          <svg v-if="rememberMe" width="9" height="7" viewBox="0 0 9 7" fill="none" class="text-primary-foreground">
            <path d="M1 3.5L3.5 6L8 1" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </span>
        Keep me signed in
      </label>

      <!-- Message -->
      <div v-if="message" class="px-3 py-2.5 rounded-lg text-[13px]" :class="message.type === 'error'
        ? 'bg-destructive/12 text-destructive border border-destructive/25'
        : 'bg-primary/12 text-primary border border-primary/25'">
        {{ message.text }}
      </div>

      <!-- Submit -->
      <Button type="submit" variant="outline" class="w-full h-12 text-[15px] rounded-xl mt-1" :disabled="isLoading">
        {{ isLoading ? 'Signing in…' : 'Sign in with email' }}
      </Button>
    </form>

    <!-- Footer -->
    <p class="text-center text-[13px] text-muted-foreground">
      New to Music Crate?
      <Button variant="link" class="px-1 text-[13px] h-auto font-medium">Create an account</Button>
    </p>

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
