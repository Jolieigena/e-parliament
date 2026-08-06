import { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { LogIn, X, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import BrandMark from '../../components/ui/BrandMark';
import ThemeToggle from '../../components/ui/ThemeToggle';
import GlobalSearch from '../../components/ui/GlobalSearch';
import './public.css';

const GALLERY = [
  {
    url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
    tag: 'Chamber',
    title: 'Plenary Chamber',
    caption: 'Ordinary sitting, National Assembly',
  },
  {
    url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    tag: 'Committee',
    title: 'Committee hearings',
    caption: 'Finance Committee in session',
  },
  {
    url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80',
    tag: 'Floor',
    title: 'Question time',
    caption: 'Ministerial oral answers',
  },
  {
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    tag: 'Procedural',
    title: 'Laying of papers',
    caption: 'Tabling of the 2026 Budget',
  },
  {
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    tag: 'Ceremonial',
    title: 'Head of State address',
    caption: 'Opening of the new legislative session',
  },
  {
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80',
    tag: 'Voting',
    title: 'Voting lobby',
    caption: 'Roll-call division in progress',
  },
];

const Layout = () => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const openLightbox = (id) => setLightbox(id);
  const stepLightbox = (dir) =>
    setLightbox((cur) => (cur + dir + GALLERY.length) % GALLERY.length);

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
            <NavLink to="/public/petitions" className={({ isActive }) => (isActive ? 'active' : '')}>
              Petitions
            </NavLink>
            <NavLink to="/public/ideas" className={({ isActive }) => (isActive ? 'active' : '')}>
              Ideas &amp; requests
            </NavLink>
          </nav>

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GlobalSearch pathPrefix="/public" />

            <ThemeToggle />

            <Link
              to="/internal/signin"
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
        <Outlet />
      </main>

      {/* SITE FOOTER */}
      <footer className="public-site-footer">
        <div className="public-footer-inner">
          <div>National Assembly Public Portal — an open record of legislative business.</div>
          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              className="footer-gallery-btn"
              onClick={() => setGalleryOpen(true)}
            >
              <Camera size={13} /> Gallery
            </button>
            <a href="#" onClick={(e) => e.preventDefault()}>Accessibility</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Open data</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Contact the Clerk's office</a>
            <Link to="/" style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <LogIn size={13} /> Staff &amp; Government Portal
            </Link>
          </div>
        </div>
      </footer>

      {galleryOpen && (
        <div className="gallery-modal" onClick={() => setGalleryOpen(false)}>
          <button
            type="button"
            className="gallery-lightbox-close"
            onClick={() => setGalleryOpen(false)}
            aria-label="Close gallery"
          >
            <X size={20} />
          </button>
          <div className="gallery-modal-inner" onClick={(e) => e.stopPropagation()}>
            <div className="footer-gallery-head">
              <div>
                <span className="gov-offer-eyebrow">Media</span>
                <h3>Parliament in pictures</h3>
              </div>
              <p>Moments from the Chamber, committees, and the corridors of the Assembly.</p>
            </div>
            <div className="gallery-modal-grid">
              {GALLERY.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="gallery-item"
                  onClick={() => openLightbox(idx)}
                  aria-label={`View photo: ${item.title}`}
                >
                  <img src={item.url} alt={item.title} loading="lazy" />
                  <span className="gallery-tag">{item.tag}</span>
                  <span className="gallery-item-caption">
                    <b>{item.title}</b>
                    <span>{item.caption}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {lightbox !== null && (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)}>
          <button
            type="button"
            className="gallery-lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <button
            type="button"
            className="gallery-lightbox-nav prev"
            onClick={(e) => { e.stopPropagation(); stepLightbox(-1); }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={20} />
          </button>

          <figure className="gallery-lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img src={GALLERY[lightbox].url} alt={GALLERY[lightbox].title} />
            <figcaption>
              <span className="gallery-tag">{GALLERY[lightbox].tag}</span>
              <b>{GALLERY[lightbox].title}</b>
              <span>{GALLERY[lightbox].caption}</span>
              <em>{lightbox + 1} / {GALLERY.length}</em>
            </figcaption>
          </figure>

          <button
            type="button"
            className="gallery-lightbox-nav next"
            onClick={(e) => { e.stopPropagation(); stepLightbox(1); }}
            aria-label="Next photo"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Layout;
