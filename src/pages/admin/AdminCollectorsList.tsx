import React from 'react'
import Collectors from '../../components/admin/Collectors';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

const AdminCollectorsList: React.FC = () => {
    return (
        <div>
            <Breadcrumbs title="Collector Management" />
            <Collectors />

        </div>
    )
}

export default AdminCollectorsList
