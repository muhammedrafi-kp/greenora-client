import React from 'react';
import Layout from '../../components/admin/layout/Layout';
import Dashboard from '../../components/admin/Dashboard';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
const AdminDashboard: React.FC = () => {
  return (
    <Layout>
      <Breadcrumbs title='Dashboard' />
      <Dashboard />
    </Layout>
  );
};

export default AdminDashboard;