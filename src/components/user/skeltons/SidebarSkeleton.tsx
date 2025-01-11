import React from 'react';

const SidebarSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-4 border-b">
      {/* Skeleton for Profile Section */}
      <div className="relative group">
        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center relative animate-pulse">
          {/* Profile image skeleton */}
        </div>
      </div>
      <div className="mt-4 text-center">
        {/* Username Skeleton */}
        <div className="w-24 h-4 bg-gray-300 rounded mx-auto animate-pulse"></div>
        {/* Email Skeleton */}
        <div className="w-32 h-4 mt-2 bg-gray-300 rounded mx-auto animate-pulse"></div>
      </div>
    </div>
  );
};

export default SidebarSkeleton;
