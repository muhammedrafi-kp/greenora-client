import React from 'react'
import { Routes, Route } from 'react-router-dom';
import UserHome from '../pages/user/UserHome';
import UserAccount from '../pages/user/UserAccount';
import UserPickupRequest from '../pages/user/UserPickupRequest';
import OtpVerification from '../components/user/OtpVerification';
import UserProtectedRoute from '../ProtectedRoutes/UserProtectedRoute';
import UserPricing from '../pages/user/UserPricing';

const UserRoutes: React.FC = () => {
    return (

        <Routes>
            <Route path='/' element={<UserHome />} />
            <Route element={<UserProtectedRoute />}>
                <Route path='/account' element={<UserAccount />} />
                <Route path='/make-request' element={<UserPickupRequest />} />
                <Route path='/pricing' element={<UserPricing />} />
            </Route>
        </Routes>
    )
}

export default UserRoutes;
