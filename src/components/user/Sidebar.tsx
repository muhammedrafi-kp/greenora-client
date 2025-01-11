import React, { useState, useEffect } from 'react';
import { FaUser, FaHistory, FaAddressCard, FaBell, FaLock, FaSignOutAlt } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { Camera } from 'lucide-react';
import { getUserData } from "../../services/userService";
import { IUserData } from '../../interfaces/interfaces';
import SidebarSkeleton from './skeltons/SidebarSkeleton';

interface SidebarProps {
  activeTab: string | null;
  onTabClick: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabClick }) => {

  const [userData, setUserData] = useState<IUserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
    }

    fetchUserData();
  }, []);



  return (
    <div className={`lg:w-1/4 ${activeTab ? 'hidden lg:block' : 'block'}  border shadow-sm rounded-lg`}>
      <div className="bg-white rounded-lg  p-4">

        {loading ? (
          <SidebarSkeleton />
        ) : (
          <div className="flex flex-col items-center p-4 border-b">
            {/* Updated Profile section */}
            <div className="relative group">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center relative">
                {/* <FaUser className="xs:w-12 xs:h-12 w-8 h-8 text-green-600" /> */}
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
            <h2 className="mt-4 xs:text-base text-sm font-semibold">{userData?.name}</h2>
            <p className="text-sm text-gray-500">{userData?.email}</p>
          </div>
        )}
        <nav className="mt-4 flex lg:justify-center flex-col gap-2">
          {/* Navigation buttons */}
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
              className={`flex items-center gap-3 w-full xs:p-3 p-2 xs:text-base text-xs rounded-lg transition-colors ${activeTab === item.id ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'
                }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <button className="flex items-center gap-3 w-full xs:p-3 p-2 xs:text-base text-xs rounded-lg text-red-600 hover:bg-red-100 transition-colors">
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;