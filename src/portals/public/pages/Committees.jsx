import { Link } from 'react-router-dom';
import { Gavel, Users2, FileText, ArrowRight, Building2 } from 'lucide-react';
import { useApp } from '../../../mock/store';
import Avatar from '../../../components/ui/Avatar';
import Badge from '../../../components/ui/Badge';

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
      <h1 className="portal-page-title">
        <span className="page-title-icon-wrap"><Gavel size={20} /></span> Committees
      </h1>
      <p className="portal-page-subtitle">Standing committees, their membership, and referred legislation.</p>

      <div className="committee-grid">
        {committees.map((committee) => {
          const roster = rosterOf(committee.name);
          const chair = chairOf(committee.name);
          const billCount = referredBillCount(committee.name);

          return (
            <Link to={`/public/committees/${committee.id}`} key={committee.id} className="committee-card">
              <div className="committee-card-icon">
                <Gavel size={20} />
              </div>
              <Badge tone="neutral" icon={Building2}>{committee.type}</Badge>
              <h3>{committee.name}</h3>
              <p className="committee-card-mandate">{committee.mandate}</p>

              <div className="committee-card-footer">
                {chair && (
                  <div className="committee-card-chair">
                    <Avatar name={chair.name} size={26} />
                    <span>{chair.name}</span>
                  </div>
                )}
                <div className="committee-card-stats">
                  <span><Users2 size={13} /> {roster.length}</span>
                  <span><FileText size={13} /> {billCount}</span>
                </div>
              </div>

              <div className="committee-card-link">
                View committee <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Committees;
