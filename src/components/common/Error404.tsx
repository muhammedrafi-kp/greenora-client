import React from 'react';
import { Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Error404Props {
  role?: 'user' | 'collector' | 'admin';
}

const Error404: React.FC<Error404Props> = ({ role }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    switch (role) {
      case 'collector':
        navigate('/collector');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/');
    }
  };

  const isAdmin = role === 'admin';
  const primaryColor = isAdmin ? '#0E2A39' : 'rgb(21 128 61)'; // green-700

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 md:px-8">
      <Leaf className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mb-3 sm:mb-4`} style={{ color: primaryColor }} />
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">404 - Page Not Found</h1>
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-[280px] sm:max-w-[400px] md:max-w-[500px]">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={handleNavigation}
        className="text-white text-sm sm:text-base font-semibold px-4 sm:px-6 py-2 rounded-md shadow-sm transition-all w-full sm:w-auto max-w-[200px] hover:opacity-90"
        style={{ backgroundColor: primaryColor }}
      >
        Go Home
      </button>
    </div>
  );
};

export default Error404;


