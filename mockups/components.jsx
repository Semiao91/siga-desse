// Shared UI primitives for Music Crate.
// All components are global (assigned to window at the bottom) so cross-file
// Babel scripts can use them without re-importing.

// ── Icons ──────────────────────────────────────────────────────────────────
// Tiny stroke-icon set. Inline SVG so they inherit currentColor and stay
// crisp at any size — no icon font, no asset loading.
const Icon = ({ name, size = 18, ...rest }) => {
  const paths = {
    search:    <><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></>,
    home:      <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /></>,
    library:   <><rect x="3" y="3"  width="6" height="18" rx="1" /><rect x="11" y="3"  width="6" height="18" rx="1" /><path d="M19 3v18" /></>,
    user:      <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /></>,
    plus:      <><path d="M12 5v14M5 12h14" /></>,
    arrow:     <><path d="M5 12h14M13 5l7 7-7 7" /></>,
    chev:      <><path d="m6 9 6 6 6-6" /></>,
    chevLeft:  <><path d="m15 6-6 6 6 6" /></>,
    chevRight: <><path d="m9 6 6 6-6 6" /></>,
    play:      <><path d="M6 4v16l14-8z" fill="currentColor" stroke="none" /></>,
    pause:     <><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></>,
    lock:      <><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
    globe:     <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></>,
    chat:      <><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4l-5 1.6 1.7-4.6A8.5 8.5 0 1 1 21 11.5z" /></>,
    star:      <><path d="M12 3 14.6 9l6.4.5-4.9 4.2 1.5 6.3L12 16.8 6.4 20l1.5-6.3L3 9.5 9.4 9z" /></>,
    settings:  <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
         {...rest}>
      {paths[name]}
    </svg>
  );
};

// ── Logo ───────────────────────────────────────────────────────────────────
// Stacked "crate" mark — three horizontal slabs with the bottom one filled in
// primary green to evoke a record sleeve in a crate of vinyl.
const Logo = ({ onClick }) => (
  <button className="logo" onClick={onClick} aria-label="Music Crate home">
    <span className="logo-mark" aria-hidden="true">
      <i /><i /><i />
    </span>
    <span>Music Crate</span>
  </button>
);

// ── Album cover (gradient placeholder) ─────────────────────────────────────
// We don't ship real album art — every cover is a 2-color gradient labelled
// with the album title in monospace. Looks intentional and stays original.
const AlbumCover = ({ album, size = null, showRating = true }) => {
  const style = {
    '--c1': album.colors[0],
    '--c2': album.colors[1],
  };
  if (size) { style.width = size; style.height = size; }
  return (
    <div className="cover" style={style}>
      <div className="art">
        <span className="art-tag">{album.title.toUpperCase()}</span>
      </div>
      {showRating && album.myRating != null && (
        <span className="rate-pill" data-good={album.myRating >= 8 ? '1' : '0'}>
          {album.myRating}
        </span>
      )}
    </div>
  );
};

// ── Album card (cover + meta + click-through) ─────────────────────────────
const AlbumCard = ({ album, onClick, showYear = true }) => (
  <button className="cover-link" onClick={() => onClick?.(album)}>
    <AlbumCover album={album} />
    <div className="cover-meta">
      <div className="t">{album.title}</div>
      <div className="a">{album.artist}</div>
      {showYear && <div className="y">{album.year}</div>}
    </div>
  </button>
);

// ── Rating control (3 variants, driven by tweaks) ─────────────────────────
// `variant` is set from the Tweaks panel: 'pills' | 'slider' | 'glyphs'.
// All three call onChange(value) where value is 1..10 or null (cleared).
const RatingControl = ({ value, onChange, variant = 'pills' }) => {
  const [hover, setHover] = React.useState(null);
  const eff = hover ?? value;

  if (variant === 'slider') {
    const pct = ((eff ?? 0) / 10) * 100;
    const onTrackClick = (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      const raw = ((e.clientX - r.left) / r.width) * 10;
      onChange(Math.max(1, Math.min(10, Math.round(raw))));
    };
    return (
      <div style={{ width: 360 }}>
        <div className="rate-slider">
          <div className="rate-slider-track" onClick={onTrackClick}
               onMouseLeave={() => setHover(null)}
               onMouseMove={(e) => {
                 const r = e.currentTarget.getBoundingClientRect();
                 const raw = ((e.clientX - r.left) / r.width) * 10;
                 setHover(Math.max(1, Math.min(10, Math.round(raw))));
               }}>
            <div className="rate-slider-fill" style={{ width: pct + '%' }} />
            {value != null && <div className="rate-slider-thumb" style={{ left: pct + '%' }} />}
          </div>
        </div>
        <div className="rate-slider-ticks">
          {[1,2,3,4,5,6,7,8,9,10].map((n) => <span key={n}>{n}</span>)}
        </div>
      </div>
    );
  }

  if (variant === 'glyphs') {
    return (
      <div className="rate-glyphs" onMouseLeave={() => setHover(null)}>
        {[1,2,3,4,5,6,7,8,9,10].map((n) => (
          <button key={n}
                  onMouseEnter={() => setHover(n)}
                  onClick={() => onChange(n === value ? null : n)}
                  data-on={value != null && n <= value ? '1' : '0'}
                  data-hi={hover != null && n <= hover && (value == null || n > value) ? '1' : '0'}
                  aria-label={`Rate ${n}`}>
            <i />
          </button>
        ))}
      </div>
    );
  }

  // pills (default)
  return (
    <div className="rate-pills" onMouseLeave={() => setHover(null)}>
      {[1,2,3,4,5,6,7,8,9,10].map((n) => (
        <button key={n}
                onMouseEnter={() => setHover(n)}
                onClick={() => onChange(n === value ? null : n)}
                data-on={value === n ? '1' : '0'}
                data-hi={hover === n && value !== n ? '1' : '0'}>
          {n}
        </button>
      ))}
    </div>
  );
};

// Big numeric readout used next to the control on the album hero.
const RatingNumeral = ({ value }) => (
  <div className="rate-num" data-unrated={value == null ? '1' : '0'}>
    {value ?? '—'}<span className="max">/10</span>
  </div>
);

// ── Avatar ────────────────────────────────────────────────────────────────
const Avatar = ({ initials, size = 36 }) => (
  <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.36 }}>
    {initials}
  </div>
);

// ── Section header with optional action ───────────────────────────────────
const SectionHead = ({ title, action, onAction }) => (
  <div className="section-head">
    <h2 className="section-title">{title}</h2>
    {action && (
      <button className="section-link" onClick={onAction}>
        {action}<Icon name="arrow" size={14} />
      </button>
    )}
  </div>
);

Object.assign(window, {
  Icon, Logo, AlbumCover, AlbumCard, RatingControl, RatingNumeral, Avatar, SectionHead,
});
