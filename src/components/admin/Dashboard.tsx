import React from 'react';
import {
    FaUsers,
    FaChartLine,
    FaClipboardList,
    FaWrench
} from 'react-icons/fa';


const DashboardBody: React.FC = () => {
    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Dashboard Cards */}
                {[
                    {
                        title: 'Total Users',
                        value: '1,234',
                        icon: <FaUsers className="text-blue-500 w-8 h-8" />,
                        bgClass: 'bg-blue-100'
                    },
                    {
                        title: 'Revenue',
                        value: '$45,678',
                        icon: <FaChartLine className="text-green-500 w-8 h-8" />,
                        bgClass: 'bg-green-100'
                    },
                    {
                        title: 'New Orders',
                        value: '56',
                        icon: <FaClipboardList className="text-purple-500 w-8 h-8" />,
                        bgClass: 'bg-purple-100'
                    },
                    {
                        title: 'Pending Tasks',
                        value: '12',
                        icon: <FaWrench className="text-yellow-500 w-8 h-8" />,
                        bgClass: 'bg-yellow-100'
                    }
                ].map((card, index) => (
                    <div key={index} className={`${card.bgClass} p-6 rounded-lg shadow-md`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-gray-600">{card.title}</h3>
                                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                            </div>
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-green-800">Recent Activity</h2>
                <ul className="divide-y divide-gray-200">
                    {[
                        { text: 'New user registration', time: '2 hours ago' },
                        { text: 'Sales report generated', time: '4 hours ago' },
                        { text: 'System maintenance', time: '1 day ago' }
                    ].map((activity, index) => (
                        <li key={index} className="py-4">
                            <div className="flex justify-between">
                                <span className="text-gray-700">{activity.text}</span>
                                <span className="text-gray-500">{activity.time}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

           
        </main>
    );
};

export default DashboardBody;