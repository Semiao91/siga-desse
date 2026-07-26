<script setup lang="ts">
import AlbumCover from '@/components/dashboard/AlbumCover.vue'
import type { Album } from '@/types/catalog'

withDefaults(
  defineProps<{
    album: Album
    showYear?: boolean
  }>(),
  { showYear: true },
)
</script>

<template>
  <div class="w-full text-left group">
    <div class="transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
      <AlbumCover :album="album" />
    </div>
    <div class="pt-3 px-0.5">
      <div class="text-sm font-medium text-foreground truncate">{{ album.title }}</div>
      <div class="text-[13px] text-muted-foreground truncate mt-0.5">{{ album.artist }}</div>
      <div v-if="showYear" class="font-mono text-[11px] text-muted-foreground mt-1.5">{{ album.year }}</div>
    </div>
  </div>
</template>
