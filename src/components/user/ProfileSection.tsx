import React, { useEffect, useState } from 'react';
import { Mail, Phone, Lock, Camera } from 'lucide-react';
import { getUserData } from "../../services/userService";
import { IUserData } from '../../interfaces/interfaces';
import ProfileSkeleton from './skeltons/ProfileSkeleton';

interface ProfileSectionProps {
    onChangePassword: () => void;
}



const ProfileSection: React.FC<ProfileSectionProps> = ({ onChangePassword }) => {


    const [userData, setUserData] = useState<IUserData | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getUserData();

                console.log("Data :", response);
                setUserData(response.data);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {

                setTimeout(() => {
                    setLoading(false);

                }, 1000);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => prev ? { ...prev, [name]: value } : null);
    };


    if (loading) {
        return <ProfileSkeleton />;
    }

    return (
        <div >
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
                            src={userData?.profileUrl}
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
                        <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={userData?.name}
                            disabled={!isEditing}
                            onChange={handleInputChange}
                            className={`w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:border-transparent ${!isEditing ? 'bg-gray-50' : ''
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
                            value={userData?.email}
                            disabled={true}
                            className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg bg-gray-50 "
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
                            name="phone"
                            value={userData?.phone}
                            disabled={!isEditing}
                            onChange={handleInputChange}
                            className={`w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:border-transparent ${!isEditing ? 'bg-gray-50 ' : ''
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