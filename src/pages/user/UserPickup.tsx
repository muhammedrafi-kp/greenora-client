import React from 'react';
import NavBar from '../../components/user/Navbar';
import PickupLayout from '../../components/user/pickupLayout/PickupLayout';

const UserPickupLayout: React.FC = () => {
    return (
        <div>
            <NavBar />
            <PickupLayout />
        </div>
    )
}

export default UserPickupLayout;
