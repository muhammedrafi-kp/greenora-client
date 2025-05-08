import React from 'react';
import { FaPhone, FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Contact: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-4 sm:p-6 overflow-x-hidden overflow-y-auto">
      {/* <h1 className="text-2xl font-bold text-green-900 mb-6">Contact Support</h1> */}
      
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
        {/* Chat Card */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="p-4 sm:p-6 flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
              <FaComments className="text-green-900 text-2xl sm:text-3xl" />
            </div>
            <h2 className="text-lg sm:text-lg font-semibold text-green-900 mb-2">Chat Right Now</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Connect with our support team instantly via chat for quick assistance.
            </p>
            <button 
              onClick={() => navigate('/collector/chat')}
              className="bg-green-900 text-white text-sm sm:text-base font-medium py-1.5 sm:py-2 px-4 sm:px-6 rounded-full hover:bg-green-800 transition-colors"
            >
              Start Chat
            </button>
          </div>
        </div>
        
        {/* Call Card */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="p-4 sm:p-6 flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
              <FaPhone className="text-green-900 text-2xl sm:text-3xl" />
            </div>
            <h2 className="text-lg sm:text-lg font-semibold text-green-900 mb-2">Call Us</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Speak directly with our support team for more complex issues.
            </p>
            <a 
              href="tel:+1234567890"
              className="bg-green-900 text-white text-sm sm:text-base font-medium py-1.5 sm:py-2 px-4 sm:px-6 rounded-full hover:bg-green-800 transition-colors"
            >
              Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
