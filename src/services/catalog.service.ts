import type { Album, RecentActivity } from '@/types/catalog'

// Fictional catalog used to demo the dashboard until the Spotify library
// integration lands. Mirrors the Music Crate design's placeholder data.
const ALBUMS: Album[] = [
  { id: 'al01', title: 'Static Bloom', artist: 'Halcyon Field', artistId: 'ar01', year: 2024, runtime: '38:42', tracks: 9, genre: 'Indie Pop', myRating: 9, colors: ['#22d3a3', '#0e7a6a'] },
  { id: 'al02', title: 'Cathedral Frequencies', artist: 'Nora Lemaitre', artistId: 'ar02', year: 2023, runtime: '52:11', tracks: 11, genre: 'Ambient', myRating: 8, colors: ['#7c5cff', '#1f1547'] },
  { id: 'al03', title: 'House of Mirrors', artist: 'The Auburn Index', artistId: 'ar03', year: 2022, runtime: '44:08', tracks: 10, genre: 'Art Rock', myRating: 7, colors: ['#ff7a59', '#4a1d10'] },
  { id: 'al04', title: 'Slow Rooms', artist: 'Halcyon Field', artistId: 'ar01', year: 2021, runtime: '36:24', tracks: 8, genre: 'Indie Pop', myRating: 6, colors: ['#5ab2ff', '#0d2945'] },
  { id: 'al05', title: 'Quiet, Brilliant', artist: 'Mara Okoye', artistId: 'ar04', year: 2025, runtime: '41:55', tracks: 11, genre: 'R&B', myRating: 10, colors: ['#ffb14d', '#582300'] },
  { id: 'al06', title: 'After the Signal', artist: 'Vesna Tide', artistId: 'ar05', year: 2024, runtime: '47:30', tracks: 10, genre: 'Electronic', myRating: null, colors: ['#ff5eb3', '#3a0a3a'] },
  { id: 'al07', title: 'Year of the Sparrow', artist: 'Nora Lemaitre', artistId: 'ar02', year: 2020, runtime: '54:00', tracks: 12, genre: 'Ambient', myRating: 9, colors: ['#ffe066', '#3e2f00'] },
  { id: 'al08', title: 'Open Plan', artist: 'Pier 14', artistId: 'ar06', year: 2025, runtime: '33:12', tracks: 8, genre: 'Indie Rock', myRating: null, colors: ['#5fe0c2', '#08332b'] },
  { id: 'al09', title: 'Soft Architecture', artist: 'Mara Okoye', artistId: 'ar04', year: 2022, runtime: '46:20', tracks: 10, genre: 'R&B', myRating: 7, colors: ['#f97373', '#3a0808'] },
  { id: 'al10', title: 'Daughter Cell', artist: 'The Auburn Index', artistId: 'ar03', year: 2019, runtime: '49:14', tracks: 11, genre: 'Art Rock', myRating: null, colors: ['#a1ff66', '#1a3b00'] },
  { id: 'al11', title: 'Northwest Passage', artist: 'Vesna Tide', artistId: 'ar05', year: 2021, runtime: '52:48', tracks: 9, genre: 'Electronic', myRating: 8, colors: ['#66c7ff', '#0a2540'] },
  { id: 'al12', title: 'Held Breath', artist: 'Pier 14', artistId: 'ar06', year: 2022, runtime: '35:50', tracks: 9, genre: 'Indie Rock', myRating: 6, colors: ['#d4a3ff', '#2a0e44'] },
]

const RECENT_ACTIVITY: RecentActivity[] = [
  { kind: 'rated', albumId: 'al05', rating: 10, ago: '2h' },
  { kind: 'reviewed', albumId: 'al01', ago: '2d' },
  { kind: 'rated', albumId: 'al11', rating: 8, ago: '4d' },
  { kind: 'rated', albumId: 'al03', rating: 7, ago: '1w' },
  { kind: 'reviewed', albumId: 'al02', ago: '1w' },
]

export function getAlbums(): Album[] {
  return ALBUMS
}

export function getRecentActivity(): RecentActivity[] {
  return RECENT_ACTIVITY
}
