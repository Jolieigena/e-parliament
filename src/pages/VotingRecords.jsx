import { Link } from 'react-router-dom';
import { Vote, CheckCircle2, XCircle, Clock, Inbox, Calendar, ArrowRight } from 'lucide-react';
import { useApp } from '../mock/store';
import { categoryIcon } from '../mock/categoryMeta';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import VoteBar from '../components/ui/VoteBar';

const RESULT_META = {
  Passed: { tone: 'success', icon: CheckCircle2 },
  Rejected: { tone: 'error', icon: XCircle },
  'In progress': { tone: 'warning', icon: Clock },
};

function resultOf(bill) {
  if (bill.stage === 'Voting') return 'In progress';
  if (bill.stage === 'Rejected') return 'Rejected';
  if (['Assent', 'Enacted'].includes(bill.stage)) return 'Passed';
  return bill.votes.aye > bill.votes.nay ? 'Passed' : 'Rejected';
}

function votingDateOf(bill) {
  const entry = [...bill.history].reverse().find((h) => h.stage === 'Voting');
  return entry?.date || bill.history[bill.history.length - 1]?.date;
}

const VotingRecords = () => {
  const { bills } = useApp();
  const records = bills
    .filter((b) => b.votes.aye + b.votes.nay + b.votes.abstain > 0)
    .map((b) => ({ bill: b, date: votingDateOf(b), result: resultOf(b) }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {records.length > 0 ? (
        records.map(({ bill, date, result }) => {
          const CategoryIcon = categoryIcon(bill.category);
          const { tone, icon } = RESULT_META[result];
          const totalVotes = bill.votes.aye + bill.votes.nay + bill.votes.abstain;

          return (
            <Link 
              to={`/internal/bills/${bill.id}`} 
              key={bill.id} 
              className="ui-card dash-section voting-record-card"
              style={{ display: 'block', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              <div className="dash-section-header" style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CategoryIcon size={18} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-strong)' }}>
                      {bill.title}
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                      <Calendar size={12} /> Division held on {date} · {totalVotes} MPs Voted
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Badge tone={tone} icon={icon}>{result}</Badge>
                </div>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <VoteBar votes={bill.votes} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.35rem', marginTop: '0.85rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>
                <span>View Full Division Details</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          );
        })
      ) : (
        <div className="ui-card dash-section">
          <p className="dash-empty-state"><Inbox size={15} /> No divisions have been called yet.</p>
        </div>
      )}
    </div>
  );
};

export default VotingRecords;
