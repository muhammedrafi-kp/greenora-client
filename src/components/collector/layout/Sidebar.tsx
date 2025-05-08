import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaHome,
    FaClipboardList,
    FaTimes
} from 'react-icons/fa';
import { GrContact } from "react-icons/gr";
interface SidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    return (
        <>
            <div className={`
                fixed inset-y-0 left-0 z-30 
                md:w-64 xs:w-56 w-48 bg-green-950 text-white shadow-lg
                transform transition-transform duration-300 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0
            `}>
                {/* Sidebar Close Button for Mobile */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden absolute md:top-4 xs:top-3 top-2 md:right-4 xs:right-3 right-2 text-white"
                >
                    <FaTimes className="md:w-6 md:h-6 xs:w-5 xs:h-5 w-4 h-4" />
                </button>

                {/* Logo */}
                <div className="md:p-4 xs:p-3 p-2 border-b border-white/10">
                    <h1 className="md:text-2xl xs:text-xl text-lg font-bold text-white">Greenora Agent</h1>
                </div>

                {/* Sidebar Menu */}
                <nav className="md:p-4 xs:p-3 p-2">
                    <ul className="space-y-2">
                        {[
                            { icon: <FaHome className="md:w-5 md:h-5 w-4 h-4" />, text: 'Dashboard', path: '/collector' },
                            { icon: <FaClipboardList className="md:w-5 md:h-5 w-4 h-4" />, text: 'Assigned Tasks', path: '/collector/tasks' },
                            // { icon: <FaTruck className="md:w-5 md:h-5 w-4 h-4" />, text: 'Route Planning', path: '/collector/route-planning' },
                            // { icon: <FaHistory className="md:w-5 md:h-5 w-4 h-4" />, text: 'Pickup History', path: '/collector/pickup-history' },
                            // { icon: <FaMap className="md:w-5 md:h-5 w-4 h-4" />, text: 'Live Tracking', path: '/collector/tracking' },
                            { icon: <GrContact className="md:w-5 md:h-5 w-4 h-4" />, text: 'Contact', path: '/collector/contact' },
                            // { icon: <FaCog className="md:w-5 md:h-5 w-4 h-4" />, text: 'Settings', path: '/collector/settings' }
                        ].map((item, index) => {
                            const isActive = 
                                (item.path === '/collector' && location.pathname === '/collector') || 
                                (item.path !== '/collector' && location.pathname.startsWith(item.path));
                            
                            return (
                                <li key={index}>
                                    <div 
                                        className={`flex items-center space-x-3 text-white font-semibold md:p-4 xs:p-3 p-1 rounded-lg cursor-pointer transition-colors duration-200
                                            ${isActive ? 'bg-green-900 font-medium' : 'hover:bg-green-900'}`}
                                        onClick={() => navigate(item.path)}
                                    >
                                        {item.icon}
                                        <span className="md:text-base xs:text-sm text-xs">{item.text}</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="md:p-4 xs:p-3 p-2 border-t border-white/10 absolute bottom-0 w-full">
                    <div className="md:text-xs xs:text-xxs text-xxs text-white">
                        <p>© 2024 Greenora</p>
                        <p>v1.0.0</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;


