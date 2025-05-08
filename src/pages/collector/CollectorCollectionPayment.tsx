import React from 'react';
import Layout from '../../components/collector/layout/Layout';
import Breadcrumbs from '../../components/collector/Breadcrumbs';
import CollectionPayment from '../../components/collector/CollectionPayment';

const CollectorCollectionPayment : React.FC = () => {
  return (
    <Layout>
      <Breadcrumbs title='Receive Payment' />
      <CollectionPayment />
    </Layout>
  )
}

export default CollectorCollectionPayment;
