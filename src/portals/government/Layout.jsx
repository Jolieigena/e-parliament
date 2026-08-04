import { useState } from 'react';
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { LayoutGrid, FileText, ShieldQuestion, Users2, FileStack, Landmark, Menu } from 'lucide-react';
import { useApp } from '../../mock/store';
import BrandMark from '../../components/ui/BrandMark';
import LiveClock from '../../components/ui/LiveClock';
import ThemeToggle from '../../components/ui/ThemeToggle';
import GovProfileMenu from './components/GovProfileMenu';
import PortalSwitcher from '../../components/ui/PortalSwitcher';

const ROUTE_TITLES = {
  '': 'Overview',
  legislation: 'Legislation',
  oversight: 'Oversight',
  'committee-requests': 'Committee Requests',
  documents: 'Documents',
};

const Layout = () => {
  const { currentGovUser, institutions } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  if (!currentGovUser) return <Navigate to="/government/signin" replace />;

  const institution = institutions.find((i) => i.id === currentGovUser.institutionId);
  const segment = location.pathname.replace(/^\/government\/?/, '').split('/')[0];
  const title = ROUTE_TITLES[segment] ?? 'Overview';

  return (
    <div className="portal-layout">
      <aside className={`portal-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="portal-brand">
          <div className="portal-seal">
            <BrandMark size={16} />
          </div>
          <span>E-Parliament</span>
        </div>

        <nav className="portal-nav">
          <NavLink to="/government" end className="portal-nav-link">
            <LayoutGrid size={17} /> <span>Overview</span>
          </NavLink>
          <NavLink to="/government/legislation" className="portal-nav-link">
            <FileText size={17} /> <span>Legislation</span>
          </NavLink>
          <NavLink to="/government/oversight" className="portal-nav-link">
            <ShieldQuestion size={17} /> <span>Oversight</span>
          </NavLink>
          <NavLink to="/government/committee-requests" className="portal-nav-link">
            <Users2 size={17} /> <span>Committee Requests</span>
          </NavLink>
          <NavLink to="/government/documents" className="portal-nav-link">
            <FileStack size={17} /> <span>Documents</span>
          </NavLink>
        </nav>

        <div className="portal-sidebar-footer">
          <PortalSwitcher variant="sidebar" collapsed={collapsed} />
        </div>
      </aside>

      <div className="portal-main">
        <header className="portal-topbar">
          <div className="portal-topbar-left">
            <button
              type="button"
              className="sidebar-collapse-btn"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu size={16} />
            </button>
            <h2 className="portal-topbar-title">{title}</h2>
            <div className="portal-topbar-session">
              <Landmark size={13} />
              {institution?.name}
            </div>
          </div>
          <div className="portal-topbar-right">
            <LiveClock />
            <ThemeToggle />
            <GovProfileMenu />
          </div>
        </header>
        <main className="portal-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
