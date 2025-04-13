import React from 'react';
import Users from '../../components/admin/Users';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

const AdminUsersList: React.FC = () => {
  return (
    <div>
        <Breadcrumbs title="User Management" />
        <Users />
    </div>
  );
};

export default AdminUsersList; 