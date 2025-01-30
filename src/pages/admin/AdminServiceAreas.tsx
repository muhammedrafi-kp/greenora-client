import React from 'react';
import Layout from '../../components/admin/layout/Layout';
import ServiceAreas from '../../components/admin/ServiceAreas';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

const AdminServiceAreas: React.FC = () => {
    return (
        <div>
            <Layout>
                <Breadcrumbs title="Service Area Managment" />
                <ServiceAreas />
            </Layout>
        </div>
    )
}

export default AdminServiceAreas
