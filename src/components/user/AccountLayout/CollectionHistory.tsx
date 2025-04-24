import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaClock, FaEye } from 'react-icons/fa';
import { getCollectionHistory } from '../../../services/userService';
import { getPaymentData, getWalletData } from '../../../services/paymentService';
import { useNavigate } from 'react-router-dom';
import { Wallet, CreditCard, Lock } from 'lucide-react';
import { useRazorpay, RazorpayOrderOptions } from 'react-razorpay';


interface Category {
  _id: string;
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
  isPaymentRequested: boolean;
  items: CollectionItem[];
  estimatedCost: number;
  address: Address;
  createdAt: string;
  preferredDate: string;
}


const CollectionHistory: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'online' | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [onlinePaymentLoading, setOnlinePaymentLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  const navigate = useNavigate();

  const { Razorpay } = useRazorpay();

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
        return { icon: <FaCheckCircle />, color: 'bg-blue-100 text-blue-600' };
      case 'cancelled':
        return { icon: <FaTimesCircle />, color: 'bg-red-100 text-red-600' };
      case 'pending':
        return { icon: <FaClock />, color: 'bg-yellow-100 text-yellow-600' };
    }
  };

  const handleViewDetails = (pickup: Collection) => {
    navigate('/collection/details', {
      state: { collectionDetails: pickup }
    });
  };

  const handlePayClick = async (collection: Collection) => {
    setSelectedCollection(collection);
    try {
      const response = await getWalletData();
      if (response.success) {
        setWalletBalance(response.data.balance);
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  const handleOnlinePaymentSelect = () => {
    setSelectedMethod('online');
  };

  const handlePaymentClick = async () => {
    if (!selectedCollection || !selectedMethod) return;

    setPaymentLoading(true);
    try {
      if (selectedMethod === 'online') {
        const response = await getPaymentData(selectedCollection.paymentId);
        console.log("Payment data response:", response);

        if (!response.success || !response.data?.orderId) {
          throw new Error('Failed to create Razorpay order');
        }

        const amount = Math.round(selectedCollection.estimatedCost * 100);
        console.log("Payment amount:", amount);

        const options: RazorpayOrderOptions = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: amount,
          currency: "INR" as any,
          name: "Greenora",
          description: "Payment for Collection",
          order_id: response.data.orderId,
          handler: async (response: any) => {
            console.log("Payment successful:", response);
            setShowPaymentModal(false);
            setSelectedMethod(null);
            setSelectedCollection(null);
            fetchPickupHistory();
          },
          prefill: {
            name: "Customer Name",
            email: "customer@example.com",
            contact: "9999999999"
          },
          theme: {
            color: "#10B981"
          },
          modal: {
            ondismiss: () => {
              console.log("Payment modal dismissed");
              setPaymentLoading(false);
            }
          }
        };

        console.log("Razorpay options:", options);
        const razorpay = new Razorpay(options);
        razorpay.open();
      } else {
        // Handle wallet payment
        setShowPaymentModal(false);
        setSelectedMethod(null);
        setSelectedCollection(null);
        fetchPickupHistory();
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setPaymentLoading(false);
    }
  };

  const PaymentModal = () => {
    if (!showPaymentModal || !selectedCollection) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-lg mx-4">
          <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Payment Details
              </h3>
              <div className="flex items-center text-sm text-gray-600">
                <Lock className="w-4 h-4 mr-1" />
                Secure Payment
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-700">Amount to Pay</p>
                <p className="text-lg font-semibold text-gray-900">
                  ₹{selectedCollection.estimatedCost - 50}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">Select Payment Method</p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('wallet')}
                  className={`flex items-center justify-between p-4 border rounded-lg transition-all
                    ${selectedMethod === 'wallet'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-gray-600" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800">Pay with Wallet</p>
                      <p className="text-xs text-gray-500">Balance: ₹{walletBalance}</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'wallet' ? 'border-green-500' : 'border-gray-300'}`}>
                    {selectedMethod === 'wallet' && (
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleOnlinePaymentSelect}
                  disabled={onlinePaymentLoading}
                  className={`flex items-center justify-between p-4 border rounded-lg transition-all
                    ${selectedMethod === 'online'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-200'}
                    ${onlinePaymentLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800">Online Payment</p>
                      <p className="text-xs text-gray-500">UPI, Card, Net Banking</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {onlinePaymentLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
                    ) : (
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'online' ? 'border-green-500' : 'border-gray-300'}`}>
                        {selectedMethod === 'online' && (
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        )}
                      </div>
                    )}
                  </div>
                </button>
              </div>

              {selectedMethod === 'wallet' && walletBalance < selectedCollection.estimatedCost && (
                <p className="text-sm font-medium text-red-500">
                  Insufficient wallet balance.
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedMethod(null);
                }}
                className="w-1/2 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePaymentClick}
                disabled={paymentLoading || !selectedMethod || (selectedMethod === 'wallet' && walletBalance < selectedCollection.estimatedCost)}
                className={`${paymentLoading ? 'w-full' : 'w-1/2'} bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg text-sm font-medium
                  ${paymentLoading || !selectedMethod || (selectedMethod === 'wallet' && walletBalance < selectedCollection.estimatedCost)
                    ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {paymentLoading ? 'Processing...' : `Pay with ${selectedMethod === 'wallet' ? 'Wallet' : 'Online'}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
          No collection history available.
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
                        <span className="text-xs text-gray-600">
                          {collection.status === 'pending' ? 'Preferred Date:' : 'Scheduled Date:'}
                        </span>
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
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleViewDetails(collection)}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <FaEye /> View Details
                      </button>
                      {collection.isPaymentRequested && (
                        <button
                          onClick={() => handlePayClick(collection)}
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          Pay
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <PaymentModal />
    </div>
  );
};

export default CollectionHistory;