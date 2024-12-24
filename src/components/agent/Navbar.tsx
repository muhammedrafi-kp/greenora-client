import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { IoIosNotifications } from "react-icons/io";
import { FaUserCircle, FaList, FaClipboardCheck, FaHome } from 'react-icons/fa';
import { BiChevronDown } from 'react-icons/bi';
import { MdLogout, MdDashboard } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";

const AgentNavbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

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

    return (
        <>
            <nav className="bg-slate-100 text-slate-950 p-2 shadow-md w-full z-50">
                <div className="container mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img
                            src={logo}
                            alt="Greenora logo"
                            style={{ width: '250px', height: 'auto' }}
                            className="cursor-pointer"
                            onClick={() => navigate('/agent')}
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
                        <span 
                            className="relative hover:text-green-900 cursor-pointer after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-green-900 after:left-0 after:bottom-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                            onClick={() => navigate('/agent')}
                        >
                            Home
                        </span>
                        <span 
                            className="relative hover:text-green-900 cursor-pointer after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-green-900 after:left-0 after:bottom-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                            onClick={() => navigate('/agent/dashboard')}
                        >
                            Dashboard
                        </span>
                        <span 
                            className="relative hover:text-green-900 cursor-pointer after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-green-900 after:left-0 after:bottom-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                            onClick={() => navigate('/agent/services')}
                        >
                            Services
                        </span>

                        {/* Notification Icon */}
                        <div className="relative group">
                            <div className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
                                <IoIosNotifications className="w-6 h-6 text-slate-950" />
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white transition-transform group-hover:scale-110">
                                    3
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
                                <div className="absolute right-0 mt-80 w-56 bg-white shadow-xl rounded-2xl text-slate-950 border border-gray-100 p-2 transform transition-all duration-300" ref={dropdownRef}>
                                    <ul className="py-1 font-normal">
                                        <li className="px-3 py-2 hover:bg-green-100 rounded-xl transition-colors duration-200" onClick={() => navigate('/agent/profile')}>
                                            <span className="flex items-center space-x-3 text-gray-700 hover:text-green-900">
                                                <FaUserCircle className="w-5 h-5" />
                                                <span className="font-base">Profile</span>
                                            </span>
                                        </li>
                                        <li className="px-3 py-2 hover:bg-green-100 rounded-xl transition-colors duration-200" onClick={() => navigate('/agent/dashboard')}>
                                            <span className="flex items-center space-x-3 text-gray-700 hover:text-green-900">
                                                <MdDashboard className="w-5 h-5" />
                                                <span className="font-base">Dashboard</span>
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
                                                <RiCustomerService2Fill className="w-5 h-5" />
                                                <span className="font-base">Services</span>
                                            </span>
                                        </li>
                                        <div className="my-2 border-t border-gray-100"></div>
                                        <li className="px-3 py-2 hover:bg-red-100 rounded-xl transition-colors duration-200">
                                            <span className="flex items-center space-x-3 text-red-600 hover:text-red-700">
                                                <MdLogout className="w-5 h-5" />
                                                <span className="font-medium">Logout</span>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Sidebar */}
                <div
                    className={`fixed top-0 right-0 w-72 h-full bg-white transform ${
                        isOpen ? 'translate-x-0' : 'translate-x-full'
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
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <FaUserCircle className="w-12 h-12 text-white" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <h3 className="text-white font-medium">Agent Name</h3>
                                <p className="text-green-100 text-sm">Professional Agent</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Navigation */}
                    <div className="p-4">
                        <ul className="space-y-2">
                            <li>
                                <button 
                                    onClick={() => navigate('/agent')}
                                    className="flex items-center w-full gap-4 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors group"
                                >
                                    <FaHome className="w-5 h-5 text-gray-500 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900">Home</span>
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => navigate('/agent/dashboard')}
                                    className="flex items-center w-full gap-4 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors group"
                                >
                                    <MdDashboard className="w-5 h-5 text-gray-500 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900">Dashboard</span>
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => navigate('/agent/services')}
                                    className="flex items-center w-full gap-4 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors group"
                                >
                                    <RiCustomerService2Fill className="w-5 h-5 text-gray-500 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900">Services</span>
                                </button>
                            </li>
                            <li>
                                <button 
                                    className="flex items-center w-full gap-4 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors group"
                                >
                                    <IoIosNotifications className="w-5 h-5 text-gray-500 group-hover:text-green-900" />
                                    <span className="font-medium group-hover:text-green-900">Notifications</span>
                                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        3
                                    </span>
                                </button>
                            </li>
                        </ul>

                        <div className="mt-6 border-t border-gray-100 pt-4">
                            <button 
                                className="flex items-center w-full gap-4 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                            >
                                <MdLogout className="w-5 h-5 group-hover:text-red-700" />
                                <span className="font-medium group-hover:text-red-700">Logout</span>
                            </button>
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
        </>
    );
};

export default AgentNavbar;
