import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Share2, Check, Sparkles, MessageSquare, Users2 } from 'lucide-react';
import { useApp } from '../../../mock/store';
import { seedTranscript, seedSpeakingQueue } from '../../../mock/entities';
import Card from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import Badge from '../../../components/ui/Badge';

const STATUS_TONE = { Speaking: 'success', Queued: 'neutral', Chairing: 'info', Recording: 'warning' };

const TABS = [
  { id: 'speakers', label: 'Speakers', icon: Users2 },
  { id: 'transcript', label: 'Transcript', icon: MessageSquare },
  { id: 'summary', label: 'AI Summary', icon: Sparkles },
];

const LiveSitting = () => {
  const { session, members } = useApp();

  const [tab, setTab] = useState('speakers');
  const [copied, setCopied] = useState(false);

  const memberOf = (id) => members.find((m) => m.id === id);
  const statusOf = (id) => seedSpeakingQueue.find((s) => s.memberId === id)?.status;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`https://e-parliament.gov/public/sitting/live`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const tiles = seedSpeakingQueue.map((s) => memberOf(s.memberId)).filter(Boolean);

  return (
    <div>
      <Link to="/public/sitting" className="dash-back-link">
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
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="live-panel">
          <div className="live-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`live-tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>

          {tab === 'speakers' && (
            <ul className="live-speaker-list">
              {seedSpeakingQueue.map(({ memberId, status }) => {
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
        </Card>
      </div>
    </div>
  );
};

export default LiveSitting;
