import React from 'react';
import Layout from '../../components/admin/layout/Layout';
import WasteCategories from '../../components/admin/WasteCategories';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

const AdminWasteCategories: React.FC = () => {
    return (
        <div>
            <Layout>
                <Breadcrumbs title="Waste Categories" />
                <WasteCategories />
            </Layout>
        </div>
    )
}

export default AdminWasteCategories
