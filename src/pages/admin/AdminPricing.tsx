import React from 'react';
import Pricing from '../../components/admin/Pricing';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

const AdminPricing: React.FC = () => {
    return (
        <div>
            <Breadcrumbs title="Pricing Managment" />
            <Pricing />
        </div>
    )
    }

export default AdminPricing;