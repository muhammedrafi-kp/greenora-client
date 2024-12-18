import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';
import DashboardBody from '../../components/admin/Dashboard';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

const Dashboard: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar 
                isSidebarOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
            />

            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <Navbar toggleSidebar={toggleSidebar} />

                {/* Breadcrumbs */}
                <Breadcrumbs />

                {/* Dashboard Body */}
                <DashboardBody />
            </div>
        </div>
    );
};

export default Dashboard;