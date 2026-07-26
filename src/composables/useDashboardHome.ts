import { computed } from 'vue'
import { getAlbums, getRecentActivity } from '@/services/catalog.service'
import type { Album, ActivityEntry } from '@/types/catalog'

export function useDashboardHome() {
  const albums = getAlbums()

  const recentActivity = computed<ActivityEntry[]>(() =>
    getRecentActivity()
      .map((entry) => {
        const album = albums.find((a) => a.id === entry.albumId)
        return album ? { ...entry, album } : null
      })
      .filter((entry): entry is ActivityEntry => entry !== null),
  )

  const featured = computed<ActivityEntry | null>(() => recentActivity.value[0] ?? null)

  const topRated = computed<Album[]>(() =>
    albums
      .filter((album) => album.myRating != null)
      .sort((a, b) => (b.myRating ?? 0) - (a.myRating ?? 0))
      .slice(0, 6),
  )

  const unratedAlbums = computed<Album[]>(() => albums.filter((album) => album.myRating == null).slice(0, 6))

  return {
    featured,
    topRated,
    unratedAlbums,
    recentActivity,
  }
}
