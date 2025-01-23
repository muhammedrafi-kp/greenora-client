import React from 'react';
import NavBar from '../../components/user/Navbar';
import Request from '../../components/user/Request';

const UserPickupRequest: React.FC = () => {
    return (
        <div>
            <NavBar />
            {/* <RequestForm /> */}
            {/* <PickupRequest /> */}
            <Request />
        </div>
    )
}

export default UserPickupRequest;
