<script setup lang="ts">
import type { IconName } from '@/types/icon'

withDefaults(
  defineProps<{
    name: IconName
    size?: number
  }>(),
  { size: 18 },
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <template v-if="name === 'search'">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </template>
    <template v-else-if="name === 'play'">
      <path d="M6 4v16l14-8z" fill="currentColor" stroke="none" />
    </template>
    <template v-else-if="name === 'plus'">
      <path d="M12 5v14M5 12h14" />
    </template>
    <template v-else-if="name === 'arrow'">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </template>
  </svg>
</template>
