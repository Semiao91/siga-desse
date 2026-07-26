<script setup lang="ts">
import TopNav from '@/components/dashboard/TopNav.vue';
</script>

<template>
  <div
    class="min-h-screen grid grid-rows-[auto_1fr] [background:radial-gradient(1200px_600px_at_80%_-10%,oklch(from_var(--primary)_l_c_h/8%),transparent_60%),radial-gradient(800px_400px_at_0%_0%,oklch(from_var(--primary)_0.5_0.18_200/5%),transparent_60%),var(--background)]">
    <TopNav />
    <main>
      <RouterView />
    </main>
  </div>
</template>
