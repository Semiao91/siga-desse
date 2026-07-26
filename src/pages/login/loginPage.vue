<script lang="ts">
export const description = "A two-column login page with brand panel and form."
</script>

<script setup lang="ts">
import BrandPanel from '@/blocks/BrandPanel.vue';
import LoginForm from '@/blocks/LoginForm.vue';
import { toggleTheme } from '@/composables/useTheme';
import { onMounted } from 'vue';

onMounted(() => {
  const stored = localStorage.getItem('mc-theme')
  const root = document.documentElement
  if (stored === 'light') {
    root.classList.remove('dark')
    root.classList.add('light')
  }
})
</script>

<template>
  <div
    class="min-h-screen grid grid-cols-1 min-[981px]:grid-cols-[1.1fr_1fr] [background:radial-gradient(1000px_600px_at_80%_100%,oklch(from_var(--primary)_l_c_h/8%),transparent_60%),var(--background)]">
    <BrandPanel />

    <main class="grid place-items-center p-10">
      <LoginForm />
    </main>
  </div>

  <!-- Theme toggle -->
  <button
    class="fixed top-6 right-6 w-9 h-9 rounded-full bg-card border border-border text-foreground grid place-items-center cursor-pointer z-10 hover:bg-accent transition-colors"
    aria-label="Toggle theme" @click="toggleTheme">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"
      stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  </button>
</template>
