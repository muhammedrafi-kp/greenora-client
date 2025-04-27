import React from 'react'
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import CollectionHistories from '../../components/admin/CollectionHistories';

const AdminCollectionHistories: React.FC = () => {
    return (
        <div>
            <Breadcrumbs title="Collection Management" />
            <CollectionHistories />
        </div>
    )
}

export default AdminCollectionHistories
