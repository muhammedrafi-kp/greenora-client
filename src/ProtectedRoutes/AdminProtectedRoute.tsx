import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute: React.FC = () => {

    const { isLoggedIn,role } = useSelector((state: any) => state.auth);

    console.log("is logged in:", isLoggedIn);

    if (!isLoggedIn||role!=='admin') {
        return <Navigate to={'/admin/login'} replace />
    }

    return <Outlet />
}

export default AdminProtectedRoute
