import React from 'react';
import WasteCategories from '../../components/admin/WasteCategories';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

const AdminWasteCategories: React.FC = () => {
    return (
        <div>
            <Breadcrumbs title="Waste Categories" />
            <WasteCategories />
        </div>
    )
}

export default AdminWasteCategories
