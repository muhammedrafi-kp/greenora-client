import React from 'react';
import Layout from '../../components/collector/layout/Layout';
import Breadcrumbs from '../../components/collector/Breadcrumbs';   
import CollectionDetails from '../../components/collector/CollectionDetails';

const CollectorCollectionDetails: React.FC = () => {
  return (
    <Layout>
        <Breadcrumbs title='Collection Details'/>
        <CollectionDetails />
    </Layout>
  )
}

export default CollectorCollectionDetails
