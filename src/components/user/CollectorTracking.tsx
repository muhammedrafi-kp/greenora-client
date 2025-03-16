// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaArrowLeft, FaPhoneAlt, FaUser, FaTruck, FaMapMarkerAlt, FaClock, FaMapPin, FaHome, FaTruckMoving } from 'react-icons/fa';

// interface CollectorLocation {
//     latitude: number;
//     longitude: number;
//     lastUpdated: string;
//     estimatedArrival: string;
// }

// const CollectorTracking: React.FC = () => {
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(true);
//     const [collectorInfo, setCollectorInfo] = useState({
//         name: "John Doe",
//         mobile: "+91 9876543210",
//         vehicleNumber: "KL-01-AB-1234",
//         status: "On the way",
//         currentLocation: "Kaloor, Kochi",
//         estimatedTime: "15 mins"
//     });

//     // Add these states for map interaction
//     const [mapZoom, setMapZoom] = useState(12);
//     const [showRoute, setShowRoute] = useState(true);

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Header */}
//             <div className="bg-white shadow-sm">
//                 <div className="container mx-auto px-4 py-4">
//                     <div className="flex items-center gap-4">
//                         <button
//                             onClick={() => navigate(-1)}
//                             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                         >
//                             <FaArrowLeft className="text-gray-600" />
//                         </button>
//                         <h1 className="text-xl font-semibold text-gray-800">Track Collector</h1>
//                     </div>
//                 </div>
//             </div>

//             <div className="container mx-auto px-4 py-6">
//                 <div className="grid md:grid-cols-3 gap-6">
//                     {/* Map Section */}
//                     <div className="md:col-span-2 bg-white rounded-xl shadow-sm border p-4">
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="text-lg font-semibold text-gray-800">Live Location</h2>
//                             <div className="flex gap-2">
//                                 <button 
//                                     onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
//                                     className="p-2 hover:bg-gray-100 rounded-lg"
//                                 >
//                                     +
//                                 </button>
//                                 <button 
//                                     onClick={() => setMapZoom(prev => Math.max(prev - 1, 8))}
//                                     className="p-2 hover:bg-gray-100 rounded-lg"
//                                 >
//                                     −
//                                 </button>
//                                 <button 
//                                     onClick={() => setShowRoute(!showRoute)}
//                                     className={`px-3 py-1 rounded-lg text-sm ${
//                                         showRoute ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
//                                     }`}
//                                 >
//                                     Show Route
//                                 </button>
//                             </div>
//                         </div>
//                         <div className="relative w-full h-[500px] bg-blue-50 rounded-lg overflow-hidden">
//                             {/* Dummy Map Content */}
//                             <div className="absolute inset-0 p-4">
//                                 {/* Grid Lines */}
//                                 <div className="grid grid-cols-8 grid-rows-8 h-full">
//                                     {Array.from({ length: 64 }).map((_, i) => (
//                                         <div key={i} className="border border-blue-100/50" />
//                                     ))}
//                                 </div>

//                                 {/* Route Line */}
//                                 {showRoute && (
//                                     <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-blue-400 transform -translate-y-1/2">
//                                         <div className="absolute top-1/2 left-0 w-2 h-2 bg-blue-400 rounded-full transform -translate-y-1/2" />
//                                         <div className="absolute top-1/2 right-0 w-2 h-2 bg-blue-400 rounded-full transform -translate-y-1/2" />
//                                     </div>
//                                 )}

//                                 {/* Pickup Location */}
//                                 <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
//                                     <div className="relative">
//                                         <FaHome className="text-gray-700 text-2xl" />
//                                         <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-md text-sm whitespace-nowrap">
//                                             Pickup Location
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Collector Location */}
//                                 <div className="absolute top-1/2 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
//                                     <div className="relative animate-bounce">
//                                         <FaTruckMoving className="text-green-600 text-3xl" />
//                                         <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-md text-sm whitespace-nowrap">
//                                             Collector Location
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Map Controls */}
//                             <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-2">
//                                 <div className="text-xs text-gray-500">Zoom Level: {mapZoom}</div>
//                             </div>
//                         </div>
//                     </div>
//                     {/* Collector Info Card */}
//                     <div className="md:col-span-1 space-y-6">
//                         <div className="bg-white rounded-xl shadow-sm border p-6">
//                             <h2 className="text-lg font-semibold text-gray-800 mb-4">Collector Details</h2>
//                             <div className="space-y-4">
//                                 <div className="flex items-center gap-3">
//                                     <div className="p-2 bg-blue-50 rounded-full">
//                                         <FaUser className="text-blue-600 w-5 h-5" />
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-500">Collector Name</p>
//                                         <p className="font-medium text-gray-800">{collectorInfo.name}</p>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center gap-3">
//                                     <div className="p-2 bg-green-50 rounded-full">
//                                         <FaPhoneAlt className="text-green-600 w-5 h-5" />
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-500">Contact Number</p>
//                                         <a 
//                                             href={`tel:${collectorInfo.mobile}`}
//                                             className="font-medium text-green-600 hover:text-green-700"
//                                         >
//                                             {collectorInfo.mobile}
//                                         </a>
//                                     </div>
//                                 </div>

//                                 {/* <div className="flex items-center gap-3">
//                                     <div className="p-2 bg-purple-50 rounded-full">
//                                         <FaTruck className="text-purple-600 w-5 h-5" />
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-500">Vehicle Number</p>
//                                         <p className="font-medium text-gray-800">{collectorInfo.vehicleNumber}</p>
//                                     </div>
//                                 </div> */}
//                             </div>
//                         </div>

//                         {/* Status Card */}
//                         <div className="bg-white rounded-xl shadow-sm border p-6">
//                             <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Status</h2>
//                             <div className="space-y-4">
//                                 <div className="flex items-center gap-3">
//                                     <div className="p-2 bg-yellow-50 rounded-full">
//                                         <FaMapMarkerAlt className="text-yellow-600 w-5 h-5" />
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-500">Current Location</p>
//                                         <p className="font-medium text-gray-800">{collectorInfo.currentLocation}</p>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center gap-3">
//                                     <div className="p-2 bg-red-50 rounded-full">
//                                         <FaClock className="text-red-600 w-5 h-5" />
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-500">Estimated Arrival</p>
//                                         <p className="font-medium text-gray-800">{collectorInfo.estimatedTime}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

                    
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CollectorTracking;











import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowCircleLeft, FaPhoneAlt  , FaUser, FaMapMarkedAlt, FaCar, FaClipboard, FaCalendarAlt, FaClock, FaRoute, FaMapMarkerAlt } from 'react-icons/fa';

const CollectorTracking = () => {
    const navigate = useNavigate();
    const { collectionId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [trackingData, setTrackingData] = useState({
        collectionId: collectionId || 'COL123456',
        collector: {
            name: 'Rajesh Kumar',
            mobile: '9876543210',
            vehicleNumber: 'MH 02 AB 1234',
            vehicleType: 'Mini Truck',
            rating: 4.7
        },
        tracking: {
            status: 'en-route', // en-route, arrived, completed
            estimatedArrival: '12:45 PM',
            estimatedTimeLeft: '15 mins',
            currentLocation: 'Andheri East, Mumbai',
            distance: '2.5 km',
            lastUpdated: new Date().toISOString()
        },
        address: {
            name: 'Sunil Sharma',
            mobile: '8765432109',
            addressLine: '402, Sunshine Apartments',
            locality: 'Powai',
            city: 'Mumbai',
            pinCode: '400076'
        }
    });

    useEffect(() => {
        // Simulate fetching tracking data
        const fetchTrackingData = async () => {
            try {
                setLoading(true);
                // In a real app, you would fetch data from your API here
                // const response = await getCollectionTracking(collectionId);
                // setTrackingData(response.data);
                
                // Simulate API delay
                setTimeout(() => {
                    setLoading(false);
                }, 1500);
            } catch (err) {
                setError('Failed to load tracking information');
                setLoading(false);
            }
        };

        fetchTrackingData();

        // Simulate location updates
        const intervalId = setInterval(() => {
            setTrackingData(prev => {
                const minutesLeft = parseInt(prev.tracking.estimatedTimeLeft.split(' ')[0]);
                const newMinutesLeft = Math.max(0, minutesLeft - 1);
                const newDistance = parseFloat(prev.tracking.distance.split(' ')[0]);
                const updatedDistance = (newDistance - 0.1).toFixed(1);
                
                let status = prev.tracking.status;
                if (newMinutesLeft === 0) {
                    status = 'arrived';
                }
                
                return {
                    ...prev,
                    tracking: {
                        ...prev.tracking,
                        estimatedTimeLeft: `${newMinutesLeft} mins`,
                        distance: `${updatedDistance} km`,
                        status: status,
                        lastUpdated: new Date().toISOString()
                    }
                };
            });
        }, 5000);

        return () => clearInterval(intervalId);
    }, [collectionId]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const formatTime = (dateString:any) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-700 font-medium">Loading tracking information...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-20 mt-9">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
                <button
                    onClick={handleGoBack}
                    className="mt-4 flex items-center gap-2 hover:bg-gray-200 p-2 rounded-lg text-sm text-gray-600"
                >
                    <FaArrowCircleLeft /> Go Back
                </button>
            </div>
        );
    }

    const getStatusInfo = (status:any) => {
        switch (status) {
            case 'en-route':
                return {
                    message: 'Collector is on the way',
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-100'
                };
            case 'arrived':
                return {
                    message: 'Collector has arrived at your location',
                    color: 'text-green-600',
                    bgColor: 'bg-green-100'
                };
            case 'completed':
                return {
                    message: 'Collection has been completed',
                    color: 'text-green-600',
                    bgColor: 'bg-green-100'
                };
            default:
                return {
                    message: 'Status unknown',
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-100'
                };
        }
    };

    const statusInfo = getStatusInfo(trackingData.tracking.status);

    return (
        <div className="container mx-auto px-4 lg:px-12 py-20 mt-9">
            <button
                onClick={handleGoBack}
                className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded-lg text-sm text-gray-600 hover:text-gray-700 mb-6"
            >
                <FaArrowCircleLeft /> Back to Collection Details
            </button>

            <div className="grid md:grid-cols-3 gap-6">
                

                {/* Right Column - Info Cards */}
                <div className="space-y-6">

                     {/* Collection Details */}
                     <div className="bg-white rounded-lg shadow-md p-6 border">
                        <h3 className="text-md font-semibold mb-3 border-b pb-2 flex items-center gap-2">
                            <FaClipboard className="text-green-800" /> Collection Details
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <FaCalendarAlt className="text-gray-500" /> Collection ID
                                </span>
                                <span className="text-gray-800 font-medium">{trackingData.collectionId}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <FaClock className="text-gray-500" /> ETA
                                </span>
                                <span className="text-green-800 font-medium">{trackingData.tracking.estimatedArrival}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <FaClock className="text-gray-500" /> Time Left
                                </span>
                                <span className="text-green-800 font-medium">{trackingData.tracking.estimatedTimeLeft}</span>
                            </div>
                        </div>
                    </div>

                    {/* Pickup Address */}
                    <div className="bg-white rounded-lg shadow-md p-6 border">
                        <h3 className="text-md font-semibold mb-3 border-b pb-2 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-green-800" /> Pickup Address
                        </h3>
                        <div className="space-y-2">
                            <p className="text-gray-800 font-medium">{trackingData.address.name}</p>
                            <p className="text-gray-800">
                                {trackingData.address.addressLine}, {trackingData.address.locality}, {trackingData.address.city} - {trackingData.address.pinCode}
                            </p>
                            <p className="text-gray-600">{trackingData.address.mobile}</p>
                        </div>
                    </div>



                    {/* Collector Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 border">
                        <h3 className="text-md font-semibold mb-3 border-b pb-2 flex items-center gap-2">
                            <FaUser className="text-green-800" /> Collector Information
                        </h3>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                                <FaUser className="text-2xl" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{trackingData.collector.name}</p>
                                <div className="flex items-center mt-1">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-4 h-4 ${i < Math.floor(trackingData.collector.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 ml-1">{trackingData.collector.rating}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {/* <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <FaPhoneAlt  className="text-gray-500" /> Phone
                                </span>
                                <a href={`tel:${trackingData.collector.mobile}`} className="text-blue-600 hover:underline">
                                    {trackingData.collector.mobile}
                                </a>
                            </div> */}
                            {/* <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <FaCar className="text-gray-500" /> Vehicle
                                </span>
                                <span className="text-gray-800">{trackingData.collector.vehicleNumber}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <FaCar className="text-gray-500" /> Type
                                </span>
                                <span className="text-gray-800">{trackingData.collector.vehicleType}</span>
                            </div> */}
                        </div>
                        <div className="mt-4">
                            <button className="w-full py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors flex items-center justify-center gap-2">
                            <FaPhoneAlt /> Call Collector
                            </button>
                        </div>
                    </div>

                </div>


                {/* Left Column - Map */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden border h-full flex flex-col">
                        <div className="p-4 bg-green-900 text-white flex justify-between items-center">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <FaMapMarkedAlt /> Live Tracking Map
                            </h2>
                            <span className="text-sm bg-white text-green-900 px-3 py-1 rounded-full">
                                Collection ID: {trackingData.collectionId}
                            </span>
                        </div>
                        
                        {/* Map Placeholder - In a real app, integrate with Google Maps or other mapping service */}
                        <div className="relative flex-grow bg-gray-100 min-h-[400px] flex items-center justify-center">
                            {/* Map would be rendered here */}
                            <div className="text-center p-6">
                                <FaMapMarkedAlt className="text-6xl text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-2">Interactive map showing real-time location</p>
                                <p className="text-sm text-gray-500">
                                    Map would show the collector's current position, your location, and the route between
                                </p>
                            </div>
                            
                            {/* Status Indicator Overlay */}
                            <div className={`absolute top-4 left-4 ${statusInfo.bgColor} ${statusInfo.color} px-4 py-2 rounded-lg shadow flex items-center gap-2`}>
                                <FaMapMarkerAlt />
                                <span className="font-medium">{statusInfo.message}</span>
                            </div>
                            
                            {/* Position indicator dots - simulating movement */}
                            <div className="absolute w-3 h-3 bg-blue-600 rounded-full top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <span className="absolute w-8 h-8 bg-blue-600 bg-opacity-30 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></span>
                            </div>
                            <div className="absolute w-3 h-3 bg-green-600 rounded-full bottom-1/4 left-2/3 transform -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                        
                        {/* Tracking Status Bar */}
                        <div className="bg-white p-4 border-t">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <FaClock className="text-gray-600" />
                                    <span className="font-medium">ETA: <span className="text-green-800">{trackingData.tracking.estimatedArrival}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaRoute className="text-gray-600" />
                                    <span className="font-medium">Distance: <span className="text-green-800">{trackingData.tracking.distance}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-gray-600" />
                                    <span className="font-medium">Current Location: <span className="text-green-800">{trackingData.tracking.currentLocation}</span></span>
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-500 text-right">
                                Last updated: {formatTime(trackingData.tracking.lastUpdated)}
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default CollectorTracking;