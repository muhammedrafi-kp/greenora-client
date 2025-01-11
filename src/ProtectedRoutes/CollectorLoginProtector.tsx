import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CollectorLoginProtector: React.FC = () => {
  const { isLoggedIn } = useSelector((state: any) => state.collectorAuth);

  if (isLoggedIn) {
    return <Navigate to="/collector/dashboard" replace />;
  }

  return <Outlet />;
};

export default CollectorLoginProtector;
