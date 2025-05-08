import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Error500: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 md:px-8">
            <AlertTriangle className="text-red-700 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mb-3 sm:mb-4" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">Error 500</h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-[280px] sm:max-w-[400px] md:max-w-[500px]">
                Server Error: Please Try Again Later
            </p>
        </div>
    );
};

export default Error500;