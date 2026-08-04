import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Users2 } from 'lucide-react';
import { useApp } from '../../mock/store';

const GlobalSearch = ({ pathPrefix = '/internal' }) => {
  const { bills, committees } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const q = query.trim().toLowerCase();
  const billMatches = q
    ? bills.filter((b) => b.title.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)).slice(0, 4)
    : [];
  const committeeMatches = q ? committees.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3) : [];
  const hasResults = billMatches.length > 0 || committeeMatches.length > 0;

  const go = (path) => {
    navigate(path);
    setQuery('');
    setOpen(false);
  };

  return (
    <div className="topbar-search" ref={ref}>
      <Search size={15} className="topbar-search-icon" style={{ zIndex: 2, color: 'var(--text-muted)', opacity: 0.75 }} />
      <input
        type="text"
        placeholder="Search bills, committees..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setQuery('');
            setOpen(false);
            e.target.blur();
          }
        }}
        style={{ paddingRight: '50px' }}
      />
      <div style={{
        position: 'absolute',
        right: '10px',
        zIndex: 2,
        fontSize: '0.65rem',
        fontWeight: 'bold',
        color: 'var(--text-muted)',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        padding: '0.15rem 0.35rem',
        borderRadius: 'var(--radius-sm)',
        pointerEvents: 'none'
      }}>
        ESC
      </div>
      {open && q && (
        <div className="topbar-dropdown search-dropdown">
          {hasResults ? (
            <>
              {billMatches.length > 0 && (
                <div className="search-group">
                  <span className="search-group-label">Bills</span>
                  {billMatches.map((b) => (
                    <button type="button" key={b.id} onClick={() => go(`${pathPrefix}/bills/${b.id}`)}>
                      <FileText size={14} /> {b.title}
                    </button>
                  ))}
                </div>
              )}
              {committeeMatches.length > 0 && (
                <div className="search-group">
                  <span className="search-group-label">Committees</span>
                  {committeeMatches.map((c) => (
                    <button type="button" key={c.id} onClick={() => go(`${pathPrefix}/committees/${c.id}`)}>
                      <Users2 size={14} /> {c.name}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="search-empty">No matches for &ldquo;{query}&rdquo;</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
