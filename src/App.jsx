import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './mock/store';
import { applyTheme, getStoredTheme } from './mock/theme';
import InternalSignIn from './portals/internal/SignIn';
import InternalLayout from './portals/internal/Layout';
import Dashboard from './pages/Dashboard';
import Bills from './pages/Bills';
import BillPage from './pages/BillPage';
import Session from './pages/Session';
import LiveSitting from './pages/LiveSitting';
import Committees from './pages/Committees';
import CommitteePage from './pages/CommitteePage';
import Users from './pages/Users';
import VotingRecords from './pages/VotingRecords';
import Reports from './pages/Reports';
import OfficialDocuments from './pages/OfficialDocuments';
import GovernmentSignIn from './portals/government/SignIn';
import GovernmentLayout from './portals/government/Layout';
import GovDashboard from './portals/government/pages/Dashboard';
import Legislation from './portals/government/pages/Legislation';
import LegislationDetail from './portals/government/pages/LegislationDetail';
import Oversight from './portals/government/pages/Oversight';
import CommitteeRequests from './portals/government/pages/CommitteeRequests';
import Documents from './portals/government/pages/Documents';
import PublicLayout from './portals/public/Layout';
import PublicHome from './portals/public/pages/Home';
import PublicBills from './portals/public/pages/Bills';
import PublicBillDetail from './portals/public/pages/BillDetail';
import PublicCommittees from './portals/public/pages/Committees';
import PublicCommitteeDetail from './portals/public/pages/CommitteeDetail';
import PublicMembers from './portals/public/pages/Members';
import PublicSitting from './portals/public/pages/Sitting';
import PublicLiveSitting from './portals/public/pages/LiveSitting';
import PublicHowItWorks from './portals/public/pages/HowItWorks';
import PublicPetitions from './portals/public/pages/Petitions';
import './index.css';

function App() {
  useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/internal/signin" replace />} />
          <Route path="/public" element={<PublicLayout />}>
            <Route index element={<PublicHome />} />
            <Route path="bills" element={<PublicBills />} />
            <Route path="bills/:billId" element={<PublicBillDetail />} />
            <Route path="committees" element={<PublicCommittees />} />
            <Route path="committees/:committeeId" element={<PublicCommitteeDetail />} />
            <Route path="members" element={<PublicMembers />} />
            <Route path="sitting" element={<PublicSitting />} />
            <Route path="sitting/live" element={<PublicLiveSitting />} />
            <Route path="how-it-works" element={<PublicHowItWorks />} />
            <Route path="petitions" element={<PublicPetitions />} />
          </Route>
          <Route path="/internal/signin" element={<InternalSignIn />} />
          <Route path="/internal" element={<InternalLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="bills" element={<Bills />} />
            <Route path="bills/:billId" element={<BillPage />} />
            <Route path="session" element={<Session />} />
            <Route path="session/live" element={<LiveSitting />} />
            <Route path="committees" element={<Committees />} />
            <Route path="committees/:committeeId" element={<CommitteePage />} />
            <Route path="users" element={<Users />} />
            <Route path="official-documents" element={<OfficialDocuments />} />
            <Route path="voting-records" element={<VotingRecords />} />
            <Route path="reports" element={<Reports />} />
          </Route>
          <Route path="/government/signin" element={<GovernmentSignIn />} />
          <Route path="/government" element={<GovernmentLayout />}>
            <Route index element={<GovDashboard />} />
            <Route path="legislation" element={<Legislation />} />
            <Route path="legislation/:billId" element={<LegislationDetail />} />
            <Route path="oversight" element={<Oversight />} />
            <Route path="committee-requests" element={<CommitteeRequests />} />
            <Route path="documents" element={<Documents />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
