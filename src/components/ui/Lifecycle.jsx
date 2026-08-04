import { Check, XCircle } from 'lucide-react';
import { STAGES } from '../../mock/entities';

const Lifecycle = ({ stage }) => {
  const isTerminal = stage === 'Rejected' || stage === 'Withdrawn';
  const currentIdx = STAGES.indexOf(isTerminal ? 'Draft' : stage);

  return (
    <div className="lifecycle-wrap">
      <div className="lifecycle">
        {STAGES.map((s, i) => (
          <div key={s} className={`lifecycle-step ${i <= currentIdx && !isTerminal ? 'done' : ''} ${s === stage ? 'current' : ''}`}>
            <div className="lifecycle-dot">{i < currentIdx && !isTerminal && <Check size={11} />}</div>
            <span>{s}</span>
          </div>
        ))}
        {isTerminal && (
          <div className="lifecycle-step current terminal">
            <div className="lifecycle-dot">
              <XCircle size={13} />
            </div>
            <span>{stage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lifecycle;
