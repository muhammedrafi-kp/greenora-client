import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowCircleLeft, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaClock, FaCreditCard, FaMoneyBill, FaMapMarkerAlt, FaPhoneAlt, FaUser, FaMapMarkedAlt, FaRegCircle, FaClipboard } from 'react-icons/fa';
import Modal from '../common/Modal';
import { getCollectorData, getPaymentData, cancelCollection } from '../../services/userService';
import toast from 'react-hot-toast';
// Define the interfaces
interface Category {
    _id: string;
    name: string;
}

interface ICollector {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profileUrl: string;
}

interface Payment {
    _id: string;
    paymentId: string;
    advanceAmount: number;
    advancePaymentStatus: string;
    status: 'pending' | 'paid' | 'failed';
    paymentDate: string;
}

interface CollectionItem {
    categoryId: Category;
    name: string;
    rate: number;
    qty: number;
}

interface Address {
    name: string;
    mobile: string;
    pinCode: string;
    locality: string;
    addressLine: string;
}

interface CancellationReason {
    id: string;
    reason: string;
}

interface CollectionDetails {
    _id: string;
    collectionId: string;
    collectorId?: string;
    districtId: string;
    serviceAreaId: string;
    type: string;
    status: 'completed' | 'scheduled' | 'in progress' | 'cancelled' | 'pending';
    paymentStatus: 'paid' | 'pending' | 'failed';
    paymentId: string;
    items: CollectionItem[];
    estimatedCost: number;
    preferredDate: string;
    createdAt: string;
    address: Address;
    collector?: ICollector;
}

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-900"></div>
    </div>
);

const CollectionDetails: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { collectionDetails } = location.state as { collectionDetails: CollectionDetails };

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [customReason, setCustomReason] = useState<string>('');
    const [isCustomReason, setIsCustomReason] = useState(false);
    const [collector, setCollector] = useState<ICollector | null>(null);
    const [payment, setPayment] = useState<Payment | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const predefinedReasons: CancellationReason[] = [
        { id: '1', reason: 'Changed my mind' },
        { id: '2', reason: 'Found better rates elsewhere' },
        { id: '3', reason: 'Scheduling conflict' },
        { id: '4', reason: 'Items no longer available' },
        { id: '5', reason: 'Other' }
    ];

    useEffect(() => {
        const fetchCollectorData = async () => {
            if (!collectionDetails.collectorId) return;

            setIsLoading(true);
            try {
                const response = await getCollectorData(collectionDetails.collectorId);
                console.log("collector response:", response);
                if (response.success) {
                    setCollector(response.data);
                }
            } catch (error) {
                console.error("Error fetching collector data:", error);
            }
        };

        const fetchPaymentData = async () => {
            try {
                if (!collectionDetails.paymentId) return;

                const response = await getPaymentData(collectionDetails.paymentId);
                console.log("payment response:", response);
                if (response.success) {
                    setPayment(response.data);
                }
            } catch (error) {
                console.error("Error fetching payment data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCollectorData();
        fetchPaymentData();
    }, [collectionDetails.collectorId, collectionDetails.paymentId]);

    console.log("payment:", payment);

    const getStatusIconAndColor = (status: 'completed' | 'scheduled' | 'cancelled' | 'in progress' | 'pending') => {
        switch (status) {
            case 'completed':
                return { icon: <FaCheckCircle />, color: 'bg-green-100 text-green-600' };
            case 'scheduled':
                return { icon: <FaCheckCircle />, color: 'bg-blue-100 text-blue-600' };
            case 'cancelled':
                return { icon: <FaTimesCircle />, color: 'bg-red-100 text-red-600' };
            case 'pending':
                return { icon: <FaClock />, color: 'bg-yellow-100 text-yellow-600' };
        }
    };

    const getPaymentStatusIconAndColor = (status: 'paid' | 'pending' | 'failed') => {
        switch (status) {
            case 'paid':
                return { icon: <FaCreditCard />, color: 'bg-green-100 text-green-600' };
            case 'pending':
                return { icon: <FaMoneyBill />, color: 'bg-yellow-100 text-yellow-600' };
            case 'failed':
                return { icon: <FaTimesCircle />, color: 'bg-red-100 text-red-600' };
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleCancelClick = () => {
        setShowCancelModal(true);
    };

    const handleConfirmCancel = async () => {
        const finalReason = isCustomReason ? customReason : selectedReason;

        setIsLoading(true);
        try {
            const response = await cancelCollection(collectionDetails.collectionId, finalReason);

            console.log("cancellation resposne:", response);

            if (response.success) {
                toast.success("collection cancelled");
                navigate("/account/waste-collection-history")
            }
        } catch (error) {
            console.error("error while cancelling the collection", error);
        } finally {
            setIsLoading(false);
            setShowCancelModal(false);
        }
    };

    const { icon, color } = getStatusIconAndColor(collectionDetails.status);
    // const { icon: paymentIcon, color: paymentColor } = getPaymentStatusIconAndColor(payment?.status as 'pending' | 'paid' | 'failed');

    const steps = [
        { number: 1, name: "Requested", status: "completed" },
        { number: 2, name: "Confirmed", status: collectionDetails.status === 'scheduled' ? "completed" : "pending" },
        { number: 3, name: "On the way", status: "pending" },
        { number: 4, name: "Picked up", status: collectionDetails.status === 'completed' ? "completed" : "pending" },
        { number: 5, name: "Completed", status: collectionDetails.status === 'completed' ? "completed" : "pending" },
    ];

    const getStepStyle = (status: string) => {
        switch (status) {
            case 'completed':
                return "border-green-500 bg-green-500 text-white";
            case 'pending':
                return "border-gray-300 bg-white text-gray-500";
            default:
                return "border-gray-300 bg-white text-gray-500";
        }
    };

    return (
        <div className="container mx-auto px-4 lg:px-12 py-20 mt-9">
            <button
                onClick={handleGoBack}
                className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded-lg text-sm text-gray-600 hover:text-gray-700 mb-6"
            >
                <FaArrowCircleLeft /> Back
            </button>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {/* Timeline Steps at the top */}
                    <div className="mb-8">
                        <div className="w-full py-4">
                            <div className="relative flex items-center justify-between">
                                <div className="absolute left-[10%] right-[10%] top-5 h-0.5 bg-gray-200" />
                                <div
                                    className="absolute left-[10%] right-[10%] top-5 h-0.5 bg-green-500 transition-all duration-300"
                                    style={{
                                        right: `${100 - (steps.filter(step => step.status === 'completed').length / (steps.length - 1)) * 80 + 10}%`
                                    }}
                                />
                                <div className="relative z-10 w-full flex justify-between">
                                    {steps.map((step) => (
                                        <div key={step.number} className="flex flex-col items-center flex-1">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                                                border-2 transition-all duration-300 ${getStepStyle(step.status)}`}
                                            >
                                                {step.number}
                                            </div>
                                            <span className={`mt-2 text-xs font-medium
                                                ${step.status === 'completed' ? 'text-green-600' : 'text-gray-500'}`}
                                            >
                                                {step.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Collection ID and Action Buttons in same row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <h2 className="text-lg font-semibold bg-green-900 text-white px-3 py-1 rounded-md">
                            Collection ID : {collectionDetails.collectionId.toLocaleUpperCase()}
                        </h2>

                        <div className="flex gap-4">
                            {collectionDetails.status !== 'cancelled' && collectionDetails.status !== 'completed' && (
                                <button
                                    className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors flex items-center gap-2"
                                    onClick={handleCancelClick}
                                >
                                    Cancel Collection
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-6 md:col-span-2">
                        <div className="space-y-6">
                            {/* Collection Details Card */}
                            <div className="bg-white rounded-lg shadow-md p-6 border">
                                {/* <h3 className="text-md font-semibold mb-3 border-b pb-2">Collection Information</h3> */}
                                <h3 className="text-md font-semibold mb-3 border-b pb-2 flex items-center gap-2">
                                    <FaClipboard className="text-green-800" /> Collection Details
                                    {/* <FaClipboard className="p-2 bg-yellow-50 rounded-full text-green-800" /> Collection Details */}

                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Type</span>
                                        <span className="text-gray-800">{collectionDetails.type}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Preferred Date</span>
                                        <span className="text-gray-800 ">{formatDate(collectionDetails.preferredDate)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Status</span>
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${color}`}>
                                            {/* {icon} */}
                                            <span className="text-sm font-medium">{collectionDetails.status.charAt(0).toUpperCase() + collectionDetails.status.slice(1)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Payment Status</span>
                                        {/* <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${paymentColor}`}> */}
                                        <div className={`flex items-center gap-2 px-3 py-1`}>

                                            {/* {paymentIcon} */}
                                            <span className="text-sm font-medium">
                                                {/* {payment?.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'Unknown'} */}
                                                {payment?.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Created</span>
                                        <span className="text-gray-800">{formatDate(collectionDetails.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Estimated Cost</span>
                                        <span className="text-gray-800 font-semibold">₹{collectionDetails.estimatedCost.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Address Details Card */}
                            <div className="bg-white rounded-lg shadow-md p-6 border">
                                {/* <h3 className="text-md font-semibold flex items-center mb-3 border-b pb-2">
                                <FaMapMarkerAlt className="text-green-800" />Address Information
                            </h3> */}
                                {/* <h3 className="text-md font-semibold mb-3 border-b pb-2 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-green-800" /> Pickup Address
                                </h3> */}

                                <div className="mb-3 border-b pb-2 flex items-center gap-2">
                                    <div className="p-2 bg-yellow-50 rounded-full">
                                        <FaMapMarkerAlt className="text-yellow-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        {/* <p className="text-sm text-gray-500">Current Location</p> */}
                                        <p className="text-md font-semibold text-gray-800">Pickup Address</p>
                                    </div>
                                </div>

                                {/* <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <FaUser className="text-gray-500 flex-shrink-0" />
                                    <div className="flex items-center justify-between w-full"> */}
                                {/* <span className="text-sm font-medium text-gray-600">Name:</span> */}
                                {/* <span className="text-gray-800">{collectionDetails.address.name}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaPhoneAlt className="text-gray-500 flex-shrink-0" />
                                    <div className="flex items-center justify-between w-full"> */}
                                {/* <span className="text-sm font-medium text-gray-600">Mobile:</span> */}
                                {/* <span className="text-gray-800">{collectionDetails.address.mobile}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-gray-500 flex-shrink-0 mt-1" />
                                    <div className="flex items-center justify-between w-full"> */}
                                {/* <span className="text-sm font-medium text-gray-600">Address:</span> */}
                                {/* <span className="text-gray-800 text-right">
                                        {collectionDetails.address.addressLine}, {collectionDetails.address.locality}, {collectionDetails.address.pinCode}
                                    </span>
                                </div>
                            </div> */}

                                <div className="space-y-2">
                                    <p className="text-gray-800 font-medium">{collectionDetails.address.name}</p>
                                    <p className="text-gray-800">
                                        {collectionDetails.address.addressLine}, {collectionDetails.address.locality}, {collectionDetails.address.pinCode}
                                    </p>
                                    <p className="text-gray-600">{collectionDetails.address.mobile}</p>
                                </div>
                            </div>

                            {/* Collector Card */}
                            {collector && (
                                <div className="bg-white rounded-lg shadow-md p-6 border ">

                                    <div className="flex items-center mb-3 border-b pb-2 gap-2">
                                        <div className="p-2 bg-blue-50 rounded-full">
                                            <FaUser className="text-blue-600 w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-md font-semibold text-gray-800">Collector Information</p>
                                        </div>
                                    </div>



                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                                            <FaUser className="text-2xl" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{collector.name}</p>
                                            <div className="flex items-center mt-1">
                                                <div className="flex">
                                                    {/* <svg key={i} className={`w-4 h-4 ${i < Math.floor(trackingData.collector.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg> */}
                                                </div>
                                                <span className="text-sm text-gray-600 ml-1">{collector.name}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-4">
                                        <button onClick={() => window.open(`tel:${collector.phone}`, '_blank')} className="w-full py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors flex items-center justify-center gap-2">
                                            <FaPhoneAlt /> Call Collector
                                        </button>
                                        <button onClick={() => navigate('/collection/track-collector')} className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
                                            <FaMapMarkedAlt /> Track Collector
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Items */}
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6 border col-span-2 ">
                                <h3 className="text-md font-semibold mb-4 border-b pb-2">Collection Items</h3>

                                {collectionDetails.items.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No items in this collection</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty(Bags) </th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {collectionDetails.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-3 text-sm text-gray-800">{item.categoryId?.name || `${item.categoryId}`}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-800 text-right">{item.qty}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-800 text-right">
                                                            ₹{item.rate?.toFixed(2) || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-800 text-right">
                                                            ₹{((item.rate || 0) * item.qty).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-gray-50">
                                                    <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-800 text-right">Total Estimated Cost</td>
                                                    <td className="px-4 py-3 text-sm font-bold text-gray-800 text-right">₹{collectionDetails.estimatedCost.toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Pickup Instructions - without card */}
                            <div className="mt-8">
                                <h3 className="text-sm sm:text-md md:text-lg font-semibold text-gray-900 mb-4">Pickup Instructions:</h3>
                                <ul className="text-sm sm:text-md md:text-md space-y-3 text-gray-800 list-disc pl-5">
                                    <li>
                                        Ensure that all {collectionDetails.type}s are ready for collection on the scheduled pickup day.
                                    </li>
                                    <li>
                                        If you need a GST invoice for billing, please add your GST number in the profile section. The pickup agent will generate the bill accordingly.
                                    </li>
                                    <li>
                                        Check the {collectionDetails.type} rates on the pickup day to verify the final payment amount.
                                    </li>
                                </ul>
                            </div>


                        </div>
                    </div>






                    {/* Cancel Collection Modal */}
                    <Modal
                        isOpen={showCancelModal}
                        onClose={() => setShowCancelModal(false)}
                        title="Cancel Collection"
                        description="Please select a reason for cancellation:"
                        confirmLabel="Confirm Cancellation"
                        confirmButtonClass="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors"
                        onConfirm={handleConfirmCancel}
                        isDisabled={!selectedReason && !customReason}
                    >
                        <div className="space-y-2">
                            {predefinedReasons.map((reason) => (
                                <div
                                    key={reason.id}
                                    onClick={() => {
                                        setSelectedReason(reason.reason);
                                        setIsCustomReason(reason.reason === 'Other');
                                        if (reason.reason !== 'Other') {
                                            setCustomReason('');
                                        }
                                    }}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className="text-xl text-red-800">
                                        {selectedReason === reason.reason && !isCustomReason ?
                                            <FaCheckCircle className="animate-scale-check" /> :
                                            <FaRegCircle />
                                        }
                                    </div>
                                    <span className={`text-sm font-medium ${selectedReason === reason.reason && !isCustomReason ?
                                        'text-red-800' :
                                        'text-gray-700'
                                        }`}>
                                        {reason.reason}
                                    </span>
                                </div>
                            ))}

                            {isCustomReason && (
                                <div className="mt-3 pl-8">
                                    <textarea
                                        value={customReason}
                                        onChange={(e) => setCustomReason(e.target.value)}
                                        placeholder="Please specify your reason..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800 focus:border-red-800"
                                        rows={3}
                                    />
                                </div>
                            )}
                        </div>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default CollectionDetails;

<style>
    {`
    @keyframes scaleCheck {
        0% { transform: scale(0.8); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    .animate-scale-check {
        animation: scaleCheck 0.2s ease-in-out;
    }
    `}
</style>












