<script setup lang="ts">
defineProps<{
  value: number | null
}>()
</script>

<template>
  <div
    class="font-(family-name:--font-display) font-medium text-[88px] leading-[0.9] tracking-[-0.04em] tabular-nums"
    :class="value == null ? 'text-muted-foreground' : 'text-foreground'"
  >
    {{ value ?? '—' }}<span class="text-[28px] text-muted-foreground font-normal ml-1">/10</span>
  </div>
</template>
