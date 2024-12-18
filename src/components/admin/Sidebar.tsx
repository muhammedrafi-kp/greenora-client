import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaUsers,
    FaCog,
    FaTimes,
    FaClipboardList
} from 'react-icons/fa';
import { FaPeopleGroup } from "react-icons/fa6";

interface SidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {

    const navigate = useNavigate();
    
    return (
        <>
            <div className={`
                fixed inset-y-0 left-0 z-30 
                w-64 bg-green-900 text-white shadow-lg
                transform transition-transform duration-300 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0
            `}>
                {/* Sidebar Close Button for Mobile */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden absolute top-4 right-4 text-white"
                >
                    <FaTimes className="w-6 h-6" />
                </button>

                {/* Logo */}
                <div className="p-4 border-b border-gray-300">
                    <h1 className="text-2xl font-bold text-white">Greenora Admin</h1>
                </div>

                {/* Sidebar Menu */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        {[
                            { icon: <FaHome />, text: 'Dashboard',path:'/admin' },
                            { icon: <FaUsers />, text: 'Users',path:'/admin/users' },
                            { icon: <FaPeopleGroup />, text: 'Agents',path:'/admin/agents' },
                            { icon: <FaClipboardList />, text: 'Requests',path:'/admin/requests' },
                            { icon: <FaCog />, text: 'Settings',path:'/admin/sett' }
                        ].map((item, index) => (
                            <li key={index}>
                                <div  className="flex items-center space-x-3 text-white p-4 hover:bg-green-800 rounded-lg"
                                onClick={()=>navigate(item.path)}>
                                    {item.icon}
                                    <span>{item.text}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-300 absolute bottom-0 w-full">
                    <div className="text-xs text-white">
                        <p>© 2024 Greenora</p>
                        <p>v1.0.0</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;


