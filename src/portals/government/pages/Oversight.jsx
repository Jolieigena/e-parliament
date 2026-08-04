import { useState } from 'react';
import { Send, Clock, CheckCircle2, CalendarClock, Inbox } from 'lucide-react';
import { useApp } from '../../../mock/store';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

const OversightItem = ({ request, onRespond }) => {
  const [draft, setDraft] = useState('');
  const isPending = request.status === 'Pending';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onRespond(request.id, draft.trim());
    setDraft('');
  };

  return (
    <Card className="dash-section">
      <div className="dash-section-header">
        <h2 style={{ fontSize: '1rem' }}>{request.subject}</h2>
        <Badge tone={isPending ? 'warning' : 'success'} icon={isPending ? Clock : CheckCircle2}>{request.status}</Badge>
      </div>
      <p className="bill-description">{request.body}</p>
      <p className="dash-footnote" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <CalendarClock size={14} /> Due {request.dueDate}
      </p>

      {isPending ? (
        <form onSubmit={handleSubmit} className="minutes-form">
          <label className="form-label" htmlFor={`response-${request.id}`}>Your response</label>
          <textarea
            id={`response-${request.id}`}
            className="form-input"
            rows={3}
            placeholder="Provide the requested information..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm" disabled={!draft.trim()}>
            <Send size={15} /> Send response
          </button>
        </form>
      ) : (
        <div className="minutes-form">
          <p className="form-label">Response ({request.responseDate})</p>
          <p className="bill-description">{request.response}</p>
        </div>
      )}
    </Card>
  );
};

const Oversight = () => {
  const { currentGovUser, oversightRequests, respondToOversight } = useApp();
  const myRequests = oversightRequests.filter((r) => r.institutionId === currentGovUser.institutionId);

  return (
    <div>
      <p className="portal-page-subtitle">Parliamentary oversight requests directed at your institution.</p>

      {myRequests.length > 0 ? (
        myRequests.map((r) => <OversightItem key={r.id} request={r} onRespond={respondToOversight} />)
      ) : (
        <Card className="dash-section">
          <p className="dash-empty-state"><Inbox size={15} /> No oversight requests at this time.</p>
        </Card>
      )}
    </div>
  );
};

export default Oversight;
