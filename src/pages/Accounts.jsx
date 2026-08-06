import { useEffect, useMemo, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import {
  User,
  Mail,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Users2,
  Search,
  ShieldCheck,
  Trash2,
  Plus,
  KeyRound,
  ToggleRight,
  ToggleLeft,
} from 'lucide-react';
import { useApp } from '../mock/store';
import { PARTIES, PERMISSIONS, ROLES, ROLE_COLORS } from '../mock/entities';
import { ROLE_ICONS, DEFAULT_ROLE_ICON, ROLE_TONE } from '../mock/roleMeta';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';

const roleIcon = (role) => ROLE_ICONS[role] || DEFAULT_ROLE_ICON;
const roleTone = (role) => ROLE_TONE[role] || 'neutral';

const Accounts = () => {
  const {
    currentUser,
    members,
    accounts,
    roles,
    addUser,
    updateUserRole,
    toggleAccountStatus,
    createRole,
    setRolePermissions,
    deleteRole,
  } = useApp();

  const [params] = useSearchParams();
  const [tab, setTab] = useState(() => {
    const fromUrl = params.get('tab');
    return fromUrl === 'roles' ? 'roles' : fromUrl === 'create' ? 'create' : 'people';
  });
  const [query, setQuery] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(roles[0]?.name || 'MP');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newRoleName, setNewRoleName] = useState('');
  const [roleError, setRoleError] = useState('');
  const [selectedRole, setSelectedRole] = useState(roles[0]?.name || 'MP');
  const [draftPerms, setDraftPerms] = useState([]);
  const [permsSaved, setPermsSaved] = useState(false);

  const currentRoleDef = roles.find((r) => r.name === currentUser.roles[0]);
  const can = (perm) => currentRoleDef?.permissions?.includes(perm) ?? false;

  const tabs = [
    { id: 'people', label: 'People', icon: Users2 },
    { id: 'create', label: 'Create account', icon: UserPlus },
    ...(can('manage_roles') ? [{ id: 'roles', label: 'Roles & permissions', icon: ShieldCheck }] : []),
  ];

  const accountFor = (memberId) => accounts.find((a) => a.memberId === memberId);
  const emailFor = (memberId) => accountFor(memberId)?.email;

  const q = query.trim().toLowerCase();
  const filteredMembers = useMemo(
    () =>
      q
        ? members.filter(
            (m) => m.name.toLowerCase().includes(q) || emailFor(m.id)?.toLowerCase().includes(q),
          )
        : members,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q, members, accounts],
  );

  const selectedRoleDef = roles.find((r) => r.name === selectedRole) || roles[0];

  useEffect(() => {
    setDraftPerms(selectedRoleDef ? [...selectedRoleDef.permissions] : []);
    setPermsSaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRole]);

  if (!can('manage_users')) return <Navigate to="/internal" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    const normalizedEmail = email.trim().toLowerCase();
    if (accounts.some((a) => a.email === normalizedEmail)) {
      setError('An account with that email already exists.');
      return;
    }
    if (!roles.some((r) => r.name === role)) {
      setError('Please choose a valid role.');
      return;
    }
    addUser(name.trim(), normalizedEmail, role);
    setSuccess(`${name.trim()} was signed up as ${role}.`);
    setError('');
    setName('');
    setEmail('');
    setRole(roles[0]?.name || 'MP');
  };

  const handleCreateRole = (e) => {
    e.preventDefault();
    setRoleError('');
    const trimmed = newRoleName.trim();
    if (!trimmed) return;
    if (roles.some((r) => r.name.toLowerCase() === trimmed.toLowerCase())) {
      setRoleError('A role with that name already exists.');
      return;
    }
    createRole(trimmed);
    setNewRoleName('');
    setSelectedRole(trimmed);
  };

  const handleDeleteRole = (roleToDelete) => {
    const inUse = members.some((m) => m.roles[0] === roleToDelete);
    if (inUse) {
      setRoleError(`Cannot delete "${roleToDelete}" — it is assigned to active members.`);
      return;
    }
    deleteRole(roleToDelete);
    if (selectedRole === roleToDelete) setSelectedRole(roles[0]?.name || 'MP');
    setRoleError('');
  };

  const togglePermission = (permissionId) => {
    setDraftPerms((prev) =>
      prev.includes(permissionId) ? prev.filter((p) => p !== permissionId) : [...prev, permissionId],
    );
    setPermsSaved(false);
  };

  const savePermissions = () => {
    if (!selectedRoleDef) return;
    setRolePermissions(selectedRoleDef.name, draftPerms);
    setPermsSaved(true);
  };

  return (
    <div>
      <h1 className="portal-page-title" style={{ margin: 0 }}>Account management</h1>
      <p className="portal-page-subtitle">People in the system, their roles, and what each role can do.</p>

      <div className="acct-tabs">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`acct-tab ${tab === id ? 'active' : ''}`}
            onClick={() => setTab(id)}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {tab === 'people' && (
        <Card className="dash-section" style={{ marginTop: '1rem' }}>
          <div className="dash-section-header">
            <h2>People ({members.length})</h2>
            <span className="dash-footnote">Change a person's role or suspend their account.</span>
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
            <p className="dash-empty-state"><Search size={15} /> No people match "{query}".</p>
          )}
          <ul className="user-list">
            {filteredMembers.map((m) => {
              const account = accountFor(m.id);
              const active = account?.active ?? true;
              const isSelf = m.id === currentUser.id;
              const currentRole = m.roles[0];
              return (
                <li key={m.id} className={active ? '' : 'user-list-inactive'}>
                  <Avatar name={m.name} size={34} />
                  <div className="user-list-info">
                    <span className="user-list-name">{m.name}</span>
                    <span className="user-list-email">{emailFor(m.id) || 'No email on file'}</span>
                  </div>
                  {m.party && (
                    <span
                      className="member-party-chip"
                      style={{
                        background: `${PARTIES.find((p) => p.id === m.party)?.color}22`,
                        color: PARTIES.find((p) => p.id === m.party)?.color,
                      }}
                    >
                      {PARTIES.find((p) => p.id === m.party)?.name}
                    </span>
                  )}
                  <Badge tone={active ? roleTone(currentRole) : 'neutral'} icon={roleIcon(currentRole)}>
                    {currentRole}
                  </Badge>
                  <Badge tone={active ? 'success' : 'neutral'}>{active ? 'Active' : 'Suspended'}</Badge>
                  <select
                    className="form-input user-role-select"
                    value={currentRole}
                    onChange={(e) => updateUserRole(m.id, e.target.value)}
                    aria-label={`Change role for ${m.name}`}
                  >
                    {roles.map((r) => (
                      <option key={r.name} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="icon-btn"
                    disabled={isSelf}
                    title={isSelf ? 'You cannot suspend your own account' : active ? 'Suspend account' : 'Restore account'}
                    onClick={() => toggleAccountStatus(m.id)}
                  >
                    {active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {tab === 'create' && (
        <Card className="dash-section" style={{ marginTop: '1rem', maxWidth: '560px' }}>
          <div className="dash-section-header">
            <h2>Sign up a new account</h2>
          </div>
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
                {roles.map((r) => (
                  <option key={r.name} value={r.name}>{r.name === 'MP' ? 'Member of Parliament' : r.name}</option>
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
              <UserPlus size={17} /> Sign up account
            </button>
          </form>
        </Card>
      )}

      {tab === 'roles' && can('manage_roles') && (
        <div className="roles-grid" style={{ marginTop: '1rem' }}>
          <Card className="dash-section">
            <div className="dash-section-header">
              <h2>Roles ({roles.length})</h2>
            </div>
            <form onSubmit={handleCreateRole} className="new-role-form">
              <div className="input-icon-wrap" style={{ flex: 1 }}>
                <KeyRound size={17} className="input-icon" />
                <input
                  type="text"
                  className="form-input has-icon"
                  placeholder="New role name…"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm" disabled={!newRoleName.trim()}>
                <Plus size={15} /> Create
              </button>
            </form>
            {roleError && (
              <p className="form-error" style={{ marginTop: '0.75rem' }}>
                <AlertCircle size={15} /> {roleError}
              </p>
            )}
            <ul className="role-list">
              {roles.map((r) => {
                const isBuiltIn = ROLES.includes(r.name);
                const color = ROLE_COLORS[r.name] || r.color;
                return (
                  <li
                    key={r.name}
                    className={`role-row ${selectedRole === r.name ? 'active' : ''}`}
                    onClick={() => setSelectedRole(r.name)}
                  >
                    <span className="role-color-dot" style={{ backgroundColor: color }} />
                    <span className="role-row-name">{r.name}</span>
                    <span className="role-row-count">{r.permissions.length} permissions</span>
                    {isBuiltIn ? (
                      <Badge tone="neutral">Built-in</Badge>
                    ) : (
                      <button
                        type="button"
                        className="icon-btn"
                        title={`Delete ${r.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRole(r.name);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card className="dash-section">
            <div className="dash-section-header">
              <h2>Permissions for {selectedRoleDef?.name}</h2>
              <span className="dash-footnote">{selectedRoleDef?.permissions.length} granted</span>
            </div>
            <div className="permission-list">
              {PERMISSIONS.map((p) => {
                const checked = draftPerms.includes(p.id);
                return (
                  <label key={p.id} className={`permission-row ${checked ? 'checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePermission(p.id)}
                    />
                    <div>
                      <span className="permission-label">{p.label}</span>
                      <span className="permission-desc">{p.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="perm-save-row">
              {permsSaved && (
                <p className="form-success" style={{ margin: 0, marginRight: 'auto' }}>
                  <CheckCircle2 size={15} /> Permissions saved.
                </p>
              )}
              <button type="button" className="btn btn-primary btn-md" onClick={savePermissions}>
                <ShieldCheck size={17} /> Save permissions
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Accounts;
