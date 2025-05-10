import React from 'react';
import Layout from '../../components/collector/layout/Layout';
import Breadcrumbs from '../../components/collector/Breadcrumbs';
import Dashboard from '../../components/collector/Dashboard';

const CollectorDashboard: React.FC = () => {
  return (
    <Layout>
      <Breadcrumbs title='Dashboard' />
      <Dashboard />
    </Layout>
  );
};

export default CollectorDashboard; 