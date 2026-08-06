import { Link } from 'react-router-dom';
import { Check, Megaphone, ArrowRight, Info } from 'lucide-react';
import { useApp } from '../../../mock/store';
import { IDEA_PETITION_THRESHOLD } from '../../../mock/entities';

const Petitions = () => {
  const { petitions, signPetition } = useApp();

  const open = petitions.filter((p) => p.status === 'Open');
  const responded = petitions.filter((p) => p.status === 'Responded');

  return (
    <div>
      <div className="petition-rule-strip">
        <span className="petition-rule-label"><Megaphone size={13} /> How petitions are actioned</span>
        <span className="petition-rule-chip">Ideas with {IDEA_PETITION_THRESHOLD}+ supports move to petitions</span>
        <span className="petition-rule-chip">Validated by the Clerk's office</span>
        <span className="petition-rule-chip">10,000+ signatures → committee response</span>
        <span className="petition-rule-chip">50,000+ signatures → floor debate</span>
      </div>

      <Link to="/public/ideas" className="idea-cta" style={{ marginBottom: '20px', textDecoration: 'none' }}>
        <span className="idea-cta-icon">
          <Megaphone size={18} />
        </span>
        <span className="idea-cta-text">
          <b>Start a petition</b>
          <small>
            Petitions begin as ideas — share yours and gather {IDEA_PETITION_THRESHOLD}+ supports to move it into the petitions process.
          </small>
        </span>
        <ArrowRight size={17} className="idea-cta-arrow" />
      </Link>

      <h3 style={{ fontSize: '15px', margin: '0 0 14px' }}>Open for signatures</h3>
      {open.length === 0 ? (
        <div className="public-card" style={{ textAlign: 'center', padding: '32px' }}>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13.5px' }}>
            No petitions are currently open for signatures.
          </p>
        </div>
      ) : (
        <div className="petitions-grid">
          {open.map((pet) => {
            const pct = Math.min(100, Math.round((pet.base / pet.goal) * 100));

            return (
              <div key={pet.id} className="public-card petition-card">
                <h4>{pet.title}</h4>
                <p>{pet.desc}</p>

                <div className="petition-meter">
                  <div className="nums">
                    <b>{pet.base.toLocaleString()} signatures</b>
                    <span>Goal: {pet.goal.toLocaleString()}</span>
                  </div>
                  <div className="bar-track" style={{ height: '8px', background: 'var(--parchment)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div className="bar-fill" style={{ width: `${pct}%`, height: '100%', background: 'var(--brand)', borderRadius: '100px' }} />
                  </div>
                </div>

                <button
                  type="button"
                  className={`sign-btn ${pet.signed ? 'signed' : ''}`}
                  onClick={() => !pet.signed && signPetition(pet.id)}
                >
                  {pet.signed ? (
                    <>
                      <Check size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Signed
                    </>
                  ) : (
                    'Sign this petition'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {responded.length > 0 && (
        <>
          <h3 style={{ fontSize: '15px', margin: '28px 0 14px' }}>
            <Info size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Responded by the Assembly
          </h3>
          <div className="petitions-grid">
            {responded.map((pet) => (
              <div key={pet.id} className="public-card petition-card">
                <h4>{pet.title}</h4>
                <p>{pet.desc}</p>
                <div className="petition-meter">
                  <div className="nums">
                    <b>{pet.base.toLocaleString()} signatures</b>
                    <span>Closed</span>
                  </div>
                  <div className="bar-track" style={{ height: '8px', background: 'var(--parchment)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div className="bar-fill" style={{ width: `${Math.min(100, Math.round((pet.base / pet.goal) * 100))}%`, height: '100%', background: 'var(--success)', borderRadius: '100px' }} />
                  </div>
                </div>
                {pet.response && (
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', borderLeft: '2px solid var(--brand)', paddingLeft: '10px', margin: '8px 0 0' }}>
                    <b>Official response:</b> {pet.response}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Petitions;
