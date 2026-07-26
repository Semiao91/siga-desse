<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const initials = computed(() => {
  if (!user.value?.name) return '?'
  return user.value.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button type="button" class="border-0 bg-transparent p-0">
        <Avatar class="size-9 border border-border-strong">
          <AvatarImage v-if="user?.avatarUrl" :src="user.avatarUrl" alt="" />
          <AvatarFallback
            class="font-semibold text-primary-foreground [background:linear-gradient(135deg,var(--primary),oklch(from_var(--primary)_0.5_0.18_220))]"
          >
            {{ initials }}
          </AvatarFallback>
        </Avatar>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" :side-offset="10" class="min-w-56">
      <DropdownMenuLabel class="flex flex-col gap-0.5 px-2 py-1.5">
        <span class="text-sm font-medium text-foreground">{{ user?.name ?? 'Unknown listener' }}</span>
        <span v-if="user?.email" class="text-xs text-muted-foreground">{{ user.email }}</span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" @select="handleLogout"> Log out </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
