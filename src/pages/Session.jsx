import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Video, Radio } from 'lucide-react';
import { useApp } from '../mock/store';
import { categoryIcon } from '../mock/categoryMeta';
import Card from '../components/ui/Card';
import StageBadge from '../components/ui/StageBadge';
import VoteBar from '../components/ui/VoteBar';

const Session = () => {
  const { session, bills, currentUser, advanceOrderPaper } = useApp();
  const role = currentUser.roles[0];

  const orderPaperBills = session.orderPaper.map((item, i) => ({
    ...item,
    bill: bills.find((b) => b.id === item.billId),
    index: i,
  }));

  const current = orderPaperBills[session.currentItemIndex];
  const isLastItem = session.currentItemIndex >= session.orderPaper.length - 1;

  return (
    <div>
      <div className="dash-section-header" style={{ marginBottom: '0.35rem' }}>
        <h1 className="portal-page-title" style={{ marginBottom: 0 }}>
          <span className="page-title-icon-wrap"><Radio size={20} /></span> {session.name}
        </h1>
        {session.live && (
          <Link to="/internal/session/live" className="btn btn-primary btn-sm">
            <Video size={16} /> Join sitting
          </Link>
        )}
      </div>
      <p className="portal-page-subtitle">
        {session.live ? 'This sitting is currently live.' : 'This sitting has been adjourned.'}
      </p>

      {current?.bill && (
        <Card className="dash-section">
          <div className="session-current-eyebrow">Current order paper item</div>
          <div className="dash-section-header">
            <h2>{current.item}</h2>
            <StageBadge stage={current.bill.stage} />
          </div>
          <p className="bill-row-meta" style={{ marginBottom: '1rem' }}>{current.bill.title}</p>

          {current.bill.stage === 'Voting' && (
            <div style={{ marginBottom: '1rem' }}>
              <VoteBar votes={current.bill.votes} />
            </div>
          )}

          <div className="session-current-actions">
            <Link to={`/internal/bills/${current.bill.id}`} className="dash-section-link">
              {role === 'MP' && current.bill.stage === 'Voting' ? 'Cast your vote' : 'View bill'} <ArrowRight size={14} />
            </Link>
            {role === 'Speaker' && !isLastItem && (
              <button type="button" className="btn btn-secondary btn-sm" onClick={advanceOrderPaper}>
                Advance to next item <ChevronRight size={15} />
              </button>
            )}
          </div>
        </Card>
      )}

      <Card className="dash-section">
        <h2 style={{ marginBottom: '1rem' }}>Order paper</h2>
        <ul className="agenda-list">
          {orderPaperBills.map(({ item, bill, index }) => {
            const CategoryIcon = bill ? categoryIcon(bill.category) : null;
            const rowClass = `agenda-row${index === session.currentItemIndex ? ' agenda-active' : ''}`;
            const content = (
              <>
                <span className="row-title-with-icon">
                  {CategoryIcon && <CategoryIcon size={14} />}
                  <span>{index + 1}. {item}</span>
                </span>
                {bill && <StageBadge stage={bill.stage} />}
              </>
            );
            return (
              <li key={item + index}>
                {bill ? (
                  <Link to={`/internal/bills/${bill.id}`} className={rowClass}>
                    {content}
                  </Link>
                ) : (
                  <div className={rowClass}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
};

export default Session;
