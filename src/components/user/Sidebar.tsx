import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FaUser, FaHistory, FaAddressCard, FaBell, FaLock, FaSignOutAlt } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { Camera } from 'lucide-react';
import { getUserData, uploadProfileImage } from "../../services/userService";
import { IUserData } from '../../interfaces/interfaces';
import SidebarSkeleton from './skeltons/SidebarSkeleton';

import { Logout } from "../../redux/authSlice";

interface SidebarProps {
  activeTab: string | null;
  onTabClick: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabClick }) => {
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUploadingToServer, setIsUploadingToServer] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        setUserData(response.data);
      } catch (error) {
        console.log("Failed to fetch user data:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const profileUrl = URL.createObjectURL(file);

      setUploadedImage(profileUrl); // Preview image.
    }
  };

  const handleCancelUpload = () => {
    setUploadedImage(null); // Reset preview.
  };

  const handleUploadImage = async () => {
    if (uploadedImage) {
      try {
        setIsUploadingToServer(true); // Indicate upload progress.

        const imageFile = await fetch(uploadedImage)
          .then((res) => res.blob())
          .then(
            (blob) =>
              new File([blob], 'profile.jpg', { type: 'image/jpeg' })
          );

        const formData = new FormData();
        formData.append('profileImage', imageFile);

        const response = await uploadProfileImage(formData);

        if (response.success) {
          // Update user data with the new profile URL.
          setUserData((prev) =>
            prev ? { ...prev, profileUrl: response.data.profileUrl } : null
          );
          setUploadedImage(null);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploadingToServer(false); // Reset progress.
      }
    }
  };

  return (
    <div className={`lg:w-1/4 ${activeTab ? 'hidden lg:block' : 'block'}  border shadow-sm rounded-lg`}>
      <div className="bg-white rounded-lg p-4">
        {loading ? (
          <SidebarSkeleton />
        ) : (
          <div className="flex flex-col items-center p-4 border-b">
            <div className="relative group">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center relative">
                <img
                  src={uploadedImage || userData?.profileUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <label htmlFor="profileImageInSidebar" className="cursor-pointer">
                    <Camera className="xs:w-6 xs:h-6 w-4 h-4 text-white" />
                  </label>
                  <input
                    id="profileImageInSidebar"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Image upload controls */}
              {isUploadingToServer ? (
                <div className="mt-4 text-sm text-green-700">Uploading...</div>
              ) : (
                uploadedImage && (
                  <div className="flex gap-2 mt-4 w-24 justify-center">
                    <button
                      type="button"
                      onClick={handleCancelUpload}
                      className="xs:px-2 px-1 py-1 xs:text-xs text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleUploadImage}
                      className="xs:px-2 px-1 py-1 xs:text-xs text-xs bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors"
                    >
                      Upload
                    </button>
                  </div>
                )
              )}
            </div>
            <h2 className="mt-4 xs:text-base text-sm font-semibold">
              {userData?.name}
            </h2>
            <p className="text-sm text-gray-500">{userData?.email}</p>
          </div>
        )}

        <nav className="mt-4 flex lg:justify-center flex-col gap-2">
          {[
            { id: 'account', icon: <FaUser />, label: 'Profile' },
            { id: 'history', icon: <FaHistory />, label: 'Collection History' },
            { id: 'address', icon: <FaAddressCard />, label: 'Addresses' },
            { id: 'payments', icon: <MdPayment />, label: 'Payments' },
            { id: 'notifications', icon: <FaBell />, label: 'Notifications' },
            { id: 'security', icon: <FaLock />, label: 'Security' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onTabClick(item.id)}
              className={`flex items-center gap-3 w-full xs:p-3 p-2 xs:text-base text-xs rounded-lg transition-colors ${activeTab === item.id
                  ? 'bg-green-100 text-green-800'
                  : 'hover:bg-gray-100'
                }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <button
            onClick={() => dispatch(Logout())}
            className="flex items-center gap-3 w-full xs:p-3 p-2 xs:text-base text-xs rounded-lg text-red-600 hover:bg-red-100 transition-colors"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

