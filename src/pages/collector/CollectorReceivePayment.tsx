import React from 'react';
import Layout from '../../components/collector/layout/Layout';
import Breadcrumbs from '../../components/collector/Breadcrumbs';
import ReceivePayment from '../../components/collector/ReceivePayment';

const CollectorReceivePayment : React.FC = () => {
  return (
    <Layout>
      <Breadcrumbs title='Receive Payment' />
      <ReceivePayment />
    </Layout>
  )
}

export default CollectorReceivePayment
