import React from 'react';
import ServiceAreas from '../../components/admin/ServiceAreas';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

const AdminServiceAreas: React.FC = () => {
    return (
        <div>
            <Breadcrumbs title="Service Area Managment" />
            <ServiceAreas />
        </div>
    )
}

export default AdminServiceAreas
