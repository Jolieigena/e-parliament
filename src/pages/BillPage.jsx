import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, MinusCircle, Clock, FilePenLine, Gavel, X, FileText } from 'lucide-react';
import { useApp } from '../mock/store';
import { STAGE_META } from '../mock/stageMeta';
import { categoryIcon } from '../mock/categoryMeta';
import { simulateChoice } from '../mock/division';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StageBadge from '../components/ui/StageBadge';
import VoteBar from '../components/ui/VoteBar';
import Lifecycle from '../components/ui/Lifecycle';
import Hemicycle from '../components/ui/Hemicycle';
import BillDocumentModal from '../components/ui/BillDocumentModal';

const COMMITTEES = ['Judiciary Committee', 'Health Committee', 'Finance Committee', 'Education Committee'];

const AMENDMENT_STATUS_ICONS = {
  Pending: Clock,
  Accepted: CheckCircle2,
  Rejected: XCircle,
};

const BillPage = () => {
  const { billId } = useParams();
  const { bills, members, institutions, currentUser, advanceStage, referToCommittee, castVote, callDivision, proposeAmendment } = useApp();
  const [committeeChoice, setCommitteeChoice] = useState(COMMITTEES[0]);
  const [liveVoters, setLiveVoters] = useState(null);
  const [liveVotes, setLiveVotes] = useState(null);
  const [divisionRunning, setDivisionRunning] = useState(false);

  // Propose Amendment State
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [amTitle, setAmTitle] = useState('');
  const [amClause, setAmClause] = useState('Section 3');
  const [amOriginal, setAmOriginal] = useState('');
  const [amProposed, setAmProposed] = useState('');
  const [amSuccess, setAmSuccess] = useState('');
  const [showDoc, setShowDoc] = useState(false);

  const handleProposeSubmit = (e) => {
    e.preventDefault();
    if (!amTitle.trim() || !amProposed.trim()) return;
    proposeAmendment(bill.id, amTitle.trim(), amClause, amOriginal.trim(), amProposed.trim(), currentUser.id);
    setAmSuccess('Clause amendment submitted and queued for Committee Review.');
    setTimeout(() => {
      setAmSuccess('');
      setShowProposeModal(false);
      setAmTitle('');
      setAmOriginal('');
      setAmProposed('');
    }, 1800);
  };

  const bill = bills.find((b) => b.id === billId);
  if (!bill) return <Navigate to="/internal/bills" replace />;

  const isGovBill = bill.sponsorType === 'Government';
  const sponsor = isGovBill ? null : members.find((m) => m.id === bill.sponsorId);
  const sponsoringInstitution = isGovBill ? institutions.find((i) => i.id === bill.institutionId) : null;
  const role = currentUser.roles[0];
  const isSuper = role === 'Superuser';
  const isSponsor = currentUser.id === bill.sponsorId;
  const myVote = bill.voters[currentUser.id];
  const meta = STAGE_META[bill.stage];
  const mps = members.filter((m) => m.roles.includes('MP'));
  const displayVoters = liveVoters || bill.voters;
  const displayVotes = liveVotes || bill.votes;
  const allVoted = mps.every((m) => displayVoters[m.id]);

  const handleCallDivision = () => {
    const notYetVoted = mps.filter((m) => !bill.voters[m.id]);
    if (notYetVoted.length === 0) return;
    setDivisionRunning(true);
    const order = [...notYetVoted].sort(() => Math.random() - 0.5);
    // Scale the batch size to the chamber's size so a 120-MP division still
    // finishes in a few seconds instead of taking half a minute at a fixed
    // batch-of-2 pace.
    const batchSize = Math.max(2, Math.ceil(order.length / 25));
    let voters = { ...bill.voters };
    let votes = { ...bill.votes };
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
        callDivision(bill.id, order.map((m) => ({ voterId: m.id, choice: voters[m.id] })));
        setDivisionRunning(false);
        setLiveVoters(null);
        setLiveVotes(null);
      }
    }, 120);
  };

  const canWithdraw = isSponsor && ['Draft', 'Introduced', 'Committee Review', 'Debate'].includes(bill.stage);
  const isTerminalStage = ['Enacted', 'Rejected', 'Withdrawn'].includes(bill.stage);
  const hasStageAction =
    role === 'Superuser' ||
    (bill.stage === 'Draft' && role === 'Clerk') ||
    (bill.stage === 'Introduced' && (role === 'Clerk' || role === 'Speaker')) ||
    (bill.stage === 'Committee Review' && (role === 'Speaker' || role === 'Clerk')) ||
    (bill.stage === 'Debate' && role === 'Speaker') ||
    (bill.stage === 'Voting' && (role === 'MP' || role === 'Speaker')) ||
    (bill.stage === 'Assent' && role === 'Clerk');
  const hasAnyAction = hasStageAction || canWithdraw;
  const showEmptyState = !hasAnyAction && bill.stage !== 'Voting' && !isTerminalStage;
  const CategoryIcon = categoryIcon(bill.category);

  return (
    <div>
      <Link to="/internal/bills" className="dash-back-link">
        <ArrowLeft size={15} /> Back to bills
      </Link>

      <div className="bill-detail-header">
        <div>
          <span className="bill-row-category"><CategoryIcon size={12} /> {bill.category}</span>
          <h1 className="portal-page-title" style={{ marginTop: '0.35rem' }}>{bill.title}</h1>
          <p className="bill-row-meta">
            Sponsored by {isGovBill ? sponsoringInstitution?.name || 'Government' : sponsor?.name}
            {bill.committee ? ` · ${bill.committee}` : ''}
          </p>
        </div>
        <StageBadge stage={bill.stage} />
      </div>

      <Card className="dash-section">
        <Lifecycle stage={bill.stage} />
      </Card>

      <Card className="dash-section">
        <div className="dash-section-header">
          <h2 style={{ marginBottom: 0 }}>Summary</h2>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowDoc(true)}>
            <FileText size={14} /> View full document
          </button>
        </div>
        <p className="bill-description" style={{ marginTop: '1rem' }}>{bill.summary}</p>
      </Card>

      <Card className="dash-section">
        <h2 style={{ marginBottom: '1rem' }}>Take action</h2>

        {bill.stage === 'Draft' && (role === 'Clerk' || isSuper) && (
          <button type="button" className="btn btn-primary btn-md" onClick={() => advanceStage(bill.id, 'Introduced', 'Verified and admitted for first reading.')}>
            Verify &amp; introduce
          </button>
        )}

        {bill.stage === 'Introduced' && (role === 'Clerk' || role === 'Speaker' || isSuper) && (
          <div className="committee-referral">
            <select className="form-input" value={committeeChoice} onChange={(e) => setCommitteeChoice(e.target.value)}>
              {COMMITTEES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <button type="button" className="btn btn-primary btn-md" onClick={() => referToCommittee(bill.id, committeeChoice)}>
              Refer to committee
            </button>
          </div>
        )}

        {bill.stage === 'Committee Review' && (role === 'Speaker' || role === 'Clerk' || isSuper) && (
          <button type="button" className="btn btn-primary btn-md" onClick={() => advanceStage(bill.id, 'Debate', 'Committee review concluded; scheduled for second reading debate.')}>
            Advance to debate
          </button>
        )}

        {bill.stage === 'Debate' && (role === 'Speaker' || isSuper) && (
          <button type="button" className="btn btn-primary btn-md" onClick={() => advanceStage(bill.id, 'Voting', 'Floor debate concluded; vote opened.')}>
            Open floor vote
          </button>
        )}

        {bill.stage === 'Voting' && (role === 'MP' || isSuper) && !myVote && (
          <div className="vote-actions">
            <button type="button" className="vote-btn vote-btn-aye" onClick={() => castVote(bill.id, 'aye')}>
              <CheckCircle2 size={17} /> Aye
            </button>
            <button type="button" className="vote-btn vote-btn-nay" onClick={() => castVote(bill.id, 'nay')}>
              <XCircle size={17} /> Nay
            </button>
            <button type="button" className="vote-btn vote-btn-abstain" onClick={() => castVote(bill.id, 'abstain')}>
              <MinusCircle size={17} /> Abstain
            </button>
          </div>
        )}
        {bill.stage === 'Voting' && (role === 'MP' || isSuper) && myVote && (
          <p className="dash-footnote">You voted <strong>{myVote}</strong> on this bill.</p>
        )}
      {(bill.stage === 'Voting' || (bill.votes && (bill.votes.aye + bill.votes.nay + bill.votes.abstain > 0))) && (
        <Card className="dash-section">
          <h2 style={{ marginBottom: '0.25rem' }}>Division Breakdown &amp; Chamber Map</h2>
          <p className="dash-footnote" style={{ marginBottom: '1.25rem' }}>
            Detailed votes recorded on the floor of Parliament.
          </p>
          <div style={{ margin: '1rem 0' }}>
            <VoteBar votes={displayVotes} />
          </div>
          <div style={{ margin: '1.5rem 0' }}>
            <Hemicycle members={mps} voters={displayVoters} />
          </div>
        </Card>
      )}
        {bill.stage === 'Voting' && (role === 'Speaker' || isSuper) && !allVoted && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleCallDivision} disabled={divisionRunning} style={{ marginBottom: '1rem' }}>
            <Gavel size={15} /> {divisionRunning ? 'Division in progress…' : 'Call a division'}
          </button>
        )}
        {bill.stage === 'Voting' && (role === 'Speaker' || isSuper) && (
          <div className="vote-actions" style={{ marginTop: '1rem' }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => advanceStage(bill.id, 'Assent', 'Passed third reading; sent for assent.')}>
              Conclude vote &amp; send for assent
            </button>
            <button type="button" className="btn btn-danger-outline btn-sm" onClick={() => advanceStage(bill.id, 'Rejected', 'Failed to pass third reading.')}>
              Declare rejected
            </button>
          </div>
        )}

        {bill.stage === 'Assent' && (role === 'Clerk' || isSuper) && (
          <button type="button" className="btn btn-primary btn-md" onClick={() => advanceStage(bill.id, 'Enacted', 'Assented to and gazetted.')}>
            Record assent &amp; gazette
          </button>
        )}

        {canWithdraw && (
          <button
            type="button"
            className="btn btn-danger-outline btn-sm"
            style={{ marginTop: bill.stage === 'Voting' ? '1rem' : '0.75rem' }}
            onClick={() => advanceStage(bill.id, 'Withdrawn', 'Withdrawn by sponsor.')}
          >
            Withdraw bill
          </button>
        )}

        {!meta && null}
        {isTerminalStage && (
          <p className="dash-footnote">This bill's lifecycle is complete — see history below.</p>
        )}
        {showEmptyState && (
          <p className="dash-footnote">No action is required from you at this stage.</p>
        )}
      </Card>

      <Card className="dash-section">
        <div className="dash-section-header">
          <h2 style={{ marginBottom: 0 }}>Amendments ({bill.amendments.length})</h2>
          {(role === 'MP' || role === 'Clerk' || isSuper) && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowProposeModal(true)}>
              <FilePenLine size={14} /> Propose Clause Amendment
            </button>
          )}
        </div>

        {bill.amendments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {bill.amendments.map((am) => {
              const proposer = members.find((m) => m.id === am.proposerId);
              return (
                <div key={am.id} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-strong)' }}>
                        {am.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Proposed by {proposer?.name || 'MP'} · {am.date || 'Recent'}
                      </div>
                    </div>
                    <Badge tone="neutral" icon={AMENDMENT_STATUS_ICONS[am.status]}>{am.status}</Badge>
                  </div>

                  {/* SIDE-BY-SIDE REDLINE DIFF VIEWER */}
                  {am.originalText && am.proposedText ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.82rem', fontFamily: 'monospace' }}>
                      <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--error)' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem', opacity: 0.8 }}>
                          Original Clause Text
                        </div>
                        <div style={{ textDecoration: 'line-through' }}>{am.originalText}</div>
                      </div>

                      <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem', opacity: 0.8 }}>
                          Proposed Redline Text
                        </div>
                        <div>{am.proposedText}</div>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                      Amendment details pending clause redline.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="dash-empty-state" style={{ marginTop: '1rem' }}>No amendments proposed yet for this bill.</p>
        )}
      </Card>

      <Card className="dash-section">
        <h2 style={{ marginBottom: '1rem' }}>History</h2>
        <ul className="timeline">
          {bill.history.map((h, i) => {
            const StageIcon = STAGE_META[h.stage]?.icon;
            return (
              <li key={i}>
                <div className="timeline-dot">{StageIcon && <StageIcon size={9} />}</div>
                <div>
                  <div className="timeline-stage">{h.stage} <span className="timeline-date">{h.date}</span></div>
                  <p>{h.note}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      {showProposeModal && (
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
            maxWidth: '600px',
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
                  <FilePenLine size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-strong)' }}>
                    Propose Clause Amendment
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                    Draft redline modifications to specific bill clauses.
                  </div>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => setShowProposeModal(false)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL FORM */}
            <form onSubmit={handleProposeSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-strong)' }}>
                  Amendment Title / Motion Subject
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Increase rural broadband fund allocation by 12%"
                  value={amTitle}
                  onChange={(e) => setAmTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.85rem', color: 'var(--text-strong)' }}
                  required
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-strong)' }}>
                  Target Clause / Section
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Section 3 (2)"
                  value={amClause}
                  onChange={(e) => setAmClause(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.85rem', color: 'var(--text-strong)' }}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-strong)' }}>
                  Original Clause Text (to be amended)
                </label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Paste the current clause text..."
                  value={amOriginal}
                  onChange={(e) => setAmOriginal(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.85rem', color: 'var(--text-strong)', lineHeight: 1.5, resize: 'vertical' }}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-strong)' }}>
                  Proposed Redline Text (new replacement clause)
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Type the exact proposed modified clause wording..."
                  value={amProposed}
                  onChange={(e) => setAmProposed(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.85rem', color: 'var(--text-strong)', lineHeight: 1.5, resize: 'vertical' }}
                  required
                />
              </div>

              {amSuccess && (
                <p className="form-success" style={{ margin: 0 }}>
                  <CheckCircle2 size={15} /> {amSuccess}
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <button type="button" className="btn btn-secondary btn-md" onClick={() => setShowProposeModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-md" disabled={!amTitle.trim() || !amProposed.trim()}>
                  Submit Clause Amendment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDoc && <BillDocumentModal bill={bill} onClose={() => setShowDoc(false)} />}
    </div>
  );
};

export default BillPage;
