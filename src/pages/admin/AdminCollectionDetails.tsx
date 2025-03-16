import React from 'react'
import Layout from '../../components/admin/layout/Layout';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import CollectionDetails from '../../components/admin/CollectionDetailsPage';


const AdminCollectionDetails: React.FC = () => {
    return (
        <div>
            <Layout>
                <Breadcrumbs title="Collection details" />
                <CollectionDetails />
            </Layout>
        </div>
    )
}

export default AdminCollectionDetails
