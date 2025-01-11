import React from 'react';
import NavBar from '../../components/user/Navbar';
import RequestForm from '../../components/user/RequestForm';
import WastePickupWizard from '../../components/user/WasteReq';

const UserPickupRequest: React.FC = () => {
    return (
        <div>
            <NavBar />
            {/* <RequestForm /> */}
            <WastePickupWizard />
        </div>
    )
}

export default UserPickupRequest
