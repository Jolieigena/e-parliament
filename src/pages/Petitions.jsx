import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Megaphone, Inbox, CheckCircle2, XCircle, Send, Clock, FileX, PlusCircle, X } from 'lucide-react';
import { useApp } from '../mock/store';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const STATUS_TONE = {
  Submitted: 'warning',
  Open: 'progress',
  Responded: 'success',
  Rejected: 'error',
};

const ACTIONS = {
  open: { label: 'Validate & open', placeholder: 'Signature goal (default 10,000)' },
  reject: { label: 'Reject', placeholder: 'Reason for rejection' },
  respond: { label: 'Record response', placeholder: 'Official response text' },
};

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

const PetitionRow = ({ petition, action, editing, note, setNote, startEdit, submitEdit }) => {
  const pct = petition.goal ? Math.min(100, Math.round((petition.base / petition.goal) * 100)) : 0;

  return (
    <li className="dash-list-row">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <b>{petition.title}</b>
        <Badge tone={STATUS_TONE[petition.status]}>{petition.status}</Badge>
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{petition.desc}</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <span>Submitted {new Date(petition.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        <span>{petition.base.toLocaleString()} signatures{pct > 0 ? ` · ${pct}% of ${petition.goal.toLocaleString()}` : ''}</span>
      </div>

      {petition.goal > 0 && (
        <div style={{ height: '6px', background: 'var(--overlay-tint)', borderRadius: '100px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: '100px' }} />
        </div>
      )}

      {petition.response && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, borderLeft: '2px solid var(--border)', paddingLeft: '0.6rem' }}>
          <b>Response:</b> {petition.response}
        </div>
      )}

      {petition.reason && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, borderLeft: '2px solid var(--error)', paddingLeft: '0.6rem' }}>
          <b>Reason:</b> {petition.reason}
        </div>
      )}

      {editing && editing.id === petition.id ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input
            className="form-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={ACTIONS[editing.action].placeholder}
            autoFocus
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => submitEdit(petition)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Send size={13} /> {ACTIONS[editing.action].label}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => startEdit(null, null)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {action === 'inbox' && (
            <>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => startEdit(petition.id, 'open')}>
                <CheckCircle2 size={13} /> Validate & open
              </button>
              <button type="button" className="btn btn-danger-outline btn-sm" onClick={() => startEdit(petition.id, 'reject')}>
                <XCircle size={13} /> Reject
              </button>
            </>
          )}
          {action === 'active' && (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => startEdit(petition.id, 'respond')}>
              <Send size={13} /> Record response
            </button>
          )}
        </div>
      )}
    </li>
  );
};

const Petitions = () => {
  const { currentUser, petitions, createPetition, openPetition, rejectPetition, respondToPetition } = useApp();
  const [editing, setEditing] = useState(null);
  const [note, setNote] = useState('');
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newGoal, setNewGoal] = useState('');

  if (!['Clerk', 'Administrator', 'Superuser'].includes(currentUser.roles[0])) {
    return <Navigate to="/internal" replace />;
  }

  const byStatus = (s) => petitions.filter((p) => p.status === s);
  const inbox = byStatus('Submitted');
  const active = byStatus('Open');
  const closed = petitions.filter((p) => ['Responded', 'Rejected'].includes(p.status));

  const counts = {
    inbox: inbox.length,
    active: active.length,
    responded: byStatus('Responded').length,
    rejected: byStatus('Rejected').length,
  };

  const startEdit = (id, action) => {
    setEditing(id && action ? { id, action } : null);
    setNote('');
  };

  const submitEdit = (p) => {
    if (editing.action === 'open') openPetition(p.id, parseInt(note, 10) || 10000);
    if (editing.action === 'reject') rejectPetition(p.id, note || 'Not accepted for validation.');
    if (editing.action === 'respond') respondToPetition(p.id, note || 'Response recorded.');
    setEditing(null);
    setNote('');
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;
    createPetition(newTitle.trim(), newDesc.trim(), parseInt(newGoal, 10) || 10000);
    setNewTitle('');
    setNewDesc('');
    setNewGoal('');
    setCreating(false);
  };

  const rowProps = { editing, note, setNote, startEdit, submitEdit };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h1 className="portal-page-title" style={{ margin: 0 }}>Petitions</h1>
          <p className="portal-page-subtitle" style={{ marginBottom: '1.25rem' }}>Citizen petitions — validation and official responses</p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setCreating((c) => !c)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          {creating ? <X size={14} /> : <PlusCircle size={14} />}
          {creating ? 'Cancel' : 'New petition'}
        </button>
      </div>

      {creating && (
        <Card className="dash-section">
          <div className="dash-section-header">
            <h2>Register a new petition</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>For petitions raised offline or presented by Members.</span>
          </div>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label className="form-label" htmlFor="np-title">Title</label>
              <input
                id="np-title"
                className="form-input"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="A short, clear title"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="np-desc">What are they petitioning for?</label>
              <textarea
                id="np-desc"
                className="form-input"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Describe the requested change and who it helps."
                rows={3}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="np-goal">Signature goal (default 10,000)</label>
              <input
                id="np-goal"
                className="form-input"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="10000"
                inputMode="numeric"
                style={{ width: '220px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={!newTitle.trim() || !newDesc.trim()} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Send size={13} /> Create & open for signatures
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCreating(false)}>
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      <div className="stat-grid">
        <StatTile label="Awaiting validation" value={counts.inbox} icon={Inbox} />
        <StatTile label="Open & collecting" value={counts.active} icon={Megaphone} />
        <StatTile label="Responded" value={counts.responded} icon={CheckCircle2} />
        <StatTile label="Rejected" value={counts.rejected} icon={FileX} />
      </div>

      <Card className="dash-section">
        <div className="dash-section-header">
          <h2>Inbox — submitted petitions</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Validate to publish for signatures, or reject.</span>
        </div>
        {inbox.length === 0 ? (
          <p className="dash-empty-state"><Inbox size={15} /> No petitions awaiting validation.</p>
        ) : (
          <ul className="dash-list">
            {inbox.map((p) => (
              <PetitionRow key={p.id} petition={p} action="inbox" {...rowProps} />
            ))}
          </ul>
        )}
      </Card>

      <Card className="dash-section">
        <div className="dash-section-header">
          <h2>Active petitions</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signature thresholds: 10,000 → committee response · 50,000 → floor debate.</span>
        </div>
        {active.length === 0 ? (
          <p className="dash-empty-state"><Megaphone size={15} /> No active petitions right now.</p>
        ) : (
          <ul className="dash-list">
            {active.map((p) => (
              <PetitionRow key={p.id} petition={p} action="active" {...rowProps} />
            ))}
          </ul>
        )}
      </Card>

      <Card className="dash-section">
        <div className="dash-section-header">
          <h2>Closed — responded & rejected</h2>
        </div>
        {closed.length === 0 ? (
          <p className="dash-empty-state"><Clock size={15} /> Nothing closed yet.</p>
        ) : (
          <ul className="dash-list">
            {closed.map((p) => (
              <PetitionRow key={p.id} petition={p} action="closed" {...rowProps} />
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default Petitions;
