import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaHome,
    FaUsers,
    FaCog,
    FaTimes,
    FaClipboardList,
    FaChevronDown,
    FaChevronUp
} from 'react-icons/fa';
import { FaPeopleGroup ,FaLocationDot} from "react-icons/fa6";
import { IoPricetags } from "react-icons/io5";
import { BiSolidCategory } from "react-icons/bi";

interface SidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {

    const navigate = useNavigate();
    const location = useLocation();

    // Keep track of the active path
    const [activePath, setActivePath] = useState(location.pathname);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);


    // Update active path when the location changes
    useEffect(() => {
        setActivePath(location.pathname);
    }, [location]);

    return (
        <>
            <div className={`
                fixed inset-y-0 left-0 z-30 
                w-64 bg-[#0E2A39] text-white shadow-lg
                transform transition-transform duration-300 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0
            `}>
                {/* Sidebar Close Button for Mobile */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden absolute top-4 right-4 text-white/80 hover:text-white"
                >
                    <FaTimes className="w-6 h-6" />
                </button>

                {/* Logo */}
                <div className="p-4 border-b border-white/10">
                    <h1 className="text-2xl font-bold text-white">Greenora Admin</h1>
                </div>

                {/* Sidebar Menu */}
                {/* <nav className="p-4">
                    <ul className="space-y-2">
                        {[
                            { icon: <FaHome />, text: 'Dashboard', path: '/admin' },
                            { icon: <FaUsers />, text: 'Users', path: '/admin/users' },
                            { icon: <FaPeopleGroup />, text: 'Collectors', path: '/admin/collectors' },
                            { icon: <BiSolidCategory />, text: 'Categories', path: '/admin/categories' },
                            { icon: <FaClipboardList />, text: 'Requests', path: '/admin/requests' },
                            { icon: <FaCog />, text: 'Settings', path: '/admin/sett' },
                            
                        ].map((item, index) => (
                            <li key={index}>
                                <div
                                    className={`flex items-center space-x-3 text-white/80 p-4 hover:bg-[#173C52] hover:text-white 
                                    rounded-lg cursor-pointer transition-all duration-200 group
                                    ${activePath === item.path ? 'bg-[#173C52] text-white' : ''}`}
                                    onClick={() => {
                                        setActivePath(item.path);
                                        navigate(item.path);
                                    }}
                                >
                                    <span className="group-hover:scale-110 transition-transform duration-200">
                                        {item.icon}
                                    </span>
                                    <span>{item.text}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </nav> */}

                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <div
                                className={`flex items-center space-x-3 text-white/80 p-3 hover:bg-[#173C52] hover:text-white 
                                rounded-lg cursor-pointer transition-all duration-200 group
                                ${activePath === '/admin' ? 'bg-[#173C52] text-white' : ''}`}
                                onClick={() => {
                                    setActivePath('/admin');
                                    navigate('/admin');
                                }}
                            >
                                <span className="group-hover:scale-110 transition-transform duration-200">
                                    <FaHome />
                                </span>
                                <span>Dashboard</span>
                            </div>
                        </li>
                        <li>
                            <div
                                className={`flex items-center space-x-3 text-white/80 p-3 hover:bg-[#173C52] hover:text-white 
                                rounded-lg cursor-pointer transition-all duration-200 group
                                ${activePath === '/admin/users' ? 'bg-[#173C52] text-white' : ''}`}
                                onClick={() => {
                                    setActivePath('/admin/users');
                                    navigate('/admin/users');
                                }}
                            >
                                <span className="group-hover:scale-110 transition-transform duration-200">
                                    <FaUsers />
                                </span>
                                <span>Users</span>
                            </div>
                        </li>
                        <li>
                            <div
                                className={`flex items-center space-x-3 text-white/80 p-3 hover:bg-[#173C52] hover:text-white 
                                rounded-lg cursor-pointer transition-all duration-200 group
                                ${activePath === '/admin/collectors' ? 'bg-[#173C52] text-white' : ''}`}
                                onClick={() => {
                                    setActivePath('/admin/collectors');
                                    navigate('/admin/collectors');
                                }}
                            >
                                <span className="group-hover:scale-110 transition-transform duration-200">
                                    <FaPeopleGroup />
                                </span>
                                <span>Collectors</span>
                            </div>
                        </li>
                        {/* Categories Dropdown */}
                        <li>
                            <div
                                className={`flex items-center justify-between text-white/80 p-3 hover:bg-[#173C52] hover:text-white 
                                rounded-lg cursor-pointer transition-all duration-200 group
                                ${activePath.startsWith('/admin/categories') ? 'bg-[#173C52] text-white' : ''}`}
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="group-hover:scale-110 transition-transform duration-200">
                                        <BiSolidCategory />
                                    </span>
                                    <span>Categories</span>
                                </div>
                                <span>
                                    {isCategoryOpen ? <FaChevronUp /> : <FaChevronDown />}
                                </span>
                            </div>
                            {/* Dropdown items */}
                            {isCategoryOpen && (
                                <ul className="ml-8 mt-2 space-y-2">
                                    {[
                                        { text: 'Wastes', path: '/admin/categories/wastes' },
                                        { text: 'Scraps', path: '/admin/categories/scraps' },
                                    ].map((item, index) => (
                                        <li key={index}>
                                            <div
                                                className={`flex items-center space-x-3 text-white/80 p-2 hover:bg-[#173C52] hover:text-white 
                                                rounded-lg cursor-pointer transition-all duration-200
                                                ${activePath === item.path ? 'bg-[#173C52] text-white' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActivePath(item.path);
                                                    navigate(item.path);
                                                }}
                                            >
                                                <span>{item.text}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>

                        <li>
                            <div
                                className={`flex items-center space-x-3 text-white/80 p-3 hover:bg-[#173C52] hover:text-white 
                                rounded-lg cursor-pointer transition-all duration-200 group
                                ${activePath === '/admin/service-areas' ? 'bg-[#173C52] text-white' : ''}`}
                                onClick={() => {
                                    setActivePath('/admin/service-areas');
                                    navigate('/admin/service-areas');
                                }}
                            >
                                <span className="group-hover:scale-110 transition-transform duration-200">
                                    <FaLocationDot />
                                </span>
                                <span>Service Areas</span>
                            </div>
                        </li>
                        <li>
                            <div
                                className={`flex items-center space-x-3 text-white/80 p-3 hover:bg-[#173C52] hover:text-white 
                                rounded-lg cursor-pointer transition-all duration-200 group
                                ${activePath === '/admin/collection-histories' ? 'bg-[#173C52] text-white' : ''}`}
                                onClick={() => {
                                    setActivePath('/admin/collection-histories');
                                    navigate('/admin/collection-histories');
                                }}
                            >
                                <span className="group-hover:scale-110 transition-transform duration-200">
                                    <FaClipboardList />
                                </span>
                                <span>Collection Requests</span>
                            </div>
                        </li>
                        <li>
                            <div
                                className={`flex items-center space-x-3 text-white/80 p-3 hover:bg-[#173C52] hover:text-white 
                                rounded-lg cursor-pointer transition-all duration-200 group
                                ${activePath === '/admin/settings' ? 'bg-[#173C52] text-white' : ''}`}
                                onClick={() => {
                                    setActivePath('/admin/settings');
                                    navigate('/admin/settings');
                                }}
                            >
                                <span className="group-hover:scale-110 transition-transform duration-200">
                                    <FaCog />
                                </span>
                                <span>Settings</span>
                            </div>
                        </li>
                    </ul>
                </nav>

                <div className="p-4 border-t border-white/10 absolute bottom-0 w-full bg-[#0E2A39]/90">
                    <div className="text-xs text-white/70">
                        <p>© 2024 Greenora</p>
                        <p>v1.0.0</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;


