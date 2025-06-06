import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FaUser, FaClipboardList, FaWallet, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { TbCoinRupeeFilled } from "react-icons/tb";
// import { VscGraph } from "react-icons/vsc";
import { Camera, CircleUserRound } from 'lucide-react';
import { getUserData, uploadProfileImage } from "../../../services/userService";
import { IUser } from '../../../types/user';
import SidebarSkeleton from '../skeltons/SidebarSkeleton';
import { Logout } from "../../../redux/authSlice";
import { NavLink } from 'react-router-dom';
import { ApiResponse } from '../../../types/common';
const navLinks = [
  // { icon: <VscGraph />, label: 'Activity', path: '/account/', end: true },
  { icon: <FaUser />, label: 'Profile', path: '/account/',end: true },
  { icon: <FaClipboardList />, label: 'Collection History', path: '/account/collections' },
  { icon: <FaWallet />, label: 'Wallet', path: '/account/wallet' },
  { icon: <TbCoinRupeeFilled />, label: 'Charges', path: '/account/charges' },
  { icon: <FaBell />, label: 'Notifications', path: '/account/notifications' },
];

const Sidebar: React.FC = () => {
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUploadingToServer, setIsUploadingToServer] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res:ApiResponse<IUser> = await getUserData();
      console.log("response :",res);
      if (res.success) {
        setUserData(res.data);
      }
    } catch (error) {
      console.log("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const profileUrl = URL.createObjectURL(file);
      setUploadedImage(profileUrl);
    }
  };

  const handleCancelUpload = () => {
    setUploadedImage(null);
  };

  const handleUploadImage = async () => {
    if (uploadedImage) {
      try {
        setIsUploadingToServer(true);
        const imageFile = await fetch(uploadedImage)
          .then((res) => res.blob())
          .then((blob) => new File([blob], 'profile.jpg', { type: 'image/jpeg' }));
        const formData = new FormData();
        formData.append('profileImage', imageFile);
        const res:ApiResponse<string> = await uploadProfileImage(formData);
        if (res.success) {
          setUserData((prev) => (prev ? { ...prev, profileUrl: res.data } : null));
          setUploadedImage(null);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploadingToServer(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4">
        {loading ? (
          <SidebarSkeleton />
        ) : (
          <div className="flex flex-col items-center p-4 border-b">
            <div className="relative group">
              <div className="w-20 h-20  rounded-full flex items-center justify-center relative">
                {userData?.profileUrl ? (
                  <img
                    src={userData?.profileUrl}
                    alt="Profile"
                    className="sm:w-24 sm:h-24 xs:w-20 xs:h-20 w-16 h-16 rounded-full sm:border-4 border-2 border-white shadow-lg object-cover"
                  />
                ) : (
                  <CircleUserRound className="w-12 h-12 text-green-950" />
                )}
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
            <p className=" text-gray-600">{userData?.email}</p>
          </div>
        )}

        <nav className="mt-4 flex flex-col gap-2">
          {navLinks.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                                flex items-center gap-3 w-full sm:p-3 p-2 sm:text-base text-sm font-medium text-gray-800 rounded-lg transition-colors
                                ${isLargeScreen && isActive ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}
                            `}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => dispatch(Logout())}
            className="flex items-center gap-3 w-full sm:p-3 p-2 sm:text-base text-sm font-medium rounded-lg text-red-600 hover:bg-red-100 transition-colors"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;