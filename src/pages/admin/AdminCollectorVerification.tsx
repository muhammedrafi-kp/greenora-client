import React from 'react';
import VerificationRequests from '../../components/admin/VerificationRequests';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
const AdminCollectorVerification: React.FC = () => {
  return (
    <div>
        <Breadcrumbs title='Verification Requests' />
        <VerificationRequests />
    </div>
  );
};

export default AdminCollectorVerification;  