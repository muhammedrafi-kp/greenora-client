import React from 'react'
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import CollectionDetails from '../../components/admin/CollectionDetails';


const AdminCollectionDetails: React.FC = () => {
    return (
        <div>
            <Breadcrumbs title="Collection details" />
            <CollectionDetails />
        </div>
    )
}

export default AdminCollectionDetails
