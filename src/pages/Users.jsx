import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Mail, UserPlus, AlertCircle, CheckCircle2, Users2, Search } from 'lucide-react';
import { useApp } from '../mock/store';
import { ROLES, PARTIES } from '../mock/entities';
import { ROLE_ICONS } from '../mock/roleMeta';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';

const ROLE_TONE = {
  MP: 'info',
  Speaker: 'progress',
  Clerk: 'neutral',
  Administrator: 'success',
};

const Users = () => {
  const { currentUser, members, accounts, addUser } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MP');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [query, setQuery] = useState('');

  if (currentUser.roles[0] !== 'Administrator') return <Navigate to="/internal" replace />;

  const emailFor = (memberId) => accounts.find((a) => a.memberId === memberId)?.email;

  const q = query.trim().toLowerCase();
  const filteredMembers = q
    ? members.filter((m) => m.name.toLowerCase().includes(q) || emailFor(m.id)?.toLowerCase().includes(q))
    : members;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    const normalizedEmail = email.trim().toLowerCase();
    if (accounts.some((a) => a.email === normalizedEmail)) {
      setError('An account with that email already exists.');
      return;
    }
    addUser(name.trim(), normalizedEmail, role);
    setSuccess(`${name.trim()} was added as ${role}.`);
    setError('');
    setName('');
    setEmail('');
    setRole('MP');
  };

  return (
    <div>

      <Card className="dash-section">
        <h2 style={{ marginBottom: '1rem' }}>Add a user</h2>
        <form onSubmit={handleSubmit} className="new-user-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full name</label>
            <div className="input-icon-wrap">
              <User size={17} className="input-icon" />
              <input
                id="name"
                type="text"
                className="form-input has-icon"
                placeholder="Hon. J. Adjei"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <div className="input-icon-wrap">
              <Mail size={17} className="input-icon" />
              <input
                id="email"
                type="email"
                className="form-input has-icon"
                placeholder="j.adjei@parliament.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="role">Role</label>
            <select id="role" className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r === 'MP' ? 'Member of Parliament' : r}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="form-error">
              <AlertCircle size={15} /> {error}
            </p>
          )}
          {success && (
            <p className="form-success">
              <CheckCircle2 size={15} /> {success}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-md">
            <UserPlus size={17} /> Add user
          </button>
        </form>
      </Card>

      <Card className="dash-section">
        <div className="dash-section-header">
          <h2>All users ({members.length})</h2>
        </div>
        <div className="input-icon-wrap" style={{ maxWidth: '340px', marginBottom: '1rem' }}>
          <Search size={17} className="input-icon" />
          <input
            type="text"
            className="form-input has-icon"
            placeholder="Search by name or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {filteredMembers.length === 0 && (
          <p className="dash-empty-state"><Search size={15} /> No users match "{query}".</p>
        )}
        <ul className="user-list">
          {filteredMembers.map((m) => (
            <li key={m.id}>
              <Avatar name={m.name} size={34} />
              <div className="user-list-info">
                <span className="user-list-name">{m.name}</span>
                <span className="user-list-email">{emailFor(m.id)}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <Badge tone={ROLE_TONE[m.roles[0]]} icon={ROLE_ICONS[m.roles[0]]}>{m.roles[0]}</Badge>
                {m.party && (
                  <span
                    className="member-party-chip"
                    style={{ background: `${PARTIES.find((p) => p.id === m.party)?.color}22`, color: PARTIES.find((p) => p.id === m.party)?.color }}
                  >
                    {PARTIES.find((p) => p.id === m.party)?.name}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Users;
