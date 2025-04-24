import React from 'react'
import { Routes, Route } from 'react-router-dom';

import UserHome from '../pages/user/UserHome';
import UserResetPassword from '../pages/user/UserResetPassword';
import UserPricing from '../pages/user/UserPricing';
import UserCollectionDetails from '../pages/user/UserCollectionDetails';
import UserTrackingCollector from '../pages/user/UserTrackingCollector';
import GeoLocationTracker from '../components/user/GeoLocationTracker';

import UserAccount from '../pages/user/UserAccount';
import UserActivity from '../pages/user/UserActivity';
import UserProfile from '../pages/user/UserProfile';
import UserWasteCollectionHistory from '../pages/user/UserWasteCollectionHistory';
import UserAddressess from '../pages/user/UserAddress';
import UserCharges from '../pages/user/UserCharges';
import UserWallet from '../pages/user/UserWallet';
import UserNotifications from '../pages/user/UserNotifications';

import UserPickupLayout from '../pages/user/UserPickup';
import UserPickupType from '../pages/user/UserPickupType';
import UserPickupAddress from '../pages/user/UserPickupAddress';
import UserPickupDetailsForm from '../pages/user/UserPickupDetailsForm';
import UserPickupReview from '../pages/user/UserPickupReview';
import UserPickupPayment from '../pages/user/UserPickupPayment';
import UserPickupSuccess from '../pages/user/UserPickupSuccess';
import UserPickupFailure from '../pages/user/UserPickupFailure';
// import UserPickupRequest from '../pages/user/UserPickupRequest';
import UserProtectedRoute from '../ProtectedRoutes/UserProtectedRoute';
import ChatBot from '../components/user/ChatBot';
import Layout from '../components/user/Layout';
const UserRoutes: React.FC = () => {
    return (
        <>
            <Routes>
                <Route element={<Layout />}>
                    <Route path='/' element={<UserHome />} />
                    <Route path='/reset-password' element={<UserResetPassword />} />
                    <Route element={<UserProtectedRoute />}>



                        <Route path='/account' element={<UserAccount />} >
                            {/* <Route index element={<UserActivity />} /> */}
                            <Route index element={<UserProfile />} />

                            {/* <Route  path='profile' element={<UserProfile />} /> */}
                            <Route path='collections' element={<UserWasteCollectionHistory />} />
                            <Route path='address' element={<UserAddressess />} />
                            <Route path='charges' element={<UserCharges />} />
                            <Route path='wallet' element={<UserWallet />} />
                            <Route path='notifications' element={<UserNotifications />} />
                        </Route>

                        <Route path='/pricing' element={<UserPricing />} />
                        <Route path='/collection/details' element={<UserCollectionDetails />} />
                        <Route path='/collection/track-collector' element={<UserTrackingCollector />} />
                        <Route path='/location' element={<GeoLocationTracker />} />
                        <Route path='/pickup' element={<UserPickupLayout />}>
                            <Route index element={<UserPickupType />} />
                            <Route path="address" element={<UserPickupAddress />} />
                            <Route path="details" element={<UserPickupDetailsForm />} />
                            <Route path="review" element={<UserPickupReview />} />
                            <Route path="payment" element={<UserPickupPayment />} />
                        </Route>
                        <Route path="/pickup/success" element={<UserPickupSuccess />} />
                        <Route path="/pickup/failure" element={<UserPickupFailure />} />

                    </Route>
                </Route>
            </Routes>

        </>
    )
}

export default UserRoutes;
