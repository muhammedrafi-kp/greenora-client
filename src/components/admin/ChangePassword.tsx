import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const ChangePassword: React.FC = () => {
    const naviagate = useNavigate();

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
            <div className="max-w-2xl mt-10">
                <form className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Change Password</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <span className="flex items-center gap-2">
                                    <Lock className="w-4 h-4" /> New Password
                                </span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={()=>naviagate('/admin/profile')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-800 text-sm text-white rounded-lg hover:bg-green-900 transition-colors"
                        >
                            Change Password
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default ChangePassword;
