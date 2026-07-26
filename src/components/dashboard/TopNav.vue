<script setup lang="ts">
import UserMenu from '@/components/dashboard/UserMenu.vue'
import AppIcon from '@/components/icons/AppIcon.vue'
import { onKeyStroke } from '@vueuse/core'
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const query = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

onKeyStroke((e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    searchInput.value?.focus()
  }
})
</script>

<template>
  <nav
    class="sticky top-0 z-50 grid grid-cols-[1fr_2fr_1fr] items-center gap-8 px-10 py-4.5 border-b border-border backdrop-blur-xl [background:oklch(from_var(--background)_l_c_h/70%)]">
    <div class="flex items-center gap-2.5">

    </div>

    <div class="relative flex items-center">
      <AppIcon name="search" :size="16" class="absolute left-4 text-muted-foreground pointer-events-none" />
      <input id="search" ref="searchInput" v-model="query" placeholder="Search artists, albums, or genres…"
        class="w-full h-10.5 pl-11 pr-14 rounded-xl bg-card border border-border text-foreground text-sm outline-none placeholder:text-muted-foreground focus:border-primary transition-colors" />
      <kbd
        class="absolute right-3 font-mono text-[11px] text-muted-foreground px-1.5 py-0.5 border border-border rounded-[5px] [background:oklch(from_var(--background)_calc(l+0.02)_c_h)]">
        ⌘ K
      </kbd>
    </div>

    <div class="flex items-center justify-end gap-1.5">
      <RouterLink to="/dashboard" class="text-sm font-medium px-3.5 py-2 rounded-full transition-colors" :class="route.name === 'dashboard-home'
        ? 'text-foreground bg-accent'
        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        ">
        Home
      </RouterLink>
      <!-- Browse/Library land once those routes exist -->
      <button type="button"
        class="text-sm font-medium px-3.5 py-2 rounded-full text-muted-foreground/60 cursor-default">
        Browse
      </button>
      <button type="button"
        class="text-sm font-medium px-3.5 py-2 rounded-full text-muted-foreground/60 cursor-default">
        Library
      </button>
      <div class="w-2" />
      <UserMenu />
    </div>
  </nav>
</template>
