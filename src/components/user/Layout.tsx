import React from 'react';
import Navbar from './Navbar';
// import Footer from './Footer';
import ChatBot from '../common/ChatBot';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            {/* <Footer /> */}
            <ChatBot />
        </div>
    );
};

export default Layout; 