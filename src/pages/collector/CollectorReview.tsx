import React from 'react'
import Layout from '../../components/collector/layout/Layout';
import Breadcrumbs from '../../components/collector/Breadcrumbs';
import Review from '../../components/collector/Review';

const CollectorReview: React.FC = () => {
  return (
    <Layout>
      <Breadcrumbs title='Review Collection Details' />
      <Review />
    </Layout>
  )
}

export default CollectorReview
