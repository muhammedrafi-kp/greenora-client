import React, { useState } from 'react';
import { Mail, Phone, Lock, Camera } from 'lucide-react';

interface ProfileSectionProps {
    onChangePassword: () => void;
}

const ProfileSection: React.FC <ProfileSectionProps> = ({ onChangePassword }) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div>
            <div className="mb-6">
                <h2 className="lg:text-lg xs:text-base text-sm sm:text-left text-center font-semibold">Profile Details</h2>
            </div>
            <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                setIsEditing(false);
                // Handle form submission
            }}>
                {/* Updated Profile Image Section */}
                <div className="lg:hidden relative sm:inline-block flex justify-center mb-6">
                    <div className="relative group">
                        <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                        {/* Camera overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="xs:w-6 xs:h-6 w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div>
                        <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">First Name</label>
                        <input
                            type="text"
                            defaultValue="John"
                            disabled={!isEditing}
                            className={`w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:border-transparent ${
                                !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                            }`}
                        />
                    </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                            <span className="flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Email Address
                            </span>
                        </label>
                        <input
                            type="email"
                            defaultValue="john.doe@example.com"
                            disabled={true}
                            className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                            <span className="flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Phone Number
                            </span>
                        </label>
                        <input
                            type="tel"
                            defaultValue="+1 (555) 123-4567"
                            disabled={!isEditing}
                            className={`w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:border-transparent ${
                                !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                            }`}
                        />
                    </div>
                </div>

                {/* Password Section */}
                <div className="pt-4">
                <button
                    type="button"
                    onClick={onChangePassword}
                    className="flex items-center gap-2 px-4 xs:py-2 py-1 xs:text-base text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    <Lock className="xs:w-4 xs:h-4 w-3 h-3" />
                    Change Password
                </button>
            </div>

                {/* Form Actions - Updated */}
                <div className="flex justify-end gap-4 pt-6">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="xs:px-4 xs:py-2 px-2 py-1  xs:text-sm text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="xs:px-4 xs:py-2 px-2 py-1 xs:text-sm text-xs bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors"
                            >
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="xs:px-4 xs:py-2 px-2 py-1 xs:text-sm text-xs bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProfileSection;