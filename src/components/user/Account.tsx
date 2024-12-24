// import React, { useState } from 'react';
// import { FaUser, FaHistory, FaAddressCard, FaBell, FaLock, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
// import { MdPayment } from 'react-icons/md';
// import { Mail, Phone, Camera, Lock } from 'lucide-react';


// const Profile: React.FC = () => {
//     const [activeTab, setActiveTab] = useState<string | null>('profile');

//     const handleTabClick = (tab: string) => {
//         setActiveTab(tab);
//     };

//     const handleBackClick = () => {
//         setActiveTab(null);
//     };

//     const renderContent = () => {
//         switch (activeTab) {
//             case 'profile':
//                 return <ProfileSection />;
//             case 'history':
//                 return <HistorySection />;
//             case 'address':
//                 return <AddressSection />;
//             case 'payments':
//                 return <PaymentSection />;
//             case 'notifications':
//                 return <NotificationSection />;
//             case 'security':
//                 return <SecuritySection />;
//             default:
//                 return null;
//         }
//     };

//     return (
//         <div className="container mx-auto px-4 py-20">
//             <div className="flex flex-col lg:flex-row gap-6">
//                 {/* Sidebar - Always visible on desktop, hidden on mobile when content is shown */}
//                 <div className={`lg:w-1/4 ${activeTab ? 'hidden lg:block' : 'block'}`}>
//                     <div className=" bg-white rounded-lg shadow-md p-4">

//                         <div className="flex flex-col items-center p-4 border-b">
//                             <div className="relative">
//                                 <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
//                                     <FaUser className="w-12 h-12 text-green-600" />
//                                 </div>
//                                 {/* Camera button - Only visible on lg and above */}
//                                 <button
//                                     type="button"
//                                     className="hidden lg:block absolute bottom-0 right-0 bg-green-800 p-2 rounded-full shadow-lg hover:bg-green-900 transition-colors"
//                                     title="Edit profile picture"
//                                 >
//                                     <Camera className="w-3 h-3 text-white" />
//                                 </button>
//                             </div>
//                             <h2 className="mt-4 text-xl font-semibold">John Doe</h2>
//                             <p className="text-gray-500">john.doe@example.com</p>
//                         </div>

//                         <nav className="mt-4 flex flex-col gap-2">
//                             <button
//                                 onClick={() => handleTabClick('profile')}
//                                 className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-50'}`}
//                             >
//                                 <FaUser /> Profile
//                             </button>
//                             <button
//                                 onClick={() => handleTabClick('history')}
//                                 className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-50'}`}
//                             >
//                                 <FaHistory /> Collection History
//                             </button>
//                             <button
//                                 onClick={() => handleTabClick('address')}
//                                 className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'address' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-50'}`}
//                             >
//                                 <FaAddressCard /> Addresses
//                             </button>
//                             <button
//                                 onClick={() => handleTabClick('payments')}
//                                 className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'payments' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-50'}`}
//                             >
//                                 <MdPayment /> Payments
//                             </button>
//                             <button
//                                 onClick={() => handleTabClick('notifications')}
//                                 className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-50'}`}
//                             >
//                                 <FaBell /> Notifications
//                             </button>
//                             <button
//                                 onClick={() => handleTabClick('security')}
//                                 className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'security' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-50'}`}
//                             >
//                                 <FaLock /> Security
//                             </button>
//                             <button
//                                 className="flex items-center gap-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
//                             >
//                                 <FaSignOutAlt /> Logout
//                             </button>
//                         </nav>
//                     </div>
//                 </div>

//                 {/* Main Content - Show only when tab is selected on mobile */}
//                 {(activeTab || window.innerWidth >= 1024) && (
//                     <div className="lg:w-3/4 w-full">
//                         <div className="bg-white rounded-lg shadow-md">
//                             {/* Back button - Only visible on mobile */}
//                             {activeTab && (
//                                 <button
//                                     onClick={handleBackClick}
//                                     className="lg:hidden flex items-center gap-2 p-4 text-gray-600 hover:text-gray-700"
//                                 >
//                                     <FaArrowLeft /> Back to Menu
//                                 </button>
//                             )}
//                             <div className="p-6">
//                                 {renderContent()}
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// // Placeholder components for each section


// const ProfileSection: React.FC = () => (
//     <div>
//         <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
//         <form className="space-y-6">
//             {/* Profile Image Section */}
//             <div className="lg:hidden relative inline-block mb-6">
//                 <img
//                     src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
//                     alt="Profile"
//                     className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
//                 />
//                 <button
//                     type="button"
//                     className="absolute bottom-0 right-0 bg-green-800 p-2 rounded-full shadow-lg hover:bg-green-900 transition-colors group"
//                     title="Edit profile picture"
//                 >
//                     <Camera className="w-3 h-3 text-white" />
//                 </button>
//             </div>

//             {/* Personal Information */}
//             <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//                     <input
//                         type="text"
//                         defaultValue="John"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg  focus:border-transparent"
//                     />
//                 </div>
//                 {/* <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//                     <input
//                         type="text"
//                         defaultValue="Doe"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     />
//                 </div> */}
//             </div>

//             {/* Contact Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         <span className="flex items-center gap-2">
//                             <Mail className="w-4 h-4" /> Email Address
//                         </span>
//                     </label>
//                     <input
//                         type="email"
//                         defaultValue="john.doe@example.com"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         <span className="flex items-center gap-2">
//                             <Phone className="w-4 h-4" /> Phone Number
//                         </span>
//                     </label>
//                     <input
//                         type="tel"
//                         defaultValue="+1 (555) 123-4567"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
//                     />
//                 </div>
//             </div>

//             {/* Password Section */}
//             <div className="pt-4">
            //     <button
            //         type="button"
            //         className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            //     >
            //         <Lock className="w-4 h-4" />
            //         Change Password
            //     </button>
            // </div>

//             {/* Form Actions */}
//             <div className="flex justify-end gap-4 pt-6">
//                 <button
//                     type="button"
//                     className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                     Cancel
//                 </button>
//                 <button
//                     type="submit"
//                     className="px-6 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors"
//                 >
//                     Save Changes
//                 </button>
//             </div>
//         </form>
//     </div>
// );



// const HistorySection: React.FC = () => (
//     <div>
//         <h2 className="text-2xl font-semibold mb-6">Collection History</h2>
//         {/* Add collection history content */}
//     </div>
// );

// const AddressSection: React.FC = () => (
//     <div>
//         <h2 className="text-2xl font-semibold mb-6">Manage Addresses</h2>
//         {/* Add address management content */}
//     </div>
// );

// const PaymentSection: React.FC = () => (
//     <div>
//         <h2 className="text-2xl font-semibold mb-6">Payment Methods</h2>
//         {/* Add payment methods content */}
//     </div>
// );

// const NotificationSection: React.FC = () => (
//     <div>
//         <h2 className="text-2xl font-semibold mb-6">Notification Settings</h2>
//         {/* Add notification settings content */}
//     </div>
// );

// const SecuritySection: React.FC = () => (
//     <div>
//         <h2 className="text-2xl font-semibold mb-6">Security Settings</h2>
//         {/* Add security settings content */}
//     </div>
// );

// export default Profile;






import React, { useState } from 'react';
import { FaArrowCircleLeft } from 'react-icons/fa';
import Sidebar from './Sidebar';
import ProfileSection from './ProfileSection';
import ChangePassword from './ChangePassword';
// import HistorySection from './sections/HistorySection';
// import AddressSection from './sections/AddressSection';
// import PaymentSection from './sections/PaymentSection';
// import NotificationSection from './sections/NotificationSection';
// import SecuritySection from './sections/SecuritySection';

const Account: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string | null>('account');
    const [isChangingPassword, setIsChangingPassword] = useState(false);


    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        setIsChangingPassword(false);
    };

    const handleBackClick = () => {
        if (isChangingPassword) {
            setIsChangingPassword(false);
        } else {
            setActiveTab(null);
        }
    };

    const renderContent = () => {

        if (isChangingPassword) {
            return <ChangePassword onCancel={() => setIsChangingPassword(false)} />;
        } 

        switch (activeTab) {
            case 'account': 
            return <ProfileSection onChangePassword={() => setIsChangingPassword(true)} />;
            // case 'history': return <HistorySection />;
            // case 'address': return <AddressSection />;
            // case 'payments': return <PaymentSection />;
            // case 'notifications': return <NotificationSection />;
            // case 'security': return <SecuritySection />;
            default: return null;
        }
    };

    return (
        <div className="container mx-auto px-12 py-20 mt-14">
            <div className="flex flex-col lg:flex-row gap-6">
                <Sidebar activeTab={activeTab} onTabClick={handleTabClick} />

                {/* Main Content */}
                {(activeTab || window.innerWidth >= 1024) && (
                    <div className="lg:w-3/4 w-full">
                        <div className="bg-white rounded-lg shadow-md">
                            {activeTab && (
                                <button
                                    onClick={handleBackClick}
                                    className="lg:hidden flex items-center gap-2 p-4 xs:text-sm text-xs text-gray-600 hover:text-gray-700"
                                >
                                    <FaArrowCircleLeft  /> Back to Menu
                                </button>
                            )}
                            <div className="p-6">
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Account;