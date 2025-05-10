import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaMoneyBillWave, FaCreditCard, FaCheck } from 'react-icons/fa';
import { completeCollection } from '../../services/collectionService';
import { sendPaymentRequest } from '../../services/collectionService';
import { ApiResponse } from '../../types/common';
import { ICollection, IItem } from '../../types/collection';


interface IFormData {
    items: IItem[];
    proofs: string[];
    notes: string;
}

// interface ICollection {
//     _id: string;
//     collectionId: string;
//     paymentId: string;
//     type: 'waste' | 'scrap';
//     items: IItem[];
//     status: string;
//     preferredDate: string;
//     preferredTime: string;
//     address: {
//         name: string;
//         mobile: string;
//         pinCode: string;
//         locality: string;
//         addressLine: string;
//     };
//     proofs: string[];
//     notes?: string;
//     payment?: {
//         advanceAmount: number;
//     };
// }


const CollectionPayment: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getStateData = () => {
        if (location.state) {
            const { formData, collection } = location.state as {
                formData: IFormData,
                collection: ICollection
            };

            console.log("formData", formData);
            console.log("collection", collection);


            return { formData, collection };
        } else {
            navigate('/collector/tasks');
        }
    };

    const stateData = getStateData();

    // If no data and redirect happened, return null
    if (!stateData) return null;

    const { formData, collection } = stateData;



    const [selectedPayment, setSelectedPayment] = useState<'digital' | 'cash'>('digital');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const [receiptGenerated, setReceiptGenerated] = useState(false);

    // Calculate total amount
    const totalAmount = formData.items.reduce((total, item) => {
        return total + (item.rate * item.qty);
    }, 0);

    // Get advance amount from collection payment
    const advanceAmount = collection.payment?.advanceAmount || 50;

    // Calculate remaining amount based on collection type
    const remainingAmount = collection.type === 'scrap'
        ? totalAmount + advanceAmount
        : totalAmount - advanceAmount;

    const handlePaymentMethodSelect = (method: 'digital' | 'cash') => {
        setSelectedPayment(method);
    };

    const handleSendPaymentRequest = async () => {
        setIsSendingRequest(true);
        try {
            const collectionData = {
                collectionId: collection.collectionId,
                items: formData.items,
                notes: formData.notes,
                paymentId: collection.payment?.paymentId,
            } as Partial<ICollection>;

            const formDataToSend = new FormData();

            formDataToSend.append('collectionData', JSON.stringify(collectionData));

            formData.proofs.forEach((proof) => {
                formDataToSend.append('collectionProofs', proof);
            });

            const res: ApiResponse<null> = await sendPaymentRequest(formDataToSend);

            console.log("response", res);

            toast.success('Payment request sent');
        } catch (error) {
            console.error("Error sending payment request:", error);
            toast.error('Failed to send payment request');
        } finally {
            setIsSendingRequest(false);
        }
    };

    const handleCompleteCollection = async () => {
        setIsProcessing(true);
        try {

            const finalCollectionData = {
                items: formData.items,
                notes: formData.notes,
            } as Partial<ICollection>;

            const formDataToSend = new FormData();
            // Add collection data  
            formDataToSend.append('paymentMethod', selectedPayment);
            formDataToSend.append('collectionData', JSON.stringify(finalCollectionData));

            formData.proofs.forEach((proof) => {
                formDataToSend.append('collectionProofs', proof);
            });

            console.log("formDataToSend", formDataToSend)

            const res: ApiResponse<null> = await completeCollection(
                collection.collectionId,
                formDataToSend
            );

            console.log("response :", res);

            if (res.success) {
                toast.success('Collection completed');
                navigate('/collector/tasks');
            }
        } catch (error: any) {
            console.error("Error completing collection:", error);
            if (error.response?.status === 404) {
                toast.error('Something went wrong');
            } else if (error.response?.status === 400) {
                toast.error('Payment is not completed yet');
            } else {
                toast.error('Failed to complete collection');
            }
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <div className="bg-gray-50 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
            {/* <div className="max-w-3xl mx-auto"> */}
            <div className="mx-auto">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {receiptGenerated ? (
                        // Receipt View
                        <div className="p-6 space-y-6">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <FaCheck className="text-green-600 text-2xl" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
                                <p className="text-gray-600 mt-1">Transaction ID: { }</p>
                            </div>

                            <div className="border-t border-b py-4 my-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="font-medium capitalize">{selectedPayment}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Amount Paid:</span>
                                    <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date & Time:</span>
                                    <span className="font-medium">{new Date().toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-gray-600 mb-4">Thank you for using Greenora!</p>
                                <button
                                    onClick={handleCompleteCollection}
                                    className="px-6 py-2 bg-green-800 hover:bg-green-900 text-white rounded-lg transition-colors"
                                >
                                    Complete Collection
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Payment Selection View
                        <>
                            <div className="p-4 sm:p-6 border-b">
                                <h1 className="text-xl font-bold text-gray-800">Receive Payment</h1>
                                <p className="text-gray-600 mt-1">Collection ID: {collection.collectionId.toUpperCase()}</p>
                            </div>

                            <div className="p-4 sm:p-6 space-y-6">
                                {/* Amount Summary */}
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Total Amount:</span>
                                        <span className="text-lg font-semibold text-green-800">₹{totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Advance Paid:</span>
                                        <span className={`${collection.type === 'scrap' ? 'text-green-600' : 'text-red-600'}`}>
                                            {collection.type === 'scrap' ? '+' : '-'} ₹{advanceAmount.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="pt-2 border-t flex justify-between items-center">
                                        <span className="text-gray-700 font-medium">
                                            {collection.type === 'scrap' ? 'Final Amount:' : 'Remaining Amount:'}
                                        </span>
                                        <span className='text-green-600'>
                                            <span className="text-lg font-semibold text-green-800">₹{remainingAmount.toFixed(2)}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div>
                                    <h2 className="text-lg font-medium mb-3">
                                        {collection.type === 'scrap' ? '' : 'Select Payment Method'}
                                    </h2>

                                    {collection.type === 'scrap' ? (
                                        // Cash Payment Option for Scrap
                                        <div className="border rounded-lg p-4 border-green-500 bg-green-50">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-green-100 p-2 rounded-full">
                                                    <FaMoneyBillWave className="text-green-600 text-xl" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">Pay in Hand</h3>
                                                    <p className="text-xs text-gray-500">Pay cash to customer</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">
                                                Pay ₹{remainingAmount.toFixed(2)} in cash to the customer.
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {/* Digital Payment Option (Wallet/Online) */}
                                            <div
                                                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPayment === 'digital'
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-green-300'
                                                    }`}
                                                onClick={() => handlePaymentMethodSelect('digital')}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-green-100 p-2 rounded-full">
                                                        <FaCreditCard className="text-green-600 text-xl" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium">Digital Payment</h3>
                                                        <p className="text-xs text-gray-500">Wallet or Online Payment</p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-xs text-gray-500">
                                                    Customer can pay using wallet or online methods
                                                </div>
                                            </div>

                                            {/* Cash Payment Option */}
                                            <div
                                                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPayment === 'cash'
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-green-300'
                                                    }`}
                                                onClick={() => handlePaymentMethodSelect('cash')}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-green-100 p-2 rounded-full">
                                                        <FaMoneyBillWave className="text-green-600 text-xl" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium">Pay in Hand</h3>
                                                        <p className="text-xs text-gray-500">Collect cash from customer</p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-xs text-gray-500">
                                                    Collect ₹{remainingAmount.toFixed(2)} in cash from the customer.
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Payment Details based on selected method */}
                                <div className="border-t pt-4">
                                    {collection.type === 'scrap' ? (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium mb-2">Cash Payment</h3>
                                            <p className="text-sm text-gray-600">
                                                Pay ₹{remainingAmount.toFixed(2)} in cash to the customer.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            {selectedPayment === 'digital' && (
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h3 className="font-medium mb-2">Digital Payment</h3>
                                                    <p className="text-sm text-gray-600 mb-4">
                                                        Customer will pay ₹{remainingAmount.toFixed(2)} using wallet or online payment.
                                                    </p>
                                                    <button
                                                        onClick={handleSendPaymentRequest}
                                                        disabled={isSendingRequest}
                                                        className={`w-1/3 mb-4 px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg transition-colors flex items-center justify-center ${isSendingRequest ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                    >
                                                        {isSendingRequest ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Sending Request...
                                                            </>
                                                        ) : (
                                                            'Send Payment Request'
                                                        )}
                                                    </button>
                                                </div>
                                            )}

                                            {selectedPayment === 'cash' && (
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h3 className="font-medium mb-2">Cash Payment</h3>
                                                    <p className="text-sm text-gray-600">
                                                        Collect ₹{remainingAmount.toFixed(2)} in cash from the customer.
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end items-center pt-4 space-x-4">
                                    <button
                                        onClick={() => navigate(-2)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-400 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                                    >
                                        Back
                                    </button>

                                    <button
                                        onClick={handleCompleteCollection}
                                        disabled={isProcessing}
                                        className={`px-6 py-2 bg-green-800 hover:bg-green-900 text-white rounded-lg transition-colors flex items-center ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            'Complete Collection'
                                        )}
                                    </button>

                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectionPayment;
