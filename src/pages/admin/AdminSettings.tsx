
import React from 'react';
import Settings from '../../components/admin/Settings';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

const AdminSettings:React.FC = () => {
  return (
    <div>
      <Breadcrumbs title="Settings" />
      <Settings />
    </div>
  )
}

export default AdminSettings
