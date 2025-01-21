

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

import Breadcrumbs from '../../admin/Breadcrumbs';

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            {isSidebarOpen && (
                <div className="fixed inset-0 z-20 bg-black opacity-50 md:hidden" onClick={toggleSidebar}></div>
            )}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar toggleSidebar={toggleSidebar} />
                {/* <Breadcrumbs/> */}
                {children}
            </div>
        </div>
    );
};

export default Layout;