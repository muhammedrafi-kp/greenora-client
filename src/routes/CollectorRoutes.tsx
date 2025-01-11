import { Routes, Route } from 'react-router-dom';
import CollectorLogin from '../pages/collector/CollectorLogin';
import CollectorSignUp from '../pages/collector/CollectorSignUp';
import CollectorDashboard from '../pages/collector/CollectorDashboard';
import CollectorAssignedTasks from '../pages/collector/CollectorAssignedTasks';
import CollectorProfile from '../pages/collector/CollectorProfile';
// import AgentPickupHistory from '../pages/agent/AgentPickupHistory';
// import AgentRoutePlanning from '../pages/agent/AgentRoutePlanning';
// import ChangePassword from '../components/collector/ChangePassword';
import OtpVerification from '../components/collector/OtpVerification';
import ForgetPassword from '../components/collector/ForgetPassword';
import ResetPassword from '../components/collector/ResetPassword';

import CollectorProtectedRoute from '../ProtectedRoutes/CollectorProtectedRoute';
import CollectorLoginProtector from '../ProtectedRoutes/CollectorLoginProtector';


const AgentRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}

       <Route element={<CollectorLoginProtector />}>
        <Route path="/login" element={<CollectorLogin />} />
        <Route path="/signup" element={<CollectorSignUp />} />
      </Route>

      {/* Protected Routes */}

      <Route element={<CollectorProtectedRoute />}>
        <Route path="/dashboard" element={<CollectorDashboard />} />
        <Route path="/tasks" element={<CollectorAssignedTasks />} />
      </Route>
      {/* <Route path="/profile" element={<AgentProfile />} /> */}
      <Route path="/profile" element={<CollectorProfile />} />
      <Route path="/otp" element={<OtpVerification email='a'  />} />
      <Route path="/forget" element={<ForgetPassword   />} />
      <Route path="/reset" element={<ResetPassword token=''  />} />
      {/* <Route path="/change-password" element={<ChangePassword />} /> */}

      {/* <Route path="/pickup-history" element={<AgentPickupHistory />} /> */}
      {/* <Route path="/route-planning" element={<AgentRoutePlanning />} /> */}
    </Routes>

    
  );
};

export default AgentRoutes;
