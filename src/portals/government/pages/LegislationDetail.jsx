import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../../mock/store';
import { STAGE_META } from '../../../mock/stageMeta';
import { categoryIcon } from '../../../mock/categoryMeta';
import Card from '../../../components/ui/Card';
import StageBadge from '../../../components/ui/StageBadge';
import Lifecycle from '../../../components/ui/Lifecycle';

const LegislationDetail = () => {
  const { billId } = useParams();
  const { bills, currentGovUser } = useApp();

  const bill = bills.find((b) => b.id === billId);
  if (!bill || bill.institutionId !== currentGovUser.institutionId) {
    return <Navigate to="/government/legislation" replace />;
  }

  const CategoryIcon = categoryIcon(bill.category);

  return (
    <div>
      <Link to="/government/legislation" className="dash-back-link">
        <ArrowLeft size={15} /> Back to legislation
      </Link>

      <div className="bill-detail-header">
        <div>
          <span className="bill-row-category"><CategoryIcon size={12} /> {bill.category}</span>
          <h1 className="portal-page-title" style={{ marginTop: '0.35rem' }}>{bill.title}</h1>
          <p className="bill-row-meta">Submitted to Parliament{bill.committee ? ` · ${bill.committee}` : ''}</p>
        </div>
        <StageBadge stage={bill.stage} />
      </div>

      <Card className="dash-section">
        <Lifecycle stage={bill.stage} />
      </Card>

      <Card className="dash-section">
        <h2 style={{ marginBottom: '0.75rem' }}>Summary</h2>
        <p className="bill-description">{bill.summary}</p>
      </Card>

      <Card className="dash-section">
        <h2 style={{ marginBottom: '1rem' }}>History</h2>
        <ul className="timeline">
          {bill.history.map((h, i) => {
            const StageIcon = STAGE_META[h.stage]?.icon;
            return (
              <li key={i}>
                <div className="timeline-dot">{StageIcon && <StageIcon size={9} />}</div>
                <div>
                  <div className="timeline-stage">{h.stage} <span className="timeline-date">{h.date}</span></div>
                  <p>{h.note}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
};

export default LegislationDetail;
