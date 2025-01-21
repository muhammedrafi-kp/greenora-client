import React from "react";
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserProtectedRoute: React.FC = () => {

    const { isLoggedIn, role } = useSelector((state: any) => state.auth);

    if (!isLoggedIn || role !== 'user') {

        console.log("not logged in")
        return <Navigate to="/" />;
    }
    console.log("logged in")
    return <Outlet />;
}

export default UserProtectedRoute
