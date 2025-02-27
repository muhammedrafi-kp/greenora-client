import React from 'react';
import Layout from '../../components/admin/layout/Layout';
import Pricing from '../../components/admin/Pricing';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

const AdminPricing: React.FC = () => {
    return (
        <div>
            <Layout>
                <Breadcrumbs title="Pricing Managment" />
                <Pricing />
            </Layout>
        </div>
    )
    }

export default AdminPricing;