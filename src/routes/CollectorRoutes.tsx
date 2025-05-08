import { Routes, Route } from 'react-router-dom';

import CollectorProtectedRoute from '../ProtectedRoutes/CollectorProtectedRoute';
import CollectorLoginProtector from '../ProtectedRoutes/CollectorLoginProtector';

import CollectorLogin from '../pages/collector/CollectorLogin';
import CollectorSignUp from '../pages/collector/CollectorSignUp';
import CollectorDashboard from '../pages/collector/CollectorDashboard';
import CollectorAssignedTasks from '../pages/collector/CollectorAssignedCollections';
import CollectorProfile from '../pages/collector/CollectorProfile';
import CollectorContact from '../pages/collector/CollectorContact';
import CollectorReview from '../pages/collector/CollectorReview';
import CollectorCollectionPayment from '../pages/collector/CollectorCollectionPayment';
import CollectorNotifications from '../pages/collector/CollectorNotifications';
import CollectorChat from '../pages/collector/CollectorChat';
import OtpVerification from '../components/collector/OtpVerification';
import ForgetPassword from '../components/collector/ForgetPassword';
import CollectorResetPassword from '../pages/collector/CollectorResetPassword';
import CollectorCollectionDetails from '../pages/collector/CollectorCollectionDetails';
import CollectorAddCollectionDetails from '../pages/collector/CollectorAddCollectionDetails';
import Error404 from '../components/common/Error404';

const AgentRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<CollectorLoginProtector />}>
        <Route path="/login" element={<CollectorLogin />} />
        <Route path="/signup" element={<CollectorSignUp />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<CollectorResetPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<CollectorProtectedRoute />}>
        <Route path="/" element={<CollectorDashboard />} />
        <Route path="/tasks" element={<CollectorAssignedTasks />} />
        <Route path="/profile" element={<CollectorProfile />} />
        <Route path="/collection-details" element={<CollectorCollectionDetails />} />
        <Route path="/add-collection-details" element={<CollectorAddCollectionDetails />} />
        <Route path="/contact" element={<CollectorContact />} />
        <Route path="/review" element={<CollectorReview />} />
        <Route path="/receive-payment" element={<CollectorCollectionPayment />} />
        <Route path="/notifications" element={<CollectorNotifications />} />
        <Route path="/chat" element={<CollectorChat />} />
      </Route>
      <Route path="*" element={<Error404 role='collector' />} />
    </Routes>


  );
};

export default AgentRoutes;
