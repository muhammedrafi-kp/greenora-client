import React from 'react';
import Layout from '../../components/collector/layout/Layout'; 
import Breadcrumbs from '../../components/collector/Breadcrumbs';
import Notifications from '../../components/collector/Notifications';

const CollectorNotifications :React.FC = () => {
  return (
    <Layout>
      <Breadcrumbs title="Notifications" />
      <Notifications />
    </Layout>
  )
}

export default CollectorNotifications;
