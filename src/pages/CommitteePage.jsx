import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarCheck,
  CalendarClock,
  FileEdit,
  Building2,
  Users2,
  Crown,
  NotebookPen,
  User,
  Inbox,
  ShieldQuestion,
  Send,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../mock/store';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import BillRow from '../components/ui/BillRow';

const ROLE_ORDER = { Chair: 0, 'Vice-Chair': 1, Secretary: 2, Member: 3 };
const COMMITTEE_ROLE_ICONS = { Chair: Crown, 'Vice-Chair': Users2, Secretary: NotebookPen, Member: User };

const CommitteePage = () => {
  const { committeeId } = useParams();
  const { committees, members, bills, currentUser, logMeetingMinutes, institutions, createOversightRequest } = useApp();
  const [draftNote, setDraftNote] = useState('');
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryTargetInst, setInquiryTargetInst] = useState(institutions[0]?.id || '');
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryBody, setInquiryBody] = useState('');
  const [inquiryDueDate, setInquiryDueDate] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState('');

  const committee = committees.find((c) => c.id === committeeId);
  if (!committee) return <Navigate to="/internal/committees" replace />;

  const roster = members
    .map((m) => ({ member: m, entry: m.committees.find((c) => c.name === committee.name) }))
    .filter((r) => r.entry)
    .sort((a, b) => ROLE_ORDER[a.entry.role] - ROLE_ORDER[b.entry.role]);

  const referredBills = bills.filter((b) => b.committee === committee.name);
  const nextScheduled = committee.meetings.find((m) => m.status === 'Scheduled');

  const myEntry = currentUser.committees.find((c) => c.name === committee.name);
  const canLogMinutes = nextScheduled && (myEntry?.role === 'Chair' || currentUser.roles[0] === 'Clerk' || currentUser.roles[0] === 'Superuser');

  const handleLogMinutes = (e) => {
    e.preventDefault();
    if (!draftNote.trim()) return;
    logMeetingMinutes(committee.id, nextScheduled.id, draftNote.trim());
    setDraftNote('');
  };

  const handleSendInquiry = (e) => {
    e.preventDefault();
    if (!inquirySubject.trim() || !inquiryBody.trim()) return;
    createOversightRequest(
      inquiryTargetInst,
      `[${committee.name}] ${inquirySubject.trim()}`,
      inquiryBody.trim(),
      inquiryDueDate || '2026-08-15'
    );
    setInquirySuccess(`Statutory inquiry dispatched to ${institutions.find((i) => i.id === inquiryTargetInst)?.name}. It is now live on the Government Portal.`);
    setTimeout(() => {
      setInquirySuccess('');
      setShowInquiryModal(false);
      setInquirySubject('');
      setInquiryBody('');
    }, 2000);
  };

  return (
    <div>
      <Link to="/internal/committees" className="dash-back-link">
        <ArrowLeft size={15} /> Back to committees
      </Link>

      <div className="bill-detail-header">
        <div>
          <Badge tone="neutral" icon={Building2}>{committee.type}</Badge>
          <h1 className="portal-page-title" style={{ marginTop: '0.35rem' }}>{committee.name}</h1>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-md"
          onClick={() => setShowInquiryModal(true)}
        >
          <ShieldQuestion size={16} /> Issue Statutory Inquiry to Ministry
        </button>
      </div>

      <Card className="dash-section">
        <h2 style={{ marginBottom: '0.75rem' }}>Mandate</h2>
        <p className="bill-description">{committee.mandate}</p>
      </Card>

      <Card className="dash-section">
        <h2 style={{ marginBottom: '1rem' }}>Members ({roster.length})</h2>
        <ul className="roster-list">
          {roster.map(({ member, entry }) => (
            <li key={member.id}>
              <Avatar name={member.name} size={32} />
              <span className="roster-name">{member.name}</span>
              <Badge tone={entry.role === 'Chair' ? 'info' : 'neutral'} icon={COMMITTEE_ROLE_ICONS[entry.role]}>{entry.role}</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="dash-section">
        <h2 style={{ marginBottom: '1rem' }}>Referred bills ({referredBills.length})</h2>
        {referredBills.length > 0 ? (
          <ul className="dash-list">
            {referredBills.map((bill) => (
              <li key={bill.id}><BillRow bill={bill} /></li>
            ))}
          </ul>
        ) : (
          <p className="dash-empty-state"><Inbox size={15} /> No bills currently referred to this committee.</p>
        )}
      </Card>

      <Card className="dash-section">
        <h2 style={{ marginBottom: '1rem' }}>Meetings</h2>
        <ul className="timeline">
          {committee.meetings.map((m) => (
            <li key={m.id}>
              <div className={`timeline-dot ${m.status === 'Scheduled' ? 'is-scheduled' : ''}`} />
              <div style={{ flex: 1 }}>
                <div className="timeline-stage">
                  {m.agenda} <span className="timeline-date">{m.date}</span>
                </div>
                <p>{m.note || (m.status === 'Scheduled' ? 'Meeting not yet held.' : '')}</p>
              </div>
              <Badge tone={m.status === 'Held' ? 'success' : 'warning'} icon={m.status === 'Held' ? CalendarCheck : CalendarClock}>
                {m.status}
              </Badge>
            </li>
          ))}
        </ul>

        {canLogMinutes && (
          <form onSubmit={handleLogMinutes} className="minutes-form">
            <label className="form-label" htmlFor="minutes">
              Log minutes for "{nextScheduled.agenda}"
            </label>
            <textarea
              id="minutes"
              className="form-input"
              rows={3}
              placeholder="Summarize what was discussed and decided..."
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={!draftNote.trim()}>
              <FileEdit size={15} /> Mark meeting held
            </button>
          </form>
        )}
      </Card>

      {showInquiryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '580px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* MODAL HEADER */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ShieldQuestion size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-strong)' }}>
                    Issue Statutory Inquiry to Ministry
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                    Select a ministry and state the statutory information requested.
                  </div>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => setShowInquiryModal(false)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL FORM */}
            <form onSubmit={handleSendInquiry} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-strong)' }}>
                  Target Government Ministry / Institution
                </label>
                <select 
                  className="form-input" 
                  value={inquiryTargetInst} 
                  onChange={(e) => setInquiryTargetInst(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.85rem', color: 'var(--text-strong)' }}
                >
                  {institutions.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} {i.acronym ? `(${i.acronym})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-strong)' }}>
                  Subject / Inquiry Title
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Audit & Submission of Q3 Budget Expenditure"
                  value={inquirySubject}
                  onChange={(e) => setInquirySubject(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.85rem', color: 'var(--text-strong)' }}
                  required
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-strong)' }}>
                  Statutory Inquiry Details &amp; Information Requested
                </label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="State the statutory provisions, questions, and specific documents requested from the Ministry..."
                  value={inquiryBody}
                  onChange={(e) => setInquiryBody(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.85rem', color: 'var(--text-strong)', lineHeight: 1.5, resize: 'vertical' }}
                  required
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-strong)' }}>
                  Response Due Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={inquiryDueDate}
                  onChange={(e) => setInquiryDueDate(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.85rem', color: 'var(--text-strong)' }}
                />
              </div>

              {inquirySuccess && (
                <p className="form-success" style={{ margin: 0 }}>
                  <CheckCircle2 size={15} /> {inquirySuccess}
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <button type="button" className="btn btn-secondary btn-md" onClick={() => setShowInquiryModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-md" disabled={!inquirySubject.trim() || !inquiryBody.trim()}>
                  <Send size={15} /> Dispatch to Ministry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitteePage;
