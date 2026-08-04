import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, Globe2, Landmark, Building2, ArrowRight } from 'lucide-react';
import { useApp } from '../../mock/store';
import BrandMark from '../../components/ui/BrandMark';
import ThemeToggle from '../../components/ui/ThemeToggle';

const ALL_PORTALS = [
  { action: 'public', icon: Globe2, title: 'Public Portal', description: 'Browse bills & committees' },
  { action: 'internal', icon: Landmark, title: 'Internal Portal', description: 'Parliament staff sign in' },
  { action: 'government', icon: Building2, title: 'Government Portal', description: 'Ministries & agencies' },
];

const GovernmentSignIn = () => {
  const { govAccounts, govLogin, accounts, login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const account = govAccounts.find((a) => a.email === email.trim().toLowerCase());
    if (!account) {
      setError('No institution account found with that email. Contact Parliament for access.');
      return;
    }
    govLogin(account.govUserId);
    navigate('/government');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="portal-topbar" style={{ position: 'relative', zIndex: 20 }}>
        <div className="portal-topbar-left">
          <Link
            to="/public"
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-strong)', textDecoration: 'none' }}
          >
            <div style={{ color: 'var(--accent)', display: 'flex' }}>
              <BrandMark size={22} />
            </div>
            E-Parliament
          </Link>
        </div>
        <div className="portal-topbar-right">
          <ThemeToggle />
        </div>
      </header>

      <div className="split-page" style={{ minHeight: 'auto', flex: 1 }}>
        <div className="split-left" style={{ padding: '2.5rem' }}>
          <div className="split-form-wrap">
            <div className="ui-card" style={{ padding: '2.5rem 2rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', border: 'none', boxShadow: 'var(--shadow-md)' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <div className="input-icon-wrap">
                <Mail size={17} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  className="form-input has-icon"
                  placeholder="boateng@justice.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-icon-wrap">
                <Lock size={17} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input has-icon has-icon-right"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="form-error">
                <AlertCircle size={15} /> {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              <LogIn size={18} /> Sign in
            </button>
          </form>

          <div className="portal-signin-footer">
            Institution accounts are provisioned by Parliament.
          </div>
          </div>

          <div className="portal-switch-label">Quick access</div>
          <div className="portal-switch-grid">
            {ALL_PORTALS.map(({ action, icon: Icon, title, description }) => (
              <button
                type="button"
                key={action}
                className="portal-switch-card"
                style={{ textAlign: 'left', width: '100%' }}
                onClick={() => {
                  if (action === 'public') {
                    navigate('/public');
                  } else if (action === 'internal') {
                    if (accounts && accounts.length > 0) {
                      login(accounts[0].memberId);
                    }
                    navigate('/internal');
                  } else if (action === 'government') {
                    if (govAccounts && govAccounts.length > 0) {
                      govLogin(govAccounts[0].govUserId);
                    }
                    navigate('/government');
                  }
                }}
              >
                <Icon size={18} />
                <div>
                  <strong>{title}</strong>
                  <span>{description}</span>
                </div>
                <ArrowRight size={15} className="portal-switch-arrow" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="split-right">
        <img src="/parliament-chamber.jpg" alt="" className="split-bg-image" />
        <div className="split-overlay">
          <h2>Government &amp; Parliament, Connected</h2>
          <p>
            A secure channel for ministries and agencies to respond to oversight, submit
            legislation, and exchange official correspondence with Parliament.
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default GovernmentSignIn;
