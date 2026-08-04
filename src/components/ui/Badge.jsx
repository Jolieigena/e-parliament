const Badge = ({ tone = 'neutral', icon: Icon, children }) => (
  <span className={`ui-badge ui-badge-${tone}`}>
    {Icon && <Icon size={13} />}
    {children}
  </span>
);

export default Badge;
