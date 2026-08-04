const HOW_STEPS = [
  { t: '1. Introduced', d: "A member proposes the bill and it's formally read to the Assembly for the first time." },
  { t: '2. In committee', d: 'A specialist committee examines the bill in detail and can hear public and expert testimony.' },
  { t: '3. Debated', d: "The full Assembly debates the bill's principles in the second reading." },
  { t: '4. Final vote', d: 'Members vote clause-by-clause and on the bill as a whole in the third reading.' },
  { t: '5. Awaiting sign-off', d: 'A passed bill goes for formal sign-off before it can take effect.' },
  { t: '6. Now law', d: 'The bill is enacted and becomes part of the law of the land.' },
];

const HowItWorks = () => {
  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '6px' }}>How a bill becomes law</h2>
      <p style={{ color: 'var(--slate)', fontSize: '13.5px', maxWidth: '65ch', marginBottom: '20px' }}>
        Every bill passes through the same six stages before it can take effect.
      </p>

      <div className="public-card" style={{ padding: '8px 4px', marginBottom: '32px' }}>
        <div className="steps-rail">
          {HOW_STEPS.map((s, idx) => (
            <div key={idx} className="step-card">
              <div className="step-num">{idx + 1}</div>
              <h4>{s.t}</h4>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="public-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Public Participation at Each Stage</h3>
        <p style={{ fontSize: '13px', color: 'var(--slate)', lineHeight: 1.65, margin: 0 }}>
          Citizens can submit public feedback during <strong>Stage 2 (In committee)</strong>, contact their representative before <strong>Stage 3 (Debate)</strong>, and submit e-petitions at any point to request legislative action.
        </p>
      </div>
    </div>
  );
};

export default HowItWorks;
