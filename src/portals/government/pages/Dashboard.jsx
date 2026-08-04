import { Link } from 'react-router-dom';
import {
  ShieldQuestion,
  Users2,
  FileText,
  FileStack,
  ArrowRight,
  Clock,
  CheckCircle2,
  ArrowDownToLine,
  ArrowUpFromLine,
  Inbox,
} from 'lucide-react';
import { useApp } from '../../../mock/store';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import BillRow from '../../../components/ui/BillRow';

const STATUS_ICONS = { Pending: Clock, Invited: Clock, Responded: CheckCircle2 };

const StatTile = ({ label, value, icon: Icon }) => (
  <Card className="stat-tile">
    <div className="stat-tile-icon">
      <Icon size={18} />
    </div>
    <div>
      <div className="stat-tile-value">{value}</div>
      <div className="stat-tile-label">{label}</div>
    </div>
  </Card>
);

const Dashboard = () => {
  const { currentGovUser, bills, oversightRequests, committeeRequests, documents } = useApp();
  const institutionId = currentGovUser.institutionId;

  const myOversight = oversightRequests.filter((r) => r.institutionId === institutionId);
  const myCommitteeRequests = committeeRequests.filter((r) => r.institutionId === institutionId);
  const myBills = bills.filter((b) => b.institutionId === institutionId);
  const myDocuments = documents.filter((d) => d.institutionId === institutionId);

  const pendingOversight = myOversight.filter((r) => r.status === 'Pending');
  const pendingCommitteeRequests = myCommitteeRequests.filter((r) => r.status === 'Invited');
  const recentDocuments = [...myDocuments].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);

  return (
    <div>
      <p className="portal-page-subtitle">Track and respond to matters involving your institution.</p>

      <div className="stat-grid">
        <StatTile label="Pending oversight" value={pendingOversight.length} icon={ShieldQuestion} />
        <StatTile label="Pending committee requests" value={pendingCommitteeRequests.length} icon={Users2} />
        <StatTile label="Bills sponsored" value={myBills.length} icon={FileText} />
        <StatTile label="Documents exchanged" value={myDocuments.length} icon={FileStack} />
      </div>

      <Card className="dash-section">
        <div className="dash-section-header">
          <h2>Oversight requests</h2>
          <Link to="/government/oversight" className="dash-section-link">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {myOversight.length > 0 ? (
          <ul className="agenda-list">
            {myOversight.slice(0, 3).map((r) => (
              <li key={r.id} className="agenda-row">
                <span className="row-title-with-icon">
                  <ShieldQuestion size={14} /> <span>{r.subject}</span>
                </span>
                <Badge tone={r.status === 'Responded' ? 'success' : 'warning'} icon={STATUS_ICONS[r.status]}>{r.status}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dash-empty-state"><Inbox size={15} /> No oversight requests at this time.</p>
        )}
      </Card>

      <Card className="dash-section">
        <div className="dash-section-header">
          <h2>Committee requests</h2>
          <Link to="/government/committee-requests" className="dash-section-link">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {myCommitteeRequests.length > 0 ? (
          <ul className="agenda-list">
            {myCommitteeRequests.slice(0, 3).map((r) => (
              <li key={r.id} className="agenda-row">
                <span className="row-title-with-icon">
                  <Users2 size={14} /> <span>{r.committeeName} — {r.subject}</span>
                </span>
                <Badge tone={r.status === 'Responded' ? 'success' : 'warning'} icon={STATUS_ICONS[r.status]}>{r.status}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dash-empty-state"><Inbox size={15} /> No committee requests at this time.</p>
        )}
      </Card>

      <Card className="dash-section">
        <div className="dash-section-header">
          <h2>Your legislation</h2>
          <Link to="/government/legislation" className="dash-section-link">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {myBills.length > 0 ? (
          <ul className="dash-list">
            {myBills.map((bill) => (
              <li key={bill.id}><BillRow bill={bill} basePath="/government/legislation" /></li>
            ))}
          </ul>
        ) : (
          <p className="dash-empty-state"><Inbox size={15} /> No legislation submitted yet.</p>
        )}
      </Card>

      <Card className="dash-section">
        <div className="dash-section-header">
          <h2>Recent documents</h2>
          <Link to="/government/documents" className="dash-section-link">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {recentDocuments.length > 0 ? (
          <ul className="agenda-list">
            {recentDocuments.map((doc) => (
              <li key={doc.id} className="agenda-row">
                <span className="row-title-with-icon">
                  {doc.direction === 'inbound' ? <ArrowDownToLine size={14} /> : <ArrowUpFromLine size={14} />}
                  <span>{doc.subject}</span>
                </span>
                <Badge tone="neutral">{doc.date}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dash-empty-state"><Inbox size={15} /> No documents exchanged yet.</p>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
