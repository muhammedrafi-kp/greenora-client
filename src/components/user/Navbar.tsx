import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { IoIosNotifications, IoIosPricetags } from "react-icons/io";
import { FaUserCircle, FaUserPlus, FaList, FaClipboardCheck, FaHome, FaInfoCircle } from 'react-icons/fa'; // For profile icon
import { BiChevronDown } from 'react-icons/bi'; // For the dropdown arrow
import { MdLogin, MdLogout } from "react-icons/md";
// import { CgLogOut } from "react-icons/cg";
import { GrServices, GrContact } from "react-icons/gr";
import Login from './Login';
import Signup from './Signup';


const NavBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const navigate = useNavigate();

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

    const openSignUpModal = () => {
        setIsSignUpModalOpen(true);
    };

    const closeSignUpModal = () => {
        setIsSignUpModalOpen(false);
    };

    return (
        <>
            <nav className="bg-slate-100 text-slate-950 p-2 shadow-lg fixed top-0  w-full" >
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
                        <span className="hover:text-gray-400 cursor-pointer" onClick={navigateToHome}>Home</span>
                        <a href="#about" className="hover:text-gray-400">About</a>
                        <a href="#services" className="hover:text-gray-400">Services</a>
                        <a href="#pricing" className="hover:text-gray-400">Pricing</a>
                        <a href="#contact" className="hover:text-gray-400">Contact</a>

                        {/* Notification Icon */}
                        <div className="relative">
                            <IoIosNotifications className="w-7 h-7 text-slate-950" />
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-500 rounded-full">
                                6
                            </span>
                        </div>

                        {/* Profile Icon with Dropdown */}
                        <div className="bg-white relative flex items-center gap-2 border rounded-full cursor-pointer py-1 px-2 shadow-md">
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center justify-center w-5 h-5 bg-green-900 rounded-full text-white"
                            >
                                <BiChevronDown className={`transition-transform transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                            </button>
                            <div className="relative" onClick={toggleDropdown}>
                                <FaUserCircle className="w-7 h-7 text-slate-950 rounded-full" />
                                <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div> {/* Optional status indicator */}
                            </div>
                            {/* Dropdown Toggle (Triangle) */}


                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-80 w-48 bg-white shadow-md rounded-2xl text-slate-950 border p-3" ref={dropdownRef}>
                                    <ul className="py-2 font-normal">
                                        <li className="px-4 py-2 hover:bg-green-200 rounded-lg" onClick={openSignUpModal}>
                                            <a href="#signup" className="flex items-center space-x-3">
                                                <FaUserPlus />
                                                <span>Signup</span>
                                            </a>
                                        </li>
                                        <li className="px-4 py-2 hover:bg-green-200 rounded-lg " onClick={openLoginModal}>
                                            <a href="#login" className="flex items-center space-x-3">
                                                <MdLogin />
                                                <span>Login</span>
                                            </a>
                                        </li>

                                        <li className="px-4 py-2 hover:bg-green-200 rounded-xl">
                                            <a href="#login" className="flex items-center space-x-3">
                                                <FaUserCircle />
                                                <span>Account</span>
                                            </a>
                                        </li>
                                        <li className="px-4 py-2 hover:bg-green-200 rounded-xl">

                                            <a href="#requests" className="flex items-center space-x-3">
                                                <FaList />
                                                <span>Requests</span>
                                            </a>

                                        </li>
                                        <li className="px-4 py-2 hover:bg-green-200 rounded-xl">
                                            <a href="#plans" className="flex items-center space-x-3">
                                                <FaClipboardCheck />
                                                <span>Plans</span>
                                            </a>
                                        </li>

                                        <li className="px-4 py-2 hover:bg-green-200 rounded-xl">
                                            <a href="#logout" className="flex items-center space-x-3">
                                                <MdLogout />
                                                <span>Logout</span>
                                            </a>
                                        </li>

                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar (slides in from the right) */}
                <div
                    className={`fixed top-0 right-0 w-64 h-full bg-white transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
                        } transition-transform md:hidden z-50`}
                >
                    <div className="p-3 flex justify-between bg-green-900">
                        <div className="flex ">

                            <a href="#" className="flex items-center space-x-3 text-white">
                                <FaUserCircle />
                                <span>User name</span>
                            </a>
                            {/* <img src={logo} alt="Greenora logo" style={{ width: '250px', height: 'auto' }} /> */}
                        </div>

                        <button onClick={toggleMenu} className="focus:outline-none">
                            <svg
                                className="w-6 h-6 text-white"
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

                    <ul className=" text-slate-950 ">

                        <li className="p-3 border-b ">
                            <a href="#home" className="flex items-center space-x-3">
                                <FaHome />
                                <span>Home</span>
                            </a>
                        </li>

                        <li className="p-3  border-b">
                            <a href="#services" className="flex items-center space-x-3">
                                <GrServices />
                                <span>Services</span>
                            </a>
                        </li>
                        <li className="p-3  border-b">
                            <a href="#pricing" className="flex items-center space-x-3">
                                <IoIosPricetags />
                                <span>Pricing</span>
                            </a>
                        </li>
                        <li className="p-3  border-b">
                            <a href="#notifications" className="flex items-center space-x-3">
                                <IoIosNotifications />
                                <span>Notifications</span>
                            </a>
                        </li>
                        <li className="p-3  border-b">
                            <a href="#about" className="flex items-center space-x-3">
                                <FaInfoCircle />
                                <span>About</span>
                            </a>
                        </li>
                        <li className="p-3  border-b">
                            <a href="#contact" className="flex items-center space-x-3">
                                <GrContact />
                                <span>Contact</span>
                            </a>
                        </li>

                    </ul>
                </div>

                {/* Overlay to close the sidebar */}
                {isOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-50 md:hidden z-40"
                        onClick={toggleMenu}
                    ></div>
                )}
            </nav>

            {isLoginModalOpen && (<Login closeModal={closeLoginModal} />)}
            {isSignUpModalOpen && (<Signup closeModal={closeSignUpModal} />)}

        </>
    );
};

export default NavBar;
