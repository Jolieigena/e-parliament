import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useApp } from '../../../mock/store';

const BILL_TOPICS = ['All topics', 'Finance', 'Health', 'Justice', 'Technology', 'Environment', 'Education'];

const Bills = () => {
  const { bills } = useApp();
  const { globalSearch } = useOutletContext() || { globalSearch: '' };
  const [search, setSearch] = useState('');
  const [topic, setTopic] = useState('All topics');

  const query = (search || globalSearch).trim().toLowerCase();

  const filteredBills = bills.filter((b) => {
    const matchesTopic = topic === 'All topics' || b.category.toLowerCase() === topic.toLowerCase();
    const matchesSearch = !query || b.title.toLowerCase().includes(query) || b.summary.toLowerCase().includes(query);
    return matchesTopic && matchesSearch;
  });

  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '6px' }}>What's being decided, in plain language</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', maxWidth: '65ch', marginBottom: '20px' }}>
        Every bill currently before the Assembly, what it means for you, and where it stands in the process.
      </p>

      <div className="public-filter-bar">
        <input
          type="text"
          placeholder="Search bills by title or topic…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          {BILL_TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
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
