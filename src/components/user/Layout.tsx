import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
// import Footer from './Footer';
import ChatBot from './ChatBot';
import { Outlet } from 'react-router-dom'



const Layout: React.FC = () => {

    const { isLoggedIn } = useSelector((state: any) => state.auth);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            {isLoggedIn && <ChatBot />}
        </div>
    );
};

export default Layout; 