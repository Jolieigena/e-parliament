import { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { Search, LogIn } from 'lucide-react';
import BrandMark from '../../components/ui/BrandMark';
import ThemeToggle from '../../components/ui/ThemeToggle';
import './public.css';
import PortalSwitcher from '../../components/ui/PortalSwitcher';

const Layout = () => {
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <div className="public-portal-root">
      {/* SITE HEADER */}
      <header className="public-site-header">
        <div className="public-header-inner">
          <Link to="/public" className="public-logo">
            <div className="portal-seal" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-tint)', borderRadius: '8px' }}>
              <BrandMark size={18} />
            </div>
            <div className="name">E-Parliament</div>
          </Link>

          <nav className="public-main-nav">
            <NavLink to="/public" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Home
            </NavLink>
            <NavLink to="/public/bills" className={({ isActive }) => (isActive ? 'active' : '')}>
              Bills
            </NavLink>
            <NavLink to="/public/members" className={({ isActive }) => (isActive ? 'active' : '')}>
              Find your MP
            </NavLink>
            <NavLink to="/public/sitting" className={({ isActive }) => (isActive ? 'active' : '')}>
              Watch &amp; attend
            </NavLink>
            <NavLink to="/public/how-it-works" className={({ isActive }) => (isActive ? 'active' : '')}>
              How it works
            </NavLink>
            <NavLink to="/public/petitions" className={({ isActive }) => (isActive ? 'active' : '')}>
              Petitions
            </NavLink>
          </nav>

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="public-header-search">
              <Search size={15} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search bills or your MP…"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </div>

            <ThemeToggle />

            <Link
              to="/"
              className="btn btn-secondary btn-sm"
              style={{ textDecoration: 'none', whiteSpace: 'nowrap', fontSize: '12.5px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <LogIn size={14} /> Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="public-content">
        <Outlet context={{ globalSearch }} />
      </main>

      {/* SITE FOOTER */}
      <footer className="public-site-footer">
        <div className="public-footer-inner">
          <div>National Assembly Public Portal — an open record of legislative business.</div>
          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="#" onClick={(e) => e.preventDefault()}>Accessibility</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Open data</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Contact the Clerk's office</a>
            <Link to="/" style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <LogIn size={13} /> Staff &amp; Government Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
