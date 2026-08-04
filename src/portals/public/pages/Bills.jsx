import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useApp } from '../../../mock/store';

const BILL_TOPICS = ['All topics', 'Judiciary', 'Public Health', 'Budget', 'Education', 'Energy'];

const HOW_STEPS = [
  { t: '1. Introduced', d: "A member proposes the bill and it's formally read to the Assembly for the first time." },
  { t: '2. In committee', d: 'A specialist committee examines the bill in detail and can hear public and expert testimony.' },
  { t: '3. Debated', d: "The full Assembly debates the bill's principles in the second reading." },
  { t: '4. Final vote', d: 'Members vote clause-by-clause and on the bill as a whole in the third reading.' },
  { t: '5. Awaiting sign-off', d: 'A passed bill goes for formal sign-off before it can take effect.' },
  { t: '6. Now law', d: 'The bill is enacted and becomes part of the law of the land.' },
];

const Bills = () => {
  const { bills } = useApp();
  const [topic, setTopic] = useState('All topics');
  const [showSteps, setShowSteps] = useState(false);

  const filteredBills = bills.filter((b) => topic === 'All topics' || b.category.toLowerCase() === topic.toLowerCase());

  return (
    <div>
      <div className="public-card" style={{ marginBottom: '16px', padding: 0, overflow: 'hidden' }}>
        <button
          type="button"
          onClick={() => setShowSteps((s) => !s)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            width: '100%',
            padding: '14px 18px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span>
            <span style={{ display: 'block', fontSize: '14px', fontWeight: 700 }}>How a bill becomes law</span>
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Every bill passes through the same six stages before it can take effect.
            </span>
          </span>
          <ChevronDown
            size={16}
            style={{
              transform: showSteps ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.15s ease',
              flexShrink: 0,
              color: 'var(--text-muted)',
            }}
          />
        </button>
        {showSteps && (
          <div style={{ padding: '4px 4px 8px', borderTop: '1px solid var(--border)' }}>
            <div className="steps-rail">
              {HOW_STEPS.map((s, idx) => (
                <div key={idx} className="step-card">
                  <div className="step-num">{idx + 1}</div>
                  <h4>{s.t}</h4>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bills-topic-chips-bar">
        {BILL_TOPICS.map((t) => (
          <button
            key={t}
            type="button"
            className={`bills-topic-chip ${topic === t ? 'active' : ''}`}
            onClick={() => setTopic(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="public-bills-grid">
        {filteredBills.map((bill) => {
          const supportPct = Math.round(Math.min(100, Math.max(35, (bill.votes?.aye || 70) * 1.05)));

          return (
            <div key={bill.id} className="public-card public-bill-card">
              <div className="topic">{bill.category}</div>
              <h4>{bill.title}</h4>
              <div className="plain">{bill.summary}</div>
              <div className="public-stage-pill">{bill.stage}</div>

              <div className="support-meter">
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${supportPct}%` }} />
                </div>
                <div className="lbl">
                  <span>Public &amp; Chamber Support</span>
                  <span>{supportPct}%</span>
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
  );
};

export default Bills;
