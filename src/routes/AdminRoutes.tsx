import React from 'react'
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProfile from '../pages/admin/AdminProfile';
import AdminChangePassword from '../pages/admin/AdminChangePassword';
import AdminLogin from '../pages/admin/AdminLogin';

const AdminRoutes: React.FC = () => {
    return (
        <div>
            <Routes>
                <Route path='/login' element={<AdminLogin/>} />
                <Route path='/' element={<AdminDashboard />} />
                <Route path='/profile' element={<AdminProfile />} />
                <Route path='/change-password' element={<AdminChangePassword/>} />
            </Routes>
        </div>
    )
}

export default AdminRoutes;
