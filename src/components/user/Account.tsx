import React, {  useState } from 'react';
import { FaArrowCircleLeft } from 'react-icons/fa';
import Sidebar from './Sidebar';
import ProfileSection from './ProfileSection';
import ChangePassword from './ChangePassword';
import Charges from './Charges';
import AddressSection from './AddressSection';
import Notifications from './Notifications';
import Wallet from './Wallet';
import CollectionHistory from './CollectionHistory';
// import HistorySection from './sections/HistorySection';
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
            case 'address': return <AddressSection />;
            // case 'payments': return <PaymentSection />;
            case 'notifications': return <Notifications />;
            // case 'security': return <SecuritySection />;
            case 'charges': return <Charges />;
            case 'wallet': return <Wallet />;
            case 'history': return <CollectionHistory />;
            default: return null;
        }
    };

    return (
        <div className="container mx-auto px-12 py-20 mt-9">
            <div className="flex flex-col lg:flex-row gap-6">
                <Sidebar activeTab={activeTab} onTabClick={handleTabClick} />

                {/* Main Content */}
                {(activeTab || window.innerWidth >= 1024) && (
                    <div className="lg:w-3/4 w-full ">
                        <div className="bg-white border rounded-lg shadow-sm">
                            {activeTab && (
                                <button
                                    onClick={handleBackClick}
                                    className="lg:hidden flex items-center gap-2 p-4 xs:text-sm text-xs text-gray-600 hover:text-gray-700"
                                >
                                    <FaArrowCircleLeft /> Back
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