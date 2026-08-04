import { Link } from 'react-router-dom';
import { ArrowRight, Inbox, Vote, CalendarDays, Users2, Radio } from 'lucide-react';
import { useApp } from '../../../mock/store';
import { seedUpcomingSittings } from '../../../mock/entities';
import Card from '../../../components/ui/Card';
import BillRow from '../../../components/ui/BillRow';

const nextScheduledMeeting = (committee) =>
  committee.meetings
    .filter((m) => m.status === 'Scheduled')
    .sort((a, b) => a.date.localeCompare(b.date))[0];

const chairOf = (committee, members) =>
  members.find((m) => m.committees.some((c) => c.name === committee.name && c.role === 'Chair'));

const MPDashboard = () => {
  const { currentUser, bills, session, members, committees } = useApp();

  const myBills = bills.filter((b) => b.sponsorId === currentUser.id);
  const onFloorToday = session.orderPaper
    .map((item) => bills.find((b) => b.id === item.billId))
    .filter(Boolean);
  
  const votingBill = bills.find((b) => b.stage === 'Voting');
  const needsMyVote = votingBill && !votingBill.voters[currentUser.id];

  const committeeActivity = committees
    .map((c) => ({ committee: c, next: nextScheduledMeeting(c), chair: chairOf(c, members) }))
    .filter((c) => c.next)
    .sort((a, b) => a.next.date.localeCompare(b.next.date))
    .slice(0, 4);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
        <h1 className="portal-page-title" style={{ margin: 0 }}>Good day, {currentUser.name}</h1>
        <div className="portal-topbar-session" data-live={session.live} style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
          <Radio size={13} />
          {session.name} {session.live ? '· Live' : '· Adjourned'}
        </div>
      </div>
      <p className="portal-page-subtitle">Action Inbox & Agenda</p>

      {/* ACTION INBOX */}
      {needsMyVote && (
        <Card className="dash-section" style={{ borderLeft: '4px solid var(--error)', backgroundColor: 'var(--error-bg)' }}>
          <div className="dash-section-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
            <h2 style={{ color: 'var(--error)' }}><Vote size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: '0.5rem' }}/> Action Required: Live Vote</h2>
          </div>
          <p className="dash-footnote" style={{ marginTop: '0.5rem', color: 'var(--text-strong)' }}>
            <strong>{votingBill.title}</strong> is currently on the floor for a vote.
          </p>
          <Link to="/internal/session/live" className="btn btn-primary btn-sm" style={{ marginTop: '1rem', backgroundColor: 'var(--error)', borderColor: 'var(--error)' }}>
            Join sitting to vote
          </Link>
        </Card>
      )}

      <div className="dash-overview-grid" style={{ marginTop: '2rem' }}>
        <div>
          {/* CHRONOLOGICAL ORDER PAPER */}
          <Card className="dash-section">
            <div className="dash-section-header">
              <h2>Today's Order Paper</h2>
              <Link to="/internal/session" className="dash-section-link">
                Join sitting <ArrowRight size={14} />
              </Link>
            </div>
            
            <ul className="timeline">
              {onFloorToday.map((bill, index) => (
                <li key={bill.id}>
                  <div className="timeline-dot" style={{ backgroundColor: bill.stage === 'Voting' ? 'var(--error)' : 'var(--accent)' }}></div>
                  <div style={{ width: '100%' }}>
                    <div className="timeline-stage" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Item {index + 1}</span>
                      {bill.stage === 'Voting' && <span style={{ color: 'var(--error)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>• Live Now</span>}
                    </div>
                    <p style={{ color: 'var(--text-strong)', fontWeight: 600, marginTop: '0.25rem' }}>{bill.title}</p>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Current stage: {bill.stage}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* MY BILLS */}
          <Card className="dash-section">
            <div className="dash-section-header">
              <h2>Tracked Legislation</h2>
              <Link to="/internal/bills" className="dash-section-link">
                All bills <ArrowRight size={14} />
              </Link>
            </div>
            <ul className="dash-list">
              {myBills.map((bill) => (
                <li key={bill.id}><BillRow bill={bill} /></li>
              ))}
            </ul>
          </Card>
        </div>

        <div>
          {/* COMMITTEES */}
          <Card className="dash-section">
            <div className="dash-section-header">
              <h2>Committee schedule</h2>
            </div>
            {committeeActivity.length > 0 ? (
              <ul className="agenda-list">
                {committeeActivity.map(({ committee, next, chair }) => (
                  <li key={committee.id} className="agenda-row">
                    <span className="row-title-with-icon">
                      <Users2 size={14} />
                      <span>{committee.name}</span>
                    </span>
                    <span className="committee-activity-meta">
                      {next.date}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dash-empty-state"><Inbox size={15} /> No committee meetings currently scheduled.</p>
            )}
          </Card>

          {/* UPCOMING SITTINGS */}
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

export default MPDashboard;
