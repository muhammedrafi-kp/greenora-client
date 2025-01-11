import React from 'react';
import Layout from '../../components/admin/layout/Layout';
import Users from '../../components/admin/Users';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

const AdminUsersList: React.FC = () => {
  return (
    <Layout>
      <Breadcrumbs title="User Management" />
      <Users />
    </Layout>
  );
};

export default AdminUsersList; 