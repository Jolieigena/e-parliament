import { useState } from 'react';
import { useApp } from '../../mock/store';
import MemberProfileModal from './MemberProfileModal';

const initials = (name) =>
  name
    .replace(/^(Hon\.|Ms\.|Mr\.|Dr\.)\s*/i, '')
    .trim()
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const Avatar = ({ name, size = 36, onClick }) => {
  const { members } = useApp();
  const [showModal, setShowModal] = useState(false);

  const matchedMember = members ? members.find((m) => m.name === name || name.includes(m.name.replace(/^(Hon\.|Ms\.|Mr\.|Dr\.)\s*/i, ''))) : null;

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (matchedMember) {
      e.preventDefault();
      e.stopPropagation();
      setShowModal(true);
    }
  };

  return (
    <>
      <div 
        className="ui-avatar" 
        style={{ width: size, height: size, fontSize: size * 0.38, cursor: matchedMember ? 'pointer' : 'default' }}
        onClick={handleClick}
        title={matchedMember ? `Click to view MP profile for ${matchedMember.name}` : name}
      >
        {initials(name)}
      </div>

      {showModal && matchedMember && (
        <MemberProfileModal member={matchedMember} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default Avatar;
