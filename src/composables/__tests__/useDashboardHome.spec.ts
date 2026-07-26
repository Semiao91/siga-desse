import { describe, expect, it } from 'vitest'
import { useDashboardHome } from '../useDashboardHome'

describe('useDashboardHome', () => {
  it('features the most recent activity entry', () => {
    const { featured } = useDashboardHome()

    expect(featured.value?.albumId).toBe('al05')
    expect(featured.value?.album.title).toBe('Quiet, Brilliant')
  })

  it('sorts top rated albums by rating, descending, capped at 6', () => {
    const { topRated } = useDashboardHome()

    expect(topRated.value).toHaveLength(6)
    expect(topRated.value.every((album) => album.myRating !== null)).toBe(true)
    const ratings = topRated.value.map((album) => album.myRating)
    expect(ratings).toEqual([...ratings].sort((a, b) => (b ?? 0) - (a ?? 0)))
  })

  it('only includes unrated albums, capped at 6', () => {
    const { unratedAlbums } = useDashboardHome()

    expect(unratedAlbums.value.every((album) => album.myRating === null)).toBe(true)
    expect(unratedAlbums.value.length).toBeLessThanOrEqual(6)
  })

  it('joins recent activity with its album', () => {
    const { recentActivity } = useDashboardHome()

    expect(recentActivity.value).toHaveLength(5)
    expect(recentActivity.value.every((entry) => entry.album.id === entry.albumId)).toBe(true)
  })
})
