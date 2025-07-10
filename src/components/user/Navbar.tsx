import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'
import { IoIosNotifications } from "react-icons/io";
import { FaUserCircle, FaHome, FaInfoCircle, FaClipboardList } from 'react-icons/fa';
import { BiChevronDown } from 'react-icons/bi';
import { MdLogin, MdLogout } from "react-icons/md";
import { GrServices, GrContact } from "react-icons/gr";
import AuthModal from './AuthModal';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '../../redux/authSlice';
import notificationAlert from '../../assets/notification-alert.mp3';
import { getNotifications, getUnreadNotificationCount, markNotificationAsRead } from '../../services/notificationService';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { setUnreadCount, incrementUnreadCount } from '../../redux/notificationSlice';
import { TbCoinRupeeFilled } from 'react-icons/tb';
import { ApiResponse } from '../../types/common';
import { INotification } from '../../types/notification';
import socket from "../../sockets/notificationSocket";

interface DecodedToken extends JwtPayload {
    userId: string;
}

const NavBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const unreadCount = useSelector((state: any) => state.notification.unreadCount.user);
    const { isLoggedIn, role, token } = useSelector((state: any) => state.auth);

    console.log("isLoggedIn :", isLoggedIn)
    console.log("role :", role)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const notificationRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const notificationContainerRef = useRef<HTMLDivElement | null>(null);

    const fetchNotifications = async (page: number = 1) => {
        try {
            setIsLoading(true);
            const res: ApiResponse<INotification[]> = await getNotifications(page);
            console.log("Notifications response:", res);

            if (res.success) {
                // Create a Set of existing notification IDs
                const existingIds = new Set(notifications.map(n => n._id));

                // Filter out any duplicates from the new data
                const newNotifications = res.data.filter(
                    (notification: INotification) => !existingIds.has(notification._id)
                );

                if (page === 1) {
                    setNotifications(res.data);
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
            const res: ApiResponse<number> = await getUnreadNotificationCount();
            if (res.success) {
                dispatch(setUnreadCount({ role: "user", count: res.data }));
                console.log("unread:", unreadCount)
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
            fetchNotifications(page);

            socket.connect();
            socket.emit("join-room", decodedToken.userId);

            socket.on("receive-notification", (notification: INotification) => {
                console.log("notification:", notification);
                setNotifications(prev => [notification, ...prev]);
                dispatch(incrementUnreadCount("user"));

                if (audioRef.current) {
                    audioRef.current.play().catch(err => console.log("Audio play failed:", err));
                }
            });

            socket.on("notification-read", (notificationId: string) => {
                console.log("notification-read:", notificationId);
                setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
                dispatch(setUnreadCount({ role: "user", count: Math.max(0, unreadCount - 1) }));
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
            const res: ApiResponse<null> = await markNotificationAsRead(notificationId);
            if (res.success) {
                setNotifications(prev =>
                    prev.map(notif =>
                        notif._id === notificationId
                            ? { ...notif, isRead: true }
                            : notif
                    )
                );
                dispatch(setUnreadCount({ role: "user", count: Math.max(0, unreadCount - 1) }));

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

            <nav className="bg-slate-100 p-3 shadow-md text-slate-950 w-full fixed top-0 z-50">
                <div className="container flex justify-between items-center mx-auto">
                    {/* Logo and Mobile Menu */}
                    <div className="flex items-center gap-4">

                        {/* Mobile Hamburger Menu (left side) */}
                        <div className="md:hidden mt-2">
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

                        {/* Logo */}
                        <div className="flex items-center lg:ml-8 md:ml-6">
                            <img
                                src={logo}
                                alt="Greenora logo"
                                className="lg:w-12 md:w-10 w-7 lg:h-12 md:h-10 h-7"
                            />
                            <span className="ml-2 font-bold text-green-900 text-xl md:text-2xl lg:text-3xl select-none">Greenora</span>
                        </div>
                    </div>

                    {/* Mobile Icons (right side) */}
                    <div className="md:hidden flex items-center lg:gap-2 gap-1">
                        {isLoggedIn && role === 'user' && (
                            <>
                                {/* Mobile Notification Icon */}
                                <div className="relative">
                                    <button
                                        onClick={toggleNotification}
                                        className="p-2 rounded-full hover:bg-slate-200 transition-colors"
                                    >
                                        <IoIosNotifications className="h-5 w-5 text-slate-950" />
                                        {unreadCount > 0 && (
                                            <span className="bg-red-500 border-2 border-white h-4 w-4 justify-center rounded-full text-white text-xs absolute -right-1 -top-1 font-bold inline-flex items-center">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                </div>

                                {/* Mobile Profile Icon */}
                                <div className="relative">
                                    <button
                                        onClick={toggleDropdown}
                                        className="p-1 rounded-full hover:bg-slate-200 transition-colors"
                                    >
                                        <FaUserCircle className="h-6 w-6 text-green-900" />
                                        {/* <div className="bg-green-500 border-2 border-white h-2.5 w-2.5 rounded-full absolute right-0 top-0"></div> */}
                                    </button>
                                </div>
                            </>
                        )}
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
                                            className={`bg-white border border-gray-200 rounded-lg shadow-2xl w-[32rem] [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2 absolute duration-300 ${notifications.length === 0 ? 'h-[10rem]' : 'max-h-[28rem]'} mt-2 overflow-y-auto right-0 transform transition-all`}
                                        >
                                            <div className="bg-gray-50 border-b mb-4 sticky top-0 z-10">
                                                <div className="flex items-center justify-between px-4 py-2">
                                                    <h3 className="text-gray-800 text-lg font-semibold">
                                                        Notifications
                                                    </h3>
                                                    <button
                                                        onClick={toggleNotification}
                                                        className="text-gray-500 hover:text-gray-700 transition-colors"
                                                    >
                                                        <svg
                                                            className="h-5 w-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
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
                                            {notifications.length > 0 && (
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
                                            )}
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
                                                <li className="rounded-xl duration-200 hover:bg-green-100 px-3 py-2 transition-colors" onClick={() => {
                                                    navigate('/account/');
                                                    toggleDropdown();
                                                }}>
                                                    <span className="flex text-gray-700 font-medium hover:text-green-900 items-center space-x-3">
                                                        <FaUserCircle className="h-5 w-5" />
                                                        <span className="font-base">Account</span>
                                                    </span>
                                                </li>
                                                <li onClick={() => {
                                                    navigate('/account/collections');
                                                    toggleDropdown();
                                                }} className="rounded-xl duration-200 hover:bg-green-100 px-3 py-2 transition-colors">
                                                    <span className="flex text-gray-700 font-medium hover:text-green-900 items-center space-x-3">
                                                        <FaClipboardList className="h-5 w-5" />
                                                        <span className="font-base">Collections</span>
                                                    </span>
                                                </li>
                                                <li onClick={() => {
                                                    navigate('/account/charges');
                                                    toggleDropdown();
                                                }} className="rounded-xl duration-200 hover:bg-green-100 px-3 py-2 transition-colors">
                                                    <span className="flex text-gray-700 font-medium hover:text-green-900 items-center space-x-3">
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
                    className={`fixed top-0 left-0 w-72 h-full bg-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                        } transition-transform duration-300 ease-in-out md:hidden z-50`}
                >
                    {/* Sidebar Header */}
                    <div className="bg-gradient-to-r p-3 from-green-900 to-green-800">
                        {isLoggedIn && role === 'user' ? (
                            <div className="flex gap-3 sm:gap-4 items-center">
                                <div className="relative">
                                    <FaUserCircle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                                    <div className="bg-green-400 border-2 border-white h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full absolute bottom-0 right-0"></div>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-sm sm:text-base">User Name</h3>
                                    <p className="text-green-100 text-xs sm:text-sm">Welcome back!</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-white">
                                <h3 className="font-medium text-sm sm:text-base">Welcome to Greenora</h3>
                                <p className="text-green-100 text-xs sm:text-sm">Please login to continue</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Navigation */}
                    <div className="p-3 sm:p-4 z-50">
                        <ul className="space-y-1.5 sm:space-y-2">
                            <li>
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex rounded-lg text-gray-700 w-full gap-3 sm:gap-4 group hover:bg-green-50 items-center px-3 py-2.5 sm:px-4 sm:py-3 transition-colors"
                                >
                                    <FaHome className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900 text-sm sm:text-base">Home</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/services')}
                                    className="flex rounded-lg text-gray-700 w-full gap-3 sm:gap-4 group hover:bg-green-50 items-center px-3 py-2.5 sm:px-4 sm:py-3 transition-colors"
                                >
                                    <GrServices className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900 text-sm sm:text-base">Services</span>
                                </button>
                            </li>
                            {isLoggedIn && role === 'user' ? (
                                <>
                                    <li>
                                        <button
                                            onClick={() => {
                                                navigate('/account/');
                                                toggleMenu();
                                            }}
                                            className="flex rounded-lg text-gray-700 w-full gap-3 sm:gap-4 group hover:bg-green-50 items-center px-3 py-2.5 sm:px-4 sm:py-3 transition-colors"
                                        >
                                            <FaUserCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 group-hover:text-green-900" />
                                            <span className="font-medium group-hover:text-green-900 text-sm sm:text-base">Account</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                navigate('/account/collections');
                                                toggleMenu();
                                            }}
                                            className="flex rounded-lg text-gray-700 w-full gap-3 sm:gap-4 group hover:bg-green-50 items-center px-3 py-2.5 sm:px-4 sm:py-3 transition-colors"
                                        >
                                            <FaClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 group-hover:text-green-900" />
                                            <span className="font-medium group-hover:text-green-900 text-sm sm:text-base">My Collections</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => {
                                            navigate('/account/notifications');
                                            toggleMenu();
                                        }}
                                            className="flex rounded-lg text-gray-700 w-full gap-3 sm:gap-4 group hover:bg-green-50 items-center px-3 py-2.5 sm:px-4 sm:py-3 transition-colors"
                                        >
                                            <IoIosNotifications className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 group-hover:text-green-900" />
                                            <span className="font-medium group-hover:text-green-900 text-sm sm:text-base">Notifications</span>
                                            <span className="bg-red-500 rounded-full text-white text-xs font-bold ml-auto px-1.5 py-0.5 sm:px-2 sm:py-1">
                                                6
                                            </span>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                navigate('/account/charges');
                                                toggleMenu();
                                            }}
                                            className="flex rounded-lg text-gray-700 w-full gap-3 sm:gap-4 group hover:bg-green-50 items-center px-3 py-2.5 sm:px-4 sm:py-3 transition-colors"
                                        >
                                            <TbCoinRupeeFilled className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 group-hover:text-green-900" />
                                            <span className="font-medium group-hover:text-green-900 text-sm sm:text-base">Charges</span>
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <button
                                        onClick={openLoginModal}
                                        className="flex rounded-lg text-gray-700 w-full gap-3 sm:gap-4 group hover:bg-green-50 items-center px-3 py-2.5 sm:px-4 sm:py-3 transition-colors"
                                    >
                                        <MdLogin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 group-hover:text-green-900" />
                                        <span className="font-medium group-hover:text-green-900 text-sm sm:text-base">Account</span>
                                    </button>
                                </li>
                            )}
                            <li>
                                <button
                                    onClick={() => navigate('/about')}
                                    className="flex rounded-lg text-gray-700 w-full gap-3 sm:gap-4 group hover:bg-green-50 items-center px-3 py-2.5 sm:px-4 sm:py-3 transition-colors"
                                >
                                    <FaInfoCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900 text-sm sm:text-base">About</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/contact')}
                                    className="flex rounded-lg text-gray-700 w-full gap-3 sm:gap-4 group hover:bg-green-50 items-center px-3 py-2.5 sm:px-4 sm:py-3 transition-colors"
                                >
                                    <GrContact className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900 text-sm sm:text-base">Contact</span>
                                </button>
                            </li>
                        </ul>


                        {isLoggedIn && role === 'user' && (
                            <div className="border-gray-100 border-t mt-4 sm:mt-6 pt-3 sm:pt-4 space-y-1.5 sm:space-y-2">
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        toggleMenu();
                                    }}
                                    className="flex rounded-lg text-red-600 w-full gap-3 sm:gap-4 group hover:bg-red-50 items-center px-3 py-2.5 sm:px-4 sm:py-3 transition-colors"
                                >
                                    <MdLogout className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 group-hover:text-red-700" />
                                    <span className="font-medium group-hover:text-red-700 text-sm sm:text-base">Logout</span>
                                </button>
                            </div>
                        )}
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

