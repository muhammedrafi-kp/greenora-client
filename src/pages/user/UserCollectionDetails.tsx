import React from 'react'
import NavBar from '../../components/user/Navbar'
import CollectionDetails from '../../components/user/CollectionDetails';

const UserCollectionDetails: React.FC = () => {
    return (
        <div>
            <NavBar />
            <CollectionDetails />
        </div>
    )
}

export default UserCollectionDetails;
