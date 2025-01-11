import React from 'react';
import Layout from '../../components/admin/layout/Layout';
import ScrapCategories from '../../components/admin/ScrapCategories';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

const AdminScrapCategories: React.FC = () => {
    return (
        <div>
            <Layout>
                <Breadcrumbs title="Scrap Categories" />
                <ScrapCategories />
            </Layout>
        </div>
    )
}

export default AdminScrapCategories
