import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CollectorLoginProtector: React.FC = () => {
  const { isLoggedIn,role } = useSelector((state: any) => state.auth);

  if (isLoggedIn&&role==='collector') {
    return <Navigate to="/collector/dashboard" replace />;
  }

  return <Outlet />;
};

export default CollectorLoginProtector;
