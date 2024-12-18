import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaSearch,
    FaBars,
    FaUserCircle,
    FaRegUserCircle,
} from 'react-icons/fa';
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdChatBubbleOutline, MdOutlineLogout } from "react-icons/md";

interface NavbarProps {
    toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();

    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Mobile Sidebar Toggle */}
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden text-green-800 hover:text-green-800"
                    >
                        <FaBars className="w-6 h-6" />
                    </button>

                    {/* Search Bar */}
                    <div className="flex-1 flex justify-center mx-4">
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-100"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Navbar Icons */}
                    <div className="flex items-center space-x-6">
                        {/* Notifications */}
                        <div className="relative">
                            <button className='p-1 bg-gray-100 rounded-full' >
                                <IoMdNotificationsOutline className="w-5 h-5 text-gray-800" />
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                                    3
                                </span>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="relative">
                            <button className='p-1 bg-gray-100 rounded-full'>
                                <MdChatBubbleOutline className="w-5 h-5  text-gray-800" />
                                <span className="absolute -top-2 -right-2 bg-green-700 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                                    5
                                </span>
                            </button>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={toggleDropdown}>
                                <FaUserCircle className="w-8 h-8 text-gray-800" />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-2xl z-50">
                                    {/* Profile Info */}
                                    <div className="p-2 border-b ">
                                        <div className="p-2 flex items-center space-x-3 hover:bg-gray-100 rounded-lg">
                                            <img
                                                src="https://via.placeholder.com/40"
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <h3 className="text-gray-900 font-medium">User name</h3>
                                                <p className="text-sm text-gray-500">user@example.com</p>
                                            </div>
                                        </div>
                                    </div>

                                    <ul className="p-2">
                                        <li className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg cursor-pointer" onClick={()=>navigate('/admin/profile')}>
                                            <div className="flex items-center space-x-3">
                                                <FaRegUserCircle />
                                                <span>View Profile</span>
                                            </div>
                                          
                                        </li>
                                        <li className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg cursor-pointer">
                                            <div className="flex items-center space-x-3">
                                                <IoMdNotificationsOutline />
                                                <span>Notifications</span>
                                            </div>
                                        </li>
                                        <li className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg cursor-pointer">
                                            <div className="flex items-center space-x-3">
                                                <MdOutlineLogout />
                                                <span>Logout</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
