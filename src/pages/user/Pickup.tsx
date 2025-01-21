import React from 'react';
import NavBar from '../../components/user/Navbar';
import PickupRequest from '../../components/user/PickupRequest';

const Pickup: React.FC = () => {
    return (
        <div>
            <NavBar />
            {/* <RequestForm /> */}
            <PickupRequest />
        </div>
    )
}

export default Pickup;
