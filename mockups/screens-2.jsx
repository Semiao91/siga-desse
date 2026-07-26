// Album, Artist, Profile screens.

// ── Album detail ─────────────────────────────────────────────────────────
const ScreenAlbum = ({ nav, state, dispatch, tweaks }) => {
  const album = ALBUMS.find((a) => a.id === state.activeAlbum);
  if (!album) return <div className="page">Album not found</div>;

  const myRating = state.ratings[album.id] ?? album.myRating;
  const trackRatings = state.trackRatings[album.id] || {};
  const tracks = React.useMemo(() => makeTracks(album).map((t) => ({
    ...t,
    rating: trackRatings[t.n] !== undefined ? trackRatings[t.n] : t.rating,
  })), [album.id, state.trackRatings]);

  const baseSeed = COMMENTS_SEED[album.id] || { public: [], private: [] };
  const userPublic = state.comments[album.id]?.public || [];
  const userPrivate = state.comments[album.id]?.private || [];
  const publics = [...userPublic, ...baseSeed.public];
  const privates = [...userPrivate, ...baseSeed.private];

  const otherAlbums = ALBUMS.filter((a) => a.artistId === album.artistId && a.id !== album.id).slice(0, 4);

  const heroStyle = {
    '--h1': album.colors[0],
    '--h2': album.colors[1],
  };

  return (
    <div className="page fade-in">
      <button className="row" onClick={() => nav.back()}
              style={{ background: 'transparent', border: 0, color: 'var(--muted-foreground)', cursor: 'pointer', padding: 0, marginBottom: 24, gap: 4 }}>
        <Icon name="chevLeft" size={16} /> Back
      </button>

      <div className="hero" data-hero={tweaks.heroStyle} style={heroStyle}>
        <div className="hero-cover">
          <AlbumCover album={album} showRating={false} />
        </div>
        <div className="hero-meta">
          <div className="hero-eyebrow">Album · {album.year}</div>
          <h1 className="hero-title">{album.title}</h1>
          <p className="hero-artist">
            by <a onClick={() => nav.go({ name: 'artist', id: album.artistId })} style={{ cursor: 'pointer' }}>{album.artist}</a>
          </p>
          <div className="hero-meta-row">
            <span>{album.tracks} tracks</span>
            <span className="dot" />
            <span>{album.runtime}</span>
            <span className="dot" />
            <span>{album.genre}</span>
          </div>
          <div className="row" style={{ marginTop: 8, gap: 10 }}>
            <button className="btn btn-primary">
              <Icon name="play" size={14} /> Play album
            </button>
            <button className="btn btn-ghost">
              <Icon name="plus" size={14} /> Save
            </button>
          </div>
        </div>
      </div>

      <div className="section" style={{ marginTop: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64 }}>
          <div>
            <SectionHead title="Tracks" />
            <div className="tracklist card" style={{ padding: 8 }}>
              {tracks.map((t) => {
                const tComments = state.trackComments[album.id]?.[t.n] || [];
                const isOpen = state.openTrack === `${album.id}:${t.n}`;
                return (
                  <div key={t.n} className={`track-item${isOpen ? ' expanded' : ''}`}>
                    <div className="track-row">
                      <div className="track-num">
                        <span className="num-glyph">{String(t.n).padStart(2, '0')}</span>
                        <span className="play-glyph" style={{ display: 'none' }}>▸</span>
                      </div>
                      <div className="track-title">{t.title}</div>
                      <div className="track-duration">{t.duration}</div>
                      <div className="track-rate">
                        <TrackRateMenu value={t.rating}
                                       onChange={(v) => dispatch({ type: 'rateTrack', albumId: album.id, n: t.n, value: v })} />
                      </div>
                      <button className="track-comment-btn"
                              data-on={isOpen ? '1' : '0'}
                              data-has={tComments.length > 0 ? '1' : '0'}
                              aria-label={`${tComments.length} comments on this track`}
                              onClick={() => dispatch({ type: 'toggleTrack', key: `${album.id}:${t.n}` })}>
                        <Icon name="chat" size={16} />
                      </button>
                    </div>
                    {isOpen && (
                      <div className="track-comments">
                        {tComments.length === 0 && (
                          <div className="track-comment-empty">No notes on this track yet.</div>
                        )}
                        {tComments.map((c) => (
                          <div key={c.id} className="track-comment">
                            <Avatar initials={c.initials} size={28} />
                            <div>
                              <div className="track-comment-head">
                                <span className="track-comment-author">{c.author}</span>
                                <span className="track-comment-meta">· {c.ago}</span>
                              </div>
                              <div className="track-comment-text">{c.text}</div>
                            </div>
                          </div>
                        ))}
                        <TrackCommentForm albumId={album.id} n={t.n} dispatch={dispatch} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="card">
              <div className="stat-label" style={{ marginBottom: 12 }}>Your rating</div>
              <RatingNumeral value={myRating} />
              <div style={{ marginTop: 16, marginBottom: 16 }}>
                <RatingControl value={myRating} variant={tweaks.rateUI}
                               onChange={(v) => dispatch({ type: 'rateAlbum', albumId: album.id, value: v })} />
              </div>
              {myRating == null && (
                <p style={{ margin: 0, fontSize: 12, color: 'var(--muted-foreground)' }}>
                  Tap a value to rate this album from 1 to 10.
                </p>
              )}
              {myRating != null && (
                <button onClick={() => dispatch({ type: 'rateAlbum', albumId: album.id, value: null })}
                        style={{ background: 'transparent', border: 0, color: 'var(--muted-foreground)', cursor: 'pointer', fontSize: 12, padding: 0, marginTop: 4 }}>
                  Clear rating
                </button>
              )}
            </div>

            <div className="card" style={{ marginTop: 16 }}>
              <div className="stat-label" style={{ marginBottom: 16 }}>Community</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--primary)' }}>
                  {averageRating(publics, baseSeed)}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
                  from {1247} ratings
                </div>
              </div>
              {/* Distribution — synthesized from a fixed shape so the bars feel real */}
              {distribution(album.id).map((d) => (
                <div className="dist" key={d.n}>
                  <span className="dist-num">{d.n}</span>
                  <div className="dist-bar"><div className="dist-fill" style={{ width: d.pct + '%' }} /></div>
                  <span className="dist-count">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <SectionHead title={`Notes & reviews · ${publics.length + privates.length}`} />
        <CommentComposer albumId={album.id} dispatch={dispatch} />
        <div className="comments" style={{ marginTop: 16 }}>
          {privates.map((c) => <CommentCard key={c.id} c={c} isPrivate />)}
          {publics.map((c) => <CommentCard key={c.id} c={c} />)}
          {publics.length + privates.length === 0 && (
            <div className="empty">Be the first to leave a note on this album.</div>
          )}
        </div>
      </div>

      {otherAlbums.length > 0 && (
        <div className="section">
          <SectionHead title={`More from ${album.artist}`} action="See all" onAction={() => nav.go({ name: 'artist', id: album.artistId })} />
          <div className="grid-4">
            {otherAlbums.map((a) => {
              const augmented = { ...a, myRating: state.ratings[a.id] ?? a.myRating };
              return <AlbumCard key={a.id} album={augmented} onClick={() => nav.go({ name: 'album', id: a.id })} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Per-track rating: a 1-10 pop-out so the row stays compact.
const TrackRateMenu = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();
  React.useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="track-rate-btn" data-rated={value != null ? '1' : '0'} onClick={() => setOpen(!open)}>
        {value != null ? value : 'Rate'}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 10,
          padding: 8, borderRadius: 10,
          background: 'var(--popover)', border: '1px solid var(--border-strong)',
          boxShadow: '0 12px 32px -12px oklch(0 0 0 / 50%)',
          display: 'flex', gap: 2,
        }}>
          {[1,2,3,4,5,6,7,8,9,10].map((n) => (
            <button key={n} onClick={() => { onChange(n === value ? null : n); setOpen(false); }}
                    style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: value === n ? 'var(--primary)' : 'transparent',
                      color: value === n ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                      border: 0, cursor: 'pointer',
                      fontFamily: 'var(--font-mono)', fontSize: 12,
                    }}>{n}</button>
          ))}
          {value != null && (
            <button onClick={() => { onChange(null); setOpen(false); }}
                    style={{
                      marginLeft: 4, padding: '0 8px', height: 28,
                      background: 'transparent', border: 0, cursor: 'pointer',
                      color: 'var(--muted-foreground)', fontSize: 12,
                    }}>Clear</button>
          )}
        </div>
      )}
    </div>
  );
};

const TrackCommentForm = ({ albumId, n, dispatch }) => {
  const [text, setText] = React.useState('');
  const submit = () => {
    if (!text.trim()) return;
    dispatch({ type: 'addTrackComment', albumId, n, comment: {
      id: 'tc' + Date.now(),
      author: 'You', initials: 'YO',
      ago: 'just now',
      text: text.trim(),
    } });
    setText('');
  };
  const onKey = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit();
  };
  return (
    <div className="track-comment-form">
      <textarea placeholder="Note on this track…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKey} />
      <button className="btn btn-primary btn-sm"
              onClick={submit} disabled={!text.trim()}
              style={{ opacity: text.trim() ? 1 : 0.5, alignSelf: 'flex-end' }}>
        Post
      </button>
    </div>
  );
};

const CommentComposer = ({ albumId, dispatch }) => {
  const [text, setText] = React.useState('');
  const [rating, setRating] = React.useState(null);
  const [vis, setVis] = React.useState('public');
  const submit = () => {
    if (!text.trim()) return;
    dispatch({ type: 'addComment', albumId, comment: {
      id: 'u' + Date.now(),
      author: 'You', initials: 'YO',
      rating, ago: 'just now',
      text: text.trim(),
    }, visibility: vis });
    setText(''); setRating(null);
  };
  return (
    <div className="comment-form">
      <textarea placeholder={vis === 'private' ? 'Private note — only you will see this…' : 'Write a public review…'}
                value={text} onChange={(e) => setText(e.target.value)} />
      <div className="comment-form-foot">
        <div className="row" style={{ gap: 16 }}>
          <div className="visibility-toggle">
            <button data-on={vis === 'public' ? '1' : '0'} onClick={() => setVis('public')}>
              <Icon name="globe" size={12} /> Public
            </button>
            <button data-on={vis === 'private' ? '1' : '0'} onClick={() => setVis('private')}>
              <Icon name="lock" size={12} /> Private
            </button>
          </div>
          <div className="row" style={{ gap: 8, color: 'var(--muted-foreground)', fontSize: 12 }}>
            <span>Rate with note</span>
            <select value={rating ?? ''} onChange={(e) => setRating(e.target.value ? Number(e.target.value) : null)}
                    style={{
                      height: 30, padding: '0 10px',
                      background: 'var(--background)', color: 'var(--foreground)',
                      border: '1px solid var(--border-strong)', borderRadius: 8,
                      fontFamily: 'var(--font-mono)', fontSize: 12,
                    }}>
              <option value="">—</option>
              {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={submit} disabled={!text.trim()}
                style={{ opacity: text.trim() ? 1 : 0.5 }}>
          Post note
        </button>
      </div>
    </div>
  );
};

const CommentCard = ({ c, isPrivate = false }) => (
  <div className="comment">
    <Avatar initials={c.initials} size={40} />
    <div className="comment-body">
      <div className="comment-head">
        <span className="comment-author">{c.author}</span>
        <span className="comment-meta">{c.ago}</span>
        {c.rating != null && <span className="comment-rate">{c.rating}/10</span>}
        {isPrivate && <span className="comment-private"><Icon name="lock" size={10} /> private</span>}
      </div>
      <div className="comment-text">{c.text}</div>
    </div>
  </div>
);

// Pseudo-community average: bias toward user's own rating to feel coherent.
function averageRating(publics, seed) {
  const all = [...publics, ...(seed.public || [])];
  if (!all.length) return '—';
  const ratings = all.filter((c) => c.rating != null).map((c) => c.rating);
  if (!ratings.length) return '—';
  return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
}

// Deterministic distribution shape per album id — feels real, looks varied.
function distribution(albumId) {
  const seed = parseInt(albumId.slice(2), 10);
  // Bell-ish curve weighted toward higher ratings.
  const shape = [1, 1, 2, 4, 6, 10, 14, 22, 26, 14];
  return shape.map((w, i) => {
    const n = i + 1;
    const offset = ((seed * (i + 3)) % 7) - 3;
    const pct = Math.max(2, w + offset);
    const count = Math.round(pct * 12);
    return { n, pct, count };
  });
}

// ── Artist ────────────────────────────────────────────────────────────────
const ScreenArtist = ({ nav, state }) => {
  const artist = ARTISTS.find((a) => a.id === state.activeArtist);
  if (!artist) return <div className="page">Artist not found</div>;
  const discography = ALBUMS.filter((a) => a.artistId === artist.id)
    .map((a) => ({ ...a, myRating: state.ratings[a.id] ?? a.myRating }))
    .sort((a, b) => b.year - a.year);
  const rated = discography.filter((a) => a.myRating != null);
  const avg = rated.length
    ? (rated.reduce((s, a) => s + a.myRating, 0) / rated.length).toFixed(1)
    : '—';

  return (
    <div className="page fade-in">
      <button className="row" onClick={() => nav.back()}
              style={{ background: 'transparent', border: 0, color: 'var(--muted-foreground)', cursor: 'pointer', padding: 0, marginBottom: 24, gap: 4 }}>
        <Icon name="chevLeft" size={16} /> Back
      </button>

      <div style={{
        display: 'grid', gridTemplateColumns: '180px 1fr', gap: 40,
        alignItems: 'end',
        padding: '32px 0 40px',
        marginBottom: 40,
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          width: 180, height: 180, borderRadius: '50%',
          background: `linear-gradient(135deg, ${artist.colors[0]}, ${artist.colors[1]})`,
          border: '1px solid var(--border-strong)',
        }} />
        <div>
          <div className="stat-label" style={{ marginBottom: 12 }}>Artist</div>
          <h1 className="hero-title" style={{ fontSize: 72 }}>{artist.name}</h1>
          <div className="row" style={{ marginTop: 16, gap: 8, flexWrap: 'wrap' }}>
            {artist.tags.map((t) => <span key={t} className="chip chip-outline">{t}</span>)}
            <span className="chip chip-outline">{artist.listeners} monthly listeners</span>
          </div>
        </div>
      </div>

      <div className="section" style={{ marginTop: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 40 }}>
          <StatBlock label="Your average" value={avg} note={`across ${rated.length} of ${discography.length} albums`} />
          <StatBlock label="Discography" value={discography.length} note={`${discography[discography.length-1]?.year} – ${discography[0]?.year}`} />
          <StatBlock label="Top album" value={rated[0]?.title || '—'} note={rated[0] ? `${rated[0].myRating}/10` : 'rate to surface'} valueSize={20} />
        </div>

        <SectionHead title="Discography" />
        <div className="grid-4">
          {discography.map((a) => <AlbumCard key={a.id} album={a} onClick={() => nav.go({ name: 'album', id: a.id })} />)}
        </div>
      </div>
    </div>
  );
};

const StatBlock = ({ label, value, note, valueSize = 44 }) => (
  <div className="card">
    <div className="stat-label" style={{ marginBottom: 8 }}>{label}</div>
    <div style={{
      fontFamily: 'var(--font-display)', fontWeight: 500,
      fontSize: valueSize, letterSpacing: '-0.02em',
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 1.1,
    }}>{value}</div>
    <div style={{ marginTop: 6, fontSize: 12, color: 'var(--muted-foreground)' }}>{note}</div>
  </div>
);

// ── Profile ───────────────────────────────────────────────────────────────
const ScreenProfile = ({ nav, state }) => {
  const rated = ALBUMS.map((a) => ({ ...a, myRating: state.ratings[a.id] ?? a.myRating }))
    .filter((a) => a.myRating != null);
  const byScore = [...rated].sort((a, b) => b.myRating - a.myRating);
  const avg = rated.length ? (rated.reduce((s, a) => s + a.myRating, 0) / rated.length).toFixed(1) : '—';
  // Build distribution of YOUR ratings (1-10).
  const dist = Array.from({ length: 10 }, (_, i) => {
    const n = i + 1;
    const c = rated.filter((a) => a.myRating === n).length;
    return { n, c };
  });
  const maxC = Math.max(1, ...dist.map((d) => d.c));

  // Aggregate user-authored comments across all albums.
  const myReviews = [];
  for (const [albumId, buckets] of Object.entries(state.comments)) {
    for (const c of (buckets.public || []).concat(buckets.private || [])) {
      const album = ALBUMS.find((a) => a.id === albumId);
      const isPrivate = (buckets.private || []).some((p) => p.id === c.id);
      myReviews.push({ ...c, album, isPrivate });
    }
  }
  // Also surface seed private notes (which we count as "yours").
  for (const [albumId, seed] of Object.entries(COMMENTS_SEED)) {
    for (const c of (seed.private || [])) {
      if (!myReviews.find((r) => r.id === c.id)) {
        const album = ALBUMS.find((a) => a.id === albumId);
        myReviews.push({ ...c, album, isPrivate: true });
      }
    }
  }

  return (
    <div className="page fade-in">
      <div className="profile-head">
        <div className="profile-avatar">Y</div>
        <div>
          <div className="stat-label" style={{ marginBottom: 8 }}>Crate keeper since 2023</div>
          <h1 className="hero-title" style={{ fontSize: 56 }}>You</h1>
          <p style={{ margin: '8px 0 0', color: 'var(--muted-foreground)', fontSize: 15 }}>
            Indie pop and ambient mostly. Looking for the next Halcyon Field.
          </p>
        </div>
        <div className="profile-stats">
          <div className="profile-stat">
            <div className="v">{rated.length}</div>
            <div className="stat-label">Albums rated</div>
          </div>
          <div className="profile-stat">
            <div className="v">{avg}</div>
            <div className="stat-label">Avg score</div>
          </div>
          <div className="profile-stat">
            <div className="v">{myReviews.length}</div>
            <div className="stat-label">Notes</div>
          </div>
        </div>
      </div>

      <div className="section" style={{ marginTop: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48 }}>
          <div className="card">
            <div className="stat-label" style={{ marginBottom: 16 }}>Rating distribution</div>
            {dist.slice().reverse().map((d) => (
              <div className="dist" key={d.n}>
                <span className="dist-num">{d.n}</span>
                <div className="dist-bar"><div className="dist-fill" style={{ width: (d.c / maxC * 100) + '%' }} /></div>
                <span className="dist-count">{d.c}</span>
              </div>
            ))}
          </div>
          <div>
            <SectionHead title="Top rated" />
            <div className="grid-3">
              {byScore.slice(0, 6).map((a) => <AlbumCard key={a.id} album={a} onClick={() => nav.go({ name: 'album', id: a.id })} />)}
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <SectionHead title={`Your notes · ${myReviews.length}`} />
        <div className="comments">
          {myReviews.length === 0 && <div className="empty">You haven't written any notes yet.</div>}
          {myReviews.map((r) => (
            <div key={r.id} className="comment">
              <div style={{ width: 56, height: 56 }}>
                <AlbumCover album={r.album} showRating={false} />
              </div>
              <div className="comment-body">
                <div className="comment-head">
                  <button onClick={() => nav.go({ name: 'album', id: r.album.id })}
                          style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer', color: 'var(--foreground)', fontSize: 14, fontWeight: 500 }}>
                    {r.album.title}
                  </button>
                  <span className="comment-meta">· {r.album.artist}</span>
                  <span className="comment-meta">· {r.ago}</span>
                  {r.rating != null && <span className="comment-rate">{r.rating}/10</span>}
                  {r.isPrivate && <span className="comment-private"><Icon name="lock" size={10} /> private</span>}
                </div>
                <div className="comment-text">{r.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ScreenAlbum, ScreenArtist, ScreenProfile });
