import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, Building2, Landmark, Check, ArrowLeftRight } from 'lucide-react';

const PORTALS = [
  { id: 'public', name: 'Public Portal', path: '/public', icon: Globe },
  {
    id: 'internal',
    name: 'Internal Assembly',
    path: '/internal/signin',
    activePathPrefix: '/internal',
    icon: Building2,
  },
  {
    id: 'government',
    name: 'Government Ministries',
    path: '/government/signin',
    activePathPrefix: '/government',
    icon: Landmark,
  },
];

const PortalMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const activeId = PORTALS.find((p) =>
    p.activePathPrefix ? currentPath.startsWith(p.activePathPrefix) : currentPath.startsWith(p.path)
  )?.id ?? 'public';

  return (
    <div className="portal-menu-items">
      <div className="profile-dropdown-label">
        <ArrowLeftRight size={12} /> Switch portal
      </div>
      {PORTALS.map((portal) => {
        const Icon = portal.icon;
        const active = portal.id === activeId;

        return (
          <button
            key={portal.id}
            type="button"
            className={`portal-menu-item ${active ? 'active' : ''}`}
            onClick={() => navigate(portal.path)}
          >
            <Icon size={15} />
            <span className="portal-menu-item-name">{portal.name}</span>
            {active && <Check size={14} />}
          </button>
        );
      })}
    </div>
  );
};

export default PortalMenu;
