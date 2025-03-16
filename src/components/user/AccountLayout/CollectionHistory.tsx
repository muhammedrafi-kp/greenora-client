import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaClock, FaEye } from 'react-icons/fa';
import { getCollectionHistory } from '../../../services/userService';
import { useNavigate } from 'react-router-dom';


interface Category {
  _id:string;
  name: string;
  rate: number;
}

interface CollectionItem {
  categoryId: Category;
  qty: number;
}

interface Address {
  name: string;
  mobile: string;
  pinCode: string;
  locality: string;
  addressLine: string;
}

interface Collection {
  _id: string;
  collectionId: string;
  collectorId: string;
  districtId: string;
  serviceAreaId: string;
  type: string;
  status: 'completed' | 'scheduled' | 'cancelled' | 'pending';
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentId: string;
  items: CollectionItem[];
  estimatedCost: number;
  address: Address;
  createdAt: string;
  preferredDate: string;
}


const CollectionHistory: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPickupHistory = async () => {
    setLoading(true)
    try {
      const response = await getCollectionHistory();
      console.log(response.data);
      if (response.success) {
        setCollections(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching collection histories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickupHistory();
  }, []);

  const getStatusIconAndColor = (status: 'completed' | 'scheduled' | 'cancelled' | 'pending') => {
    switch (status) {
      case 'completed':
        return { icon: <FaCheckCircle />, color: 'bg-green-100 text-green-600' };
      case 'scheduled':
        return { icon: <FaCheckCircle />, color: 'bg-green-100 text-green-600' };
      case 'cancelled':
        return { icon: <FaTimesCircle />, color: 'bg-red-100 text-red-600' };
      case 'pending':
        return { icon: <FaClock />, color: 'bg-blue-100 text-blue-600' };
    }
  };

  const handleViewDetails = (pickup: Collection) => {
    navigate('/collection/details', {
      state: { collectionDetails: pickup }
    });
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
        {collections.length > 0 && (
          <div className="flex gap-2 mt-2">
            <button className="px-4 py-2 bg-gray-200 rounded-lg text-xs">All</button>
            <button className="px-4 py-2 bg-gray-200 rounded-lg text-xs">Completed</button>
            <button className="px-4 py-2 bg-gray-200 rounded-lg text-xs">In progress</button>
            <button className="px-4 py-2 bg-gray-200 rounded-lg text-xs">Cancelled</button>
          </div>
        )}
      </div>

      {collections.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No pickup history available.
        </div>
      ) : (
        <div className="space-y-4">
          {collections.map((collection) => {
            const { icon, color } = getStatusIconAndColor(collection.status);
            return (
              <div
                key={collection._id}
                className="p-4 rounded-lg  bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Left Section: Request Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-600">Collection ID:</span>
                      <span className="text-sm font-semibold text-gray-800">{collection.collectionId.toLocaleUpperCase()}</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div>
                        <span className="text-xs text-gray-600">Type:</span>
                        <p className="text-sm font-medium text-gray-800">{collection.type}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Estimated cost:</span>
                        <p className="text-sm font-medium text-gray-800">{collection.estimatedCost}₹</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Created Date:</span>
                        <p className="text-sm font-medium text-gray-800">{collection.createdAt.split('T')[0]}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Preferred Date:</span>
                        <p className="text-sm font-medium text-gray-800">{collection.preferredDate.split('T')[0]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Section: Status and Action Button */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${color}`}>
                      {icon}
                      <span className="text-xs font-medium">{collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}</span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(collection)}
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