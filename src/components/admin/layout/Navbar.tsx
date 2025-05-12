import React, { useState, useRef, useEffect } from 'react';
import {
    FaBars,
    FaUserCircle,
} from 'react-icons/fa';
// import { IoMdNotificationsOutline } from "react-icons/io";
import { MdChatBubbleOutline } from "react-icons/md";
// import { CiChat1 } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { MdOutlineLogout } from 'react-icons/md';
// import { BiMessageRoundedDots } from "react-icons/bi";
import { useDispatch } from 'react-redux';
import { Logout } from "../../../redux/authSlice";

interface NavbarProps {
    toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
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

                    {/* Right side icons */}
                    <div className="flex items-center space-x-4">
                        {/* Chat Icon */}
                        <div className="relative">
                            <button
                                className="p-2 hover:bg-[#0E2A39]/5 rounded-full transition-colors duration-200"
                                onClick={() => { navigate('/admin/chat') }}
                            >
                                <MdChatBubbleOutline className="w-6 h-6 text-[#0E2A39]" />
                            </button>
                            {/* {hasUnreadMessages && (
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            )} */}
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
            </div>
        </nav>
    );
};

export default Navbar;
