import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaWallet, FaMoneyBillWave, FaCreditCard, FaArrowLeft, FaCheck } from 'react-icons/fa';

interface PaymentItem {
    categoryId: string;
    name: string;
    rate: number;
    qty: number;
}

interface PaymentData {
    items: PaymentItem[];
    proofs: File[];
    notes: string;
}

interface CollectionDetails {
    _id: string;
    collectionId: string;
    type: 'waste' | 'scrap';
    status: string;
    preferredDate: string;
    preferredTime: string;
    address: {
        name: string;
        mobile: string;
        pinCode: string;
        locality: string;
        addressLine: string;
    };
}

type PaymentMethod = 'wallet' | 'online' | 'cash';

const ReceivePayment: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { formData, collection } = location.state as {
        formData: PaymentData,
        collection: CollectionDetails
    };

    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('wallet');
    const [isProcessing, setIsProcessing] = useState(false);
    const [receiptGenerated, setReceiptGenerated] = useState(false);
    const [transactionId, setTransactionId] = useState('');

    // Calculate total amount
    const totalAmount = formData.items.reduce((total, item) => {
        return total + (item.rate * item.qty);
    }, 0);

    const handlePaymentMethodSelect = (method: PaymentMethod) => {
        setSelectedPayment(method);
    };

    const handleProcessPayment = async () => {
        setIsProcessing(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Generate a random transaction ID
            const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
            setTransactionId(`TXN${randomId}`);

            setIsProcessing(false);
            setReceiptGenerated(true);
            toast.success('Payment processed successfully!');
        } catch (error) {
            setIsProcessing(false);
            toast.error('Payment processing failed. Please try again.');
            console.error(error);
        }
    };

    const handleComplete = () => {
        toast.success('Collection completed successfully!');
        navigate('/collector/tasks');
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
                                <p className="text-gray-600 mt-1">Transaction ID: {transactionId}</p>
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
                                    onClick={handleComplete}
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
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Total Amount:</span>
                                        <span className="text-xl font-bold text-green-800">₹{totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div>
                                    <h2 className="text-lg font-medium mb-3">Select Payment Method</h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {/* Wallet Option */}
                                        <div
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPayment === 'wallet'
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-green-300'
                                                }`}
                                            onClick={() => handlePaymentMethodSelect('wallet')}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-green-100 p-2 rounded-full">
                                                    <FaWallet className="text-green-600 text-xl" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">Wallet</h3>
                                                    <p className="text-xs text-gray-500">Greenora Wallet</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">
                                                Quick and convenient
                                            </div>
                                        </div>

                                        {/* Online Payment */}
                                        <div
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPayment === 'online'
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-green-300'
                                                }`}
                                            onClick={() => handlePaymentMethodSelect('online')}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-green-100 p-2 rounded-full">
                                                    <FaCreditCard className="text-green-600 text-xl" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">Online</h3>
                                                    <p className="text-xs text-gray-500">Card/UPI/Net Banking</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">
                                                Secure digital payment
                                            </div>
                                        </div>

                                        {/* Cash Payment */}
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
                                                    <h3 className="font-medium">Cash</h3>
                                                    <p className="text-xs text-gray-500">Pay on Collection</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">
                                                Traditional payment method
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Details based on selected method */}
                                <div className="border-t pt-4">
                                    {selectedPayment === 'wallet' && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium mb-2">Wallet Payment</h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Customer will pay using their Greenora wallet balance.
                                            </p>
                                            <div className="flex items-center text-green-600">
                                                <FaWallet className="mr-2" />
                                                <span>Sufficient balance available</span>
                                            </div>
                                        </div>
                                    )}

                                    {selectedPayment === 'online' && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium mb-2">Online Payment</h3>
                                            <p className="text-sm text-gray-600">
                                                Generate a payment link for the customer to pay via card, UPI, or net banking.
                                            </p>
                                        </div>
                                    )}

                                    {selectedPayment === 'cash' && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium mb-2">Cash Payment</h3>
                                            <p className="text-sm text-gray-600">
                                                Collect ₹{totalAmount.toFixed(2)} in cash from the customer.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end items-center pt-4 space-x-4">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-400 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                                    >
                                        <div className="flex items-center">
                                            {/* <FaArrowLeft className="mr-2 text-sm" /> */}
                                            Back
                                        </div>
                                    </button>

                                    <button
                                        onClick={handleProcessPayment}
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
                                            'Process Payment'
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

export default ReceivePayment;
