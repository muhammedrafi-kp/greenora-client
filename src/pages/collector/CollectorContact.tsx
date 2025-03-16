import React from 'react'
import Layout from '../../components/collector/layout/Layout';
import Breadcrumbs from '../../components/collector/Breadcrumbs';
import Contact from '../../components/collector/Contact';

const CollectorContact : React.FC = () => {
  return (
    <Layout>
      <Breadcrumbs title='Contact Support' />
      <Contact />
    </Layout>
  )
}

export default CollectorContact
