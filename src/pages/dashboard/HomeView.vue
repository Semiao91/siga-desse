<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardHome } from '@/composables/useDashboardHome'
import AlbumCover from '@/components/dashboard/AlbumCover.vue'
import AlbumCard from '@/components/dashboard/AlbumCard.vue'
import RatingNumeral from '@/components/dashboard/RatingNumeral.vue'
import SectionHead from '@/components/dashboard/SectionHead.vue'
import AppIcon from '@/components/icons/AppIcon.vue'

const { featured, topRated, unratedAlbums, recentActivity } = useDashboardHome()

const unwrapped = computed(() => recentActivity.value.slice(0, 4))
</script>

<template>
  <div v-if="featured" class="max-w-[1320px] mx-auto px-10 pt-12 pb-24 animate-in fade-in duration-300">
    <!-- Featured -->
    <div class="grid grid-cols-[1.4fr_1fr] gap-12 items-end mb-16">
      <div>
        <div class="font-mono text-[11px] tracking-[0.08em] uppercase text-muted-foreground mb-3">
          <span class="text-primary">●</span> Last rated · {{ featured.ago }} ago
        </div>
        <h1 class="font-(family-name:--font-display) font-medium text-[56px] leading-[1.05] tracking-[-0.02em] m-0 mb-2 text-balance">
          {{ featured.album.title }}
        </h1>
        <p class="text-muted-foreground text-[15px] mb-6">
          by
          <span class="text-foreground border-b border-dashed border-border-strong">{{ featured.album.artist }}</span>
          · {{ featured.album.year }} · {{ featured.album.genre }}
        </p>
        <div class="flex items-center gap-4">
          <RatingNumeral :value="featured.album.myRating" />
          <div class="flex-1">
            <p class="m-0 text-muted-foreground text-sm leading-[1.6]">
              You called this an "album of the year contender." Worth a full revisit before December.
            </p>
            <div class="flex items-center gap-2.5 mt-4">
              <button
                type="button"
                class="inline-flex items-center gap-2 h-10 px-4.5 rounded-[10px] text-sm font-medium bg-primary text-primary-foreground hover:brightness-105 transition-[filter]"
              >
                <AppIcon name="play" :size="14" /> Open album
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-2 h-10 px-4.5 rounded-[10px] text-sm font-medium border border-border-strong text-foreground hover:bg-accent transition-colors"
              >
                <AppIcon name="plus" :size="14" /> Add to crate
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="(entry, i) in unwrapped"
          :key="entry.album.id"
          :style="{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }"
        >
          <AlbumCover :album="entry.album" />
        </div>
      </div>
    </div>

    <!-- Top of all time -->
    <div class="mt-14">
      <SectionHead title="Your top of all time" action="See library" />
      <div class="grid grid-cols-4 xl:grid-cols-6 gap-6">
        <AlbumCard v-for="album in topRated" :key="album.id" :album="album" />
      </div>
    </div>

    <!-- Recently rated -->
    <div class="mt-14">
      <SectionHead title="Recently rated" />
      <div class="rounded-[14px] border border-border bg-card">
        <div
          v-for="(entry, i) in recentActivity"
          :key="i"
          class="grid grid-cols-[64px_1fr_80px_60px] gap-5 items-center px-5 py-4"
          :class="i < recentActivity.length - 1 ? 'border-b border-border' : ''"
        >
          <div class="w-16 h-16">
            <AlbumCover :album="entry.album" :show-rating="false" />
          </div>
          <div class="min-w-0">
            <div class="text-[15px] font-medium truncate">{{ entry.album.title }}</div>
            <div class="text-[13px] text-muted-foreground mt-0.5 truncate">
              {{ entry.kind === 'rated' ? 'You rated' : 'You reviewed' }} · {{ entry.album.artist }}
            </div>
          </div>
          <div class="font-mono text-xs text-muted-foreground">{{ entry.ago }} ago</div>
          <div
            class="text-right font-(family-name:--font-display) text-[28px] font-medium"
            :class="(entry.rating ?? entry.album.myRating ?? 0) >= 8 ? 'text-primary' : 'text-foreground'"
          >
            {{ entry.rating ?? entry.album.myRating ?? '—' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Unrated -->
    <div class="mt-14">
      <SectionHead title="Unrated in your crate" action="Browse all" />
      <div class="grid grid-cols-4 xl:grid-cols-6 gap-6">
        <AlbumCard v-for="album in unratedAlbums" :key="album.id" :album="album" />
      </div>
    </div>
  </div>
</template>
