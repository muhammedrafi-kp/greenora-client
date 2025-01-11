import React, { useEffect, useState } from 'react';
import {
  User, Phone, Mail, MapPin, Truck, Award, Shield, Edit, Lock, CheckCircle, AlertCircle
} from 'lucide-react';
import { ChangePassword } from './ChangePassword';
import ProfileSkeleton from '../collector/skeltons/ProfileSkelton';
import { ICollectorData } from '../../interfaces/interfaces';
import { getCollectorData } from "../../services/collectorService"

interface ProfileProps {
  isVerified?: boolean;
}


const ProfileCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-lg border shadow-sm">
    <div className="md:p-6 xs:p-4 p-3 border-b xs:text-start text-center">
      <h3 className="md:text-lg xs:text-base text-sm font-semibold">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const Profile: React.FC<ProfileProps> = ({ isVerified = false }) => {

  const [collectorData, setCollectorData] = useState<ICollectorData | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const performanceStats = [
    { label: "Pickups Completed", value: "1,234" },
    { label: "On-time Rate", value: "95%" },
    { label: "Customer Rating", value: "4.8/5" },
    { label: "Areas Covered", value: "3" }
  ];

  useEffect(() => {
    const fetchCollectorData = async () => {
      try {
        const response = await getCollectorData();
        console.log("response.data : ", response.data);
        setCollectorData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    }

    fetchCollectorData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCollectorData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Profile Details Card */}
        <ProfileCard title="Profile Details" >

          {loading ? (
            <ProfileSkeleton />
          ) : (
            <form className="space-y-6">
              <div className="flex xs:justify-end justify-center items-center">
                <div className="flex items-center text-green-600 gap-1">
                  <CheckCircle className="xs:w-4 w-2 xs:h-4 h-2" />
                  <span className="xs:text-sm text-xs">Verified</span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="sm:w-20 sm:h-20 w-14 h-14 rounded-full border-2 border-white shadow-lg overflow-hidden">
                    <User className="w-full h-full p-4 bg-gray-200" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Edit className="sm:w-6 sm:h-6 w-4 h-4 text-white" />
                  </div>
                </div>
                <h2 className="lg:text-xl md:text-base xs:text-sm text-xs font-semibold xs:mt-4 mt-2">
                  John Smith
                </h2>
                <span className="xs:text-sm text-xs text-gray-500">ID: AGT001</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Full name
                    </span>
                  </label>
                  <input
                    type="text"
                    value={collectorData?.name}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className={`w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:border-transparent ${!isEditing ? 'bg-gray-50' : ''
                      }`}
                  />
                </div>

                <div>
                  <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email Address
                    </span>
                  </label>
                  <input
                    type="email"
                    value={collectorData?.email}
                    disabled={true}
                    className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone Number
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={collectorData?.phone}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className={`w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:border-transparent ${!isEditing ? 'bg-gray-50' : ''
                      }`}
                  />
                </div>
                <div>
                  <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Service Area
                    </span>
                  </label>
                  <input
                    type="text"
                    value={collectorData?.serviceArea}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className={`w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:border-transparent ${!isEditing ? 'bg-gray-50' : ''
                      }`}
                  />
                </div>
              </div>


              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(true)}
                  className="flex items-center gap-2 px-4 xs:py-2 py-1 xs:text-base text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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
          )}
        </ProfileCard>

        {/* Performance Stats Card */}
        <ProfileCard title="Performance Overview">
          <div className="grid xs:grid-cols-2 grid-cols-1 gap-4">
            {performanceStats.map((stat, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="md:text-2xl xs:text-xl text-lg font-bold">{stat.value}</div>
                <div className="md:text-sm xs:text-xs text-xxs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="md:text-base xs:text-sm text-xs font-semibold mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Award className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-yellow-500" />
                <span className="md:text-sm xs:text-xs text-xxs">Perfect Attendance - December 2024</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-yellow-500" />
                <span className="md:text-sm xs:text-xs text-xxs">Top Performer - Q4 2024</span>
              </div>
            </div>
          </div>
        </ProfileCard>
      </div>

      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </main>
  );
};

export default Profile;