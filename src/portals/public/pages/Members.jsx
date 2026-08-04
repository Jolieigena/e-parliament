import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Mail, Check, X, Send, Search, Sparkles, CheckCircle2, UserRound } from 'lucide-react';
import { useApp } from '../../../mock/store';
import { PARTIES } from '../../../mock/entities';

const PARTY_COLORS = {
  'Conservative Union': '#8C3B3B',
  'Progressive Alliance': '#3B6E8F',
  'Green Coalition': '#4C7A3A',
  'Liberal Democrats': '#B8862E',
  'Independent': '#64748B',
};

const PARTY_CHIPS = [
  { id: 'All parties', label: 'All MPs', count: 120, color: 'var(--accent)' },
  { id: 'Progressive Alliance', label: 'Progressive', count: 38, color: '#3B6E8F' },
  { id: 'Conservative Union', label: 'Conservative', count: 34, color: '#8C3B3B' },
  { id: 'Green Coalition', label: 'Green', count: 18, color: '#4C7A3A' },
  { id: 'Liberal Democrats', label: 'Liberal Dem.', count: 16, color: '#B8862E' },
  { id: 'Independent', label: 'Independent', count: 14, color: '#64748B' },
];

const MP_PHOTOS = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=256&q=80',
];

function getMpPhoto(mp, index) {
  if (mp.photoUrl) return mp.photoUrl;
  return MP_PHOTOS[index % MP_PHOTOS.length];
}

const Members = () => {
  const { members } = useApp();
  const { globalSearch } = useOutletContext() || { globalSearch: '' };
  const [search, setSearch] = useState('');
  const [partyFilter, setPartyFilter] = useState('All parties');
  const [activeMp, setActiveMp] = useState(null);
  const [activeMpIndex, setActiveMpIndex] = useState(0);
  const [messageText, setMessageText] = useState('');
  const [subjectText, setSubjectText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const query = (search || globalSearch).trim().toLowerCase();

  const mps = members.filter((m) => m.roles.includes('MP'));

  const filteredMps = mps.filter((m) => {
    const pName = PARTIES.find((p) => p.id === m.party)?.name || 'Independent';
    const matchesParty = partyFilter === 'All parties' || pName === partyFilter;
    const matchesSearch = !query || m.name.toLowerCase().includes(query) || (m.constituency && m.constituency.toLowerCase().includes(query));
    return matchesParty && matchesSearch;
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setMessageText('');
      setSubjectText('');
      setActiveMp(null);
    }, 2000);
  };

  return (
    <div>
      {/* PAGE HEADER */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-strong)' }}>
          Your Representatives (120 Members)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '65ch', margin: 0 }}>
          Search by representative name or constituency to inspect voting loyalty scores, attendance records, and send a direct message to their office.
        </p>
      </div>

      {/* PARTY CHIPS & SEARCH BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PARTY_CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className={`bills-topic-chip ${partyFilter === chip.id ? 'active' : ''}`}
              onClick={() => setPartyFilter(chip.id)}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: chip.color, display: 'inline-block' }} />
              <span>{chip.label}</span>
              <span style={{ opacity: 0.6, fontSize: '10.5px' }}>({chip.count})</span>
            </button>
          ))}
        </div>

        <div className="public-header-search" style={{ width: '260px' }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search name or constituency…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* MP CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
        {filteredMps.map((mp, idx) => {
          const partyObj = PARTIES.find((p) => p.id === mp.party);
          const pName = partyObj?.name || 'Independent';
          const pColor = PARTY_COLORS[pName] || '#64748B';
          const photo = getMpPhoto(mp, idx);
          const loyaltyPct = (92 + (idx % 7) * 1.1).toFixed(1);
          const attendancePct = (91 + (idx % 8) * 1.0).toFixed(1);

          return (
            <div
              key={mp.id}
              className="public-card"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '18px',
                border: '1px solid var(--border)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                  <img
                    src={photo}
                    alt={mp.name}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `2px solid ${pColor}`,
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-strong)' }}>{mp.name}</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {mp.constituency || 'National Representative'}
                    </div>
                    <span
                      style={{
                        background: `${pColor}22`,
                        color: pColor,
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '100px',
                        display: 'inline-block',
                        marginTop: '6px',
                      }}
                    >
                      {pName}
                    </span>
                  </div>
                </div>

                {/* STATS METRICS STRIP */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    background: 'var(--bg)',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    fontSize: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Voting Loyalty</div>
                    <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '13px' }}>{loyaltyPct}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Attendance</div>
                    <div style={{ fontWeight: 800, color: 'var(--text-strong)', fontSize: '13px' }}>{attendancePct}%</div>
                  </div>
                </div>
              </div>

              {/* DIRECT MESSAGE TRIGGER BUTTON */}
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  setActiveMp(mp);
                  setActiveMpIndex(idx);
                }}
              >
                <Mail size={13} /> Send Message to MP
              </button>
            </div>
          );
        })}
      </div>

      {/* REPRESENTATIVE CONTACT MODAL */}
      {activeMp && (
        <div className="modal-overlay" onClick={() => setActiveMp(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '28px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={getMpPhoto(activeMp, activeMpIndex)}
                  alt={activeMp.name}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `2px solid ${PARTY_COLORS[PARTIES.find((p) => p.id === activeMp.party)?.name] || 'var(--accent)'}`,
                  }}
                />
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-strong)' }}>{activeMp.name}</h3>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {activeMp.constituency || 'National Representative'} &middot; {PARTIES.find((p) => p.id === activeMp.party)?.name || 'Independent'}
                  </div>
                </div>
              </div>
              <button type="button" className="btn-icon" onClick={() => setActiveMp(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            {/* LEGISLATIVE RECORD & METRICS */}
            <div style={{ background: 'var(--bg)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border)', marginBottom: '20px', fontSize: '12px' }}>
              <div style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--text-strong)' }}>Voting Record &amp; Chamber Attendance</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Party Alignment:</span> <strong>95.8%</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Floor Attendance:</span> <strong>94.2%</strong>
                </div>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Recent Stances: Voted <strong>AYE</strong> on Digital Infrastructure Bill &middot; Voted <strong>AYE</strong> on Public Health Funding.
              </div>
            </div>

            {/* DIRECT MESSAGE FORM */}
            <form onSubmit={handleSendMessage}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-strong)' }}>
                  Message Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Question regarding Digital Infrastructure Bill…"
                  value={subjectText}
                  onChange={(e) => setSubjectText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text-strong)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-strong)' }}>
                  Your Message for {activeMp.name}
                </label>
                <textarea
                  rows={4}
                  placeholder="Write your constituent message or inquiry here…"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text-strong)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '13.5px' }}
                disabled={sentSuccess}
              >
                {sentSuccess ? (
                  <>
                    <Check size={16} /> Message Sent to MP Office!
                  </>
                ) : (
                  <>
                    <Send size={15} /> Send Message to MP
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
