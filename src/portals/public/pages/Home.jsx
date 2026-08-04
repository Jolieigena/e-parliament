import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, UserRound, FileText, Video, Play, Volume2, PenTool } from 'lucide-react';
import { useApp } from '../../../mock/store';

const MP_HERO_PHOTOS = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
];

const Home = () => {
  const { bills, session } = useApp();

  return (
    <div>
      {/* BALANCED 2-COLUMN LUXURY HERO SECTION */}
      <div className="editorial-hero-container">
        <div className="editorial-hero-bg" />
        <div className="editorial-hero-overlay" />

        {/* HERO BODY */}
        <div className="editorial-hero-body">
          {/* LEFT EDITORIAL COPY */}
          <div>
            <h1 className="editorial-title">
              The Democratic Assembly
            </h1>
            <p className="editorial-lede">
              Track bills in plain language, inspect representative voting records, watch live chamber hearings, and submit e-petitions on issues that matter to you.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/public/bills" className="editorial-capsule-btn">
                Explore Bills <ArrowRight size={14} />
              </Link>

              <Link to="/public/members" className="editorial-capsule-btn" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                <UserRound size={14} /> Find your MP
              </Link>
            </div>
          </div>

          {/* RIGHT LIVE BROADCAST CHAMBER CARD */}
          <div className="hero-live-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="live-badge">
                <span className="pulse-dot" /> LIVE SITTING IN SESSION
              </div>
              <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Plenary Floor</span>
            </div>

            <div className="player-preview">
              <div className="player-overlay">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', background: 'rgba(15,23,42,0.6)', padding: '3px 8px', borderRadius: '4px', color: '#fff', fontWeight: 600 }}>
                    HD Broadcast 1080p
                  </span>
                  <Volume2 size={16} color="#fff" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Link to="/public/sitting/live" className="play-icon-circle">
                    <Play size={20} style={{ marginLeft: '3px' }} />
                  </Link>
                </div>
                <div style={{ fontSize: '11.5px', color: '#fff', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                  {session.name || 'Ordinary Sitting — Floor Debate'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#fff' }}>Current Business: Digital Infrastructure Bill</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '2px' }}>Hon. S. Kamau (Speaker presiding)</div>
              </div>
              <Link to="/public/sitting/live" className="btn btn-primary btn-sm" style={{ textDecoration: 'none', whiteSpace: 'nowrap', fontSize: '11.5px' }}>
                Watch Live Stream
              </Link>
            </div>
          </div>
        </div>

        {/* FROSTED GLASS STAT PILLS */}
        <div className="editorial-bottom-bar">
          <div className="editorial-bottom-card">
            <div style={{ display: 'flex', flexShrink: 0 }}>
              {MP_HERO_PHOTOS.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="MP Avatar"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #ffffff',
                    marginLeft: idx > 0 ? '-12px' : 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                />
              ))}
            </div>
            <div>
              <div className="card-title">120 Members of Parliament</div>
              <div className="card-desc">Representing 12M+ Citizens across 5 Parliamentary Parties</div>
            </div>
          </div>

          <div className="editorial-bottom-card">
            <ShieldCheck size={24} color="#a5b4fc" style={{ flexShrink: 0 }} />
            <div>
              <div className="card-title">100% Open Data &amp; Verified Records</div>
              <div className="card-desc">Publicly accessible legislation &amp; roll-call votes</div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTION FEATURE HUB */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', margin: '36px 0' }}>
        <Link to="/public/bills" className="public-card" style={{ padding: '22px', textDecoration: 'none', display: 'flex', gap: '14px', alignItems: 'center', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--accent-tint)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-strong)' }}>Track Legislation</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Plain-language bill summaries</div>
          </div>
        </Link>

        <Link to="/public/members" className="public-card" style={{ padding: '22px', textDecoration: 'none', display: 'flex', gap: '14px', alignItems: 'center', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--accent-tint)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserRound size={22} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-strong)' }}>Find Your MP</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Search &amp; message your representative</div>
          </div>
        </Link>

        <Link to="/public/sitting" className="public-card" style={{ padding: '22px', textDecoration: 'none', display: 'flex', gap: '14px', alignItems: 'center', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--accent-tint)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Video size={22} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-strong)' }}>Watch Sittings</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Live broadcast &amp; gallery visits</div>
          </div>
        </Link>

        <Link to="/public/petitions" className="public-card" style={{ padding: '22px', textDecoration: 'none', display: 'flex', gap: '14px', alignItems: 'center', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--accent-tint)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PenTool size={22} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-strong)' }}>Sign Petitions</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Have your say on key issues</div>
          </div>
        </Link>
      </div>

      {/* TODAY AT THE ASSEMBLY */}
      <div style={{ margin: '44px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
          <div>
            <h2>Today at the Assembly</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '4px 0 0' }}>
              What's being debated and decided this week, explained simply.
            </p>
          </div>
        </div>

        <div className="agenda-grid">
          <div className="public-card agenda-card">
            <span className="tag">Second reading</span>
            <h4>Digital Infrastructure Bill</h4>
            <p>Debate on funding high-speed rural broadband for unconnected municipalities.</p>
          </div>

          <div className="public-card agenda-card">
            <span className="tag">Question time</span>
            <h4>Ministerial Oral Answers</h4>
            <p>Public questioning session directed at the Minister of Finance regarding budget forecasts.</p>
          </div>

          <div className="public-card agenda-card">
            <span className="tag">Third reading</span>
            <h4>Public Health Funding Amendment</h4>
            <p>Final floor vote on expanding mental health funding and community clinic staffing.</p>
          </div>
        </div>
      </div>

      {/* BILLS BEFORE PARLIAMENT */}
      <div style={{ margin: '44px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
          <div>
            <h2>Bills before parliament</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '4px 0 0' }}>
              The legislation moving through the Assembly right now.
            </p>
          </div>
          <Link to="/public/bills" className="dash-section-link">
            See all bills &rarr;
          </Link>
        </div>

        <div className="public-bills-grid">
          {bills.slice(0, 3).map((bill) => {
            const rawSupport = Math.min(100, Math.max(30, (bill.votes?.aye || 65) * 1.1));
            const roundedSupport = Math.round(rawSupport);

            return (
              <div key={bill.id} className="public-card public-bill-card">
                <div className="topic">{bill.category}</div>
                <h4>{bill.title}</h4>
                <div className="plain">{bill.summary}</div>
                <div className="public-stage-pill">{bill.stage}</div>

                <div className="support-meter">
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${roundedSupport}%` }} />
                  </div>
                  <div className="lbl">
                    <span>Public &amp; Chamber Support</span>
                    <span>{roundedSupport}%</span>
                  </div>
                </div>

                <div className="bill-actions">
                  <Link to={`/public/bills/${bill.id}`} className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                    Read summary
                  </Link>
                  <Link to="/public/members" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                    Contact your MP
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
