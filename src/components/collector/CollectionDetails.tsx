import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Package, Clock, Phone, User, ArrowLeft, Truck, CreditCard } from 'lucide-react';
import { getDistrictAndServiceArea } from '../../services/locationService';

interface ICollection {
    _id: string;
    user: {
        userId: string;
        name: string;
        email: string;
        phone: string;
    };
    collectionId: string;
    type: 'waste' | 'scrap';
    serviceAreaId: string;
    districtId: string;
    status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
    payment: {
        paymentId: string;
        advanceAmount: number;
        advancePaymentStatus: string;
        amount: number;
        status: "pending" | "success" | "failed";
        paidAt: string;
    }
    createdAt: string;
    items: {
        categoryId: string;
        name: string;
        rate: number;
        qty: number;
    }[];
    instructions?: string;
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


const CollectionDetails: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const collection: ICollection = location.state?.collection;
    const [district, setDistrict] = useState<string>('');
    const [serviceArea, setServiceArea] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [districtResponse] = await Promise.all([
                    getDistrictAndServiceArea(collection.districtId, collection.serviceAreaId),
                ]);

                console.log("district and service area response:", districtResponse);
                if (districtResponse.success) {
                    setDistrict(districtResponse.district.name);
                    setServiceArea(districtResponse.serviceArea.name);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [collection.districtId, collection.serviceAreaId]);

    console.log("collection", collection);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (!collection) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Collection not found</p>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <main className="bg-gray-50  overflow-x-hidden overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                {/* Back Button - Make it sticky on mobile */}
                <div className="sticky top-0 z-10 bg-gray-50 -mx-4 px-4 py-2 sm:static sm:bg-transparent sm:px-0 sm:py-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Collections
                    </button>
                </div>

                <div className="mt-4 bg-white rounded-lg shadow-sm border">
                    {/* Header Section */}
                    <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                                    #{collection.collectionId.toUpperCase()}
                                </h1>
                                <p className="text-gray-600">
                                    {collection.type === 'waste' ? 'Waste Collection' : 'Scrap Collection'}
                                </p>
                            </div>
                            <span className={`self-start px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(collection.status)}`}>
                                {collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
                            </span>
                        </div>

                        {/* Customer Details Section */}
                        <div className="border-b pb-6 mb-6">
                            <h2 className="text-lg font-medium mb-4">Customer Details</h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <User className="w-5 h-5 flex-shrink-0" />
                                    <span className="break-words">{collection.address.name}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone className="w-5 h-5 flex-shrink-0" />
                                    <span className="break-words">{collection.address.mobile}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-5 h-5 flex-shrink-0" />
                                    <span className="break-words">
                                        {collection.address.addressLine}, {collection.address.locality}, {collection.address.pinCode}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Truck className="w-5 h-5 flex-shrink-0" />
                                    <span className="break-words">{serviceArea}, {district}</span>
                                </div>
                            </div>
                        </div>

                        {/* Collection Details Section */}
                        <div className="border-b pb-6 mb-6">
                            <h2 className="text-lg font-medium mb-4">Collection Details</h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Calendar className="w-5 h-5 flex-shrink-0" />
                                        <span>
                                            <div className="font-medium">Created Date</div>
                                            <div>{new Date(collection.createdAt).toLocaleDateString()}</div>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Calendar className="w-5 h-5 flex-shrink-0" />
                                        <span>
                                            <div className="font-medium">Scheduled Date</div>
                                            <div>{new Date(collection.preferredDate).toLocaleDateString()}</div>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Clock className="w-5 h-5 flex-shrink-0" />
                                        <span>
                                            <div className="font-medium">Preferred Time</div>
                                            <div>{collection.preferredTime}</div>
                                        </span>
                                    </div>

                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Package className="w-5 h-5 flex-shrink-0" />
                                        <span>
                                            <div className="font-medium">Total Items</div>
                                            <div>
                                                {collection.items.reduce((total, item) => total + item.qty, 0)}
                                                {collection.type === 'waste' ? ' bags' : ' kg'}
                                            </div>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <CreditCard className="w-5 h-5 flex-shrink-0" />
                                            {/* <span>
                                                <div className="font-medium">Payment Status</div>
                                                <div>{collection.payment.status.charAt(0).toUpperCase() + collection.payment.status.slice(1)}</div>
                                            </span> */}

                                        <span>
                                            <div className="font-medium">Payment Status</div>
                                            <div>{collection.payment?.status}</div>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items List Section */}
                        <div className="border-b pb-6 mb-6 overflow-x-auto">
                            <h2 className="text-lg font-medium mb-4">Items</h2>
                            <div className="min-w-[300px]">
                                {/* Table Header */}
                                <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-gray-50 rounded-t-lg font-medium text-gray-600">
                                    <div>Item</div>
                                    <div className="text-right">Rate</div>
                                    <div className="text-center">Quantity ({collection.type === 'waste' ? 'bags' : 'kg'})</div>
                                    <div className="text-right">Total</div>
                                </div>

                                {/* Table Body */}
                                <div className="divide-y">
                                    {collection.items.map((item, index) => (
                                        <div key={index} className="grid grid-cols-4 gap-4 px-4 py-3 items-center hover:bg-gray-50">
                                            <div className="font-medium text-gray-900">{item.name}</div>
                                            <div className="text-right">₹{item.rate}</div>
                                            <div className="text-center">{item.qty}</div>
                                            <div className="text-right font-medium text-gray-900">
                                                ₹{(item.rate * item.qty).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Total Row */}
                                <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-gray-50 rounded-b-lg font-medium">
                                    <div className="col-span-3 text-right">Total Amount:</div>
                                    <div className="text-right text-gray-900">
                                        ₹{collection.items.reduce((total, item) => total + (item.rate * item.qty), 0).toFixed(2)}
                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button onClick={() => navigate(-1)} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg">
                                Back
                            </button>
                            {collection.status === 'scheduled' && (
                                <Link to="/collector/add-collection-details" state={{ collection }}>
                                    <button className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-lg">
                                        Add Details
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CollectionDetails;
