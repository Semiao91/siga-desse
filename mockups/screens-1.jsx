// Screens for Music Crate — Home, Search, Album, Artist, Profile.
// Each screen is a function that takes ({ state, nav, tweaks }) where:
//   state    — { ratings, comments, ... }, the live app state
//   nav      — { go(route), back() }
//   tweaks   — { dark, rateUI, heroStyle }
// They return JSX and stay free of routing logic so they're easy to read.

// ── Home ──────────────────────────────────────────────────────────────────
const ScreenHome = ({ nav, state }) => {
  const recent = RECENT_ACTIVITY.map((a) => {
    const album = ALBUMS.find((x) => x.id === a.albumId);
    const rating = state.ratings[album.id] ?? album.myRating;
    return { ...a, album: { ...album, myRating: rating } };
  });
  const featured = recent[0].album;
  const rated = ALBUMS.filter((a) => (state.ratings[a.id] ?? a.myRating) != null)
    .map((a) => ({ ...a, myRating: state.ratings[a.id] ?? a.myRating }))
    .sort((a, b) => b.myRating - a.myRating)
    .slice(0, 6);
  const recos = ALBUMS.filter((a) => (state.ratings[a.id] ?? a.myRating) == null).slice(0, 6);
  const unwrapped = recent.slice(0, 5);

  return (
    <div className="page fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, alignItems: 'end', marginBottom: 64 }}>
        <div>
          <div className="stat-label" style={{ marginBottom: 12 }}>
            <span style={{ color: 'var(--primary)' }}>●</span> Last rated · {recent[0].ago} ago
          </div>
          <h1 className="page-title" style={{ fontSize: 56 }}>{featured.title}</h1>
          <p className="page-sub" style={{ marginBottom: 24 }}>
            by <a onClick={() => nav.go({ name: 'artist', id: featured.artistId })}
                  style={{ color: 'var(--foreground)', cursor: 'pointer', borderBottom: '1px dashed var(--border-strong)' }}>{featured.artist}</a>
            {' '}· {featured.year} · {featured.genre}
          </p>
          <div className="row" style={{ gap: 16 }}>
            <RatingNumeral value={featured.myRating} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: 14, lineHeight: 1.6 }}>
                You called this an "album of the year contender." Worth a full revisit before December.
              </p>
              <div className="row" style={{ marginTop: 16, gap: 10 }}>
                <button className="btn btn-primary" onClick={() => nav.go({ name: 'album', id: featured.id })}>
                  <Icon name="play" size={14} /> Open album
                </button>
                <button className="btn btn-ghost">
                  <Icon name="plus" size={14} /> Add to crate
                </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {unwrapped.slice(0, 4).map((a, i) => (
            <button key={a.album.id} className="cover-link" onClick={() => nav.go({ name: 'album', id: a.album.id })}
                    style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}>
              <AlbumCover album={a.album} />
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <SectionHead title="Your top of all time" action="See library" onAction={() => nav.go({ name: 'profile' })} />
        <div className="grid-6">
          {rated.map((a) => <AlbumCard key={a.id} album={a} onClick={() => nav.go({ name: 'album', id: a.id })} />)}
        </div>
      </div>

      <div className="section">
        <SectionHead title="Recently rated" />
        <div className="card" style={{ padding: 0 }}>
          {recent.map((r, i) => {
            const rating = state.ratings[r.album.id] ?? r.album.myRating;
            return (
              <div key={i}
                   onClick={() => nav.go({ name: 'album', id: r.album.id })}
                   style={{
                     display: 'grid',
                     gridTemplateColumns: '64px 1fr 80px 60px',
                     gap: 20, alignItems: 'center',
                     padding: '16px 20px',
                     borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 0,
                     cursor: 'pointer',
                   }}>
                <div style={{ width: 64, height: 64 }}>
                  <AlbumCover album={r.album} showRating={false} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{r.album.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>
                    {r.kind === 'rated' ? `You rated · ${r.album.artist}` : `You reviewed · ${r.album.artist}`}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)' }}>
                  {r.ago} ago
                </div>
                <div style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 500, color: rating >= 8 ? 'var(--primary)' : 'var(--foreground)' }}>
                  {rating ?? '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="section">
        <SectionHead title="Unrated in your crate" action="Browse all" onAction={() => nav.go({ name: 'search' })} />
        <div className="grid-6">
          {recos.map((a) => <AlbumCard key={a.id} album={a} onClick={() => nav.go({ name: 'album', id: a.id })} />)}
        </div>
      </div>
    </div>
  );
};

// ── Search ───────────────────────────────────────────────────────────────
const ScreenSearch = ({ nav, state, query }) => {
  const [tab, setTab] = React.useState('albums');
  const q = (query || '').trim().toLowerCase();
  const albums = q
    ? ALBUMS.filter((a) => a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q))
    : ALBUMS;
  const artists = q
    ? ARTISTS.filter((a) => a.name.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q)))
    : ARTISTS;

  return (
    <div className="page fade-in">
      <div style={{ marginBottom: 32 }}>
        <div className="stat-label" style={{ marginBottom: 8 }}>Search</div>
        <h1 className="page-title">
          {q ? <>Results for <em style={{ fontStyle: 'normal', color: 'var(--primary)' }}>"{query}"</em></> : 'Browse the crate'}
        </h1>
        <p className="page-sub">
          {q
            ? `${albums.length} album${albums.length === 1 ? '' : 's'}, ${artists.length} artist${artists.length === 1 ? '' : 's'}`
            : 'Search artists or albums — or pick from the crate below.'}
        </p>
      </div>

      <div className="tabs">
        <button data-on={tab === 'albums' ? '1' : '0'} onClick={() => setTab('albums')}>
          Albums <span className="count">{albums.length}</span>
        </button>
        <button data-on={tab === 'artists' ? '1' : '0'} onClick={() => setTab('artists')}>
          Artists <span className="count">{artists.length}</span>
        </button>
      </div>

      {tab === 'albums' && (
        albums.length === 0
          ? <div className="empty">No albums match "{query}"</div>
          : (
            <div className="grid-5">
              {albums.map((raw) => {
                const a = { ...raw, myRating: state.ratings[raw.id] ?? raw.myRating };
                return <AlbumCard key={a.id} album={a} onClick={() => nav.go({ name: 'album', id: a.id })} />;
              })}
            </div>
          )
      )}

      {tab === 'artists' && (
        artists.length === 0
          ? <div className="empty">No artists match "{query}"</div>
          : (
            <div className="grid-3">
              {artists.map((ar) => (
                <button key={ar.id} className="artist-row"
                        onClick={() => nav.go({ name: 'artist', id: ar.id })}
                        style={{ background: 'var(--card)', border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left' }}>
                  <div className="artist-avatar" style={{ '--c1': ar.colors[0], '--c2': ar.colors[1] }} />
                  <div>
                    <div className="artist-name">{ar.name}</div>
                    <div className="artist-sub">
                      {ar.tags.join(' · ')} · {ar.listeners} monthly
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )
      )}
    </div>
  );
};

Object.assign(window, { ScreenHome, ScreenSearch });
