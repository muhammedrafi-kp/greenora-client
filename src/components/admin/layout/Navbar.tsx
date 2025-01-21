import React, { useState, useRef, useEffect } from 'react';
import {
    FaSearch,
    FaBars,
    FaUserCircle,
    FaRegUserCircle,
} from 'react-icons/fa';
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineLogout } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from "../../../redux/authSlice";

interface NavbarProps {
    toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dispatch = useDispatch();

    // const { isLoggedIn, role } = useSelector((state: any) => state.auth);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        dispatch(Logout())
    }

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
        <nav className="bg-white border-b border-[#0E2A39]/10">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Mobile Sidebar Toggle */}
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden text-[#0E2A39] hover:text-[#173C52] transition-colors duration-200"
                    >
                        <FaBars className="w-6 h-6" />
                    </button>

                    {/* Empty div for spacing */}
                    <div className="flex-1"></div>

                    {/* Search Bar */}
                    <div className="flex justify-end mx-4">
                        <div className="relative w-64">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 
                                focus:outline-none focus:ring-2 focus:ring-[#0E2A39] focus:border-transparent 
                                bg-[#0E2A39]/5 transition-all duration-200 text-sm"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-[#0E2A39]/60" />
                            </div>
                        </div>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={toggleDropdown}
                            className="hover:opacity-80 transition-opacity duration-200"
                        >
                            <FaUserCircle className="w-9 h-9 text-[#0E2A39]" />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 w-64 mt-3 bg-white border rounded-xl shadow-xl z-50 overflow-hidden cursor-pointer">
                                {/* Profile Info */}
                                <div className="p-3 border-b ">
                                    <div className="p-2 flex items-center space-x-3 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                        <img
                                            src="https://via.placeholder.com/40"
                                            alt="Profile"
                                            className="md:w-10 w-8 md:h-10 h-8 rounded-full border-2 border-[#0E2A39]"
                                        />
                                        <div>
                                            <h3 className="text-[#0E2A39] font-semibold md:text-sm text xs">Admin name</h3>
                                            <p className="text-sm text-gray-500 md:text-sm text xs">admin@example.com</p>
                                        </div>
                                    </div>
                                </div>

                                <ul className="p-2">
                                    {/* <li 
                                        onClick={()=>navigate('/admin/profile')}
                                        className="block px-4 py-2.5 text-gray-700 hover:bg-[#0E2A39]/5 rounded-lg cursor-pointer transition-colors duration-200"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <FaRegUserCircle className="text-gray-500" />
                                            <span>View Profile</span>
                                        </div>
                                    </li>
                                    <li className="block px-4 py-2.5 text-gray-700 hover:bg-[#0E2A39]/5 rounded-lg cursor-pointer transition-colors duration-200">
                                        <div className="flex items-center space-x-3">
                                            <IoMdNotificationsOutline className="text-gray-500" />
                                            <span>Notifications</span>
                                        </div>
                                    </li> */}
                                    <li className="block px-4 py-2.5 text-gray-700 hover:bg-red-100 rounded-lg cursor-pointer transition-colors duration-200"
                                        onClick={handleLogout}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <MdOutlineLogout className="text-gray-500" />
                                            <span>Logout</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
