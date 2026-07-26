// Music Crate — app shell: router, state, top nav, tweaks panel.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": true,
  "rateUI": "pills",
  "heroStyle": "extracted"
}/*EDITMODE-END*/;

// ── State reducer ─────────────────────────────────────────────────────────
// All persistent app state lives here. Ratings, track ratings, and comments
// keyed by album id. Route history is a simple stack so the back button works.
const initialState = {
  route: { name: 'home' },
  history: [],
  query: '',
  activeAlbum: null,
  activeArtist: null,
  ratings: {},        // { [albumId]: 1..10 | null }
  trackRatings: {},   // { [albumId]: { [trackN]: 1..10 | null } }
  trackComments: TRACK_COMMENTS_SEED,  // { [albumId]: { [trackN]: Comment[] } }
  comments: {},       // { [albumId]: { public: Comment[], private: Comment[] } }
  openTrack: null,    // "<albumId>:<n>" of currently expanded track row, if any
};

function reducer(state, action) {
  switch (action.type) {
    case 'go': {
      const route = action.route;
      const next = { ...state, route, history: [...state.history, state.route] };
      if (route.name === 'album')  next.activeAlbum  = route.id;
      if (route.name === 'artist') next.activeArtist = route.id;
      return next;
    }
    case 'back': {
      if (!state.history.length) return state;
      const prev = state.history[state.history.length - 1];
      return { ...state, route: prev, history: state.history.slice(0, -1) };
    }
    case 'setQuery':
      return { ...state, query: action.query };

    case 'rateAlbum':
      return { ...state, ratings: { ...state.ratings, [action.albumId]: action.value } };

    case 'rateTrack': {
      const prev = state.trackRatings[action.albumId] || {};
      return {
        ...state,
        trackRatings: { ...state.trackRatings, [action.albumId]: { ...prev, [action.n]: action.value } },
      };
    }

    case 'addTrackComment': {
      const prevAlbum = state.trackComments[action.albumId] || {};
      const prevTrack = prevAlbum[action.n] || [];
      return {
        ...state,
        trackComments: {
          ...state.trackComments,
          [action.albumId]: { ...prevAlbum, [action.n]: [action.comment, ...prevTrack] },
        },
      };
    }

    case 'toggleTrack':
      return { ...state, openTrack: state.openTrack === action.key ? null : action.key };

    case 'addComment': {
      const prev = state.comments[action.albumId] || { public: [], private: [] };
      const bucket = action.visibility === 'private' ? 'private' : 'public';
      const next = { ...prev, [bucket]: [action.comment, ...prev[bucket]] };
      return { ...state, comments: { ...state.comments, [action.albumId]: next } };
    }

    default:
      return state;
  }
}

// ── Top nav ──────────────────────────────────────────────────────────────
const TopNav = ({ state, dispatch, onSearch }) => {
  const inputRef = React.useRef();
  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  const isOn = (name) => state.route.name === name;
  return (
    <nav className="nav">
      <div className="nav-left">
        <Logo onClick={() => dispatch({ type: 'go', route: { name: 'home' } })} />
      </div>
      <div className="search">
        <Icon name="search" size={16} className="s-icon" />
        <input ref={inputRef}
               placeholder="Search artists, albums, or genres…"
               value={state.query}
               onChange={(e) => {
                 dispatch({ type: 'setQuery', query: e.target.value });
                 if (state.route.name !== 'search') {
                   dispatch({ type: 'go', route: { name: 'search' } });
                 }
               }}
               onFocus={() => {
                 if (state.route.name !== 'search') {
                   dispatch({ type: 'go', route: { name: 'search' } });
                 }
               }} />
        <kbd>⌘ K</kbd>
      </div>
      <div className="nav-right">
        <button className="nav-link" data-active={isOn('home') ? '1' : '0'}
                onClick={() => dispatch({ type: 'go', route: { name: 'home' } })}>Home</button>
        <button className="nav-link" data-active={isOn('search') ? '1' : '0'}
                onClick={() => dispatch({ type: 'go', route: { name: 'search' } })}>Browse</button>
        <button className="nav-link" data-active={isOn('profile') ? '1' : '0'}
                onClick={() => dispatch({ type: 'go', route: { name: 'profile' } })}>Library</button>
        <div style={{ width: 8 }} />
        <button onClick={() => dispatch({ type: 'go', route: { name: 'profile' } })}
                style={{ border: 0, background: 'transparent', padding: 0, cursor: 'pointer' }}>
          <Avatar initials="YO" />
        </button>
      </div>
    </nav>
  );
};

// ── App root ──────────────────────────────────────────────────────────────
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // Apply theme class to <html> so the tokens cascade everywhere.
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', !!tweaks.dark);
    root.classList.toggle('light', !tweaks.dark);
  }, [tweaks.dark]);

  const nav = {
    go: (route) => dispatch({ type: 'go', route }),
    back: () => dispatch({ type: 'back' }),
  };

  let screen;
  switch (state.route.name) {
    case 'home':    screen = <ScreenHome    nav={nav} state={state} />; break;
    case 'search':  screen = <ScreenSearch  nav={nav} state={state} query={state.query} />; break;
    case 'album':   screen = <ScreenAlbum   nav={nav} state={state} dispatch={dispatch} tweaks={tweaks} />; break;
    case 'artist':  screen = <ScreenArtist  nav={nav} state={state} />; break;
    case 'profile': screen = <ScreenProfile nav={nav} state={state} />; break;
    default:        screen = <div className="page">Page not found</div>;
  }

  return (
    <div className="app">
      <TopNav state={state} dispatch={dispatch} />
      <main key={state.route.name + (state.activeAlbum || '') + (state.activeArtist || '')}>
        {screen}
      </main>

      <TweaksPanel title="Music Crate · Tweaks">
        <TweakSection label="Theme" />
        <TweakRadio label="Mode" value={tweaks.dark ? 'dark' : 'light'}
                    options={['light', 'dark']}
                    onChange={(v) => setTweak('dark', v === 'dark')} />

        <TweakSection label="Album hero" />
        <TweakSelect label="Hero style" value={tweaks.heroStyle}
                     options={[
                       { value: 'extracted', label: 'Extracted color background' },
                       { value: 'crate',     label: 'Tilted crate stack' },
                       { value: 'minimal',   label: 'Minimal — no embellishment' },
                     ]}
                     onChange={(v) => setTweak('heroStyle', v)} />

        <TweakSection label="Rating control" />
        <TweakRadio label="Style" value={tweaks.rateUI}
                    options={['pills', 'slider', 'glyphs']}
                    onChange={(v) => setTweak('rateUI', v)} />
        <div style={{ fontSize: 11, color: 'rgba(41,38,27,.55)', marginTop: -4 }}>
          Visit any album page to try it.
        </div>

        <TweakSection label="Try it" />
        <TweakButton label="Go to album page" onClick={() => dispatch({ type: 'go', route: { name: 'album', id: 'al05' } })} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
