import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CollectorProtectedRoute = () => {
  const { isLoggedIn,role } = useSelector((state: any) => state.auth);

  if (!isLoggedIn||role!=='collector') {
    return <Navigate to="/collector/login" replace />;
  }

  return <Outlet />;
};

export default CollectorProtectedRoute;
