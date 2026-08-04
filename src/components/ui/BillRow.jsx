import { Link } from 'react-router-dom';
import { STAGES } from '../../mock/entities';
import { categoryIcon } from '../../mock/categoryMeta';
import StageBadge from './StageBadge';

const BillRow = ({ bill, basePath = '/internal/bills' }) => {
  const CategoryIcon = categoryIcon(bill.category);
  const stageIdx = STAGES.indexOf(bill.stage);
  return (
    <Link to={`${basePath}/${bill.id}`} className="dash-list-row">
      <div className="order-card-icon">
        <CategoryIcon size={18} />
      </div>
      <div className="order-card-title">{bill.title}</div>
      {stageIdx !== -1 && (
        <div className="bill-row-stage-track" aria-hidden="true">
          {STAGES.map((s, i) => (
            <i key={s} className={i <= stageIdx ? 'done' : ''} />
          ))}
        </div>
      )}
      <div className="order-card-footer">
        <StageBadge stage={bill.stage} />
      </div>
    </Link>
  );
};

export default BillRow;
