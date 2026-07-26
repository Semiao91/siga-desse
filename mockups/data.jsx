// Mock data — fictional artists/albums to demo the dashboard.
// Each album carries a 2-color palette used to render its placeholder cover
// art and (in extracted-color hero mode) tint the album page background.

const ALBUMS = [
  { id: 'al01', title: 'Static Bloom',          artist: 'Halcyon Field',     artistId: 'ar01', year: 2024, runtime: '38:42', tracks: 9,  genre: 'Indie Pop',     myRating: 9,  colors: ['#22d3a3', '#0e7a6a'] },
  { id: 'al02', title: 'Cathedral Frequencies', artist: 'Nora Lemaitre',     artistId: 'ar02', year: 2023, runtime: '52:11', tracks: 11, genre: 'Ambient',       myRating: 8,  colors: ['#7c5cff', '#1f1547'] },
  { id: 'al03', title: 'House of Mirrors',      artist: 'The Auburn Index',  artistId: 'ar03', year: 2022, runtime: '44:08', tracks: 10, genre: 'Art Rock',      myRating: 7,  colors: ['#ff7a59', '#4a1d10'] },
  { id: 'al04', title: 'Slow Rooms',            artist: 'Halcyon Field',     artistId: 'ar01', year: 2021, runtime: '36:24', tracks: 8,  genre: 'Indie Pop',     myRating: 6,  colors: ['#5ab2ff', '#0d2945'] },
  { id: 'al05', title: 'Quiet, Brilliant',      artist: 'Mara Okoye',        artistId: 'ar04', year: 2025, runtime: '41:55', tracks: 11, genre: 'R&B',           myRating: 10, colors: ['#ffb14d', '#582300'] },
  { id: 'al06', title: 'After the Signal',      artist: 'Vesna Tide',        artistId: 'ar05', year: 2024, runtime: '47:30', tracks: 10, genre: 'Electronic',    myRating: null, colors: ['#ff5eb3', '#3a0a3a'] },
  { id: 'al07', title: 'Year of the Sparrow',   artist: 'Nora Lemaitre',     artistId: 'ar02', year: 2020, runtime: '54:00', tracks: 12, genre: 'Ambient',       myRating: 9,  colors: ['#ffe066', '#3e2f00'] },
  { id: 'al08', title: 'Open Plan',             artist: 'Pier 14',           artistId: 'ar06', year: 2025, runtime: '33:12', tracks: 8,  genre: 'Indie Rock',    myRating: null, colors: ['#5fe0c2', '#08332b'] },
  { id: 'al09', title: 'Soft Architecture',     artist: 'Mara Okoye',        artistId: 'ar04', year: 2022, runtime: '46:20', tracks: 10, genre: 'R&B',           myRating: 7,  colors: ['#f97373', '#3a0808'] },
  { id: 'al10', title: 'Daughter Cell',         artist: 'The Auburn Index',  artistId: 'ar03', year: 2019, runtime: '49:14', tracks: 11, genre: 'Art Rock',      myRating: null, colors: ['#a1ff66', '#1a3b00'] },
  { id: 'al11', title: 'Northwest Passage',     artist: 'Vesna Tide',        artistId: 'ar05', year: 2021, runtime: '52:48', tracks: 9,  genre: 'Electronic',    myRating: 8,  colors: ['#66c7ff', '#0a2540'] },
  { id: 'al12', title: 'Held Breath',           artist: 'Pier 14',           artistId: 'ar06', year: 2022, runtime: '35:50', tracks: 9,  genre: 'Indie Rock',    myRating: 6,  colors: ['#d4a3ff', '#2a0e44'] },
];

const ARTISTS = [
  { id: 'ar01', name: 'Halcyon Field',    listeners: '2.1M', tags: ['Indie Pop', 'Dream Pop'],   colors: ['#22d3a3', '#5ab2ff'] },
  { id: 'ar02', name: 'Nora Lemaitre',    listeners: '850K', tags: ['Ambient', 'Modern Classical'], colors: ['#7c5cff', '#ffe066'] },
  { id: 'ar03', name: 'The Auburn Index', listeners: '1.4M', tags: ['Art Rock', 'Post-Punk'],    colors: ['#ff7a59', '#a1ff66'] },
  { id: 'ar04', name: 'Mara Okoye',       listeners: '3.2M', tags: ['R&B', 'Neo-Soul'],          colors: ['#ffb14d', '#f97373'] },
  { id: 'ar05', name: 'Vesna Tide',       listeners: '690K', tags: ['Electronic', 'Downtempo'],  colors: ['#ff5eb3', '#66c7ff'] },
  { id: 'ar06', name: 'Pier 14',          listeners: '420K', tags: ['Indie Rock', 'Slacker'],    colors: ['#5fe0c2', '#d4a3ff'] },
];

// Tracklist is generated per-album from a pool — keeps the data file compact
// while every album page still shows a unique-looking list. Track ratings
// default to a sparse spread; in-app interactions overlay/replace from state.
const TRACK_TITLE_POOL = [
  'Overture', 'Soft Static', 'The First Letter', 'Maple Lane', 'Glasshouse',
  'Witness, Witness', 'Hour of Sparrows', 'Cardinal', 'New Math', 'Aperture',
  'Holdfast', 'Daughter Cell', 'Tin Window', 'Late Sunday', 'Open Plan',
  'Polestar', 'Hollow Drums', 'A Year, Tomorrow', 'Marquee', 'Cul-de-sac',
];
function makeTracks(album) {
  const tracks = [];
  // Deterministic per-album track set by stepping through the pool.
  let seed = parseInt(album.id.slice(2), 10) * 7;
  const startRating = [9, null, 7, 10, null, 8, 6, null, 8, null, 7, 9];
  for (let i = 0; i < album.tracks; i++) {
    const title = TRACK_TITLE_POOL[(seed + i * 3) % TRACK_TITLE_POOL.length];
    const min = 2 + ((seed + i) % 4);
    const sec = (i * 11 + seed) % 60;
    tracks.push({
      n: i + 1,
      title,
      duration: `${min}:${String(sec).padStart(2, '0')}`,
      rating: album.myRating != null ? startRating[i % startRating.length] : null,
    });
  }
  return tracks;
}

// Seed comments live in two buckets per album: public reviews from other users,
// and the current user's private notes. The Profile page also reads
// `myRecentReviews` to surface what you've written.
const COMMENTS_SEED = {
  al01: {
    public: [
      { id: 'c1', author: 'Renée K.',   initials: 'RK', rating: 9,  ago: '3 days ago',  text: 'A really cohesive third record. The back-to-back of "Glasshouse" and "Cardinal" is the strongest thing they\'ve put out.' },
      { id: 'c2', author: 'Tom Berger', initials: 'TB', rating: 7,  ago: '1 week ago',  text: 'Loved the production, found the lyrics a bit thin in the middle stretch. Closer redeems it.' },
    ],
    private: [
      { id: 'p1', author: 'You', initials: 'YO', rating: 9, ago: '2 days ago', text: 'Album of the year contender. Revisit before December.' },
    ],
  },
  al05: {
    public: [
      { id: 'c1', author: 'Aki M.',     initials: 'AM', rating: 10, ago: 'yesterday',   text: 'Career best. Side B is masterful — every track earns its place.' },
      { id: 'c2', author: 'David Ortiz', initials: 'DO', rating: 9, ago: '4 days ago',  text: 'The string arrangement on "Soft Architecture" alone is worth it.' },
      { id: 'c3', author: 'Priya S.',   initials: 'PS', rating: 10, ago: '1 week ago',  text: '11 tracks, no skips. That\'s rare in 2025.' },
    ],
    private: [],
  },
  al02: {
    public: [
      { id: 'c1', author: 'Sam Howe', initials: 'SH', rating: 8, ago: '2 weeks ago', text: 'Slow burner. Needed three listens to click; now I can\'t stop.' },
    ],
    private: [
      { id: 'p1', author: 'You', initials: 'YO', rating: 8, ago: '5 days ago', text: 'Track 7 reminds me of that Hauschka record. Look up similar.' },
    ],
  },
};

const RECENT_ACTIVITY = [
  { kind: 'rated',    albumId: 'al05', rating: 10, ago: '2h' },
  { kind: 'reviewed', albumId: 'al01', ago: '2d' },
  { kind: 'rated',    albumId: 'al11', rating: 8, ago: '4d' },
  { kind: 'rated',    albumId: 'al03', rating: 7, ago: '1w' },
  { kind: 'reviewed', albumId: 'al02', ago: '1w' },
];

const TRACK_COMMENTS_SEED = {
  al01: {
    3: [
      { id: 'tc01', author: 'Renée K.', initials: 'RK', ago: '2 days ago', text: 'That breakdown around 2:10 — chef\'s kiss.' },
      { id: 'tc02', author: 'Tom Berger', initials: 'TB', ago: '1 week ago', text: 'Best opener on the record.' },
    ],
    7: [
      { id: 'tc03', author: 'You', initials: 'YO', ago: '2 days ago', text: 'Loop this one. The bridge is the high point of the album.' },
    ],
  },
  al05: {
    2: [
      { id: 'tc04', author: 'Aki M.', initials: 'AM', ago: 'yesterday', text: 'The way the strings come in… I had to stop what I was doing.' },
    ],
    9: [
      { id: 'tc05', author: 'Priya S.', initials: 'PS', ago: '4 days ago', text: 'Closer of the year so far.' },
    ],
  },
};

Object.assign(window, {
  ALBUMS, ARTISTS, makeTracks, COMMENTS_SEED, TRACK_COMMENTS_SEED, RECENT_ACTIVITY,
});
