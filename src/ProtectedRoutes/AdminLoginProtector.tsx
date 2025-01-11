import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminLoginProtector: React.FC = () => {
    const { isLoggedIn } = useSelector((state: any) => state.adminAuth);

    console.log("is logged in:", isLoggedIn);

    if (isLoggedIn) {
        return <Navigate to={'/admin'} replace />
    }

    return <Outlet />
}

export default AdminLoginProtector;

