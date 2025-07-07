import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const CollectorProtectedRoute = lazy(() => import('../ProtectedRoutes/CollectorProtectedRoute'));
const CollectorLoginProtector = lazy(() => import('../ProtectedRoutes/CollectorLoginProtector'));


const CollectorLogin = lazy(() => import('../pages/collector/CollectorLogin'));
const CollectorSignUp = lazy(() => import('../pages/collector/CollectorSignUp'));
const CollectorDashboard = lazy(() => import('../pages/collector/CollectorDashboard'));
const CollectorAssignedTasks = lazy(() => import('../pages/collector/CollectorAssignedCollections'));
const CollectorProfile = lazy(() => import('../pages/collector/CollectorProfile'));
const CollectorContact = lazy(() => import('../pages/collector/CollectorContact'));
const CollectorReview = lazy(() => import('../pages/collector/CollectorReview'));
const CollectorCollectionPayment = lazy(() => import('../pages/collector/CollectorCollectionPayment'));
const CollectorNotifications = lazy(() => import('../pages/collector/CollectorNotifications'));
const CollectorChat = lazy(() => import('../pages/collector/CollectorChat'));
const OtpVerification = lazy(() => import('../components/collector/OtpVerification'));
const ForgetPassword = lazy(() => import('../components/collector/ForgetPassword'));
const CollectorResetPassword = lazy(() => import('../pages/collector/CollectorResetPassword'));
const CollectorCollectionDetails = lazy(() => import('../pages/collector/CollectorCollectionDetails'));
const CollectorAddCollectionDetails = lazy(() => import('../pages/collector/CollectorAddCollectionDetails'));
const Error404 = lazy(() => import('../components/common/Error404'));
import Spinner from '../components/common/Spinner';

const AgentRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Spinner />}>
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
    </Suspense>
  );
};

export default AgentRoutes;
