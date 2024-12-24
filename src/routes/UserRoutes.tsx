import React from 'react'
import { Routes, Route } from 'react-router-dom';
import UserHome from '../pages/user/UserHome';
import UserAccount from '../pages/user/UserAccount';
import OtpVerification from '../components/user/OtpVerification';

const UserRoutes: React.FC = () => {
    return (
        
        <Routes>
            <Route path='/' element={<UserHome/>}/>
            <Route path='/account' element={<UserAccount/>}/>
            <Route path='/otp' element={<OtpVerification closeModal={() => {}} email={''} />}/>

        </Routes>
    )
}

export default UserRoutes;
