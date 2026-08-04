import { useState } from 'react';
import { Check, Megaphone } from 'lucide-react';

const INITIAL_PETITIONS = [
  {
    id: 'pet-1',
    title: 'Extend free public transit to students under 18',
    desc: 'Calls on the Assembly to expand the existing transit subsidy to all secondary school students nationwide.',
    goal: 50000,
    base: 38210,
    signed: false,
  },
  {
    id: 'pet-2',
    title: 'Require published environmental impact reports for all coastal permits',
    desc: 'Asks committees to make environmental assessments public before approving coastal development.',
    goal: 50000,
    base: 12480,
    signed: false,
  },
  {
    id: 'pet-3',
    title: 'Faster appeals process for Freedom of Information refusals',
    desc: 'Requests a statutory 30-day limit on appeals when an information request is refused.',
    goal: 10000,
    base: 9120,
    signed: false,
  },
  {
    id: 'pet-4',
    title: 'Guarantee a minimum number of rural broadband installers',
    desc: 'Asks that the Digital Infrastructure rollout guarantee installer capacity in low-density regions, not just funding.',
    goal: 10000,
    base: 6710,
    signed: false,
  },
];

const Petitions = () => {
  const [petitions, setPetitions] = useState(INITIAL_PETITIONS);

  const handleSign = (id) => {
    setPetitions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, base: p.base + 1, signed: true } : p))
    );
  };

  return (
    <div>
      <div className="petition-rule-strip">
        <span className="petition-rule-label"><Megaphone size={13} /> How petitions are actioned</span>
        <span className="petition-rule-chip">10,000+ signatures &rarr; committee response</span>
        <span className="petition-rule-chip">50,000+ signatures &rarr; floor debate</span>
      </div>

      <div className="petitions-grid">
        {petitions.map((pet) => {
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
                onClick={() => !pet.signed && handleSign(pet.id)}
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
    </div>
  );
};

export default Petitions;
