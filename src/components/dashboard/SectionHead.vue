<script setup lang="ts">
import AppIcon from '@/components/icons/AppIcon.vue'

defineProps<{
  title: string
  action?: string
}>()

defineEmits<{ action: [] }>()
</script>

<template>
  <div class="flex items-baseline justify-between mb-5">
    <h2 class="font-(family-name:--font-display) font-medium text-2xl tracking-[-0.01em] m-0">{{ title }}</h2>
    <button
      v-if="action"
      type="button"
      class="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
      @click="$emit('action')"
    >
      {{ action }}
      <AppIcon name="arrow" :size="14" />
    </button>
  </div>
</template>
