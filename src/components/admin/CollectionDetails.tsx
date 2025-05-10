import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Phone } from 'lucide-react';
import { FaRegClipboard } from 'react-icons/fa';
import { getCollectorData, getAvailableCollectors } from '../../services/userService';
import { scheduleCollection, cancelCollection } from '../../services/collectionService';
import { getDistrictAndServiceArea } from '../../services/locationService';
import { toast } from 'react-hot-toast';
import ScheduleCollectionModal from './ScheduleCollectionModal';
import CancelCollectionModal from './CancelCollectionModal';
import { ApiResponse } from '../../types/common';
import { ICollector } from '../../types/user';

interface ICollection {
  _id: string;
  collectionId: string;
  collectorId: string;
  user: {
    userId: string;
    name: string;
    email: string;
    phone: string;
  };
  type: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  payment: {
    paymentId: string;
    advanceAmount: number;
    advancePaymentStatus: string;
    status: "pending" | "success" | "failed";
    amount: number;
    paidAt: string;
  }
  estimatedCost: string;
  createdAt: string;
  preferredDate: string;
  address: {
    name: string;
    mobile: string;
    pinCode: string;
    locality: string;
    addressLine: string;
  };
  districtId: string;
  serviceAreaId: string;
  items: {
    categoryId: {
      _id: string;
      name: string;
    };
    name: string;
    rate: number;
    qty: number;
  }[];
}


interface ICancellationReason {
  id: string;
  reason: string;
}


const CollectionDetailsPage: React.FC = () => {
  const [collector, setCollector] = useState<ICollector>({} as ICollector);
  const [district, setDistrict] = useState<string>('');
  const [serviceArea, setServiceArea] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [availableCollectors, setAvailableCollectors] = useState<ICollector[]>([]);
  const [selectedCollector, setSelectedCollector] = useState<string>('');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { collection } = location.state as { collection: ICollection } || {};

  console.log("collection:", collection);

  const cancellationReasons: ICancellationReason[] = [
    { id: '1', reason: 'Customer requested cancellation' },
    { id: '2', reason: 'No collector available' },
    { id: '3', reason: 'Invalid address' },
    { id: '4', reason: 'Customer not reachable' },
    { id: '5', reason: 'Other' }
  ];

  useEffect(() => {
    if (!collection) {
      toast.error('Collection details not found. Redirecting to collection history...');
      navigate('/admin/collections');
    }
  }, [collection, navigate]);

  // Early return if no collection data
  if (!collection) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  useEffect(() => {
    const fetchCollectorData = async () => {
      setLoading(true);
      try {
        if (!collection.collectorId) return;
        const res: ApiResponse<ICollector> = await getCollectorData("admin", collection.collectorId);
        console.log("collector response:", res);
        if (res.success) {
          setCollector(res.data);
        }
      } catch (error) {
        console.error("Error fetching collector data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollectorData();
  }, []);

  useEffect(() => {
    const fetchDistrictAndServiceArea = async () => {
      setLoading(true);
      try {
        const response = await getDistrictAndServiceArea(collection.districtId, collection.serviceAreaId);
        console.log("district and service area response:", response);
        if (response.success) {
          setDistrict(response.district.name);
          setServiceArea(response.serviceArea.name);
        }
      } catch (error) {
        console.error("Error fetching district and service area:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDistrictAndServiceArea();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDateSelect = async (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      try {
        setLoading(true);
        // Format the date as YYYY-MM-DD to avoid timezone issues
        const formattedDate = date.toISOString().split('T')[0];
        const res:ApiResponse<ICollector[]> = await getAvailableCollectors(collection.serviceAreaId, formattedDate);
        console.log("available collectors response:", res);
        if (res.success) {
          setAvailableCollectors(res.data);
        }
      } catch (error) {
        console.error("Error fetching available collectors:", error);
        toast.error('Failed to fetch available collectors');
      } finally {
        setLoading(false);
      }
    } else {
      setAvailableCollectors([]);
    }
  };

  const handleSchedule = async () => {
    try {
      setLoading(true);
      if (!selectedCollector || !selectedDate) {
        toast.error('Please select a collector and date');
        return;
      }

      const formattedDate = selectedDate.toISOString().split('T')[0];
      const res: ApiResponse<null> = await scheduleCollection(
        collection.collectionId,
        selectedCollector,
        collection.user.userId,
        formattedDate
      );
      console.log("schedule collection response:", res);
      if (res.success) {
        toast.success('Collection scheduled successfully');
        setShowScheduleModal(false);
        // navigate('/admin/collections');
        window.location.reload();
      } else {
        toast.error(res.message || 'Failed to schedule collection');
      }
    } catch (error) {
      console.error('Error scheduling collection:', error);
      toast.error('Failed to schedule collection');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedReason) {
      toast.error('Please select a cancellation reason');
      return;
    }

    try {
      setLoading(true);

      console.log("selected reason:",collection.collectionId,typeof selectedReason);
      const res: ApiResponse<null> = await cancelCollection(
        collection.collectionId,
        selectedReason
      );

      console.log("cancel collection response:", res);
      if (res.success) {
        toast.success('Collection cancelled successfully');
        setShowCancelModal(false);
        navigate('/admin/collections');
      } else {
        toast.error(res.message || 'Failed to cancel collection');
      }
    } catch (error) {
      console.error('Error cancelling collection:', error);
      toast.error('Failed to cancel collection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Collections</span>
        </button>

        {/* Request ID Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <h1 className="text-xl font-bold bg-blue-950 text-white px-4 py-2 rounded-lg shadow-md">
              Collection ID : #{collection.collectionId.toLocaleUpperCase()}
            </h1>
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(collection.status)} shadow-sm`}>
              {collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {collection.status === 'pending' && (
              <button
                onClick={() => setShowScheduleModal(true)}

                className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Schedule Collection
              </button>
            )}
            {(collection.status === 'pending' || collection.status === 'scheduled') && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Cancel Collection
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Collection Details Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b flex items-center gap-2">
              <FaRegClipboard className="w-5 h-5 text-blue-600" /> Collection Details
            </h2>
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Type</span>
                <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-md">{collection.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(collection.status)}`}>
                  {collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payment Status</span>
                <span className={`px-3 py-1 rounded-md text-xs font-medium bg-gray-100`}>
                  {collection.payment?.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Created Date</span>
                <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-md">{formatDate(collection.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Preferred Date</span>
                <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-md">{formatDate(collection.preferredDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estimated Cost</span>
                <span className="text-sm font-medium bg-green-100 text-green-800 px-3 py-1 rounded-md">₹{collection.estimatedCost}</span>
              </div>
            </div>
          </div>

          {/* User Details Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> User Information
            </h2>
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Name</span>
                <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-md">{collection.user.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Email</span>
                <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-md">{collection.user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Phone</span>
                <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-md">{collection.user.phone}</span>
              </div>
            </div>
          </div>

          {/* Address Details Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" /> Pickup Address
            </h2>
            <div className="space-y-5">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">{collection.address.name}</p>
                <p className="text-sm text-gray-600">
                  {collection.address.addressLine}, {collection.address.locality}, {collection.address.pinCode}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <Phone className="w-4 h-4 text-blue-600" />
                {collection.address.mobile}
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="text-sm text-gray-600">District</span>
                <span className="text-sm font-medium">{district}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="text-sm text-gray-600">Service Area</span>
                <span className="text-sm font-medium">{serviceArea}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items and Collector Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Collector Details Card - Show only if scheduled */}
          {(collection.status === 'scheduled' || collection.status === 'completed') && (
            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow duration-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" /> Collector Information
              </h2>
              <div className="space-y-5">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm text-gray-600">Name</span>
                  <span className="text-sm font-medium">{collector?.name || 'Not assigned'}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm text-gray-600">Current Tasks</span>
                  <span className="text-sm font-medium">{collector?.taskCount || '0'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Items Table - Adjust colspan based on status */}
          <div className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow duration-200 ${collection.status === 'scheduled' || collection.status === 'completed' ? 'md:col-span-2' : 'md:col-span-3'}`}>
            <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b">Collection Items</h2>

            {collection.items.length === 0 ? (
              <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">No items in this collection</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty(Bags)</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {collection.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm text-gray-800">{`${item.name}`||`${item.categoryId}`}</td>
                        <td className="px-6 py-4 text-sm text-gray-800 text-right">{item.qty}</td>
                        <td className="px-6 py-4 text-sm text-gray-800 text-right">
                          ₹{item.rate?.toFixed(2) || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 text-right">
                          ₹{((item.rate || 0) * item.qty).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-6 py-4 text-sm font-semibold text-gray-800 text-right">Total Estimated Cost</td>
                      <td className="px-6 py-4 text-sm font-bold text-green-800 text-right">₹{collection.estimatedCost}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <ScheduleCollectionModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        district={district}
        serviceArea={serviceArea}
        availableCollectors={availableCollectors}
        selectedCollector={selectedCollector}
        onCollectorSelect={setSelectedCollector}
        onSchedule={handleSchedule}
        loading={loading}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        originalPreferredDate={collection.preferredDate}
      />

      <CancelCollectionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        selectedReason={selectedReason}
        onReasonSelect={setSelectedReason}
        onCancel={handleCancel}
        loading={loading}
      />
    </main>
  );
};

export default CollectionDetailsPage; 