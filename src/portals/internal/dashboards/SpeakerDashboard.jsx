import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users2, Vote, BadgeCheck, ArrowRight, Inbox, Gavel, Radio, Play, Pause } from 'lucide-react';
import { useApp } from '../../../mock/store';
import { simulateChoice } from '../../../mock/division';
import Card from '../../../components/ui/Card';
import BillRow from '../../../components/ui/BillRow';
import Hemicycle from '../../../components/ui/Hemicycle';
import VoteBar from '../../../components/ui/VoteBar';
import StageBadge from '../../../components/ui/StageBadge';

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

const SpeakerDashboard = () => {
  const { currentUser, bills, session, members, callDivision, setSessionLive } = useApp();
  const [liveVoters, setLiveVoters] = useState(null);
  const [liveVotes, setLiveVotes] = useState(null);
  const [divisionRunning, setDivisionRunning] = useState(false);

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
  const displayVotes = liveVotes || votingBill?.votes;
  const displayVoters = liveVoters || votingBill?.voters || {};
  const allVoted = votingBill ? mps.every((m) => displayVoters[m.id]) : true;

  const handleCallDivision = () => {
    if (!votingBill) return;
    const notYetVoted = mps.filter((m) => !votingBill.voters[m.id]);
    if (notYetVoted.length === 0) return;
    setDivisionRunning(true);
    const order = [...notYetVoted].sort(() => Math.random() - 0.5);
    const batchSize = Math.max(2, Math.ceil(order.length / 25));
    let voters = { ...votingBill.voters };
    let votes = { ...votingBill.votes };
    let step = 0;
    const interval = setInterval(() => {
      order.slice(step, step + batchSize).forEach((m) => {
        const choice = simulateChoice(m.party);
        voters = { ...voters, [m.id]: choice };
        votes = { ...votes, [choice]: votes[choice] + 1 };
      });
      setLiveVoters(voters);
      setLiveVotes(votes);
      step += batchSize;
      if (step >= order.length) {
        clearInterval(interval);
        callDivision(votingBill.id, order.map((m) => ({ voterId: m.id, choice: voters[m.id] })));
        setDivisionRunning(false);
        setLiveVoters(null);
        setLiveVotes(null);
      }
    }, 120);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
        <h1 className="portal-page-title" style={{ margin: 0 }}>Good day, Speaker {currentUser.name.replace(/^(Hon\.|Ms\.|Mr\.)\s*/, '')}</h1>
        <div className="portal-topbar-session" data-live={session.live} style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
          <Radio size={13} />
          {session.name} {session.live ? '· Live' : '· Adjourned'}
        </div>
      </div>
      <p className="portal-page-subtitle">Chamber Management</p>

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
              <h2>{session.live ? 'Live vote tally' : 'Prepared for next sitting'}</h2>
              {votingBill && session.live && (
                <Link to={`/internal/bills/${votingBill.id}`} className="dash-section-link">
                  Open bill <ArrowRight size={14} />
                </Link>
              )}
            </div>
            {session.live && votingBill ? (
              <>
                <p className="dash-footnote" style={{ marginBottom: '0.75rem' }}>{votingBill.title}</p>
                <VoteBar votes={displayVotes} />
                {!allVoted && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleCallDivision}
                    disabled={divisionRunning}
                    style={{ marginTop: '1rem' }}
                  >
                    <Gavel size={15} /> {divisionRunning ? 'Division in progress…' : 'Call a division'}
                  </button>
                )}
              </>
            ) : session.live ? (
              <p className="dash-empty-state"><Inbox size={15} /> No bill is currently up for a vote.</p>
            ) : (
              <>
                <p className="dash-footnote">
                  The chamber is adjourned — no live division in progress. Order paper readiness for {session.name}:
                </p>
                <ul className="agenda-list">
                  {onFloorToday.map((bill) => (
                    <li key={bill.id} className="agenda-row">
                      <span className="row-title-with-icon">
                        <FileText size={14} />
                        <span>{bill.title}</span>
                      </span>
                      <StageBadge stage={bill.stage} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>
          
          <Card className="dash-section">
            <div className="dash-section-header">
              <h2>Session control</h2>
            </div>
            <p className="dash-footnote">
              {session.name} is currently <strong>{session.live ? 'live' : 'adjourned'}</strong>.{' '}
              {session.live
                ? 'Manage the order paper, open the floor to debate, and control voting from the Sitting workspace.'
                : 'Open the sitting to resume the order paper from where it left off.'}
            </p>
            {session.live ? (
              <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => setSessionLive(false)}>
                <Pause size={15} /> Adjourn sitting
              </button>
            ) : (
              <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => setSessionLive(true)}>
                <Play size={15} /> Start sitting
              </button>
            )}
            <Link to="/internal/session" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem', marginLeft: '0.5rem' }}>
              Open sitting controls
            </Link>
          </Card>
        </div>
        
        <div>
          <Card className="dash-section">
            <div className="dash-section-header">
              <h2>Chamber composition</h2>
            </div>
            <Hemicycle members={mps} />
          </Card>
        </div>
      </div>
      
      <Card className="dash-section" style={{ marginTop: '2rem' }}>
        <div className="dash-section-header">
          <h2>{session.name} order paper</h2>
          <Link to="/internal/session" className="dash-section-link">
            Go to sitting <ArrowRight size={14} />
          </Link>
        </div>
        <ul className="dash-list">
          {onFloorToday.map((bill) => (
            <li key={bill.id}><BillRow bill={bill} /></li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default SpeakerDashboard;
