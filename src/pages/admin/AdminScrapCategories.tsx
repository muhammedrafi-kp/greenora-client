import React from 'react';
import ScrapCategories from '../../components/admin/ScrapCategories';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

const AdminScrapCategories: React.FC = () => {
    return (
        <div>
            <Breadcrumbs title="Scrap Categories" />
            <ScrapCategories />
        </div>
    )
}

export default AdminScrapCategories
