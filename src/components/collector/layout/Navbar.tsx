// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     FaSearch,
//     FaBars,
//     FaUserCircle,
//     FaRegUserCircle,
// } from 'react-icons/fa';
// import { IoMdNotificationsOutline } from "react-icons/io";
// import { MdChatBubbleOutline, MdOutlineLogout } from "react-icons/md";
// import { useDispatch } from 'react-redux';
// import { collectorLogout } from '../../../redux/collectorAuthSlice';

// interface NavbarProps {
//     toggleSidebar: () => void;
// }

// const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const navigate = useNavigate();
//     const dropdownRef = useRef<HTMLDivElement>(null);
//     const dispatch = useDispatch();

//     const toggleDropdown = () => {
//         setIsDropdownOpen(!isDropdownOpen);
//     };

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//                 setIsDropdownOpen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     const handleLogout = () => {
//         dispatch(collectorLogout());
//         navigate('/collector/login');
//     };

//     return (
//         <nav className="bg-white shadow-sm border-b border-gray-100">
//             <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex items-center justify-between h-16">
//                     {/* Mobile Sidebar Toggle */}
//                     <button
//                         onClick={toggleSidebar}
//                         className="md:hidden text-green-700 hover:text-green-600 transition-colors duration-200"
//                     >
//                         <FaBars className="w-6 h-6" />
//                     </button>

//                     {/* Search Bar */}
//                     <div className="flex-1 flex justify-end mx-4">
//                         <div className="relative w-64">
//                             <input
//                                 type="text"
//                                 placeholder="Search pickups..."
//                                 className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-gray-50 transition-all duration-200"
//                             />
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <FaSearch className="text-gray-400 hover:text-green-500" />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Navbar Icons */}
//                     <div className="flex items-center space-x-6">
//                         {/* Notifications */}
//                         <div className="relative">
//                             <button
//                                 onClick={() => navigate('/agent/notifications')}
//                                 className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'
//                             >
//                                 <IoMdNotificationsOutline className="w-6 h-6 text-gray-600 hover:text-green-600" />
//                                 <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
//                                     3
//                                 </span>
//                             </button>
//                         </div>

//                         {/* Messages */}
//                         <div className="relative">
//                             <button className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'>
//                                 <MdChatBubbleOutline className="w-6 h-6 text-gray-600 hover:text-green-600" />
//                                 <span className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
//                                     2
//                                 </span>
//                             </button>
//                         </div>

//                         {/* Profile Dropdown */}
//                         <div className="relative" ref={dropdownRef}>
//                             <button 
//                                 onClick={toggleDropdown}
//                                 className="hover:opacity-80 transition-opacity duration-200"
//                             >
//                                 <FaUserCircle className="w-9 h-9 text-green-800" />
//                             </button>

//                             {isDropdownOpen && (
//                                 <div className="absolute right-0 mt-3 w-64 bg-white border rounded-xl shadow-xl z-50 overflow-hidden">
//                                     {/* Profile Info */}
//                                     <div className="p-3 border-b ">
//                                         <div className="p-2 flex items-center space-x-3 hover:bg-gray-100  rounded-lg transition-colors duration-200 cursor-pointer">
//                                             <img
//                                                 src="https://via.placeholder.com/40"
//                                                 alt="Profile"
//                                                 className=" md:w-10 w-8 md:h-10 h-8 rounded-full "
//                                             />
//                                             <div>
//                                                 <h3 className="text-gray-900 font-semibold md:text-sm text xs">Agent Name</h3>
//                                                 <p className="text-sm text-gray-500 md:text-sm text xs">agent@example.com</p>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <ul className="p-2">
//                                         <li
//                                             className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200"
//                                             onClick={() => navigate('/collector/profile')}
//                                         >
//                                             <div className="flex items-center space-x-3">
//                                                 <FaRegUserCircle className="text-gray-500" />
//                                                 <span>View Profile</span>
//                                             </div>
//                                         </li>
//                                         <li
//                                             className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200"
//                                             onClick={() => navigate('/agent/notifications')}
//                                         >
//                                             <div className="flex items-center space-x-3">
//                                                 <IoMdNotificationsOutline className="text-gray-500" />
//                                                 <span>Notifications</span>
//                                             </div>
//                                         </li>
//                                         <li 
//                                             className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200"
//                                             onClick={handleLogout}
//                                         >
//                                             <div className="flex items-center space-x-3">
//                                                 <MdOutlineLogout className="text-gray-500" />
//                                                 <span>Logout</span>
//                                             </div>
//                                         </li>
//                                     </ul>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;


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
import { useDispatch } from 'react-redux';
import { collectorLogout } from '../../../redux/collectorAuthSlice';

interface NavbarProps {
    toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

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

    const handleLogout = () => {
        dispatch(collectorLogout());
        navigate('/collector/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-full mx-auto md:px-6 xs:px-4 px-2">
                <div className="flex items-center justify-between md:h-16 h-14">
                    {/* Mobile Sidebar Toggle */}
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden text-green-950 hover:text-green-600 transition-colors duration-200"
                    >
                        <FaBars className="xs:w-6 xs:h-6 w-5 h-5" />
                    </button>

                    {/* Search Bar */}
                    <div className="flex-1 flex justify-end md:mx-4 xs:mx-3 mx-2">
                        <div className="relative md:w-64 xs:w-48 w-40">
                            <input
                                type="text"
                                placeholder="Search pickups..."
                                className="w-full md:pl-10 xs:pl-8 pl-6 pr-4 md:py-2 py-1.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent bg-gray-50 transition-all duration-200 md:text-sm xs:text-xs text-xxs"
                            />
                            <div className="absolute inset-y-0 left-0 md:pl-3 xs:pl-2.5 pl-2 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400 hover:text-green-500 md:w-4 md:h-4 w-3 h-3" />
                            </div>
                        </div>
                    </div>

                    {/* Navbar Icons */}
                    <div className="flex items-center md:space-x-6 xs:space-x-4 space-x-2">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => navigate('/agent/notifications')}
                                className='md:p-2 p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200'
                            >
                                <IoMdNotificationsOutline className="md:w-6 md:h-6 xs:w-5 xs:h-5 w-4 h-4 text-gray-600 hover:text-green-600" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full md:w-5 md:h-5 w-4 h-4 flex items-center justify-center md:text-xs text-xxs font-semibold">
                                    3
                                </span>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="relative">
                            <button className='md:p-2 p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200'>
                                <MdChatBubbleOutline className="md:w-6 md:h-6 xs:w-5 xs:h-5 w-4 h-4 text-gray-600 hover:text-green-600" />
                                <span className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full md:w-5 md:h-5 w-4 h-4 flex items-center justify-center md:text-xs text-xxs font-semibold">
                                    2
                                </span>
                            </button>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={toggleDropdown}
                                className="hover:opacity-80 transition-opacity duration-200"
                            >
                                <FaUserCircle className="md:w-9 md:h-9 xs:w-8 xs:h-8 w-6 h-6 text-green-900" />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-3 md:w-64 xs:w-56 w-48 bg-white border rounded-xl shadow-xl z-50 overflow-hidden">
                                    {/* Profile Info */}
                                    <div className="md:p-3 p-2 border-b">
                                        <div className="md:p-2 p-1.5 flex items-center space-x-3 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer">
                                            <img
                                                src="https://via.placeholder.com/40"
                                                alt="Profile"
                                                className="md:w-10 md:h-10 xs:w-8 xs:h-8 w-6 h-6 rounded-full"
                                            />
                                            <div>
                                                <h3 className="text-gray-900 font-semibold md:text-sm xs:text-xs text-xxs">Agent Name</h3>
                                                <p className="text-gray-500 md:text-sm xs:text-xs text-xxs">agent@example.com</p>
                                            </div>
                                        </div>
                                    </div>

                                    <ul className="md:p-2 p-1.5">
                                        <li
                                            className="block md:px-4 px-3 md:py-2.5 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200"
                                            onClick={() => navigate('/collector/profile')}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <FaRegUserCircle className="md:w-4 md:h-4 w-3 h-3 text-gray-500" />
                                                <span className="md:text-sm xs:text-xs text-xxs">View Profile</span>
                                            </div>
                                        </li>
                                        <li
                                            className="block md:px-4 px-3 md:py-2.5 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200"
                                            onClick={() => navigate('/agent/notifications')}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <IoMdNotificationsOutline className="md:w-4 md:h-4 w-3 h-3 text-gray-500" />
                                                <span className="md:text-sm xs:text-xs text-xxs">Notifications</span>
                                            </div>
                                        </li>
                                        <li 
                                            className="block md:px-4 px-3 md:py-2.5 py-2 text-gray-700 hover:bg-red-100 rounded-lg cursor-pointer transition-colors duration-200"
                                            onClick={handleLogout}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <MdOutlineLogout className="md:w-4 md:h-4 w-3 h-3 text-gray-500" />
                                                <span className="md:text-sm xs:text-xs text-xxs">Logout</span>
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