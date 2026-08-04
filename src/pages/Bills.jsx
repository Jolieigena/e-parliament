import { Link } from 'react-router-dom';
import { FileText, Landmark } from 'lucide-react';
import { useApp } from '../mock/store';
import { categoryIcon } from '../mock/categoryMeta';
import StageBadge from '../components/ui/StageBadge';
import Avatar from '../components/ui/Avatar';

const Bills = () => {
  const { bills, members, institutions } = useApp();

  const getSponsor = (id) => members.find((m) => m.id === id);
  const getInstitution = (id) => institutions.find((i) => i.id === id);

  return (
    <div>


      <div className="bill-list">
        {bills.map((bill) => {
          const isGovBill = bill.sponsorType === 'Government';
          const sponsor = isGovBill ? null : getSponsor(bill.sponsorId);
          const institution = isGovBill ? getInstitution(bill.institutionId) : null;
          const lastHistory = bill.history[bill.history.length - 1];
          const lastUpdated = lastHistory ? new Date(lastHistory.date).toLocaleDateString() : 'Unknown';
          const CategoryIcon = categoryIcon(bill.category);

          return (
            <Link to={`/internal/bills/${bill.id}`} key={bill.id} className="bill-card">
              <div className="bill-card-header">
                <span className="bill-row-category">
                  <CategoryIcon size={12} /> {bill.category}
                </span>
                <StageBadge stage={bill.stage} />
              </div>

              <h3 className="bill-card-title">{bill.title}</h3>

              <div className="bill-card-footer">
                <div className="bill-card-sponsor">
                  {isGovBill ? <Landmark size={16} /> : sponsor && <Avatar name={sponsor.name} size={22} />}
                  <span>{isGovBill ? institution?.name || 'Government' : sponsor?.name || 'Unknown'}</span>
                </div>
                <div className="bill-card-meta">
                  <span>{bill.committee || 'Floor'}</span>
                  <span>Updated {lastUpdated}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Bills;
