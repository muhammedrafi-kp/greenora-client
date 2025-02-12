import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MapPin, Calendar, Package } from 'lucide-react';

interface PickupRequest {
  type: string;
  address: string;
  wasteType: string;
  quantity: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  specialInstructions?: string;
  estimatedCost: number;
}

const Review = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [request, setRequest] = useState<PickupRequest >({
    "type": "Scheduled Pickup",
    "address": "123 Green Street, Springfield, IL, 62704",
    "wasteType": "E-Waste",
    "quantity": "5 kg",
    "description": "Old electronics including monitors and phones",
    "preferredDate": "2025-02-10",
    "preferredTime": "10:30 AM",
    "specialInstructions": "Handle electronics carefully; fragile items included",
    "estimatedCost": 25.50
  }
  );

  useEffect(() => {
    const fetchRequest = async () => {
    //   try {
    //     const response = await axios.get(`/api/pickup/${requestId}`);
    //     setRequest(response.data);
    //   } catch (error) {
    //     toast.error('Failed to load request details');
    //   } finally {
    //     setIsLoading(false);
    //   }
    };
    fetchRequest();
  }, [requestId]);

  const handleConfirm = async () => {
    setIsLoading(true);
    // try {
    //   await axios.post(`/api/pickup/${requestId}/confirm`);
    //   navigate(`/pickup/payment/${requestId}`);
    // } catch (error) {
    //   toast.error('Failed to confirm request');
    //   setIsLoading(false);
    // }
  };

//   if (isLoading || !request) {
//     return (
//       <div className="flex justify-center items-center min-h-[200px]">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
//       </div>
//     );
//   }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Review Your Request
        </h3>

        <div className="space-y-6">
          <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
            <MapPin className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-700">Pickup Address</p>
              <p className="text-sm text-gray-600 mt-1">{request.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
            <Package className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-700">Pickup Details</p>
              <div className="mt-1 space-y-1">
                <p className="text-sm text-gray-600">Type: {request.wasteType}</p>
                <p className="text-sm text-gray-600">Quantity: {request.quantity}</p>
                <p className="text-sm text-gray-600">Description: {request.description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
            <Calendar className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-700">Schedule</p>
              <div className="mt-1 space-y-1">
                <p className="text-sm text-gray-600">Date: {request.preferredDate}</p>
                <p className="text-sm text-gray-600">Time: {request.preferredTime}</p>
                {request.specialInstructions && (
                  <p className="text-sm text-gray-600">
                    Special Instructions: {request.specialInstructions}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">Estimated Cost</p>
              <p className="text-lg font-semibold text-gray-900">
                ${request.estimatedCost.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => navigate(`/pickup/details/${requestId}`)}
          className="w-1/2 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className={`w-1/2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-medium
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Review; 