// Adapted from the HuzaGrid brand mark (same parent company) — the three-bar
// glyph is kept, recolored via currentColor and rounded to match this
// system's mark specs instead of HuzaGrid's blue squared-off original.
const BrandMark = ({ size = 22 }) => (
  <svg
    width={size}
    height={(size * 26) / 20}
    viewBox="0 0 20 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="3" y1="3" x2="3" y2="23" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <line x1="10" y1="9" x2="10" y2="17" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <line x1="17" y1="3" x2="17" y2="18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <line x1="17" y1="21" x2="17" y2="23" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export default BrandMark;
