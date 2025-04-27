import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaClock, FaEye } from 'react-icons/fa';
import { getCollectionHistory } from '../../../services/collectionService';
import { getPaymentData, getWalletData, verifyPayment } from '../../../services/paymentService';
import { useNavigate } from 'react-router-dom';
import { Wallet, CreditCard, Lock } from 'lucide-react';
import { useRazorpay, RazorpayOrderOptions } from 'react-razorpay';
import toast from 'react-hot-toast';


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
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'online' | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [onlinePaymentLoading, setOnlinePaymentLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showWaste, setShowWaste] = useState<boolean | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const navigate = useNavigate();

  const { Razorpay } = useRazorpay();

  const isAnyFilterActive = () => {
    return startDate !== '' || endDate !== '' || selectedStatus !== 'all' || showWaste !== null;
  };

  const fetchPickupHistory = async (pageNum: number = 1, isNewFilter: boolean = false) => {
    if (isNewFilter) {
      setPage(1);
      setCollections([]);
      setHasMore(true);
    }

    const loadingState = isNewFilter ? setLoading : setIsLoadingMore;
    loadingState(true);

    try {
      const filters = {
        startDate,
        endDate,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        type: showWaste !== null ? (showWaste ? 'waste' : 'scrap') : undefined,
        page: pageNum,
        limit: 10
      };

      const response = await getCollectionHistory(filters);
      console.log("collections:", response.data);

      if (response.success) {
        if (isNewFilter) {
          setCollections(response.data);
        } else {
          const existingIds = new Set(collections.map(c => c._id));
          const newCollections = response.data.filter(
            (collection: Collection) => !existingIds.has(collection._id)
          );
          setCollections(prev => [...prev, ...newCollections]);
        }
        setHasMore(response.data.length > 0);
      }
    } catch (error) {
      console.error('Error fetching collection histories:', error);
    } finally {
      loadingState(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !isLoadingMore && hasMore) {
      setPage(prevPage => {
        if (prevPage === page) {
          return prevPage + 1;
        }
        return prevPage;
      });
    }
  };

  useEffect(() => {
    if (page > 1 && !isLoadingMore) {
      fetchPickupHistory(page);
    }
  }, [page]);

  useEffect(() => {
    fetchPickupHistory(1, true);
  }, [startDate, endDate, selectedStatus, showWaste]);

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

            try {
              const verificationResponse = await verifyPayment({
                paymentId: selectedCollection.paymentId,
                collectionId: selectedCollection.collectionId,
                razorpayResponse: response,
              });

              if (verificationResponse.success) {
                toast.success('Payment completed.');
              } else {
                toast.error('Payment failed.');
              }
            } catch (error) {
              console.error('Error verifying payment:', error);
              toast.error('Error verifying payment. Please try again or contact support.');
            }

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

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedStatus('all');
    setShowWaste(null);
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
    return <div className="text-center text-gray-500 py-8">Loading collection history...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="lg:text-lg xs:text-base text-sm font-semibold flex items-center gap-2">
            Collection History
          </h2>
          {/* Filter Icon for Small Screens */}
          <button
            onClick={() => setShowFilterModal(true)}
            className="sm:hidden p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
        
        {/* Desktop Filters */}
        <div className="hidden sm:flex flex-wrap items-center gap-4 mt-4">
         
          {/* Status Filter Buttons */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'completed', label: 'Completed' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'cancelled', label: 'Cancelled' }
            ].map((status) => (
              <button 
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`px-4 py-2 rounded-lg text-xs transition-colors ${
                  selectedStatus === status.value 
                    ? 'bg-green-800 text-white font-medium' 
                    : 'bg-gray-200 hover:bg-gray-300 font-medium'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

           {/* Type Selector */}
           <div className="flex flex-col gap-1 relative">
            <div className="relative">
              <select
                value={showWaste === null ? 'all' : (showWaste ? 'waste' : 'scrap')}
                onChange={(e) => setShowWaste(e.target.value === 'all' ? null : e.target.value === 'waste')}
                className="px-3 pr-8 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500 w-full appearance-none bg-white"
              >
                <option value="all">All </option>
                <option value="waste">Waste</option>
                <option value="scrap">Scrap</option>
              </select>
              <span className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-600 font-medium">
                Type
              </span>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          

          {/* Date Filter Section */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 relative">
              <div className="relative">
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    const newStartDate = e.target.value;
                    if (endDate && newStartDate > endDate) {
                      toast.error('Start date cannot be greater than end date');
                      return;
                    }
                    setStartDate(newStartDate);
                  }}
                  max={endDate || undefined}
                  className={`px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500 w-full ${
                    !startDate ? 'text-gray-500' : 'text-gray-900'
                  }`}
                />
                <span className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-600 font-medium">
                  {startDate ? (
                    <span className="line-through opacity-50">From</span>
                  ) : (
                    "From"
                  )}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 relative">
              <div className="relative">
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    const newEndDate = e.target.value;
                    if (startDate && newEndDate < startDate) {
                      toast.error('End date cannot be less than start date');
                      return;
                    }
                    setEndDate(newEndDate);
                  }}
                  min={startDate || undefined}
                  className={`px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500 w-full ${
                    !endDate ? 'text-gray-500' : 'text-gray-900'
                  }`}
                />
                <span className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-600 font-medium">
                  {endDate ? (
                    <span className="line-through opacity-50">To</span>
                  ) : (
                    "To"
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Clear Filter Button - Only show when filters are active */}
          {isAnyFilterActive() && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-gray-200 hover:bg-gray-300 transition-colors flex items-center gap-1"
            >
              Clear Filters
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}


        </div>

        {/* Filter Modal for Small Screens */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:hidden">
            <div className="bg-white rounded-xl w-full max-w-md mx-4">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Type Selector */}
                <div className="flex flex-col gap-1 relative">
                  <div className="relative">
                    <select
                      value={showWaste === null ? 'all' : (showWaste ? 'waste' : 'scrap')}
                      onChange={(e) => setShowWaste(e.target.value === 'all' ? null : e.target.value === 'waste')}
                      className="px-3 pr-8 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500 w-full appearance-none bg-white"
                    >
                      <option value="all">All </option>
                      <option value="waste">Waste</option>
                      <option value="scrap">Scrap</option>
                    </select>
                    <span className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-600 font-medium">
                      Type
                    </span>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Status Filter Buttons */}
                <div className="space-y-2">
                  <div className="flex flex-col gap-1 relative">
                    <div className="relative">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3 pr-8 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500 w-full appearance-none bg-white"
                      >
                        <option value="all">All </option>
                        <option value="completed">Completed</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <span className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-600 font-medium">
                        Status
                      </span>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date Filter Section */}
                <div className="space-y-4">
                  <p className="text-xs font-medium text-gray-600">Date Range</p>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1 relative">
                      <div className="relative">
                        <input
                          id="modalStartDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            const newStartDate = e.target.value;
                            if (endDate && newStartDate > endDate) {
                              toast.error('Start date cannot be greater than end date');
                              return;
                            }
                            setStartDate(newStartDate);
                          }}
                          max={endDate || undefined}
                          className={`px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500 w-full ${
                            !startDate ? 'text-gray-500' : 'text-gray-900'
                          }`}
                        />
                        <span className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-600 font-medium">
                          From
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 relative">
                      <div className="relative">
                        <input
                          id="modalEndDate"
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            const newEndDate = e.target.value;
                            if (startDate && newEndDate < startDate) {
                              toast.error('End date cannot be less than start date');
                              return;
                            }
                            setEndDate(newEndDate);
                          }}
                          min={startDate || undefined}
                          className={`px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500 w-full ${
                            !endDate ? 'text-gray-500' : 'text-gray-900'
                          }`}
                        />
                        <span className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-600 font-medium">
                          To
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {isAnyFilterActive() && (
                    <button
                      onClick={() => {
                        handleClearFilters();
                        setShowFilterModal(false);
                      }}
                      className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                    >
                      Clear Filters
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="w-full bg-green-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading collection history...</div>
      ) : collections.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No collection history available.
        </div>
      ) : (
        <div 
          onScroll={handleScroll}
          className="space-y-4 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2"
        >
          {collections.map((collection) => {
            const { icon, color } = getStatusIconAndColor(collection.status);
            return (
              <div
                key={collection._id}
                className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
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
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
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
          {isLoadingMore && (
            <div className="text-center py-4">
              <div className="border-b-2 border-green-700 h-6 rounded-full w-6 animate-spin inline-block"></div>
            </div>
          )}
        </div>
      )}
      <PaymentModal />
    </div>
  );
};

export default CollectionHistory;