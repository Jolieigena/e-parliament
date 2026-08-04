import { FileText, CheckCircle2, User, Users2, Mic2 } from 'lucide-react';

const iconMap = {
  Draft: FileText,
  Introduced: Mic2,
  'Committee Review': Users2,
  Debate: Mic2,
  Voting: User,
  Assent: CheckCircle2,
  Enacted: CheckCircle2,
};

const ActivityTimeline = ({ history = [] }) => {
  if (!history || history.length === 0) return <p className="dash-footnote">No activity yet.</p>;

  const reversed = [...history].reverse();

  return (
    <div className="activity-timeline">
      {reversed.map((event, idx) => {
        const Icon = iconMap[event.stage] || FileText;
        const isLast = idx === reversed.length - 1;
        return (
          <div key={idx} className="activity-timeline-item">
            {!isLast && <div className="activity-timeline-connector" />}
            <div className="activity-timeline-icon-wrap">
              <Icon size={14} />
            </div>
            <div className="activity-timeline-content">
              <div className="activity-timeline-header">
                <strong>{event.stage}</strong>
                <span className="activity-timeline-date">{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <p className="activity-timeline-note">{event.note}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityTimeline;
