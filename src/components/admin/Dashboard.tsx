import React from 'react';
import {
    FaUsers,
    FaChartLine,
    FaClipboardList,
    FaWrench
} from 'react-icons/fa';

import Breadcrumbs from './Breadcrumbs';

const Dashboard: React.FC = () => {
    return (

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-6 py-4">
            {/* <Breadcrumbs/> */}
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 ">
                {[
                    {
                        title: 'Total Users',
                        value: '1,234',
                        icon: <FaUsers className="w-7 h-7" />,
                        color: 'bg-white border-l-4 border-emerald-400',
                        iconColor: 'text-emerald-400'
                    },
                    {
                        title: 'Revenue',
                        value: '$45,678',
                        icon: <FaChartLine className="w-7 h-7" />,
                        color: 'bg-white border-l-4 border-sky-400',
                        iconColor: 'text-sky-400'
                    },
                    {
                        title: 'New Orders',
                        value: '56',
                        icon: <FaClipboardList className="w-7 h-7" />,
                        color: 'bg-white border-l-4 border-violet-400',
                        iconColor: 'text-violet-400'
                    },
                    {
                        title: 'Pending Tasks',
                        value: '12',
                        icon: <FaWrench className="w-7 h-7" />,
                        color: 'bg-white border-l-4 border-amber-400',
                        iconColor: 'text-amber-400'
                    }
                ].map((card, index) => (
                    <div key={index}
                        className={`${card.color} rounded-lg shadow-sm hover:shadow-md transition-all duration-300`}
                    >
                        <div className="lg:p-6 sm:p-4 p-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-gray-600 lg:text-base md:text-sm font-medium mb-1">{card.title}</h3>
                                    <p className="lg:text-2xl md:text-xl sm:text-lg font-bold text-gray-800">{card.value}</p>
                                </div>
                                <div className={`${card.iconColor}  opacity-80 group-hover:scale-110 transition-transform duration-300`}>
                                    {card.icon}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & System Stats */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-300 border">
                    <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
                        <FaClipboardList className="mr-2 text-violet-400" /> Recent Activity
                    </h2>
                    <div className="space-y-4">
                        {[
                            { text: 'New user registration', time: '2 hours ago', status: 'success' },
                            { text: 'Sales report generated', time: '4 hours ago', status: 'warning' },
                            { text: 'System maintenance', time: '1 day ago', status: 'info' }
                        ].map((activity, index) => (
                            <div key={index}
                                className="p-4 rounded-lg hover:bg-gray-50 
                                transition-colors duration-200 cursor-pointer border border-gray-100"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 font-medium">{activity.text}</span>
                                    <span className="text-sm text-gray-500">{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Stats */}
                <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-300 border">
                    <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
                        <FaChartLine className="mr-2 text-sky-400" /> System Stats
                    </h2>
                    <div className="space-y-4">
                        {[
                            { label: 'System Uptime', value: '99.9%', color: 'bg-emerald-400' },
                            { label: 'Response Time', value: '0.2s', color: 'bg-sky-400' },
                            { label: 'Active Sessions', value: '234', color: 'bg-violet-400' }
                        ].map((stat, index) => (
                            <div key={index} className="p-4 rounded-lg border border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700 font-medium">{stat.label}</span>
                                    <span className="text-gray-800 font-semibold">{stat.value}</span>
                                </div>
                                <div className="mt-2 bg-gray-100 rounded-full h-2">
                                    <div className={`${stat.color} h-2 rounded-full opacity-80`}
                                        style={{ width: '75%' }}>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Latest Updates */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-300 border">
                <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
                    <FaWrench className="mr-2 text-amber-400" /> Latest Updates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { title: 'System Update v2.1', time: '1 day ago', desc: 'Major performance improvements' },
                        { title: 'Security Patch', time: '2 days ago', desc: 'Enhanced security measures' },
                        { title: 'Database Optimization', time: '3 days ago', desc: 'Improved query performance' }
                    ].map((update, index) => (
                        <div key={index}
                            className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 
                            transition-all duration-200 cursor-pointer"
                        >
                            <h3 className="font-semibold text-gray-800">{update.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{update.desc}</p>
                            <p className="text-xs text-gray-500 mt-2">{update.time}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Dashboard;