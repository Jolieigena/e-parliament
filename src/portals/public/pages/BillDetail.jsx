import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, XCircle, FilePenLine, History, FileText } from 'lucide-react';
import { useApp } from '../../../mock/store';
import { STAGE_META } from '../../../mock/stageMeta';
import { categoryIcon } from '../../../mock/categoryMeta';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import StageBadge from '../../../components/ui/StageBadge';
import VoteBar from '../../../components/ui/VoteBar';
import Lifecycle from '../../../components/ui/Lifecycle';
import Hemicycle from '../../../components/ui/Hemicycle';

const AMENDMENT_STATUS_ICONS = {
  Pending: Clock,
  Accepted: CheckCircle2,
  Rejected: XCircle,
};

const BillDetail = () => {
  const { billId } = useParams();
  const { bills, members, institutions } = useApp();

  const bill = bills.find((b) => b.id === billId);
  if (!bill) return <Navigate to="/public/bills" replace />;

  const isGovBill = bill.sponsorType === 'Government';
  const sponsor = isGovBill ? null : members.find((m) => m.id === bill.sponsorId);
  const sponsoringInstitution = isGovBill ? institutions.find((i) => i.id === bill.institutionId) : null;
  const CategoryIcon = categoryIcon(bill.category);
  const mps = members.filter((m) => m.roles.includes('MP'));

  return (
    <div>
      <Link to="/public/bills" className="dash-back-link">
        <ArrowLeft size={15} /> Back to bills
      </Link>

      <div className="bill-detail-header">
        <div>
          <span className="bill-row-category"><CategoryIcon size={12} /> {bill.category}</span>
          <h1 className="portal-page-title" style={{ marginTop: '0.35rem' }}>{bill.title}</h1>
          <p className="bill-row-meta">
            Sponsored by {isGovBill ? sponsoringInstitution?.name || 'Government' : sponsor?.name}
            {bill.committee ? ` · ${bill.committee}` : ''}
          </p>
        </div>
        <StageBadge stage={bill.stage} />
      </div>

      <Card className="dash-section">
        <Lifecycle stage={bill.stage} />
      </Card>

      <Card className="dash-section">
        <div className="dash-section-header">
          <h2 style={{ marginBottom: 0 }}>Summary</h2>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => alert('Full document viewer not implemented in prototype.')}>
            <FileText size={14} /> View full document
          </button>
        </div>
        <p className="bill-description" style={{ marginTop: '1rem' }}>{bill.summary}</p>
      </Card>

      {(bill.stage === 'Voting' || (bill.votes && (bill.votes.aye + bill.votes.nay + bill.votes.abstain > 0))) && (
        <Card className="dash-section">
          <h2 style={{ marginBottom: '1rem' }}>Vote tally &amp; Chamber Map</h2>
          <VoteBar votes={bill.votes} />
          <div style={{ marginTop: '1rem' }}>
            <Hemicycle members={mps} voters={bill.voters} />
          </div>
        </Card>
      )}

      {bill.amendments.length > 0 && (
        <Card className="dash-section">
          <h2 style={{ marginBottom: '1rem' }}>Amendments</h2>
          <ul className="agenda-list">
            {bill.amendments.map((am) => (
              <li key={am.id} className="agenda-row">
                <span className="row-title-with-icon">
                  <FilePenLine size={14} />
                  <span>{am.title} — {members.find((m) => m.id === am.proposerId)?.name}</span>
                </span>
                <Badge tone="neutral" icon={AMENDMENT_STATUS_ICONS[am.status]}>{am.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="dash-section">
        <h2 style={{ marginBottom: '1rem' }}>History</h2>
        <ul className="timeline">
          {bill.history.map((h, i) => {
            const StageIcon = STAGE_META[h.stage]?.icon || History;
            return (
              <li key={i}>
                <div className="timeline-dot"><StageIcon size={9} /></div>
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

export default BillDetail;
