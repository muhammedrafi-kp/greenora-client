import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { IoIosNotifications, IoIosPricetags } from "react-icons/io";
import { FaUserCircle, FaUserPlus, FaList, FaClipboardCheck, FaHome, FaInfoCircle, FaClipboardList } from 'react-icons/fa';
import { BiChevronDown } from 'react-icons/bi';
import { MdLogin, MdLogout } from "react-icons/md";
import { GrServices, GrContact } from "react-icons/gr";
import AuthModal from './AuthModal';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '../../redux/authSlice';
import notificationAlert from '../../assets/notification-alert.mp3';
import { getNotifications, getUnreadNotificationCount, markNotificationAsRead } from '../../services/userService';
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';
import { JwtPayload } from 'jwt-decode';
import { setUnreadCount, incrementUnreadCount } from '../../redux/notificationSlice';
import { TbCoinRupeeFilled } from 'react-icons/tb';

const socket = io('http://localhost:3006', {
    withCredentials: true,
    transports: ['websocket'],
});

interface DecodedToken extends JwtPayload {
    userId: string;
}

export interface INotification {
    _id: string;
    title: string;
    message: string;
    url: string;
    createdAt: string;
    isRead: boolean;
}

const NavBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>('');
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {unreadCount} = useSelector((state: any) => state.notification);
    const { isLoggedIn, role, token } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const notificationRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const notificationContainerRef = useRef<HTMLDivElement | null>(null);

    const fetchNotifications = async (page: number = 1) => {
        try {
            setIsLoading(true);
            const response = await getNotifications(page);
            console.log("Notifications response:", response);

            if (response.success) {
                // Create a Set of existing notification IDs
                const existingIds = new Set(notifications.map(n => n._id));

                // Filter out any duplicates from the new data
                const newNotifications = response.data.filter(
                    (notification: INotification) => !existingIds.has(notification._id)
                );

                if (page === 1) {
                    setNotifications(response.data);
                } else {
                    setNotifications(prev => [...prev, ...newNotifications]);
                }

                // Only set hasMore to true if we received new, unique notifications
                setHasMore(newNotifications.length > 0);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchUnreadNotificationCount = async () => {
        try {
            const response = await getUnreadNotificationCount();
            if (response.success) {
                dispatch(setUnreadCount(response.data));
                console.log("unread:",unreadCount)
            }
        } catch (error) {
            console.error("Error fetching unread notification count:", error);
        }
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        // Only fetch more if we're near the bottom, not loading, and have more to fetch
        if (scrollHeight - scrollTop <= clientHeight * 1.5 && !isLoading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    useEffect(() => {
        if (isLoggedIn && role === 'user') {
            fetchUnreadNotificationCount();
        }
    }, [isLoggedIn, role]);

    useEffect(() => {
        if (isLoggedIn && role === 'user' && token) {
            const decodedToken = jwtDecode<DecodedToken>(token);
            console.log("decodedToken:", decodedToken);
            setUserId(decodedToken.userId);
            fetchNotifications(page);

            socket.connect();
            socket.emit("join-room", decodedToken.userId);

            socket.on("receive-notification", (notification: INotification) => {
                console.log("notification:", notification);
                setNotifications(prev => [notification, ...prev]);
                dispatch(incrementUnreadCount());

                if (audioRef.current) {
                    audioRef.current.play().catch(err => console.log("Audio play failed:", err));
                }
            });

            socket.on("notification-read", (notificationId: string) => {
                console.log("notification-read:", notificationId);
                setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
                dispatch(setUnreadCount(Math.max(0, unreadCount - 1)));
            });

            return () => {
                socket.off("receive-notification");
                socket.disconnect();
            };
        }
    }, [page, isLoggedIn, role, token, dispatch, unreadCount]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navigateToHome = () => {
        navigate('/');
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleNotification = () => {
        if (isNotificationOpen) {
            setPage(1);
            setHasMore(true);
            // setNotifications([]); 
        }
        setIsNotificationOpen(!isNotificationOpen);
    };

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    const handleLogout = () => {
        dispatch(Logout());
        setIsDropdownOpen(false);
    };

    // Function to mark notification as read
    const handleNotificationClick = async (notificationId: string, url: string) => {
        try {
            const response = await markNotificationAsRead(notificationId);
            if (response.success) {
                setNotifications(prev =>
                    prev.map(notif =>
                        notif._id === notificationId
                            ? { ...notif, isRead: true }
                            : notif
                    )
                );
                dispatch(setUnreadCount(Math.max(0, unreadCount - 1)));

                // Navigate to the notification URL
                if (url) {
                    navigate(url);
                }

                // Close the notification dropdown
                setIsNotificationOpen(false);
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    return (
        <>
            {/* Add audio element */}
            <audio ref={audioRef} src={notificationAlert} />

            <nav className="bg-slate-100 p-1 shadow-md text-slate-950 w-full fixed top-0 z-50">
                <div className="container flex justify-between items-center mx-auto">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img
                            src={logo}
                            alt="Greenora logo"
                            style={{ width: '250px', height: 'auto' }}
                        />
                    </div>

                    {/* Hamburger Menu (for medium screens and smaller) */}
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="focus:outline-none">
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {isOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <div className="font-medium hidden md:flex md:items-center md:space-x-6 mr-8">
                        <span onClick={navigateToHome} className="after:content-[''] cursor-pointer hover:text-green-900 relative after:absolute after:w-full after:h-0.5 after:bg-green-900 after:left-0 after:bottom-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Home</span>

                        <a href="#about" className="after:content-[''] hover:text-green-900 relative after:absolute after:w-full after:h-0.5 after:bg-green-900 after:left-0 after:bottom-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">About</a>

                        <a href="#services" className="after:content-[''] hover:text-green-900 relative after:absolute after:w-full after:h-0.5 after:bg-green-900 after:left-0 after:bottom-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Services</a>

                        <a href="#contact" className="after:content-[''] hover:text-green-900 relative after:absolute after:w-full after:h-0.5 after:bg-green-900 after:left-0 after:bottom-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Contact</a>

                        {isLoggedIn && role === 'user' ? (
                            <>
                                {/* Notification Icon */}
                                <div className="group relative" ref={notificationRef}>
                                    <div
                                        className="p-2 rounded-full cursor-pointer hover:bg-slate-200 transition-colors"
                                        onClick={toggleNotification}
                                    >
                                        <IoIosNotifications className="h-6 text-slate-950 w-6" />
                                        {unreadCount > 0 && (
                                            <span className="bg-red-500 border-2 border-white h-5 justify-center rounded-full text-white text-xs w-5 -right-1 -top-1 absolute font-bold inline-flex items-center">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </div>

                                    {/* Notification Card */}
                                    {isNotificationOpen && (
                                        <div
                                            ref={notificationContainerRef}
                                            onScroll={handleScroll}
                                            className="bg-white border border-gray-200 rounded-lg shadow-xl w-[32rem] [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2 absolute duration-300 max-h-[28rem] mt-2 overflow-y-auto right-0 transform transition-all"
                                        >
                                            <h3 className="bg-gray-50 border-b text-gray-800 text-lg font-semibold mb-4 pb-2 pt-4 px-4 sticky top-0 z-10">
                                                Notifications
                                            </h3>
                                            <div className="px-4 space-y-3">
                                                {notifications && notifications.length > 0 ? (
                                                    <>
                                                        {notifications.map((notification) => (
                                                            <div
                                                                key={notification._id}
                                                                onClick={() => handleNotificationClick(notification._id, notification.url)}
                                                                className={`p-3 rounded-lg ${notification.isRead ? 'bg-gray-50' : 'bg-white'} border border-gray-200 cursor-pointer hover:shadow-md transition-shadow relative`}
                                                            >
                                                                {!notification.isRead && (
                                                                    <div className="absolute right-2 top-2">
                                                                        <div className="bg-red-500 h-1 rounded-full w-1"></div>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-between items-center mt-2">
                                                                    <h4 className={'text-gray-800 text-sm font-semibold'}>
                                                                        {notification.title}
                                                                    </h4>
                                                                    <span className="text-gray-500 text-xs">
                                                                        {new Date(notification.createdAt).toLocaleString('en-US', {
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric',
                                                                            hour: 'numeric',
                                                                            minute: '2-digit',
                                                                            hour12: true
                                                                        })}
                                                                    </span>
                                                                </div>
                                                                <p className={`text-gray-600 text-xs mt-3 ${!notification.isRead ? 'font-medium' : 'font-normal'}`}>
                                                                    {notification.message}
                                                                </p>
                                                            </div>
                                                        ))}
                                                        {isLoading && (
                                                            <div className="text-center py-4">
                                                                <div className="border-b-2 border-green-700 h-6 rounded-full w-6 animate-spin inline-block"></div>
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="text-center text-gray-500 py-4">
                                                        No notifications
                                                    </div>
                                                )}
                                            </div>
                                            <div className="bg-gray-50 border-t bottom-0 mt-4 pb-4 pt-2 px-4 sticky">
                                                <button
                                                    onClick={() => {
                                                        navigate('/account/notifications');
                                                        toggleNotification();
                                                    }}
                                                    className="text-center text-green-700 text-sm w-full hover:text-green-800"
                                                >
                                                    View All Notifications
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Profile Icon with Dropdown */}
                                <div className="flex bg-white border rounded-full cursor-pointer duration-300 gap-2 hover:border-green-500 hover:shadow-lg items-center px-2 py-1 relative transition-all">
                                    <div className="relative" onClick={toggleDropdown}>
                                        <FaUserCircle className="h-8 rounded-full text-green-900 w-8 hover:opacity-80 transition-opacity" />
                                        <div className="bg-green-500 border-2 border-white h-3 rounded-full w-3 absolute right-0 top-0"></div>
                                    </div>
                                    <button
                                        onClick={toggleDropdown}
                                        className="flex h-6 justify-center rounded-full w-6 hover:bg-green-100 items-center transition-colors"
                                    >
                                        <BiChevronDown className={`transition-transform duration-300 text-green-900 w-5 h-5 transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="bg-white border border-gray-100 p-2 rounded-2xl shadow-xl text-slate-950 w-56 absolute duration-300 mt-64 right-0 transform transition-all" ref={dropdownRef}>
                                            <ul className="font-normal py-1">
                                                <li className="rounded-xl duration-200 hover:bg-green-100 px-3 py-2 transition-colors" onClick={() =>{
                                                    navigate('/account/');
                                                    toggleDropdown();
                                                }}>
                                                    <span className="flex text-gray-700 hover:text-green-900 items-center space-x-3">
                                                        <FaUserCircle className="h-5 w-5" />
                                                        <span className="font-base">Account</span>
                                                    </span>
                                                </li>
                                                <li onClick={() => {
                                                    navigate('/account/collections');
                                                    toggleDropdown();
                                                }} className="rounded-xl duration-200 hover:bg-green-100 px-3 py-2 transition-colors">
                                                    <span className="flex text-gray-700 hover:text-green-900 items-center space-x-3">
                                                        <FaClipboardList className="h-5 w-5" />
                                                        <span className="font-base">Collections</span>
                                                    </span>
                                                </li>
                                                <li onClick={() => {
                                                    navigate('/account/charges');
                                                    toggleDropdown();
                                                }} className="rounded-xl duration-200 hover:bg-green-100 px-3 py-2 transition-colors">
                                                    <span className="flex text-gray-700 hover:text-green-900 items-center space-x-3">
                                                        <TbCoinRupeeFilled className="h-5 w-5" />
                                                        <span className="font-base">Charges</span>
                                                    </span>
                                                </li>
                                                <div className="border-gray-100 border-t my-2"></div>
                                                <li className="rounded-xl duration-200 hover:bg-red-100 px-3 py-2 transition-colors" onClick={handleLogout}>
                                                    <span className="flex text-red-600 hover:text-red-700 items-center space-x-3">
                                                        <MdLogout className="h-5 w-5" />
                                                        <span className="font-medium">Logout</span>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={openLoginModal}
                                className="bg-green-800 rounded-full text-white duration-300 hover:bg-green-900 px-6 py-2 transition-colors"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Sidebar */}
                <div
                    className={`fixed top-0 right-0 w-72 h-full bg-white transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
                        } transition-transform duration-300 ease-in-out md:hidden z-50`}
                >
                    {/* Sidebar Header */}
                    <div className="bg-gradient-to-r p-3 from-green-900 to-green-800">
                        {isLoggedIn && role === 'user' ? (
                            <div className="flex gap-4 items-center">
                                <div className="relative">
                                    <FaUserCircle className="h-12 text-white w-12" />
                                    <div className="bg-green-400 border-2 border-white h-3 rounded-full w-3 absolute bottom-0 right-0"></div>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">User Name</h3>
                                    <p className="text-green-100 text-sm">Welcome back!</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-white">
                                <h3 className="font-medium">Welcome to Greenora</h3>
                                <p className="text-green-100 text-sm">Please login to continue</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Navigation */}
                    <div className="p-4 z-50">
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex rounded-lg text-gray-700 w-full gap-4 group hover:bg-green-50 items-center px-4 py-3 transition-colors"
                                >
                                    <FaHome className="h-5 text-gray-500 w-5 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900">Home</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/services')}
                                    className="flex rounded-lg text-gray-700 w-full gap-4 group hover:bg-green-50 items-center px-4 py-3 transition-colors"
                                >
                                    <GrServices className="h-5 text-gray-500 w-5 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900">Services</span>
                                </button>
                            </li>
                            {/* <li>
                                <button
                                    onClick={() => navigate('/pricing')}
                                    className="flex rounded-lg text-gray-700 w-full gap-4 group hover:bg-green-50 items-center px-4 py-3 transition-colors"
                                >
                                    <IoIosPricetags className="h-5 text-gray-500 w-5 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900">Pricing</span>
                                </button>
                            </li> */}
                            <li>
                                <button
                                    className="flex rounded-lg text-gray-700 w-full gap-4 group hover:bg-green-50 items-center px-4 py-3 transition-colors"
                                >
                                    <IoIosNotifications className="h-5 text-gray-500 w-5 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900">Notifications</span>
                                    <span className="bg-red-500 rounded-full text-white text-xs font-bold ml-auto px-2 py-1">
                                        6
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/about')}
                                    className="flex rounded-lg text-gray-700 w-full gap-4 group hover:bg-green-50 items-center px-4 py-3 transition-colors"
                                >
                                    <FaInfoCircle className="h-5 text-gray-500 w-5 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900">About</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/contact')}
                                    className="flex rounded-lg text-gray-700 w-full gap-4 group hover:bg-green-50 items-center px-4 py-3 transition-colors"
                                >
                                    <GrContact className="h-5 text-gray-500 w-5 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900">Contact</span>
                                </button>
                            </li>
                        </ul>

                        <div className="border-gray-100 border-t mt-6 pt-4 space-y-2">
                            <button
                                onClick={openLoginModal}
                                className="flex rounded-lg text-gray-700 w-full gap-4 group hover:bg-green-50 items-center px-4 py-3 transition-colors"
                            >
                                <MdLogin className="h-5 text-gray-500 w-5 group-hover:text-green-900" />
                                <span className="font-medium group-hover:text-green-900">Login</span>
                            </button>
                        </div>
                    </div>

                </div>

                {/* Overlay with blur effect */}
                {isOpen && (
                    <div
                        className="bg-black/30 backdrop-blur-sm fixed inset-0 md:hidden z-40"
                        onClick={toggleMenu}
                    ></div>
                )}
            </nav>

            {isLoginModalOpen && <AuthModal closeModal={closeLoginModal} initialMode="login" />}
        </>
    );
};

export default NavBar;

