import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Lock, Camera } from 'lucide-react';
import { getUserData, updateUserData } from "../../../services/userService";
import { IUser } from '../../../types/user';
import ProfileSkeleton from '../skeltons/ProfileSkeleton';
import { ChangePassword } from '../../common/ChangePassword';
import toast from 'react-hot-toast';


interface FormErrors {
    name?: string;
    phone?: string;
}

const ProfileSection: React.FC = () => {
    const [userData, setUserData] = useState<IUser | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [showChangePassword, setShowChangePassword] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const response = await getUserData();
            if (response.success) {
                setUserData(response.data);
                console.log(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch user data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const validateField = (name: string, value: string): string | undefined => {
        if (name === 'name') {
            if (!value.trim()) {
                return "Full name is required";
            }
            // if (/[^a-zA-Z\s]/.test(value)) {
            //     return "Full name cannot contain special characters";
            // }
        }

        if (name === 'phone') {
            const phoneRegex = /^[0-9]{10}$/;
            if (!value.trim()) {
                return "Phone number is required";
            }
            if (!phoneRegex.test(value)) {
                return "Phone number must be 10 digits long";
            }
        }

        return undefined;
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        if (userData) {
            const nameError = validateField('name', userData.name || '');
            const phoneError = validateField('phone', userData.phone || '');

            if (nameError) {
                newErrors.name = nameError;
                isValid = false;
            }
            if (phoneError) {
                newErrors.phone = phoneError;
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => prev ? { ...prev, [name]: value } : null);

        // Validate the field immediately
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Rest of the component remains the same...
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const profileUrl = URL.createObjectURL(file);
            setUploadedImage(profileUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setIsSaving(true);

        const formData = new FormData();

        if (userData?.name) formData.append('name', userData.name as string);
        if (userData?.phone) formData.append('phone', userData.phone as string);

        if (uploadedImage) {
            try {
                const imageFile = await fetch(uploadedImage)
                    .then(res => res.blob())
                    .then(blob => new File([blob], 'profile.jpg', { type: 'image/jpeg' }));
                formData.append('profileImage', imageFile);
            } catch (error) {
                console.error("Error processing image:", error);
                toast.error('Error processing image. Please try again.');
                setIsSaving(false);
                return;
            }
        }

        try {
            const response = await updateUserData(formData);
            if (response.success) {
                toast.success("Profile updated.");
                setIsEditing(false);
                await fetchUserData();
            }
        } catch (error) {
            console.error("Error while updating userdata:", error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setUploadedImage(null);
        setErrors({});
        fetchUserData();
    };

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="lg:text-xl xs:text-base text-sm sm:text-left text-center font-bold">Profile Details</h2>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="lg:hidden flex flex-col sm:items-start items-center mb-6">
                    <div className="relative group">
                        <img
                            src={uploadedImage || userData?.profileUrl}
                            alt="Profile"
                            className="sm:w-24 sm:h-24 xs:w-20 xs:h-20 w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                        {isEditing && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <label htmlFor="profileImage" className="cursor-pointer">
                                    <Camera className="xs:w-6 xs:h-6 w-4 h-4 text-white" />
                                </label>
                                <input
                                    id="profileImage"
                                    name="profileImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div>
                        <label className="block xs:text-base text-sm font-medium text-gray-700 mb-1">
                            <span className="flex items-center gap-2">
                                <User className="w-4 h-4" /> Full Name
                            </span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={userData?.name || ''}
                            disabled={!isEditing}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 xs:py-2 py-1 xs:text-sm text-xs font-medium border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:border-transparent ${!isEditing ? 'bg-gray-50' : ''}`}
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-700">{errors.name}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block xs:text-base text-sm font-medium text-gray-700 mb-1">
                            <span className="flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Email Address
                            </span>
                        </label>
                        <input
                            type="email"
                            value={userData?.email}
                            disabled={true}
                            className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs font-medium border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block xs:text-base text-sm font-medium text-gray-700 mb-1">
                            <span className="flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Phone Number
                            </span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={userData?.phone || ''}
                            disabled={!isEditing}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 xs:py-2 py-1 xs:text-sm text-xs font-medium border ${errors.phone ? 'border-red-700' : 'border-gray-300'} rounded-lg focus:border-transparent ${!isEditing ? 'bg-gray-50' : ''}`}
                        />
                        {errors.phone && (
                            <p className="mt-1 text-xs text-red-700">{errors.phone}</p>
                        )}
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="button"
                        onClick={() => setShowChangePassword(true)}
                        className="flex items-center gap-2 px-4 xs:py-2 py-1 xs:text-base text-xs font-semibold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        <Lock className="xs:w-4 xs:h-4 w-3 h-3" />
                        Change Password
                    </button>
                </div>
                <div className="flex justify-end gap-4 pt-6">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                                className="xs:px-4 xs:py-2 px-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="xs:px-4 xs:py-2 px-2 py-1 xs:text-sm text-xs bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="xs:px-4 xs:py-2 px-2 py-1 xs:text-sm text-xs font-semibold bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </form>

            {showChangePassword && (
                <ChangePassword
                    isOpen={showChangePassword}
                    onClose={() => setShowChangePassword(false)}
                    role="user"
                />
            )}
        </div>
    );
};

export default ProfileSection;