import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, ThumbsUp, Send, Check, X, ArrowRight, Megaphone } from 'lucide-react';
import { useApp } from '../../../mock/store';
import { IDEA_PETITION_THRESHOLD } from '../../../mock/entities';

const IDEA_CATEGORIES = [
  'Governance',
  'Employment',
  'Accessibility',
  'Health',
  'Education',
  'Technology',
  'Environment',
  'Finance',
];

const FILTER_CATEGORIES = ['All', ...IDEA_CATEGORIES];

const Ideas = () => {
  const { publicIdeas, submitIdea, upvoteIdea } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('All');
  const [title, setTitle] = useState('');
  const [ideaCategory, setIdeaCategory] = useState('Governance');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const filtered =
    category === 'All' ? publicIdeas : publicIdeas.filter((i) => i.category === category);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    submitIdea(title.trim(), ideaCategory, description.trim());
    setTitle('');
    setIdeaCategory('Governance');
    setDescription('');
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div>
      {!showForm ? (
        <button type="button" className="idea-cta" onClick={() => setShowForm(true)}>
          <span className="idea-cta-icon">
            <Lightbulb size={18} />
          </span>
          <span className="idea-cta-text">
            <b>Share your idea</b>
            <small>Propose a policy idea or a request for your representative — takes about two minutes.</small>
          </span>
          <ArrowRight size={17} className="idea-cta-arrow" />
        </button>
      ) : (
        <div className="public-card idea-form-card">
          <div className="idea-form-head">
            <span className="idea-form-icon">
              <Lightbulb size={18} />
            </span>
            <div className="idea-form-head-text">
              <b>Share your idea or request</b>
              <small>
                Ideas that earn {IDEA_PETITION_THRESHOLD}+ community supports move into the petitions process.
              </small>
            </div>
            <button
              type="button"
              className="idea-form-close"
              onClick={() => setShowForm(false)}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="idea-field">
              <label className="field-label" htmlFor="idea-title">
                Title
              </label>
              <input
                id="idea-title"
                className="form-input"
                placeholder="A short, clear title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={90}
                style={{ width: '100%' }}
              />
              <div className="idea-field-hint">
                <span>What should this be called?</span>
                <span>{title.length}/90</span>
              </div>
            </div>

            <div className="idea-field">
              <label className="field-label">Category</label>
              <div className="idea-category-grid">
                {IDEA_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`idea-category-chip ${ideaCategory === c ? 'active' : ''}`}
                    onClick={() => setIdeaCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="idea-field">
              <label className="field-label" htmlFor="idea-description">
                What should we consider?
              </label>
              <textarea
                id="idea-description"
                className="form-input"
                placeholder="Describe the idea, the problem it solves, and who it helps."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                style={{ width: '100%', resize: 'vertical' }}
              />
              <div className="idea-field-hint">
                <span>Be specific — clear ideas are easier to act on.</span>
                <span>{description.length}/1000</span>
              </div>
            </div>

            <div className="idea-form-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary idea-submit-btn"
                disabled={!title.trim() || !description.trim()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Send size={15} /> Submit idea
              </button>
            </div>
          </form>
        </div>
      )}

      {submitted && (
        <div className="idea-success-banner">
          <span className="idea-success-icon">
            <Check size={14} />
          </span>
          Thanks — your idea is now public and open to community support.
        </div>
      )}

      <div className="bills-topic-chips-bar" style={{ marginBottom: '16px' }}>
        {FILTER_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`bills-topic-chip ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="public-card" style={{ textAlign: 'center', padding: '32px' }}>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13.5px' }}>
            No ideas in this category yet. Be the first to share one.
          </p>
        </div>
      ) : (
        <div className="petitions-grid">
          {filtered.map((idea) => {
            const pct = Math.min(100, Math.round((idea.upvotes / IDEA_PETITION_THRESHOLD) * 100));

            return (
              <div key={idea.id} className="public-card petition-card idea-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="idea-chip">{idea.category}</span>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    {new Date(idea.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h4 style={{ margin: '2px 0 0' }}>{idea.title}</h4>
                <p>{idea.description}</p>

                <div className="petition-meter">
                  <div className="nums">
                    <b>{idea.upvotes.toLocaleString()} supports</b>
                    <span>
                      {idea.promoted ? (
                        <Link to="/public/petitions" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>
                          <Megaphone size={12} style={{ verticalAlign: 'middle', marginRight: '2px' }} />
                          Moved to petitions
                        </Link>
                      ) : (
                        `${Math.max(0, IDEA_PETITION_THRESHOLD - idea.upvotes)} to the petition threshold`
                      )}
                    </span>
                  </div>
                  <div className="bar-track" style={{ height: '6px', background: 'var(--parchment)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div className="bar-fill" style={{ width: `${pct}%`, height: '100%', background: idea.promoted ? 'var(--success)' : 'var(--brand)', borderRadius: '100px' }} />
                  </div>
                </div>

                <button
                  type="button"
                  className={`idea-vote-btn ${idea.voted ? 'voted' : ''}`}
                  onClick={() => !idea.voted && upvoteIdea(idea.id)}
                >
                  {idea.voted ? <Check size={14} /> : <ThumbsUp size={14} />}
                  {idea.upvotes.toLocaleString()}
                  <span className="idea-vote-label">{idea.voted ? 'Supported' : 'Support'}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Ideas;
