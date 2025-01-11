// import React, { useState } from 'react';
// import Navbar from './Navbar';
// import Sidebar from './Sidebar';

// const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
//       <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
//       {/* Main Content Area */}
//       <main className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
//         <div className="p-6">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default DashboardLayout;

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

import Breadcrumbs from '../../admin/Breadcrumbs';

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            {isSidebarOpen && (
                <div className="fixed inset-0 z-20 bg-black opacity-50 md:hidden" onClick={toggleSidebar}></div>
            )}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar toggleSidebar={toggleSidebar} />
                {/* <Breadcrumbs/> */}
                {children}
            </div>
        </div>
    );
};

export default Layout;