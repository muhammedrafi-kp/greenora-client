import React from 'react';
import Layout from '../../components/admin/layout/Layout';
import VerificationRequests from '../../components/admin/VerificationRequests';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
const AdminCollectorVerification: React.FC = () => {
  return (
    <Layout>
      <Breadcrumbs title='Verification Requests' />
      <VerificationRequests />
    </Layout>
  );
};

export default AdminCollectorVerification;  