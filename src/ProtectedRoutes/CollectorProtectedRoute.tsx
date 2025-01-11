import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CollectorProtectedRoute = () => {
  const { isLoggedIn } = useSelector((state: any) => state.collectorAuth);

  if (!isLoggedIn) {
    return <Navigate to="/collector/login" replace />;
  }

  return <Outlet />;
};

export default CollectorProtectedRoute;
