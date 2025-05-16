import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    FaBars,
    FaUserCircle,
    FaRegUserCircle,
} from 'react-icons/fa';
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdChatBubbleOutline, MdOutlineLogout } from "react-icons/md";
import notificationAlert from '../../../assets/notification-alert.mp3';
import { io } from 'socket.io-client';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { Logout } from '../../../redux/authSlice';
import { getUnreadNotificationCount } from '../../../services/notificationService';
import { incrementUnreadCount, setUnreadCount } from '../../../redux/notificationSlice';
import { ApiResponse } from '../../../types/common';


const socket = io(import.meta.env.VITE_API_GATEWAY_URL, {
    withCredentials: true,
    transports: ['websocket'],
    path: "/notification/socket.io",
});

interface DecodedToken extends JwtPayload {
    userId: string;
}

interface NavbarProps {
    toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const dispatch = useDispatch();
    const unreadCount = useSelector((state: any) => state.notification.unreadCount.collector);
    const { isLoggedIn, role, token } = useSelector((state: any) => state.auth);

    console.log(" isLoggedIn:",  isLoggedIn);
    console.log(" role:",  role);
    console.log(" token:",  token);

    // useEffect(() => {
    //     fetchUnreadNotificationCount();
    // }, []);

    const fetchUnreadNotificationCount = async () => {
        try {
            const res: ApiResponse<number> = await getUnreadNotificationCount();
            if (res.success) {
                dispatch(setUnreadCount({ role: "collector", count: res.data }));
            }
        } catch (error) {
            console.error("Error fetching unread notification count:", error);
        }
    };

    useEffect(() => {
        if (isLoggedIn && role === 'collector' && token) {
            const decodedToken = jwtDecode<DecodedToken>(token);
            console.log("decodedToken:", decodedToken);
            fetchUnreadNotificationCount();

            socket.connect();
            socket.emit("join-room", decodedToken.userId);

            socket.on("receive-notification", () => {
                
                dispatch(incrementUnreadCount("collector"));

                if (audioRef.current) {
                    audioRef.current.play().catch(err => console.log("Audio play failed:", err));
                }
            });

            return () => {
                socket.off("receive-notification");
                socket.disconnect();
            };
        }
    }, [isLoggedIn, role, token]);

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
        dispatch(Logout());
        navigate('/collector/login');
    };

    return (
        <>
        <audio ref={audioRef} src={notificationAlert} />
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
                    {/* <div className="flex-1 flex justify-end md:mx-4 xs:mx-3 mx-2">
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
                    </div> */}

                    {/* Navbar Icons - Updated to ensure right alignment */}
                    <div className="flex items-center ml-auto md:space-x-6 xs:space-x-4 space-x-2">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => navigate('/collector/notifications')}
                                className='md:p-2 p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200'
                            >
                                <IoMdNotificationsOutline className="md:w-6 md:h-6 xs:w-5 xs:h-5 w-4 h-4 text-gray-600 hover:text-green-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 flex items-center justify-center md:text-xs text-xxs font-semibold">
                                    {unreadCount}
                                </span>
                                )}
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="relative">
                            <button 
                                onClick={() => navigate('/collector/chat')}
                                className='md:p-2 p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200'
                            >
                                <MdChatBubbleOutline className="md:w-6 md:h-6 xs:w-5 xs:h-5 w-4 h-4 text-gray-600 hover:text-green-600" />
                                {/* <span className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 flex items-center justify-center md:text-xs text-xxs font-semibold">
                                    2
                                </span> */}
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
                                           <div>
                                           <FaRegUserCircle className="md:w-4 md:h-4 w-3 h-3 text-gray-500" />  
                                           </div>
                                            <div>
                                                {/* <h3 className="text-gray-900 font-semibold md:text-sm xs:text-xs text-xxs">Agent Name</h3> */}
                                                <p className="text-gray-500 md:text-sm xs:text-xs text-xxs">collector@gmail.com</p>
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
        </>
    );
};

export default Navbar;