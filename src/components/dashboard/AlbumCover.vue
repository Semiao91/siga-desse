<script setup lang="ts">
import type { Album } from '@/types/catalog'

withDefaults(
  defineProps<{
    album: Album
    showRating?: boolean
  }>(),
  { showRating: true },
)
</script>

<template>
  <div
    class="cover relative aspect-square rounded-lg overflow-hidden bg-card isolate shadow-[0_1px_0_oklch(1_0_0/5%)_inset,0_6px_20px_-10px_oklch(0_0_0/50%)]"
    :style="{ '--c1': album.colors[0], '--c2': album.colors[1] }"
  >
    <div class="art absolute inset-0 grid p-3.5 [place-items:end_start]">
      <span
        class="relative z-[1] font-mono text-[10px] tracking-[0.06em] uppercase text-white/70 bg-black/30 backdrop-blur-md px-1.5 py-1 rounded-[3px]"
      >
        {{ album.title.toUpperCase() }}
      </span>
    </div>
    <span
      v-if="showRating && album.myRating != null"
      class="absolute top-2.5 right-2.5 z-[2] w-[30px] h-[30px] rounded-full border grid place-items-center font-mono text-[13px] font-semibold"
      :class="
        album.myRating >= 8
          ? 'bg-primary text-primary-foreground border-transparent'
          : 'bg-black/60 backdrop-blur-md text-white border-white/15'
      "
    >
      {{ album.myRating }}
    </span>
  </div>
</template>

<style scoped>
.art::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 80% at 10% 0%, oklch(from var(--c1) l c h) 0%, transparent 60%),
    radial-gradient(120% 100% at 100% 100%, oklch(from var(--c2) l c h) 0%, transparent 65%),
    linear-gradient(
      180deg,
      oklch(from var(--c1) calc(l * 0.4) c h),
      oklch(from var(--c2) calc(l * 0.3) c h)
    );
}

.art::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(115deg, oklch(1 0 0 / 0%) 0 12px, oklch(1 0 0 / 3%) 12px 13px);
  mix-blend-mode: overlay;
}
</style>
