import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, MapPin, ArrowRight, Play } from 'lucide-react';
import { useApp } from '../../../mock/store';

const SESSIONS_LIST = [
  { d: '01', m: 'Aug', tag: 'Floor Debate', t: 'Ordinary Sitting — Floor Debate', s: 'Second reading: Infrastructure Budget 2026' },
  { d: '05', m: 'Aug', tag: 'Question Time', t: 'Ministerial Oral Answers', s: 'Public questions to the Minister of Finance regarding budget forecasts' },
  { d: '08', m: 'Aug', tag: 'Final Vote', t: 'Ordinary Sitting — Final Floor Vote', s: 'Third reading: Public Sector Pension Reform Bill' },
  { d: '12', m: 'Aug', tag: 'Joint Sitting', t: 'Special Joint Assembly Sitting', s: 'Address by visiting international parliamentary delegation' },
];

const Sitting = () => {
  const { session } = useApp();

  return (
    <div>
      {/* LIVE BROADCAST CARD */}
      <div className="public-card" style={{ padding: '24px', marginBottom: '28px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', color: '#ef4444', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
              {session.live ? 'LIVE SITTING IN SESSION' : 'NEXT UPCOMING SITTING'}
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-strong)', margin: '0 0 4px 0' }}>
              {session.name || 'Sitting 104 — Ordinary Plenary Session'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              Current Floor Debate: Second Reading on Infrastructure Budget 2026 &middot; Presiding: Hon. S. Kamau
            </p>
          </div>

          <Link to="/public/sitting/live" className="btn btn-primary" style={{ textDecoration: 'none', padding: '12px 22px', fontSize: '13px' }}>
            <Play size={15} style={{ marginRight: '6px' }} /> Watch Live Broadcast (HD)
          </Link>
        </div>
      </div>

      {/* UPCOMING SITTINGS CALENDAR GRID */}
      <div className="public-card" style={{ padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-strong)' }}>Upcoming Assembly Sittings</h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Schedule of plenary debates and committee hearings open to the public.</p>
          </div>
        </div>

        <div className="sessions-list-grid">
          {SESSIONS_LIST.map((item, idx) => (
            <div key={idx} className="session-event-card">
              {/* DATE TILE */}
              <div className="session-date-tile">
                <div className="day">{item.d}</div>
                <div className="month">{item.m}</div>
              </div>

              {/* EVENT CONTENT */}
              <div style={{ flex: 1 }}>
                <span className="public-stage-pill" style={{ marginBottom: '8px', fontSize: '10.5px' }}>{item.tag}</span>
                <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-strong)' }}>{item.t}</h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 12px 0', lineHeight: 1.5 }}>{item.s}</p>
                <Link to="/public/sitting/live" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Watch stream <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VISITING THE PUBLIC GALLERY INFO BOX */}
      <div className="gallery-info-box">
        <div className="gallery-info-item">
          <div className="icon-circle">
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-strong)' }}>Gallery Hours</div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.5 }}>
              Doors open 1 hour before each sitting. Arrive early for high-interest debates.
            </div>
          </div>
        </div>

        <div className="gallery-info-item">
          <div className="icon-circle">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-strong)' }}>ID &amp; Security</div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.5 }}>
              Valid photo ID required for entry. Bags are subject to airport-style security screening.
            </div>
          </div>
        </div>

        <div className="gallery-info-item">
          <div className="icon-circle">
            <MapPin size={20} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-strong)' }}>Chamber Entrance</div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.5 }}>
              Public Visitors Gate 4, Assembly Square. Wheelchair accessible with assistance on request.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitting;
