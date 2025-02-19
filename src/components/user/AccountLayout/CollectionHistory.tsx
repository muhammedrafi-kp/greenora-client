import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaClock, FaEye } from 'react-icons/fa';
import { getCollectionHistory } from '../../../services/userService';
// Define pickup history types
interface PickupHistory {
  _id: string;
  collectionId: string;
  type: string;
  estimatedCost: string;
  status: 'completed' | 'cancelled' | 'pending';
  createdAt: string;
  preferredDate: string;
  }

const CollectionHistory: React.FC = () => {
  const [pickups, setPickups] = useState<PickupHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPickupHistory = async () => {
    try {
      const response = await getCollectionHistory();
      console.log(response.data);
      if (response.success) {
      setPickups(response.data);
      setLoading(false);
    }
  } catch (error) {
    console.error('Error fetching collection histories:', error);
  }finally{
    setLoading(false);
  }
  };

  useEffect(() => {   
    fetchPickupHistory();
  }, []);

  const getStatusIconAndColor = (status: 'completed' | 'cancelled' | 'pending') => {
    switch (status) {
      case 'completed':
        return { icon: <FaCheckCircle />, color: 'bg-green-100 text-green-600' };
      case 'cancelled':
        return { icon: <FaTimesCircle />, color: 'bg-red-100 text-red-600' };
      case 'pending':
        return { icon: <FaClock />, color: 'bg-blue-100 text-blue-600' };
    }
  };

  const handleViewDetails = (requestId: string) => {
    // Replace with actual navigation or modal logic
    console.log('View details for request:', requestId);
    alert(`View details for request: ${requestId}`);
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-8">Loading pickup history...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="lg:text-lg xs:text-base text-sm font-semibold flex items-center gap-2">
          {/* <FaClipboardList />  */}
          Collection History
        </h2>
        {pickups.length > 0 && (
                <div className="flex gap-2 mt-2">
                    <button className="px-4 py-2 bg-gray-200 rounded-lg text-xs">All</button>
                    <button className="px-4 py-2 bg-gray-200 rounded-lg text-xs">Completed</button>
                    <button className="px-4 py-2 bg-gray-200 rounded-lg text-xs">In progress</button>
                    <button className="px-4 py-2 bg-gray-200 rounded-lg text-xs">Cancelled</button>
                </div>
        ) }
      </div>

      {pickups.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No pickup history available.
        </div>
      ) : (
        <div className="space-y-4">
          {pickups.map((pickup) => {
            const { icon, color } = getStatusIconAndColor(pickup.status);
            return (
              <div
                key={pickup._id}
                className="p-4 rounded-lg  bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Left Section: Request Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-600">Collection ID:</span>
                      <span className="text-sm font-semibold text-gray-800">{pickup.collectionId}</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div>
                        <span className="text-xs text-gray-600">Type:</span>
                        <p className="text-sm font-medium text-gray-800">{pickup.type}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Estimated cost:</span>
                        <p className="text-sm font-medium text-gray-800">{pickup.estimatedCost}₹</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Created At:</span>
                        <p className="text-sm font-medium text-gray-800">{pickup.createdAt.split('T')[0]}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Preferred Date:</span>
                        <p className="text-sm font-medium text-gray-800">{pickup.preferredDate.split('T')[0]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Section: Status and Action Button */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${color}`}>
                      {icon}
                      <span className="text-xs font-medium">{pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}</span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(pickup.collectionId)}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <FaEye /> View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CollectionHistory;