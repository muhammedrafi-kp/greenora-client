import React from 'react';
import Layout from '../../components/admin/layout/Layout';
import DashboardContent from '../../components/admin/DashboardContent';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
const AdminDashboard: React.FC = () => {
  return (
    <Layout>
      <Breadcrumbs title='Dashboard' />
      <DashboardContent />
    </Layout>
  );
};

export default AdminDashboard;