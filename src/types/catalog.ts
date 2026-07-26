export type AlbumColors = [string, string]

export type Album = {
  id: string
  title: string
  artist: string
  artistId: string
  year: number
  runtime: string
  tracks: number
  genre: string
  myRating: number | null
  colors: AlbumColors
}

export type ActivityKind = 'rated' | 'reviewed'

export type RecentActivity = {
  kind: ActivityKind
  albumId: string
  rating?: number
  ago: string
}

export type ActivityEntry = RecentActivity & { album: Album }
