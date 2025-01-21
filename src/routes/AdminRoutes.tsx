import React from 'react'
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsersList from '../pages/admin/AdminUsersList';
import AdminLogin from '../pages/admin/AdminLogin';

import AdminProtectedRoute from '../ProtectedRoutes/AdminProtectedRoute';
import AdminLoginProtector from '../ProtectedRoutes/AdminLoginProtector';
import AdminCollectorsList from '../pages/admin/AdminCollectorsList';
import AdminWasteCategories from '../pages/admin/AdminWasteCategories';
import AdminScrapCategories from '../pages/admin/AdminScrapCategories';
import AdminServiceArea from '../pages/admin/AdminServiceArea';

const AdminRoutes: React.FC = () => {
    return (
        <Routes>
            <Route element={<AdminLoginProtector />}>
                <Route path='/login' element={<AdminLogin />} />
            </Route>

            <Route element={<AdminProtectedRoute />}>
                <Route path='/' element={<AdminDashboard />} />
                <Route path='/users' element={<AdminUsersList />} />
                <Route path='/collectors' element={<AdminCollectorsList />} />
                <Route path='/categories/wastes' element={<AdminWasteCategories />} />
                <Route path='/categories/scraps' element={<AdminScrapCategories />} />
                <Route path='/service-areas' element={<AdminServiceArea />} />

            </Route>
        </Routes>
    )
}

export default AdminRoutes;
