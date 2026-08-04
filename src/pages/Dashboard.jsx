import { useApp } from '../mock/store';
import MPDashboard from '../portals/internal/dashboards/MPDashboard';
import SpeakerDashboard from '../portals/internal/dashboards/SpeakerDashboard';
import ClerkDashboard from '../portals/internal/dashboards/ClerkDashboard';
import AdminDashboard from '../portals/internal/dashboards/AdminDashboard';

const Dashboard = () => {
  const { currentUser } = useApp();
  const role = currentUser.roles[0];

  if (role === 'MP') return <MPDashboard />;
  if (role === 'Speaker') return <SpeakerDashboard />;
  if (role === 'Clerk') return <ClerkDashboard />;
  if (role === 'Administrator') return <AdminDashboard />;

  return (
    <div>
      <h1 className="portal-page-title">Good day, {currentUser.name}</h1>
      <p className="portal-page-subtitle">Your role '{role}' does not have a configured dashboard.</p>
    </div>
  );
};

export default Dashboard;
