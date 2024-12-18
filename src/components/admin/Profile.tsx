

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Camera, Lock } from 'lucide-react';

const Profile: React.FC = () => {
    const navigate = useNavigate();

    return (

        <main className="flex-1 overflow-x-hidden  overflow-y-auto bg-gray-50 p-4">
            
            <div className="mx-auto">
                {/* Profile Form */}
                <form className="space-y-6 bg-white p-6 rounded-lg shadow-md relative mt-10">
                    <div className="absolute -top-16 md:left-28 left-1/2 transform -translate-x-1/2">
                        <div className="relative mt-5">
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt="Profile"
                                className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
                            />
                            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                                <Camera className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <div className="pt-20 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    defaultValue="John Doe"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <span className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> Email Address
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    defaultValue="john.doe@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <span className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> Phone Number
                                    </span>
                                </label>
                                <input
                                    type="tel"
                                    defaultValue="+1 (555) 123-4567"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Change Password Button */}
                        <div className="flex justify-start">
                            <button
                                type="button"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                onClick={()=>navigate('/admin/change-password')}
                            >
                                <Lock className="w-4 h-4" />
                                Change Password
                            </button>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            className="px-4 py-2 border  border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={()=>navigate('/admin')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-800 text-sm text-white rounded-lg hover:bg-green-900 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>

            </div>
        </main>

    );
}

export default Profile