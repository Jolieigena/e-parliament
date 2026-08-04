import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, FileText } from 'lucide-react';
import { useApp } from '../../mock/store';

const NotificationBell = () => {
  const { bills } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const recent = [...bills]
    .map((b) => ({ bill: b, last: b.history[b.history.length - 1] }))
    .sort((a, b) => new Date(b.last.date) - new Date(a.last.date))
    .slice(0, 4);

  return (
    <div className="topbar-widget" ref={ref}>
      <button
        type="button"
        className="topbar-icon-btn"
        onClick={() => {
          setOpen((o) => !o);
          setSeen(true);
        }}
        aria-label="Notifications"
      >
        <Bell size={17} />
        {!seen && <span className="topbar-badge-dot" />}
      </button>
      {open && (
        <div className="topbar-dropdown notif-dropdown">
          <div className="topbar-dropdown-title">Recent activity</div>
          <ul>
            {recent.map(({ bill, last }) => (
              <li key={bill.id}>
                <button type="button" onClick={() => { navigate(`/internal/bills/${bill.id}`); setOpen(false); }}>
                  <span className="notif-icon">
                    <FileText size={14} />
                  </span>
                  <span className="notif-text">
                    <strong>{bill.title}</strong> moved to {last.stage}
                    <span className="notif-date">{last.date}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
