import React, { useState, useEffect } from 'react';
import { Outlet,useLocation, useNavigate } from 'react-router-dom';
import { FaArrowCircleLeft } from 'react-icons/fa';
import Sidebar from './Sidebar';

const AccountLayout: React.FC = () => {
    const [showSidebar, setShowSidebar] = useState(true);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            const isLg = window.innerWidth >= 1024;
            setIsLargeScreen(isLg);
            if (isLg) {
                setShowSidebar(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Hide sidebar on mobile when navigating to a new route
    useEffect(() => {
        if (!isLargeScreen) {
            setShowSidebar(location.pathname === '/account');
        }
    }, [location.pathname, isLargeScreen]);

    const handleBackClick = () => {
        if (!isLargeScreen) {
            navigate('/account');
            setShowSidebar(true);
        }
    };

    return (
        <>
        <div className="container mx-auto px-4 lg:px-12 py-20 mt-9">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                {(isLargeScreen || showSidebar) && (
                    <div className="lg:w-1/4 w-full">
                        <Sidebar />
                    </div>
                )}

                {/* Main Content */}
                {(isLargeScreen || !showSidebar) && (
                    <div className="lg:w-3/4 w-full">
                        <div className="bg-white border rounded-lg shadow-sm">
                            {!isLargeScreen && (
                                <button
                                    onClick={handleBackClick}
                                    className="flex items-center gap-2 p-4 md:text-sm text-xs text-gray-600 hover:text-gray-700"
                                >
                                    <FaArrowCircleLeft /> Back
                                </button>
                            )}
                            <div className="md:p-6 p-4">
                                {/* {children} */}
                                <Outlet/>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default AccountLayout;
