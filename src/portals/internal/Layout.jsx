import { useState } from 'react';
import { NavLink, Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { LayoutGrid, FileText, Radio, UserCog, Users2, Menu, Vote, FileBarChart, Scroll, Megaphone, Eye, Video } from 'lucide-react';
import { useApp } from '../../mock/store';
import BrandMark from '../../components/ui/BrandMark';
import GlobalSearch from '../../components/ui/GlobalSearch';
import LiveClock from '../../components/ui/LiveClock';
import ThemeToggle from '../../components/ui/ThemeToggle';
import NotificationBell from '../../components/ui/NotificationBell';
import ProfileMenu from '../../components/ui/ProfileMenu';
import PortalSwitcher from '../../components/ui/PortalSwitcher';

const ROUTE_TITLES = {
  '': 'Overview',
  bills: 'Bills',
  committees: 'Committees',
  session: 'Sitting',
  users: 'Users',
  'voting-records': 'Voting Records',
  reports: 'Reports',
  'official-documents': 'Official Documents',
};

const Layout = () => {
  const { currentUser, session } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  if (!currentUser) return <Navigate to="/internal/signin" replace />;

  const segment = location.pathname.replace(/^\/internal\/?/, '').split('/')[0];
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
          <NavLink to="/internal" end className="portal-nav-link">
            <LayoutGrid size={17} /> <span>Overview</span>
          </NavLink>
          <NavLink to="/internal/bills" className="portal-nav-link">
            <FileText size={17} /> <span>Bills</span>
          </NavLink>
          <NavLink to="/internal/committees" className="portal-nav-link">
            <Users2 size={17} /> <span>Committees</span>
          </NavLink>
          <NavLink to="/internal/session" className="portal-nav-link">
            <Radio size={17} /> <span>Sitting</span>
            {session.live && <span className="portal-nav-live-dot" />}
          </NavLink>
          {['Administrator', 'Superuser'].includes(currentUser.roles[0]) && (
            <NavLink to="/internal/users" className="portal-nav-link">
              <UserCog size={17} /> <span>Users</span>
            </NavLink>
          )}
        </nav>

        <div className="portal-nav-label">Records</div>
        <nav className="portal-nav">
          <NavLink to="/internal/official-documents" className="portal-nav-link">
            <Scroll size={17} /> <span>Official Documents</span>
          </NavLink>
          {['Clerk', 'Administrator', 'Superuser'].includes(currentUser.roles[0]) && (
            <NavLink to="/internal/petitions" className="portal-nav-link">
              <Megaphone size={17} /> <span>Petitions</span>
            </NavLink>
          )}
          <NavLink to="/internal/voting-records" className="portal-nav-link">
            <Vote size={17} /> <span>Voting Records</span>
          </NavLink>
          <NavLink to="/internal/reports" className="portal-nav-link">
            <FileBarChart size={17} /> <span>Reports</span>
          </NavLink>
        </nav>

        {currentUser.roles[0] === 'Superuser' && (
          <>
            <div className="portal-nav-label">View as</div>
            <nav className="portal-nav">
              {[
                { view: '', label: 'Superuser' },
                { view: 'mp', label: 'MP' },
                { view: 'speaker', label: 'Speaker' },
                { view: 'clerk', label: 'Clerk' },
              ].map(({ view, label }) => (
                <Link
                  key={view}
                  to={view ? `/internal?view=${view}` : '/internal'}
                  className="portal-nav-link"
                >
                  <Eye size={17} /> <span>{label}</span>
                </Link>
              ))}
            </nav>
          </>
        )}

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
            <GlobalSearch />
          </div>
          <div className="portal-topbar-right">
            <LiveClock />
            <ThemeToggle />
            <NotificationBell />
            <ProfileMenu />
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
