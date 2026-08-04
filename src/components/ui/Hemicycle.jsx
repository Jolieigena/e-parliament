import { useMemo, useState } from 'react';
import { PARTIES } from '../../mock/entities';

const VOTE_COLORS = { aye: 'var(--success)', nay: 'var(--error)', abstain: 'var(--warning)' };
const NOT_VOTED_COLOR = 'var(--border)';

// Row sizes grow from the inner ring outward (an inner ring has less
// circumference, so it holds fewer seats) — proportions borrowed from the
// reference chamber diagram (10/14/18/22/26/30, summing to 120) and scaled
// to whatever the actual chamber size is.
const ROW_SHAPE = [10, 14, 18, 22, 26, 30];

function computeRowCounts(total) {
  const shapeSum = ROW_SHAPE.reduce((a, b) => a + b, 0);
  const rows = ROW_SHAPE.map((n) => Math.max(1, Math.round((n / shapeSum) * total)));
  rows[rows.length - 1] += total - rows.reduce((a, b) => a + b, 0);
  return rows;
}

// Each row is laid out across the full 180° arc independently, then every
// seat (across all rows) is sorted by angle so party colors — assigned by
// walking that flat, angle-sorted list in the same order as the party-sorted
// member list — land as contiguous wedges. This only reads cleanly once
// there are enough seats per row that the arc looks continuous rather than
// a handful of scattered points, which is why this only kicks in at full
// chamber size (see git history for the small-chamber single-arc variant).
function generateSeatLayout(total) {
  const cx = 320;
  const cyBase = 280;
  const rMin = 55;
  const rowGap = 34;
  const seats = [];
  computeRowCounts(total).forEach((count, rowIdx) => {
    const r = rMin + rowIdx * rowGap;
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const angle = Math.PI - t * Math.PI;
      seats.push({ x: cx + r * Math.cos(angle), y: cyBase - r * Math.sin(angle), angle });
    }
  });
  seats.sort((a, b) => b.angle - a.angle);
  return seats;
}

const partyIndex = (id) => PARTIES.findIndex((p) => p.id === id);

const Hemicycle = ({ members, voters }) => {
  const [mode, setMode] = useState(voters ? 'vote' : 'party');
  const [tooltip, setTooltip] = useState(null);

  const sortedMembers = useMemo(
    () => [...members].sort((a, b) => partyIndex(a.party) - partyIndex(b.party)),
    [members],
  );
  const seats = useMemo(() => generateSeatLayout(sortedMembers.length), [sortedMembers.length]);
  const partyCounts = useMemo(() => {
    const counts = new Map();
    members.forEach((m) => counts.set(m.party, (counts.get(m.party) || 0) + 1));
    return counts;
  }, [members]);

  const colorOf = (member) => {
    if (mode === 'vote') {
      const v = voters?.[member.id];
      return v ? VOTE_COLORS[v] : NOT_VOTED_COLOR;
    }
    return PARTIES.find((p) => p.id === member.party)?.color || '#9aa1ac';
  };

  const titleOf = (member) => {
    if (mode === 'vote') {
      const v = voters?.[member.id];
      return `${member.name} — ${v ? v.toUpperCase() : 'Not yet voted'}`;
    }
    return `${member.name} — ${PARTIES.find((p) => p.id === member.party)?.name || 'Independent'}`;
  };

  return (
    <div className="hemicycle-wrap">
      <div className="hemicycle-head">
        <div className="toggle-group" role="group" aria-label="Hemicycle coloring">
          <button type="button" className={mode === 'party' ? 'active' : ''} onClick={() => setMode('party')}>
            By party
          </button>
          <button type="button" className={mode === 'vote' ? 'active' : ''} onClick={() => setMode('vote')} disabled={!voters}>
            By vote
          </button>
        </div>
      </div>

      <svg viewBox="0 0 640 300" className="hemicycle-svg">
        {sortedMembers.map((m, i) => (
          <circle
            key={m.id}
            cx={seats[i].x}
            cy={seats[i].y}
            r={7}
            fill={colorOf(m)}
            onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY, text: titleOf(m) })}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </svg>

      {tooltip && (
        <div className="hemicycle-tooltip" style={{ left: tooltip.x + 14, top: tooltip.y + 10 }}>
          {tooltip.text}
        </div>
      )}

      <div className="hemicycle-legend">
        {mode === 'party' ? (
          PARTIES.map((p) => (
            <span key={p.id}><i style={{ background: p.color }} /> {p.name} ({partyCounts.get(p.id) || 0})</span>
          ))
        ) : (
          <>
            <span><i style={{ background: 'var(--success)' }} /> Aye</span>
            <span><i style={{ background: 'var(--error)' }} /> Nay</span>
            <span><i style={{ background: 'var(--warning)' }} /> Abstain</span>
            <span><i style={{ background: 'var(--border)' }} /> Not yet voted</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Hemicycle;
