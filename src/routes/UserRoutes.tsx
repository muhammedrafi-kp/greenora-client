import React,{lazy,Suspense} from 'react'
import { Routes, Route } from 'react-router-dom';

const UserProtectedRoute = lazy(()=>import('../ProtectedRoutes/UserProtectedRoute'));
const Layout = lazy(()=>import('../components/user/Layout'));

const UserHome = lazy(()=>import('../pages/user/UserHome'));
const UserResetPassword = lazy(()=>import('../pages/user/UserResetPassword'));
const UserPricing = lazy(()=>import('../pages/user/UserPricing'));
const UserCollectionDetails = lazy(()=>import('../pages/user/UserCollectionDetails'));
const UserTrackingCollector = lazy(()=>import('../pages/user/UserTrackingCollector'));

const UserAccount = lazy(()=>import('../pages/user/UserAccount'));
// import UserActivity from '../paer/UserActivity';
const UserProfile = lazy(()=>import('../pages/user/UserProfile'));
const UserWasteCollectionHistory = lazy(()=>import('../pages/user/UserWasteCollectionHistory'));
const UserCharges = lazy(()=>import('../pages/user/UserCharges'));
const UserWallet = lazy(()=>import('../pages/user/UserWallet'));
const UserNotifications = lazy(()=>import('../pages/user/UserNotifications'));

const UserPickupLayout = lazy(()=>import('../pages/user/UserPickup'));
const UserPickupType = lazy(()=>import('../pages/user/UserPickupType'));
const UserPickupAddress = lazy(()=>import('../pages/user/UserPickupAddress'));
const UserPickupDetailsForm = lazy(()=>import('../pages/user/UserPickupDetailsForm'));
const UserPickupReview = lazy(()=>import('../pages/user/UserPickupReview'));
const UserPickupPayment = lazy(()=>import('../pages/user/UserPickupPayment'));
const UserPickupSuccess = lazy(()=>import('../pages/user/UserPickupSuccess'));
const UserPickupFailure = lazy(()=>import('../pages/user/UserPickupFailure'));

import Spinner from '../components/common/Spinner';
const Error404 = lazy(()=>import('../components/common/Error404'));


const UserRoutes: React.FC = () => {
    return (
        <>
        <Suspense fallback={<Spinner />}>
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
                            <Route path='charges' element={<UserCharges />} />
                            <Route path='wallet' element={<UserWallet />} />
                            <Route path='notifications' element={<UserNotifications />} />
                        </Route>

                        <Route path='/pricing' element={<UserPricing />} />
                        <Route path='/collection/details' element={<UserCollectionDetails />} />
                        <Route path='/collection/track-collector' element={<UserTrackingCollector />} />
                        
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
                <Route path="*" element={<Error404 role='user' />} />
            </Routes>
        </Suspense>
        </>
    )
}

export default UserRoutes;
