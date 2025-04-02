import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Phone } from 'lucide-react';
import { FaRegClipboard } from 'react-icons/fa';
import { getCollectorData, getPaymentData, getDistrictAndServiceArea } from '../../services/adminService';


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
  paymentId: string;
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

interface ICollector {
  _id: string;
  collectorId: string;
  name: string;
  email: string;
  phone: string;
  profileUrl: string;
}

interface Payment {
  paymentId: string;
  advanceAmount: number;
  advancePaymentStatus: string;
  status: "pending" | "success" | "failed";
  paymentDate: string;
}

const CollectionDetailsPage: React.FC = () => {
  const [collector, setCollector] = useState<ICollector>({} as ICollector);
  const [payment, setPayment] = useState<Payment>({} as Payment);
  const [district, setDistrict] = useState<string>('');
  const [serviceArea, setServiceArea] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { collection } = location.state as { collection: ICollection };

  console.log(collection);

  useEffect(() => {
    const fetchCollectorData = async () => {
      setLoading(true);
      try {
        if (!collection.collectorId) return;
        const response = await getCollectorData(collection.collectorId);
        console.log("collector response:", response);
        if (response.success) {
          setCollector(response.data);
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
    const fetchPaymentData = async () => {
      setLoading(true);
      try {
        const response = await getPaymentData(collection.paymentId);
        console.log("payment response:", response);
        if (response.success) {
          setPayment(response.data);
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentData();
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

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Collections</span>
        </button>

        {/* Request ID Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold bg-blue-950 text-white px-3 py-1 rounded-md">
            Collection ID : #{collection.collectionId.toLocaleUpperCase()}
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(collection.status)}`}>
            {collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Collection Details Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
              <FaRegClipboard className="w-5 h-5" /> Collection Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <span className="text-sm font-medium">{collection.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(collection.status)}`}>
                  {collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Payment Status</span>
                {/* <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.paymentStatus)}`}>
                  {collection.paymentStatus.charAt(0).toUpperCase() + collection.paymentStatus.slice(1)}
                </span> */}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                  {payment.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Created Date</span>
                <span className="text-sm font-medium">{formatDate(collection.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Preferred Date</span>
                <span className="text-sm font-medium">{formatDate(collection.preferredDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Estimated Cost</span>
                <span className="text-sm font-medium">₹{collection.estimatedCost}</span>
              </div>
            </div>
          </div>

          {/* User Details Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
              <User className="w-5 h-5" /> User Information
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Name</span>
                <span className="text-sm font-medium">{collection.user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email</span>
                <span className="text-sm font-medium">{collection.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Phone</span>
                <span className="text-sm font-medium">{collection.user.phone}</span>
              </div>
            </div>
          </div>

          {/* Address Details Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Pickup Address
            </h2>
            <div className="space-y-4">
              <p className="text-sm font-medium">{collection.address.name}</p>
              <p className="text-sm text-gray-600">
                {collection.address.addressLine}, {collection.address.locality}, {collection.address.pinCode}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {collection.address.mobile}
              </div>
              <div className="flex justify-start">
                <span className="text-sm text-gray-600">District : </span>
                <span className="text-sm font-medium text-gray-600">{district}</span>
              </div>
              <div className="flex justify-start">
                <span className="text-sm text-gray-600">Service Area : </span>
                <span className="text-sm font-medium text-gray-600">{serviceArea}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items and Collector Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Collector Details Card - Show only if scheduled */}
          {collection.status === 'scheduled' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
                <User className="w-5 h-5" /> Collector Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Name</span>
                  <span className="text-sm font-medium">{collector?.name || 'Not assigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm font-medium">{collector?.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phone</span>
                  <span className="text-sm font-medium">{collector?.phone || 'N/A'}</span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Service Area</span>
                  <span className="text-sm font-medium">{request.collector?.serviceArea || 'N/A'}</span>
                </div> */}
                {/* <div className="flex justify-between">
                  <span className="text-sm text-gray-600">District</span>
                  <span className="text-sm font-medium">{request.collector?.district || 'N/A'}</span>
                </div>
                {request.collector?.vehicleNumber && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vehicle Number</span>
                    <span className="text-sm font-medium">{request.collector.vehicleNumber}</span>
                  </div>
                )} */}
              </div>
              {/* <div className="mt-4">
                <button className="w-full py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> Call Collector
                </button>
              </div> */}
            </div>
          )}

          {/* Items Table - Adjust colspan based on status */}
          <div className={`bg-white rounded-lg shadow-sm border p-6 ${collection.status === 'scheduled' ? 'md:col-span-2' : 'md:col-span-3'}`}>
            <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Collection Items</h2>

            {collection.items.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No items in this collection</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty(Bags)</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {collection.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-800">{item.categoryId?.name || `${item.name}`}</td>
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
                      <td className="px-4 py-3 text-sm font-bold text-gray-800 text-right">₹{collection.estimatedCost}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CollectionDetailsPage; 