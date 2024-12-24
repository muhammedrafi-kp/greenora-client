import React from 'react';
import NavBar from '../../components/user/Navbar';
import Landing from '../../components/user/Landing';
import ChatBot from '../../components/common/ChatBot';

const UserHome: React.FC = () => {
    return (
        <div className='row-auto'>
            <NavBar />
            <Landing />
            <ChatBot />
        </div>
    )
}

export default UserHome;
