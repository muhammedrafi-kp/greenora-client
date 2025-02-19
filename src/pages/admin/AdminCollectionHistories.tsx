import React from 'react'

import Layout from '../../components/admin/layout/Layout';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import CollectionHistories from '../../components/admin/CollectionHistories';

const AdminCollectionHistories: React.FC = () => {
    return (
        <div>
            <Layout>
                <Breadcrumbs title="Collection History Management" />
                <CollectionHistories />
            </Layout>
        </div>
    )
}

export default AdminCollectionHistories
