import React from 'react';
import Layout from '../../components/admin/layout/Layout';
import ServiceArea from '../../components/admin/ServiceArea';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

const AdminServiceArea: React.FC = () => {
    return (
        <div>
            <Layout>
                <Breadcrumbs title="Service Area Managment" />
                <ServiceArea />
            </Layout>
        </div>
    )
}

export default AdminServiceArea
