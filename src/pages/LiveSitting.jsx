import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Check,
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Sparkles,
  MessageSquare,
  Users2,
  Vote,
} from 'lucide-react';
import { useApp } from '../mock/store';
import { seedTranscript, seedSpeakingQueue, seedJoinRequest } from '../mock/entities';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';

const STATUS_TONE = { Speaking: 'success', Queued: 'neutral', Chairing: 'info', Recording: 'warning', Joined: 'neutral' };

const TABS = [
  { id: 'speakers', label: 'Speakers', icon: Users2 },
  { id: 'transcript', label: 'Transcript', icon: MessageSquare },
  { id: 'summary', label: 'AI Summary', icon: Sparkles },
  { id: 'voting', label: 'Voting', icon: Vote },
];

const LiveSitting = () => {
  const { session, members, currentUser, bills, castVote } = useApp();
  const navigate = useNavigate();

  const [muted, setMuted] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [tab, setTab] = useState('speakers');
  const [joinRequest, setJoinRequest] = useState(seedJoinRequest);
  const [joinedIds, setJoinedIds] = useState(seedSpeakingQueue.map((s) => s.memberId));
  const [copied, setCopied] = useState(false);

  const memberOf = (id) => members.find((m) => m.id === id);
  const statusOf = (id) => seedSpeakingQueue.find((s) => s.memberId === id)?.status || 'Joined';

  const activeBillId = session.orderPaper[0]?.billId;
  const votingBill = bills.find((b) => b.id === activeBillId && b.stage === 'Voting');
  const hasVoted = votingBill?.voters?.[currentUser.id];


  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`https://e-parliament.gov/internal/session/live/${session.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const respondToRequest = (accept) => {
    if (accept && joinRequest) setJoinedIds((ids) => [...ids, joinRequest.memberId]);
    setJoinRequest(null);
  };

  const tiles = joinedIds.map((id) => memberOf(id)).filter(Boolean);
  const speakerRoster = [
    ...seedSpeakingQueue,
    ...joinedIds
      .filter((id) => !seedSpeakingQueue.some((s) => s.memberId === id))
      .map((id) => ({ memberId: id, status: 'Joined' })),
  ];

  return (
    <div>
      <Link to="/internal/session" className="dash-back-link">
        <ArrowLeft size={15} /> Back to sitting
      </Link>

      <div className="live-header">
        <div>
          <div className="live-header-eyebrow">
            <span className="portal-nav-live-dot" /> {session.name} &middot; Live
          </div>
          <h1 className="portal-page-title" style={{ marginBottom: 0 }}>Assembly Hearing</h1>
        </div>

        <div className="live-header-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleShare}>
            {copied ? <Check size={15} /> : <Share2 size={15} />} {copied ? 'Link copied' : 'Share sitting'}
          </button>

          {joinRequest && (
            <Card className="join-request-banner">
              <Avatar name={memberOf(joinRequest.memberId)?.name || '?'} size={30} />
              <div className="join-request-info">
                <strong>{memberOf(joinRequest.memberId)?.name}</strong>
                <span>Wants to join the sitting</span>
              </div>
              <button type="button" className="join-request-btn deny" onClick={() => respondToRequest(false)} aria-label="Decline">
                <X size={16} />
              </button>
              <button type="button" className="join-request-btn accept" onClick={() => respondToRequest(true)} aria-label="Accept">
                <Check size={16} />
              </button>
            </Card>
          )}
        </div>
      </div>

      <div className="live-layout">
        <div className="live-video-area">
          <div className="live-video-grid">
            {tiles.map((m) => (
              <div className={`live-tile ${statusOf(m.id) === 'Speaking' ? 'is-speaking' : ''}`} key={m.id}>
                <div className="live-tile-avatar">
                  {m.name.replace(/^(Hon\.|Ms\.|Mr\.)\s*/, '').split(' ').map((p) => p[0]).join('').slice(0, 2)}
                </div>
                <div className="live-tile-footer">
                  <span>{m.name}</span>
                  <MicOff size={13} />
                </div>
              </div>
            ))}
            <div className={`live-tile live-tile-self ${!cameraOn ? 'camera-off' : ''}`}>
              <div className="live-tile-avatar">
                {currentUser.name.replace(/^(Hon\.|Ms\.|Mr\.)\s*/, '').split(' ').map((p) => p[0]).join('').slice(0, 2)}
              </div>
              <div className="live-tile-footer">
                <span>You &middot; {currentUser.name}</span>
                {muted ? <MicOff size={13} /> : <Mic size={13} />}
              </div>
            </div>
          </div>

          <div className="call-controls">
            <button type="button" className={`call-btn ${!muted ? 'active' : ''}`} onClick={() => setMuted((s) => !s)} aria-label="Toggle microphone">
              {muted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button type="button" className={`call-btn ${cameraOn ? 'active' : ''}`} onClick={() => setCameraOn((s) => !s)} aria-label="Toggle camera">
              {cameraOn ? <Video size={18} /> : <VideoOff size={18} />}
            </button>
            <button type="button" className="call-btn call-btn-leave" onClick={() => navigate('/internal/session')} aria-label="Leave sitting">
              <PhoneOff size={18} />
            </button>
          </div>
        </div>

        <Card className="live-panel">
          <div className="live-tabs">
            {TABS.map((t) => {
              if (t.id === 'voting' && !votingBill) return null;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`live-tab ${tab === t.id ? 'active' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  <t.icon size={14} /> {t.label}
                  {t.id === 'voting' && !hasVoted && (
                    <span className="portal-nav-live-dot" style={{ marginLeft: '4px' }} />
                  )}
                </button>
              );
            })}
          </div>

          {tab === 'speakers' && (
            <ul className="live-speaker-list">
              {speakerRoster.map(({ memberId, status }) => {
                const m = memberOf(memberId);
                if (!m) return null;
                return (
                  <li key={memberId}>
                    <Avatar name={m.name} size={30} />
                    <span className="live-speaker-name">{m.name}</span>
                    <Badge tone={STATUS_TONE[status] || 'neutral'}>{status}</Badge>
                  </li>
                );
              })}
            </ul>
          )}

          {tab === 'transcript' && (
            <ul className="live-transcript">
              {seedTranscript.map((entry, i) => {
                const speaker = memberOf(entry.speakerId);
                return (
                  <li key={i}>
                    <div className="live-transcript-header">
                      <strong>{speaker?.name || 'Unknown'}</strong>
                      <span>{entry.time}</span>
                    </div>
                    <p>{entry.text}</p>
                  </li>
                );
              })}
            </ul>
          )}

          {tab === 'summary' && (
            <div className="live-summary">
              <p>
                Debate opened on the Infrastructure Budget 2026. The sponsor, Hon. T. Adeyemi, presented
                allocations for road, rail, and broadband expansion, accepting Hon. A. Mensah's amendment to
                raise rural broadband funding by 12%. Hon. R. Okafor conditioned support on retaining the
                coastal road maintenance clause. The Speaker confirmed both amendments will be read into the
                record ahead of the vote.
              </p>
              <p className="live-summary-disclaimer">
                AI-assisted summary generated from the session transcript — review before citing.
              </p>
            </div>
          )}

          {tab === 'voting' && votingBill && (
            <div style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Active Vote: {votingBill.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Please cast your vote securely on the floor.
              </p>
              
              {hasVoted ? (
                <div style={{ padding: '1rem', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                  Vote Cast: {hasVoted.toUpperCase()}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button 
                    type="button" 
                    className="btn" 
                    style={{ background: 'var(--success)', color: '#fff', padding: '1rem', fontSize: '1rem', fontWeight: 'bold', border: 'none' }}
                    onClick={() => castVote(votingBill.id, [{ voterId: currentUser.id, choice: 'aye' }])}
                  >
                    AYE
                  </button>
                  <button 
                    type="button" 
                    className="btn" 
                    style={{ background: 'var(--error)', color: '#fff', padding: '1rem', fontSize: '1rem', fontWeight: 'bold', border: 'none' }}
                    onClick={() => castVote(votingBill.id, [{ voterId: currentUser.id, choice: 'nay' }])}
                  >
                    NAY
                  </button>
                  <button 
                    type="button" 
                    className="btn" 
                    style={{ background: 'var(--text-muted)', color: '#fff', padding: '1rem', fontSize: '1rem', fontWeight: 'bold', border: 'none' }}
                    onClick={() => castVote(votingBill.id, [{ voterId: currentUser.id, choice: 'abstain' }])}
                  >
                    ABSTAIN
                  </button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LiveSitting;
