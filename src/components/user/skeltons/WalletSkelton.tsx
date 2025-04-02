import React from 'react';

const WalletSkeleton: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="lg:text-lg xs:text-base text-sm font-semibold flex items-center gap-2">
          My Wallet
        </h2>
      </div>

      <div className="space-y-6">
        {/* Balance Card Skeleton */}
        <div className="bg-green-50 border border-green-100 rounded-lg p-6 flex items-center justify-between animate-pulse">
          <div>
            <div className="flex items-center gap-2 text-green-800">
              <div className="w-6 h-6 rounded-full bg-green-200"></div>
              <div className="h-5 w-32 bg-green-200 rounded"></div>
            </div>
            <div className="h-8 w-24 bg-green-200 rounded mt-2"></div>
          </div>
          <div className="flex space-x-4">
            <div className="h-10 w-24 bg-red-200 rounded-lg"></div>
            <div className="h-10 w-24 bg-green-200 rounded-lg"></div>
          </div>
        </div>

        {/* Transaction History Skeleton */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gray-200"></div>
              <div className="h-5 w-40 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>

          {/* Transaction Items Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div 
                key={item} 
                className="flex items-center justify-between bg-white border border-gray-100 rounded-lg p-4 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletSkeleton;