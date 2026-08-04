import { Link } from 'react-router-dom';
import { FileText, Users2, Vote, BadgeCheck, ArrowRight, Inbox, CalendarDays, Radio } from 'lucide-react';
import { useApp } from '../../../mock/store';
import { seedUpcomingSittings } from '../../../mock/entities';
import Card from '../../../components/ui/Card';
import BillRow from '../../../components/ui/BillRow';

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

const ClerkDashboard = () => {
  const { currentUser, bills, session } = useApp();

  const counts = {
    total: bills.length,
    committee: bills.filter((b) => b.stage === 'Committee Review').length,
    active: bills.filter((b) => ['Debate', 'Voting'].includes(b.stage)).length,
    enacted: bills.filter((b) => b.stage === 'Enacted').length,
  };

  const awaitingVerification = bills.filter((b) => b.stage === 'Draft');

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
        <h1 className="portal-page-title" style={{ margin: 0 }}>Good day, {currentUser.name}</h1>
        <div className="portal-topbar-session" data-live={session.live} style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
          <Radio size={13} />
          {session.name} {session.live ? '· Live' : '· Adjourned'}
        </div>
      </div>
      <p className="portal-page-subtitle">Action Inbox & Secretariat Tasks</p>

      <div className="stat-grid">
        <StatTile label="Total bills" value={counts.total} icon={FileText} />
        <StatTile label="In committee" value={counts.committee} icon={Users2} />
        <StatTile label="On the floor" value={counts.active} icon={Vote} />
        <StatTile label="Enacted" value={counts.enacted} icon={BadgeCheck} />
      </div>

      <div className="dash-overview-grid">
        <div>
          <Card className="dash-section">
            <div className="dash-section-header">
              <h2>Awaiting verification</h2>
            </div>
            <ul className="dash-list">
              {awaitingVerification.map((bill) => (
                <li key={bill.id}><BillRow bill={bill} /></li>
              ))}
            </ul>
            {awaitingVerification.length === 0 && (
              <p className="dash-empty-state"><Inbox size={15} /> No bills currently awaiting verification.</p>
            )}
          </Card>
        </div>
        <div>
          <Card className="dash-section">
            <div className="dash-section-header">
              <h2>Upcoming sittings</h2>
            </div>
            <ul className="timeline">
              {seedUpcomingSittings.map((s) => (
                <li key={s.id}>
                  <div className="timeline-dot"><CalendarDays size={9} /></div>
                  <div>
                    <div className="timeline-stage">{s.title} <span className="timeline-date">{s.date}</span></div>
                    <p>{s.type} sitting</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClerkDashboard;
