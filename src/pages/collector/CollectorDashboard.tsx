import React from 'react';
import Layout from '../../components/collector/layout/Layout';
import Breadcrumbs from '../../components/collector/Breadcrumbs';
import DashboardContent from '../../components/collector/DashboardContent';

const CollectorDashboard: React.FC = () => {
  return (
    <Layout>
      <Breadcrumbs title='Dashboard' />
      <DashboardContent />
    </Layout>
  );
};

export default CollectorDashboard; 