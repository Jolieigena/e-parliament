import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, MapPin, ArrowRight, Play, Video, Ticket, Image } from 'lucide-react';
import { useApp } from '../../../mock/store';

const SESSIONS_LIST = [
  { d: '01', m: 'Aug', tag: 'Floor Debate', t: 'Ordinary Sitting — Floor Debate', s: 'Second reading: Infrastructure Budget 2026' },
  { d: '05', m: 'Aug', tag: 'Question Time', t: 'Ministerial Oral Answers', s: 'Public questions to the Minister of Finance regarding budget forecasts' },
  { d: '08', m: 'Aug', tag: 'Final Vote', t: 'Ordinary Sitting — Final Floor Vote', s: 'Third reading: Public Sector Pension Reform Bill' },
  { d: '12', m: 'Aug', tag: 'Joint Sitting', t: 'Special Joint Assembly Sitting', s: 'Address by visiting international parliamentary delegation' },
];

const PAST_SESSIONS_LIST = [
  { d: '28', m: 'Jul', tag: 'Floor Debate', t: 'First Reading — Health Act', s: 'Initial introduction and debate on the National Health Insurance Act amendment.' },
  { d: '22', m: 'Jul', tag: 'Committee', t: 'Finance Committee Hearing', s: 'Public testimony regarding the proposed 2026 infrastructure allocations.' },
  { d: '15', m: 'Jul', tag: 'Question Time', t: 'Prime Minister\'s Questions', s: 'Weekly oral answers session with the Prime Minister.' },
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

      {/* PAST SITTINGS ARCHIVE */}
      <div className="public-card" style={{ padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-strong)' }}>Past Sittings Archive</h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Watch on-demand recordings of previous assembly sessions.</p>
          </div>
        </div>

        <div className="sessions-list-grid">
          {PAST_SESSIONS_LIST.map((item, idx) => (
            <div key={idx} className="session-event-card" style={{ opacity: 0.85 }}>
              {/* DATE TILE */}
              <div className="session-date-tile" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <div className="day" style={{ color: 'var(--text-strong)' }}>{item.d}</div>
                <div className="month">{item.m}</div>
              </div>

              {/* EVENT CONTENT */}
              <div style={{ flex: 1 }}>
                <span className="public-stage-pill" style={{ marginBottom: '8px', fontSize: '10.5px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}>{item.tag}</span>
                <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-strong)' }}>{item.t}</h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 12px 0', lineHeight: 1.5 }}>{item.s}</p>
                <Link to="/public/sitting/live" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', paddingLeft: 0 }}>
                  <Video size={13} /> Watch recording
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VISITING THE PUBLIC GALLERY INFO BOX - REDESIGNED */}
      <div className="public-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexWrap: 'wrap', border: '1px solid var(--border)' }}>
        {/* Left Side: Editorial CTA */}
        <div style={{ flex: '1 1 350px', padding: '40px', background: 'var(--accent)', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '4px', background: 'rgba(255,255,255,0.15)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', alignSelf: 'flex-start' }}>
            <MapPin size={12} /> Assembly Square
          </div>
          <h3 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 12px 0', lineHeight: 1.2 }}>Attend the Chamber in Person</h3>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', margin: '0 0 28px 0', lineHeight: 1.6 }}>
            Witness democracy firsthand. The Public Gallery is open to all citizens during ordinary sittings. Reserve your seat ahead of high-interest debates.
          </p>
          <div>
            <Link to="/public/sitting" className="btn btn-primary" style={{ background: '#ffffff', color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, borderRadius: '100px', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
              <Ticket size={16} /> Request Gallery Access
            </Link>
          </div>
        </div>

        {/* Right Side: Logistical Info */}
        <div style={{ flex: '1.5 1 450px', padding: '40px', background: 'var(--surface)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-tint)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={18} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-strong)', marginBottom: '4px' }}>Gallery Hours</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Doors open exactly 1 hour before each sitting. Seating is on a first-come, first-served basis unless reserved.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-tint)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-strong)', marginBottom: '4px' }}>ID &amp; Security Protocol</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                A valid government-issued photo ID is required for entry. All bags are subject to airport-style security screening upon arrival.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-tint)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={18} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-strong)', marginBottom: '4px' }}>Chamber Entrance &amp; Accessibility</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Enter through Public Visitors Gate 4 at Assembly Square. The gallery is fully wheelchair accessible (assistance available on request).
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Sitting;
