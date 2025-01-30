import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { IoIosNotifications, IoIosPricetags } from "react-icons/io";
import { FaUserCircle, FaUserPlus, FaList, FaClipboardCheck, FaHome, FaInfoCircle } from 'react-icons/fa'; // For profile icon
import { BiChevronDown } from 'react-icons/bi'; // For the dropdown arrow
import { MdLogin, MdLogout } from "react-icons/md";
// import { CgLogOut } from "react-icons/cg";
import { GrServices, GrContact } from "react-icons/gr";
// import Login from './Login';
// import SignUp from './Signup';
import AuthModal from './AuthModal';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '../../redux/authSlice';


const NavBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    // const [isSignUpModalOpen, setIsSignUpModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { isLoggedIn, role } = useSelector((state: any) => state.auth);

    const navigateToHome = () => {
        navigate('/');
    }

    const dropdownRef = useRef<HTMLDivElement | null>(null);

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

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    // const openSignUpModal = () => {
    //     setIsSignUpModalOpen(true);
    // };

    // const closeSignUpModal = () => {
    //     setIsSignUpModalOpen(false);
    // };

    const handleLogout = () => {
        dispatch(Logout());
        setIsDropdownOpen(false);
    };

    return (
        <>
            <nav className="bg-slate-100 text-slate-950 p-1 shadow-md  w-full fixed top-0 z-50" >
                <div className="container mx-auto flex items-center justify-between">
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
                                className="w-6 h-6"
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
                    <div className="hidden md:flex md:items-center md:space-x-6 mr-8 font-medium">
                        <span onClick={navigateToHome} className="relative hover:text-green-900 cursor-pointer after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-green-900 after:left-0 after:bottom-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300" >Home</span>
                        <a href="#about" className="relative hover:text-green-900 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-green-900 after:left-0 after:bottom-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">About</a>
                        <a href="#services" className="relative hover:text-green-900 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-green-900 after:left-0 after:bottom-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Services</a>
                        <span onClick={() => navigate('/pricing')} className="relative  cursor-pointer hover:text-green-900 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-green-900 after:left-0 after:bottom-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Pricing</span>
                        <a href="#contact" className="relative hover:text-green-900 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-green-900 after:left-0 after:bottom-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Contact</a>

                        {isLoggedIn && role === 'user' ? (
                            <>
                                {/* Notification Icon */}
                                <div className="relative group">
                                    <div className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
                                        <IoIosNotifications className="w-6 h-6 text-slate-950" />
                                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white transition-transform group-hover:scale-110">
                                            6
                                        </span>
                                    </div>
                                </div>

                                {/* Profile Icon with Dropdown */}
                                <div className="bg-white relative flex items-center gap-2 border rounded-full cursor-pointer py-1 px-2 hover:shadow-lg transition-all duration-300 hover:border-green-500">
                                    <div className="relative" onClick={toggleDropdown}>
                                        <FaUserCircle className="w-8 h-8 text-green-900 rounded-full hover:opacity-80 transition-opacity" />
                                        <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <button
                                        onClick={toggleDropdown}
                                        className="flex items-center justify-center w-6 h-6 hover:bg-green-100 rounded-full transition-colors"
                                    >
                                        <BiChevronDown className={`transition-transform duration-300 text-green-900 w-5 h-5 transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-64 w-56 bg-white shadow-xl rounded-2xl text-slate-950 border border-gray-100 p-2 transform transition-all duration-300" ref={dropdownRef}>
                                            <ul className="py-1 font-normal">
                                                {/* <li className="px-3 py-2 hover:bg-green-100 rounded-xl transition-colors duration-200" onClick={openSignUpModal}>
                                                    <span  className="flex items-center space-x-3 text-gray-700 hover:text-green-900">
                                                        <FaUserPlus className="w-5 h-5" />
                                                        <span className="font-base">Sign up</span>
                                                    </span>
                                                </li>
                                                <li className="px-3 py-2 hover:bg-green-100 rounded-xl transition-colors duration-200" onClick={openLoginModal}>
                                                    <span className="flex items-center space-x-3 text-gray-700 hover:text-green-900">
                                                        <MdLogin className="w-5 h-5" />
                                                        <span className="font-base">Login</span>
                                                    </span>
                                                </li> */}
                                                {/* <div className="my-2 border-t border-gray-100"></div> */}
                                                <li className="px-3 py-2 hover:bg-green-100 rounded-xl transition-colors duration-200" onClick={() => navigate('/account')}>
                                                    <span className="flex items-center space-x-3 text-gray-700 hover:text-green-900">
                                                        <FaUserCircle className="w-5 h-5" />
                                                        <span className="font-base">Account</span>
                                                    </span>
                                                </li>
                                                <li className="px-3 py-2 hover:bg-green-100 rounded-xl transition-colors duration-200">
                                                    <span className="flex items-center space-x-3 text-gray-700 hover:text-green-900">
                                                        <FaList className="w-5 h-5" />
                                                        <span className="font-base">Requests</span>
                                                    </span>
                                                </li>
                                                <li className="px-3 py-2 hover:bg-green-100 rounded-xl transition-colors duration-200">
                                                    <span className="flex items-center space-x-3 text-gray-700 hover:text-green-900">
                                                        <FaClipboardCheck className="w-5 h-5" />
                                                        <span className="font-base">Plans</span>
                                                    </span>
                                                </li>
                                                <div className="my-2 border-t border-gray-100"></div>
                                                <li className="px-3 py-2 hover:bg-red-100 rounded-xl transition-colors duration-200" onClick={handleLogout}>
                                                    <span className="flex items-center space-x-3 text-red-600 hover:text-red-700">
                                                        <MdLogout className="w-5 h-5" />
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
                                className="bg-green-700 hover:bg-green-900  text-white px-6 py-2 rounded-full  transition-colors duration-300"
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
                    <div className="bg-gradient-to-r from-green-900 to-green-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={toggleMenu} className="text-white hover:bg-green-800 p-2 rounded-lg transition-colors">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
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
                        {isLoggedIn && role === 'user' ? (
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <FaUserCircle className="w-12 h-12 text-white" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
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
                                    className="flex items-center w-full gap-4 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors group"
                                >
                                    <FaHome className="w-5 h-5 text-gray-500 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900">Home</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/services')}
                                    className="flex items-center w-full gap-4 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors group"
                                >
                                    <GrServices className="w-5 h-5 text-gray-500 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900">Services</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/pricing')}
                                    className="flex items-center w-full gap-4 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors group"
                                >
                                    <IoIosPricetags className="w-5 h-5 text-gray-500 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900">Pricing</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="flex items-center w-full gap-4 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors group"
                                >
                                    <IoIosNotifications className="w-5 h-5 text-gray-500 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900">Notifications</span>
                                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        6
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/about')}
                                    className="flex items-center w-full gap-4 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors group"
                                >
                                    <FaInfoCircle className="w-5 h-5 text-gray-500 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900">About</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/contact')}
                                    className="flex items-center w-full gap-4 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors group"
                                >
                                    <GrContact className="w-5 h-5 text-gray-500 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900">Contact</span>
                                </button>
                            </li>
                        </ul>

                        <div className="mt-6 border-t border-gray-100 pt-4 space-y-2">
                            <button
                                onClick={openLoginModal}
                                className="flex items-center w-full gap-4 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors group"
                            >
                                <MdLogin className="w-5 h-5 text-gray-500 group-hover:text-green-900" />
                                <span className="font-medium group-hover:text-green-900">Login</span>
                            </button>
                            {/* <button
                                onClick={openSignUpModal}
                                className="flex items-center w-full gap-4 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors group"
                            >
                                <FaUserPlus className="w-5 h-5 text-gray-500 group-hover:text-green-900" />
                                <span className="font-medium group-hover:text-green-900">Sign Up</span>
                            </button> */}
                        </div>

                    </div>
                </div>

                {/* Overlay with blur effect */}
                {isOpen && (
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-40"
                        onClick={toggleMenu}
                    ></div>
                )}
            </nav>

            {/* {isLoginModalOpen && (<Login closeModal={closeLoginModal} />)} */}
            {/* {isSignUpModalOpen && (<SignUp closeModal={closeSignUpModal} />)} */}
            {isLoginModalOpen && <AuthModal closeModal={closeLoginModal} initialMode="login" />}
            {/* {isSignUpModalOpen && <AuthModal closeModal={closeSignUpModal} initialMode="signup" />} */}
        </>
    );
};

export default NavBar;

