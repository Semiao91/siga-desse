<script setup lang="ts">
import { MusicNoteSquare01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'

const imageModules = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })
const allImages = Object.values(imageModules) as string[]

function pickDistinct(arr: string[], count: number): string[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

const [img1, img2, img3] = pickDistinct(allImages, 3)
</script>

<template>
  <aside
    class="hidden min-[981px]:flex flex-col relative p-10 overflow-hidden border-r border-border [background:radial-gradient(70%_60%_at_30%_20%,oklch(from_var(--primary)_l_c_h/18%),transparent_60%),radial-gradient(60%_50%_at_90%_80%,oklch(from_var(--primary)_0.5_0.18_220/14%),transparent_60%),var(--card)]">
    <!-- Header -->
    <div class="flex items-center justify-between relative z-10">
      <div
        class="flex items-center gap-3 font-(family-name:--font-display) font-semibold text-[18px] tracking-[-0.01em] text-foreground">
        <HugeiconsIcon :icon="MusicNoteSquare01Icon" size="30" />
        <span>Music Crate</span>
      </div>
      <div class="font-mono text-[11px] text-muted-foreground tracking-[0.04em]">
        v 0.4 · BETA
      </div>
    </div>

    <!-- Floating album covers -->
    <div class="absolute inset-0 pointer-events-none z-1" aria-hidden="true">
      <div class="floater f1 absolute w-55 h-55 rounded-xl overflow-hidden" style="top:100px;right:80px">
        <img :src="img1" alt="" class="absolute inset-0 w-full h-full object-cover shadow-2xl" />
      </div>
      <div class="floater f2 absolute w-45 h-45 rounded-xl overflow-hidden" style="top:220px;right:240px">
        <img :src="img2" alt="" class="absolute inset-0 w-full h-full object-cover shadow-2xl" />
      </div>
      <div class="floater f3 absolute w-50 h-50 rounded-xl overflow-hidden" style="top:350px;right:60px">
        <img :src="img3" alt="" class="absolute inset-0 w-full h-full object-cover shadow-2xl" />
      </div>
    </div>

    <!-- Body -->
    <div class="relative z-10 flex-1 flex flex-col justify-end pt-10">
      <h1
        class="font-(family-name:--font-display) font-medium text-[44px] leading-[1.05] tracking-tight mb-6 max-w-135 text-balance">
        Keep a <em class="not-italic text-primary font-medium">record</em> of every record. Rate, review, and re-find
        what you loved.
      </h1>
      <p class="max-w-120 text-muted-foreground text-[15px] leading-[1.6] mb-10">
        Connect your Spotify library to start scoring albums and tracks from 1 to 10, leave notes for yourself or share
        them publicly, and watch your taste take shape.
      </p>
      <div class="flex gap-10 pt-6 border-t border-border">
        <div>
          <div class="font-(family-name:--font-display) font-medium text-[28px] tracking-[-0.02em] tabular-nums">12,400+
          </div>
          <div class="font-mono text-[10px] tracking-[0.08em] uppercase text-muted-foreground mt-1">Listeners</div>
        </div>
        <div>
          <div class="font-(family-name:--font-display) font-medium text-[28px] tracking-[-0.02em] tabular-nums">1.2M
          </div>
          <div class="font-mono text-[10px] tracking-[0.08em] uppercase text-muted-foreground mt-1">Ratings logged</div>
        </div>
        <div>
          <div class="font-(family-name:--font-display) font-medium text-[28px] tracking-[-0.02em] tabular-nums">7.8
          </div>
          <div class="font-mono text-[10px] tracking-[0.08em] uppercase text-muted-foreground mt-1">Avg album score
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* Vignette overlay */
.floater::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, transparent 40%, oklch(0 0 0 / 35%) 100%);
  pointer-events: none;
}

/* Scanline grain texture */
.floater::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  background: repeating-linear-gradient(115deg, oklch(1 0 0 / 0%) 0 12px, oklch(1 0 0 / 3%) 12px 13px);
  mix-blend-mode: overlay;
  pointer-events: none;
}

.floater {
  box-shadow:
    0 1px 0 oklch(1 0 0 / 5%) inset,
    0 20px 50px -20px oklch(0 0 0 / 60%);
}

/* Float animations — rotation baked in per floater so transforms compose correctly */
.floater.f1 {
  animation: float-f1 4s ease-in-out infinite;
}

.floater.f2 {
  animation: float-f2 5.2s ease-in-out infinite 0.8s;
}

.floater.f3 {
  animation: float-f3 4.6s ease-in-out infinite 1.6s;
}

@keyframes float-f1 {

  0%,
  100% {
    transform: rotate(-6deg) translateY(0px);
  }

  50% {
    transform: rotate(-6deg) translateY(-10px);
  }
}

@keyframes float-f2 {

  0%,
  100% {
    transform: rotate(4deg) translateY(0px);
  }

  50% {
    transform: rotate(4deg) translateY(-10px);
  }
}

@keyframes float-f3 {

  0%,
  100% {
    transform: rotate(-2deg) translateY(0px);
  }

  50% {
    transform: rotate(-2deg) translateY(-10px);
  }
}
</style>
