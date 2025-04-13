import React from 'react';
import Dashboard from '../../components/admin/Dashboard';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
const AdminDashboard: React.FC = () => {
  return (
    <div>
        <Breadcrumbs title='Dashboard' />
        <Dashboard />
    </div>
  );
};

export default AdminDashboard;