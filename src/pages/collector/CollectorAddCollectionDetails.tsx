import React from 'react';
import Layout from '../../components/collector/layout/Layout';
import Breadcrumbs from '../../components/collector/Breadcrumbs';
import AddCollectionDetails from '../../components/collector/AddCollectionDetails';

const CollectorAddCollectionDetails: React.FC = () => {
  return (
    <Layout>
      <Breadcrumbs title='Add Collection Details' />
      <AddCollectionDetails />
    </Layout>
  )
}

export default CollectorAddCollectionDetails
