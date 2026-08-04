// Static per-party aye-lean used only for the "Call a division" simulation —
// not fabricated per-bill data, just a fixed baseline for how each bloc
// tends to vote so a division looks like real bloc voting, not a coin flip.
const PARTY_AYE_LEAN = { 'party-progressive': 0.7, 'party-unity': 0.55, 'party-reform': 0.4 };

export function simulateChoice(partyId) {
  const ayeProb = PARTY_AYE_LEAN[partyId] ?? 0.5;
  const r = Math.random();
  if (r < ayeProb) return 'aye';
  if (r < ayeProb + (1 - ayeProb) * 0.75) return 'nay';
  return 'abstain';
}
