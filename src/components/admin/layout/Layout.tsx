import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    console.log("layout is rendered");

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            {isSidebarOpen && (
                <div className="fixed inset-0 z-20 bg-black opacity-50 md:hidden" onClick={toggleSidebar}></div>
            )}
            <div className="flex-1 flex flex-col h-full min-w-0">
                <Navbar toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto overflow-x-auto">
                    <div className="min-w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;