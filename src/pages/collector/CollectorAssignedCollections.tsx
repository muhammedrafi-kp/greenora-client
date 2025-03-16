import React from 'react';
import Layout from '../../components/collector/layout/Layout';
import Breadcrumbs from '../../components/collector/Breadcrumbs';
import AssignedCollections from '../../components/collector/AssignedCollections';

const CollectorAssignedCollections:React.FC = () => {
  return (
    <Layout>
      <Breadcrumbs title='Assigned tasks'/>
      <AssignedCollections />
    </Layout>
  );
};

export default CollectorAssignedCollections; 