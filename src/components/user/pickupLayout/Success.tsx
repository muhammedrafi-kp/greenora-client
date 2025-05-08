import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Success: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchSuccessDetails = async () => {
      //   try {
      //     const response = await axios.get(`/api/pickup/${requestId}/success`);
      //     setDetails(response.data);
      //   } catch (error) {
      //     toast.error('Failed to load confirmation details');
      //     navigate('/pickup');
      //   }
    };
    fetchSuccessDetails();
  }, [requestId, navigate]);

  //   if (!details) {
  //     return (
  //       <div className="flex justify-center items-center min-h-[200px]">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
  //       </div>
  //     );
  //   }

  return (
    <div className="bg-gray-100 min-h-screen py-16">
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Pickup Scheduled Successfully!
            </h3>
            <p className="text-gray-600 mb-6">
              Your pickup request has been confirmed and scheduled.Our team will be reaching out to you shortly.
            </p>

            {/* <div className="space-y-4 text-left">
              <div className="flex items-start gap-3 p-4 bg-gray-100 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Pickup Schedule</p>
                  <p className="text-sm text-gray-600">
                    {details.pickupDate} - {details.pickupTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-100 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Pickup Location</p>
                  <p className="text-sm text-gray-600">{details.address}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-700">Amount Paid</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${details.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div> */}

            <div className="mt-8 flex justify-center gap-4">

              <button
                onClick={() => navigate('/pickup')}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium"
              >
                Schedule Another Pickup
              </button>
              <button
                onClick={() => navigate('/account/collections')}
                className="w-full bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg text-sm font-medium"
              >
                View Collection History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success; 