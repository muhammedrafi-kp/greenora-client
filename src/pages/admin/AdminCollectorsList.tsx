import React from 'react'

import Layout from '../../components/admin/layout/Layout';
import Collectors from '../../components/admin/Collectors';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

const AdminCollectorsList: React.FC = () => {
    return (
        <div>
            <Layout>
                <Breadcrumbs title="Collector Management" />
                <Collectors />
            </Layout>

        </div>
    )
}

export default AdminCollectorsList
