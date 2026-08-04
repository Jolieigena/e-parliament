import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, CalendarCheck, CalendarClock, Building2, Users2, Crown, NotebookPen, User, Inbox } from 'lucide-react';
import { useApp } from '../../../mock/store';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Avatar from '../../../components/ui/Avatar';
import BillRow from '../../../components/ui/BillRow';

const ROLE_ORDER = { Chair: 0, 'Vice-Chair': 1, Secretary: 2, Member: 3 };
const COMMITTEE_ROLE_ICONS = { Chair: Crown, 'Vice-Chair': Users2, Secretary: NotebookPen, Member: User };

const CommitteeDetail = () => {
  const { committeeId } = useParams();
  const { committees, members, bills } = useApp();

  const committee = committees.find((c) => c.id === committeeId);
  if (!committee) return <Navigate to="/public/committees" replace />;

  const roster = members
    .map((m) => ({ member: m, entry: m.committees.find((c) => c.name === committee.name) }))
    .filter((r) => r.entry)
    .sort((a, b) => ROLE_ORDER[a.entry.role] - ROLE_ORDER[b.entry.role]);

  const referredBills = bills.filter((b) => b.committee === committee.name);

  return (
    <div>
      <Link to="/public/committees" className="dash-back-link">
        <ArrowLeft size={15} /> Back to committees
      </Link>

      <div className="bill-detail-header">
        <div>
          <Badge tone="neutral" icon={Building2}>{committee.type}</Badge>
          <h1 className="portal-page-title" style={{ marginTop: '0.35rem' }}>{committee.name}</h1>
        </div>
      </div>

      <Card className="dash-section">
        <h2 style={{ marginBottom: '0.75rem' }}>Mandate</h2>
        <p className="bill-description">{committee.mandate}</p>
      </Card>

      <Card className="dash-section">
        <h2 style={{ marginBottom: '1rem' }}>Members ({roster.length})</h2>
        <ul className="roster-list">
          {roster.map(({ member, entry }) => (
            <li key={member.id}>
              <Avatar name={member.name} size={32} />
              <span className="roster-name">{member.name}</span>
              <Badge tone={entry.role === 'Chair' ? 'info' : 'neutral'} icon={COMMITTEE_ROLE_ICONS[entry.role]}>{entry.role}</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="dash-section">
        <h2 style={{ marginBottom: '1rem' }}>Referred bills ({referredBills.length})</h2>
        {referredBills.length > 0 ? (
          <ul className="dash-list">
            {referredBills.map((bill) => (
              <li key={bill.id}><BillRow bill={bill} basePath="/public/bills" /></li>
            ))}
          </ul>
        ) : (
          <p className="dash-empty-state"><Inbox size={15} /> No bills currently referred to this committee.</p>
        )}
      </Card>

      <Card className="dash-section">
        <h2 style={{ marginBottom: '1rem' }}>Meetings</h2>
        <ul className="timeline">
          {committee.meetings.map((m) => (
            <li key={m.id}>
              <div className={`timeline-dot ${m.status === 'Scheduled' ? 'is-scheduled' : ''}`} />
              <div style={{ flex: 1 }}>
                <div className="timeline-stage">
                  {m.agenda} <span className="timeline-date">{m.date}</span>
                </div>
                <p>{m.note || (m.status === 'Scheduled' ? 'Meeting not yet held.' : '')}</p>
              </div>
              <Badge tone={m.status === 'Held' ? 'success' : 'warning'} icon={m.status === 'Held' ? CalendarCheck : CalendarClock}>
                {m.status}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default CommitteeDetail;
