import { Link } from 'react-router-dom';
import { UserCog, Radio } from 'lucide-react';
import { useApp } from '../../../mock/store';
import Card from '../../../components/ui/Card';

const AdminDashboard = () => {
  const { currentUser, members, session } = useApp();

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
        <h1 className="portal-page-title" style={{ margin: 0 }}>Good day, {currentUser.name}</h1>
        <div className="portal-topbar-session" data-live={session.live} style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
          <Radio size={13} />
          {session.name} {session.live ? '· Live' : '· Adjourned'}
        </div>
      </div>
      <p className="portal-page-subtitle">System Administration</p>

      <Card className="dash-section" style={{ maxWidth: '600px', marginTop: '2rem' }}>
        <div className="dash-section-header">
          <h2>User accounts</h2>
        </div>
        <p className="dash-footnote">
          <strong>{members.length}</strong> accounts currently provisioned. Create new accounts and
          assign roles from the Accounts workspace.
        </p>
        <Link to="/internal/accounts" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
          <UserCog size={16} /> Manage accounts
        </Link>
      </Card>
    </div>
  );
};

export default AdminDashboard;
