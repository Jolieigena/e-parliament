import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';
import { useApp } from '../../../mock/store';
import Avatar from '../../../components/ui/Avatar';
import PortalMenu from '../../../components/ui/PortalMenu';

const GovProfileMenu = () => {
  const { currentGovUser, institutions, govLogout } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const institution = institutions.find((i) => i.id === currentGovUser.institutionId);

  const handleLogout = () => {
    govLogout();
    navigate('/government/signin');
  };

  return (
    <div className="topbar-widget profile-menu" ref={ref}>
      <button type="button" className="profile-trigger" onClick={() => setOpen((o) => !o)}>
        <Avatar name={currentGovUser.name} size={32} />
        <span className="profile-trigger-info">
          <span className="profile-trigger-name">{currentGovUser.name}</span>
          <span className="profile-trigger-role">{institution?.name}</span>
        </span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="topbar-dropdown profile-dropdown">
          <PortalMenu />
          <button type="button" onClick={handleLogout}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default GovProfileMenu;
