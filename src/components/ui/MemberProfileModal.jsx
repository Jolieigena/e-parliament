import { X, Award, CheckCircle2, MapPin, Users2, FileText, Vote, Calendar, TrendingUp } from 'lucide-react';
import { PARTIES } from '../../mock/entities';
import { useApp } from '../../mock/store';
import Avatar from './Avatar';
import Badge from './Badge';

const MemberProfileModal = ({ member, onClose }) => {
  const { bills, committees } = useApp();
  if (!member) return null;

  const party = PARTIES.find((p) => p.id === member.party);
  const sponsoredBills = bills.filter((b) => b.sponsorId === member.id);

  // Mock calculated metrics for MP loyalty and attendance
  const loyaltyRate = member.party === 'independent' ? 'N/A' : '95.8%';
  const attendanceRate = '94.2%';

  // Extract recent votes cast by this MP
  const recentVotes = bills
    .filter((b) => b.voters && b.voters[member.id])
    .map((b) => ({
      billId: b.id,
      billTitle: b.title,
      choice: b.voters[member.id],
      date: b.history[b.history.length - 1]?.date || 'Recent'
    }));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '680px',
        maxHeight: '88vh',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* MODAL HEADER */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Avatar name={member.name} size={42} />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-strong)' }}>
                {member.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                {party && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '12px', background: `${party.color}22`, color: party.color }}>
                    {party.name}
                  </span>
                )}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={12} /> {member.constituency || 'National Listing'}
                </span>
              </div>
            </div>
          </div>

          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* STATS TILES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.06)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                Voting Loyalty
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-strong)' }}>
                {loyaltyRate}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Party alignment rate</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--success)', marginBottom: '0.25rem' }}>
                Sitting Attendance
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-strong)' }}>
                {attendanceRate}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Floor sittings attended</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#8B5CF6', marginBottom: '0.25rem' }}>
                Bills Sponsored
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-strong)' }}>
                {sponsoredBills.length}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Legislation introduced</div>
            </div>
          </div>

          {/* COMMITTEE ROLES */}
          <div>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
              Committee Positions ({member.committees.length})
            </h4>
            {member.committees.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {member.committees.map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users2 size={15} color="var(--primary)" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-strong)' }}>{c.name}</span>
                    </div>
                    <Badge tone={c.role === 'Chair' ? 'info' : 'neutral'}>{c.role}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No committee assignments.</div>
            )}
          </div>

          {/* RECENT DIVISION VOTES CAST */}
          <div>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
              Recent Division Votes Cast
            </h4>
            {recentVotes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {recentVotes.map((v, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                      <Vote size={15} color="var(--text-muted)" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-strong)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {v.billTitle}
                      </span>
                    </div>
                    <Badge tone={v.choice === 'aye' ? 'success' : v.choice === 'nay' ? 'error' : 'warning'}>
                      {v.choice.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No recent votes recorded in system.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfileModal;
