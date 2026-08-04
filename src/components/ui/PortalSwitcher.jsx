import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, Building2, Landmark, ChevronDown, Check } from 'lucide-react';

const PORTALS = [
  {
    id: 'public',
    name: 'Public Portal',
    path: '/public',
    icon: Globe,
    desc: 'Public bill tracking, MP directory & live sittings',
    badge: 'Open Record',
  },
  {
    id: 'internal',
    name: 'Internal Assembly',
    path: '/internal/signin',
    activePathPrefix: '/internal',
    icon: Building2,
    desc: 'MPs, Clerks & Assembly operations',
    badge: 'Assembly Staff',
  },
  {
    id: 'government',
    name: 'Government Ministries',
    path: '/government/signin',
    activePathPrefix: '/government',
    icon: Landmark,
    desc: 'Ministry executive policy & legislative filing',
    badge: 'Executive',
  },
];

const PortalSwitcher = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const currentPortal = PORTALS.find((p) => {
    if (p.activePathPrefix) {
      return currentPath.startsWith(p.activePathPrefix);
    }
    return currentPath.startsWith(p.path);
  }) || PORTALS[0];

  const CurrentIcon = currentPortal.icon;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPortal = (portal) => {
    setOpen(false);
    navigate(portal.path);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        className="portal-switcher-btn"
        onClick={() => setOpen(!open)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          padding: '6px 14px',
          borderRadius: '100px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-strong)',
          fontSize: '12.5px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
        }}
      >
        <CurrentIcon size={14} color="var(--accent)" />
        <span>{currentPortal.name}</span>
        <ChevronDown size={13} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease', opacity: 0.7 }} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '280px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-lg)',
            padding: '8px',
            zIndex: 999,
          }}
        >
          <div style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '6px 10px 8px 10px' }}>
            Switch System Portal
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {PORTALS.map((portal) => {
              const Icon = portal.icon;
              const isActive = currentPortal.id === portal.id;

              return (
                <button
                  key={portal.id}
                  type="button"
                  onClick={() => handleSelectPortal(portal)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isActive ? 'var(--accent-tint-soft)' : 'transparent',
                    color: 'var(--text-strong)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'var(--accent-tint-soft)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isActive ? 'var(--accent)' : 'var(--accent-tint)',
                      color: isActive ? '#ffffff' : 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Icon size={16} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-strong)' }}>{portal.name}</span>
                      {isActive && <Check size={14} color="var(--accent)" />}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.3 }}>
                      {portal.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalSwitcher;
