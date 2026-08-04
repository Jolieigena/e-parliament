import { useState } from 'react';
import { Users2, Send, Clock, CheckCircle2, CalendarClock, Inbox } from 'lucide-react';
import { useApp } from '../../../mock/store';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

const CommitteeRequestItem = ({ request, onRespond }) => {
  const [draft, setDraft] = useState('');
  const isInvited = request.status === 'Invited';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onRespond(request.id, draft.trim());
    setDraft('');
  };

  return (
    <Card className="dash-section">
      <div className="dash-section-header">
        <h2 style={{ fontSize: '1rem' }}>{request.committeeName}</h2>
        <Badge tone={isInvited ? 'warning' : 'success'} icon={isInvited ? Clock : CheckCircle2}>{request.status}</Badge>
      </div>
      <p className="bill-description">{request.subject}</p>
      <p className="dash-footnote" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <CalendarClock size={14} /> Meeting date {request.meetingDate}
      </p>

      {isInvited ? (
        <form onSubmit={handleSubmit} className="minutes-form">
          <label className="form-label" htmlFor={`cr-response-${request.id}`}>Your response</label>
          <textarea
            id={`cr-response-${request.id}`}
            className="form-input"
            rows={3}
            placeholder="Confirm attendance or submit written evidence..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm" disabled={!draft.trim()}>
            <Send size={15} /> Send response
          </button>
        </form>
      ) : (
        <div className="minutes-form">
          <p className="form-label">Response</p>
          <p className="bill-description">{request.responseNote}</p>
        </div>
      )}
    </Card>
  );
};

const CommitteeRequests = () => {
  const { currentGovUser, committeeRequests, respondToCommitteeRequest } = useApp();
  const myRequests = committeeRequests.filter((r) => r.institutionId === currentGovUser.institutionId);

  return (
    <div>
      <h1 className="portal-page-title">
        <span className="page-title-icon-wrap"><Users2 size={20} /></span> Committee Requests
      </h1>
      <p className="portal-page-subtitle">Invitations to participate in committee hearings and evidence sessions.</p>

      {myRequests.length > 0 ? (
        myRequests.map((r) => <CommitteeRequestItem key={r.id} request={r} onRespond={respondToCommitteeRequest} />)
      ) : (
        <Card className="dash-section">
          <p className="dash-empty-state"><Inbox size={15} /> No committee requests at this time.</p>
        </Card>
      )}
    </div>
  );
};

export default CommitteeRequests;
