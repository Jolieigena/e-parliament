import { Link } from 'react-router-dom';
import { FileText, Users2, Vote, BadgeCheck, ArrowRight, Inbox, Megaphone, Radio, CalendarDays, Gavel } from 'lucide-react';
import { useApp } from '../../../mock/store';
import { seedUpcomingSittings } from '../../../mock/entities';
import Card from '../../../components/ui/Card';
import BillRow from '../../../components/ui/BillRow';
import Hemicycle from '../../../components/ui/Hemicycle';
import VoteBar from '../../../components/ui/VoteBar';

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

const SuperuserDashboard = () => {
  const { currentUser, bills, session, members, petitions } = useApp();

  const counts = {
    total: bills.length,
    committee: bills.filter((b) => b.stage === 'Committee Review').length,
    active: bills.filter((b) => ['Debate', 'Voting'].includes(b.stage)).length,
    enacted: bills.filter((b) => b.stage === 'Enacted').length,
  };

  const mps = members.filter((m) => m.roles.includes('MP'));

  const onFloorToday = session.orderPaper
    .map((item) => bills.find((b) => b.id === item.billId))
    .filter(Boolean);

  const votingBill = bills.find((b) => b.stage === 'Voting');

  const awaitingVerification = bills.filter((b) => b.stage === 'Draft');
  const petitionsToValidate = petitions.filter((p) => p.status === 'Submitted');

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
        <h1 className="portal-page-title" style={{ margin: 0 }}>Good day, {currentUser.name}</h1>
        <div className="portal-topbar-session" data-live={session.live} style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
          <Radio size={13} />
          {session.name} {session.live ? '· Live' : '· Adjourned'}
        </div>
      </div>
      <p className="portal-page-subtitle">Full Assembly Overview — MP, Chamber & Secretariat</p>

      <div className="stat-grid">
        <StatTile label="Total bills" value={counts.total} icon={FileText} />
        <StatTile label="In committee" value={counts.committee} icon={Users2} />
        <StatTile label="On the floor" value={counts.active} icon={Vote} />
        <StatTile label="Enacted" value={counts.enacted} icon={BadgeCheck} />
      </div>

      {session.live && votingBill && (
        <Card className="dash-section" style={{ borderLeft: '4px solid var(--error)', backgroundColor: 'var(--error-bg)' }}>
          <div className="dash-section-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '0.5rem' }}>
            <h2 style={{ color: 'var(--error)' }}><Vote size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: '0.5rem' }}/> Live Division: {votingBill.title}</h2>
            <Link to="/internal/session/live" className="btn btn-primary btn-sm" style={{ backgroundColor: 'var(--error)', borderColor: 'var(--error)', textDecoration: 'none' }}>
              Join sitting
            </Link>
          </div>
          <VoteBar votes={votingBill.votes} />
        </Card>
      )}

      <div className="dash-overview-grid" style={{ marginTop: '2rem' }}>
        <div>
          <Card className="dash-section">
            <div className="dash-section-header">
              <h2>{session.live ? "Today's Order Paper" : 'Next sitting — order of business'}</h2>
              <Link to="/internal/session" className="dash-section-link">
                {session.live ? 'Join sitting' : 'View sitting'} <ArrowRight size={14} />
              </Link>
            </div>
            {!session.live && (
              <p className="dash-footnote">
                {session.name} is adjourned. {session.date && <>Next sitting scheduled for {new Date(session.date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}.</>}
              </p>
            )}
            <ul className="timeline">
              {onFloorToday.map((bill, index) => (
                <li key={bill.id}>
                  <div className="timeline-dot" style={{ backgroundColor: session.live && bill.stage === 'Voting' ? 'var(--error)' : 'var(--accent)' }}></div>
                  <div style={{ width: '100%' }}>
                    <div className="timeline-stage" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Item {index + 1}</span>
                      {session.live && bill.stage === 'Voting' && <span style={{ color: 'var(--error)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>• Live Now</span>}
                    </div>
                    <p style={{ color: 'var(--text-strong)', fontWeight: 600, marginTop: '0.25rem' }}>{bill.title}</p>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Current stage: {bill.stage}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="dash-section">
            <div className="dash-section-header">
              <h2>Awaiting verification</h2>
              <Link to="/internal/bills" className="dash-section-link">
                All bills <ArrowRight size={14} />
              </Link>
            </div>
            {awaitingVerification.length === 0 ? (
              <p className="dash-empty-state"><Inbox size={15} /> No bills currently awaiting verification.</p>
            ) : (
              <ul className="dash-list">
                {awaitingVerification.map((bill) => (
                  <li key={bill.id}><BillRow bill={bill} /></li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div>
          <Card className="dash-section">
            <div className="dash-section-header">
              <h2>Chamber composition</h2>
            </div>
            <Hemicycle members={mps} />
          </Card>

          <Card className="dash-section">
            <div className="dash-section-header">
              <h2>Petitions to validate</h2>
              <Link to="/internal/petitions" className="dash-section-link">
                Manage <ArrowRight size={14} />
              </Link>
            </div>
            {petitionsToValidate.length === 0 ? (
              <p className="dash-empty-state"><Megaphone size={15} /> No petitions awaiting validation.</p>
            ) : (
              <ul className="agenda-list">
                {petitionsToValidate.slice(0, 4).map((p) => (
                  <li key={p.id} className="agenda-row">
                    <span className="row-title-with-icon">
                      <Megaphone size={14} />
                      <span>{p.title}</span>
                    </span>
                    <span className="committee-activity-meta">Submitted</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

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

      {session.live && votingBill && !mps.every((m) => votingBill.voters[m.id]) && (
        <Card className="dash-section">
          <div className="dash-section-header">
            <h2><Gavel size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: '0.5rem' }}/> Chamber tally</h2>
            <Link to={`/internal/bills/${votingBill.id}`} className="dash-section-link">
              Open bill <ArrowRight size={14} />
            </Link>
          </div>
          <VoteBar votes={votingBill.votes} />
        </Card>
      )}
    </div>
  );
};

export default SuperuserDashboard;
