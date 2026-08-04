import Avatar from './Avatar';

const AvatarGroup = ({ members = [], max = 3, size = 24 }) => {
  const visible = members.slice(0, max);
  const overflow = members.length - max;

  return (
    <div className="avatar-group">
      {visible.map((m, i) => (
        <div key={m.id || i} className="avatar-group-item" style={{ zIndex: max - i }}>
          <Avatar name={m.name} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="avatar-group-overflow"
          style={{ width: size, height: size, fontSize: size * 0.4, zIndex: 0 }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
