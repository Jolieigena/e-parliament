import { Link } from 'react-router-dom';
import { Gavel, Users2, FileText, ArrowRight, ShieldCheck, Landmark, Scale, HeartPulse, Wallet } from 'lucide-react';
import { useApp } from '../mock/store';
import Avatar from '../components/ui/Avatar';

const COMMITTEE_ICONS = {
  'Judiciary Committee': Scale,
  'Health Committee': HeartPulse,
  'Finance Committee': Wallet,
  'Education Committee': Landmark,
};

const Committees = () => {
  const { committees, members, bills } = useApp();

  const rosterOf = (committeeName) => members.filter((m) => m.committees.some((c) => c.name === committeeName));
  const chairOf = (committeeName) => {
    const roster = rosterOf(committeeName);
    return roster.find((m) => m.committees.find((c) => c.name === committeeName)?.role === 'Chair');
  };
  const referredBillCount = (committeeName) => bills.filter((b) => b.committee === committeeName).length;

  return (
    <div>
      <div className="committee-grid">
        {committees.map((committee) => {
          const roster = rosterOf(committee.name);
          const chair = chairOf(committee.name);
          const billCount = referredBillCount(committee.name);
          const IconComponent = COMMITTEE_ICONS[committee.name] || Gavel;

          return (
            <Link to={`/internal/committees/${committee.id}`} key={committee.id} className="committee-card">
              <div className="committee-card-top">
                <div className="committee-card-icon">
                  <IconComponent size={20} />
                </div>
                <span className="committee-card-type-badge">
                  <ShieldCheck size={12} /> {committee.type}
                </span>
              </div>

              <h3 className="committee-card-title">{committee.name}</h3>
              <p className="committee-card-mandate">{committee.mandate}</p>

              <div className="committee-card-footer">
                {chair ? (
                  <div className="committee-card-chair">
                    <Avatar name={chair.name} size={28} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="committee-chair-label">Committee Chair</span>
                      <span className="committee-chair-name">{chair.name}</span>
                    </div>
                  </div>
                ) : (
                  <div />
                )}

                <div className="committee-card-stats">
                  <span className="stat-pill" title="Committee Members">
                    <Users2 size={13} /> {roster.length}
                  </span>
                  <span className="stat-pill" title="Referred Bills">
                    <FileText size={13} /> {billCount}
                  </span>
                </div>
              </div>

              <div className="committee-card-link-bar">
                <span>Explore Committee</span>
                <ArrowRight size={15} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Committees;
