import { useSearchParams } from 'react-router-dom';
import { useApp } from '../mock/store';
import MPDashboard from '../portals/internal/dashboards/MPDashboard';
import SpeakerDashboard from '../portals/internal/dashboards/SpeakerDashboard';
import ClerkDashboard from '../portals/internal/dashboards/ClerkDashboard';
import AdminDashboard from '../portals/internal/dashboards/AdminDashboard';
import SuperuserDashboard from '../portals/internal/dashboards/SuperuserDashboard';

const VIEW_ROLES = { mp: 'MP', speaker: 'Speaker', clerk: 'Clerk' };

const Dashboard = () => {
  const { currentUser } = useApp();
  const [params] = useSearchParams();
  const role = currentUser.roles[0];
  const view = params.get('view');

  // A Superuser can preview any role's overview via ?view=mp|speaker|clerk.
  const activeRole = role === 'Superuser' && VIEW_ROLES[view] ? VIEW_ROLES[view] : role;

  if (activeRole === 'MP') return <MPDashboard />;
  if (activeRole === 'Speaker') return <SpeakerDashboard />;
  if (activeRole === 'Clerk') return <ClerkDashboard />;
  if (activeRole === 'Administrator') return <AdminDashboard />;
  if (activeRole === 'Superuser') return <SuperuserDashboard />;

  return (
    <div>
      <h1 className="portal-page-title">Good day, {currentUser.name}</h1>
      <p className="portal-page-subtitle">Your role '{role}' does not have a configured dashboard.</p>
    </div>
  );
};

export default Dashboard;
