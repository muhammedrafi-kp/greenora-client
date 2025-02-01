// import React, { useState } from 'react';
// import { FaEye, FaTrashAlt, FaCheck, FaSpinner } from 'react-icons/fa';

// interface Request {
//     id: string;
//     serviceType: string;
//     requestedDate: string;
//     status: 'In Progress' | 'Completed' | 'Cancelled';
//     payment: string;
//     amount: number;
// }

// const CollectionHistory: React.FC = () => {
//     const [requests, setRequests] = useState<Request[]>([
//         {
//             id: '#10234',
//             serviceType: 'Waste Pickup',
//             requestedDate: '2024-11-25',
//             status: 'In Progress',
//             payment: 'In Progress',
//             amount: 0
//         },
//         {
//             id: '#10233',
//             serviceType: 'Scrap Collection',
//             requestedDate: '2024-11-22',
//             status: 'Completed',
//             payment: 'Completed',
//             amount: 350
//         },
//         {
//             id: '#10233',
//             serviceType: 'Scrap Collection',
//             requestedDate: '2024-11-22',
//             status: 'Completed',
//             payment: 'Completed',
//             amount: 350
//         },
//         {
//             id: '#10233',
//             serviceType: 'Scrap Collection',
//             requestedDate: '2024-11-22',
//             status: 'Completed',
//             payment: 'Completed',
//             amount: 350
//         }
//     ]);

//     const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

//     const handleViewDetails = (request: Request) => {
//         setSelectedRequest(request);
//     };

//     const handleCancelRequest = (requestId: string) => {
//         // Implement cancellation logic here
//         setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'Cancelled' } : r));
//     };

//     const handleTrackPickup = () => {
//         // Implement tracking logic here
//     };

//     return (
//         <div>
//             <div className="mb-4">
//                 <h2 className="lg:text-lg xs:text-base text-sm font-semibold">Requests</h2>
//                 <div className="flex gap-2 mt-2">
//                     <button className="px-4 py-2 bg-gray-200 rounded-lg text-xs">All</button>
//                     <button className="px-4 py-2 bg-gray-200 rounded-lg text-xs">Completed</button>
//                     <button className="px-4 py-2 bg-gray-200 rounded-lg text-xs">In progress</button>
//                     <button className="px-4 py-2 bg-gray-200 rounded-lg text-xs">Cancelled</button>
//                 </div>
//             </div>

//             <div className="space-y-4">
//                 {requests.map((request) => (
//                     <div key={request.id} className="bg-white border border-gray-100 rounded-lg p-4 flex items-center justify-between">
//                         <div className="flex items-center gap-4">
//                             <div className="text-2xl">
//                                 {request.status === 'In Progress' ? (
//                                     <FaSpinner className="animate-spin text-blue-600" />
//                                 ) : request.status === 'Completed' ? (
//                                     <FaCheck className="text-green-600" />
//                                 ) : (
//                                     <FaTrashAlt className="text-red-600" />
//                                 )}
//                             </div>
//                             <div>
//                                 <h3 className="font-semibold text-sm">{request.id} - {request.serviceType}</h3>
//                                 <p className="text-xs text-gray-500">Requested: {request.requestedDate}</p>
//                                 <p className="text-xs font-medium text-gray-700">Status: {request.status}</p>
//                             </div>
//                         </div>
//                         <div className="flex gap-2">
//                             <button
//                                 onClick={() => handleViewDetails(request)}
//                                 className="text-green-700 hover:bg-green-50 p-2 rounded-full"
//                             >
//                                 <FaEye className="text-lg" />
//                             </button>
//                             {request.status === 'In Progress' && (
//                                 <button
//                                     onClick={handleTrackPickup}
//                                     className="text-blue-700 hover:bg-blue-50 p-2 rounded-full"
//                                 >
//                                     Track Pickup
//                                 </button>
//                             )}
//                             {request.status !== 'Cancelled' && (
//                                 <button
//                                     onClick={() => handleCancelRequest(request.id)}
//                                     className="text-red-700 hover:bg-red-50 p-2 rounded-full"
//                                 >
//                                     <FaTrashAlt className="text-lg" />
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {selectedRequest && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg p-6 w-96 max-w-full">
//                         <h3 className="text-lg font-semibold mb-4">Request Details</h3>
//                         <div className="space-y-3">
//                             <div>
//                                 <span className="font-medium">Request ID:</span> {selectedRequest.id}
//                             </div>
//                             <div>
//                                 <span className="font-medium">Service Type:</span> {selectedRequest.serviceType}
//                             </div>
//                             <div>
//                                 <span className="font-medium">Requested Date:</span> {selectedRequest.requestedDate}
//                             </div>
//                             <div>
//                                 <span className="font-medium">Status:</span> {selectedRequest.status}
//                             </div>
//                             <div>
//                                 <span className="font-medium">Payment:</span> {selectedRequest.payment}
//                             </div>
//                             <div>
//                                 <span className="font-medium">Amount:</span> ₹{selectedRequest.amount.toLocaleString()}
//                             </div>
//                         </div>
//                         <div className="flex justify-end mt-6 gap-2">
//                             {selectedRequest.status === 'In Progress' && (
//                                 <button
//                                     onClick={handleTrackPickup}
//                                     className="bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-900"
//                                 >
//                                     Track Pickup
//                                 </button>
//                             )}
//                             {selectedRequest.status !== 'Cancelled' && (
//                                 <button
//                                     onClick={() => handleCancelRequest(selectedRequest.id)}
//                                     className="bg-red-800 text-white py-2 px-4 rounded-lg hover:bg-red-900"
//                                 >
//                                     Cancel Request
//                                 </button>
//                             )}
//                             <button
//                                 onClick={() => setSelectedRequest(null)}
//                                 className="bg-green-800 text-white py-2 px-4 rounded-lg hover:bg-green-900"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CollectionHistory;

// import React, { useState } from 'react';
// import { TbClipboardList, TbEye, TbTrash, TbClock, TbCheckbox, TbCancel } from 'react-icons/tb';

// interface Request {
//   id: string;
//   serviceType: string;
//   requestedDate: string;
//   status: 'In Progress' | 'Completed' | 'Cancelled';
//   payment: string;
//   amount: number;
//   estimatedWeight: number;
//   collectorName?: string;
//   scheduledDateTime?: string;
// }

// interface RequestDetailsProps {
//   request: Request;
//   onClose: () => void;
// }

// const RequestDetails: React.FC<RequestDetailsProps> = ({ request, onClose }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-8 w-full max-w-xl shadow-lg">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-2xl font-bold">{request.id} - {request.serviceType}</h3>
//           <button
//             onClick={onClose}
//             className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors"
//           >
//             <TbEye className="text-gray-600 text-xl" />
//           </button>
//         </div>
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <p className="text-gray-500 text-sm mb-1">Requested Date</p>
//             <p className="text-gray-700 font-medium">{request.requestedDate}</p>
//           </div>
//           <div>
//             <p className="text-gray-500 text-sm mb-1">Status</p>
//             <p className="text-gray-700 font-medium">
//               {request.status === 'In Progress' ? (
//                 <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center">
//                   <TbClock className="inline-block mr-1" />
//                   In Progress
//                 </div>
//               ) : request.status === 'Completed' ? (
//                 <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center">
//                   <TbCheckbox className="inline-block mr-1" />
//                   Completed
//                 </div>
//               ) : (
//                 <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center">
//                   <TbCancel className="inline-block mr-1" />
//                   Cancelled
//                 </div>
//               )}
//             </p>
//           </div>
//           <div>
//             <p className="text-gray-500 text-sm mb-1">Payment</p>
//             <p className="text-gray-700 font-medium">{request.payment}</p>
//           </div>
//           <div>
//             <p className="text-gray-500 text-sm mb-1">Amount</p>
//             <p className="text-gray-700 font-medium">₹{request.amount.toLocaleString()}</p>
//           </div>
//           <div>
//             <p className="text-gray-500 text-sm mb-1">Estimated Weight</p>
//             <p className="text-gray-700 font-medium">{request.estimatedWeight} kg</p>
//           </div>
//           {request.collectorName && (
//             <div>
//               <p className="text-gray-500 text-sm mb-1">Assigned Collector</p>
//               <p className="text-gray-700 font-medium">{request.collectorName}</p>
//             </div>
//           )}
//           {request.scheduledDateTime && (
//             <div>
//               <p className="text-gray-500 text-sm mb-1">Scheduled Date/Time</p>
//               <p className="text-gray-700 font-medium">{request.scheduledDateTime}</p>
//             </div>
//           )}
//         </div>
//         <div className="flex justify-end mt-8 gap-4">
//           {request.status === 'In Progress' && (
//             <button
//               // onClick={() => handleTrackPickup(request)}
//               className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors"
//             >
//               <TbEye className="inline-block mr-2" />
//               Track Pickup
//             </button>
//           )}
//           {request.status !== 'Cancelled' && (
//             <button
//               // onClick={() => handleCancelRequest(request.id)}
//               className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 transition-colors"
//             >
//               <TbTrash className="inline-block mr-2" />
//               Cancel Request
//             </button>
//           )}
//           <button
//             onClick={onClose}
//             className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaClock, FaEye } from 'react-icons/fa';

// Define pickup history types
interface PickupHistory {
  id: string;
  requestId: string;
  wasteType: string;
  weight: string;
  status: 'completed' | 'cancelled' | 'pending';
  requestedDate: string;
  scheduledDate: string;
  collectorName?: string;
  notes?: string;
}

const CollectionHistory: React.FC = () => {
  const [pickups, setPickups] = useState<PickupHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch pickup history - replace with actual API call
    const fetchPickupHistory = async () => {
      // Simulate API call with mock data
      const mockPickups: PickupHistory[] = [
        {
          id: '1',
          requestId: 'REQ12345',
          wasteType: 'Electronic Waste',
          weight: '15 kg',
          status: 'completed',
          requestedDate: '2023-10-14',
          scheduledDate: '2023-10-15',
          collectorName: 'John Doe',
          notes: 'Pickup was successful and on time.'
        },
        {
          id: '2',
          requestId: 'REQ12346',
          wasteType: 'Plastic Waste',
          weight: '10 kg',
          status: 'cancelled',
          requestedDate: '2023-10-09',
          scheduledDate: '2023-10-10',
          notes: 'Pickup was cancelled by the user.'
        },
        {
          id: '3',
          requestId: 'REQ12347',
          wasteType: 'Organic Waste',
          weight: '20 kg',
          status: 'pending',
          requestedDate: '2023-10-04',
          scheduledDate: '2023-10-05',
          notes: 'Awaiting collector assignment.'
        }
      ];

      setPickups(mockPickups);
      setLoading(false);
    };

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
                <div className="flex gap-2 mt-2">
                    <button className="px-4 py-2 bg-gray-200 rounded-lg text-xs">All</button>
                    <button className="px-4 py-2 bg-gray-200 rounded-lg text-xs">Completed</button>
                    <button className="px-4 py-2 bg-gray-200 rounded-lg text-xs">In progress</button>
                    <button className="px-4 py-2 bg-gray-200 rounded-lg text-xs">Cancelled</button>
                </div>
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
                key={pickup.id}
                className="p-4 rounded-lg  bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Left Section: Request Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-600">Request ID:</span>
                      <span className="text-sm font-semibold text-gray-800">{pickup.requestId}</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div>
                        <span className="text-xs text-gray-600">Waste Type:</span>
                        <p className="text-sm font-medium text-gray-800">{pickup.wasteType}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Weight:</span>
                        <p className="text-sm font-medium text-gray-800">{pickup.weight}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Requested Date:</span>
                        <p className="text-sm font-medium text-gray-800">{pickup.requestedDate}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Scheduled Date:</span>
                        <p className="text-sm font-medium text-gray-800">{pickup.scheduledDate}</p>
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
                      onClick={() => handleViewDetails(pickup.requestId)}
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