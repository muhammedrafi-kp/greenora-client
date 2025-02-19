import React, { useState, useEffect } from 'react';
import { User, X, Check, ArrowLeft } from 'lucide-react';
import { getVerificationRequests, updateVerificationStatus } from "../../services/adminService";
import toast from 'react-hot-toast';
import Modal from '../common/Modal';

interface IVerificationRequest {
    _id: string;
    name: string;
    email: string;
    phone: string;
    serviceArea: string;
    district: string;
    gender: string;
    idProofType: string;
    profileUrl?: string;
    idProofFrontUrl?: string;
    idProofBackUrl?: string;
    verificationStatus: 'pending' | 'approved' | 'rejected';
}

const VerificationRequests: React.FC = () => {
    const [collectors, setCollectors] = useState<IVerificationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<IVerificationRequest | null>(null);
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await getVerificationRequests();
            if (response.success) {
                setCollectors(response.data);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to fetch verification requests');
            console.error('Error fetching requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = (request: IVerificationRequest, type: 'approve' | 'reject') => {
        setSelectedRequest(request);
        setActionType(type);
        setShowModal(true);
    };

    const confirmStatusUpdate = async () => {
        if (!selectedRequest?._id || !actionType) return;
        console.log("selectedRequest :", selectedRequest, actionType);
        try {
            setLoading(true);
            const response = await updateVerificationStatus(selectedRequest._id, actionType);

            if (response.success) {
                fetchRequests();
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('Failed to update verification status');
            console.error('Error updating status:', error);
        } finally {
            setLoading(false);
            setShowModal(false);
            setSelectedRequest(null);
            setActionType(null);
        }
    };

    const handleViewDetails = (request: IVerificationRequest) => {
        setSelectedRequest(request);
        setShowDetailsModal(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-6 py-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.location.href = '/admin/collectors'}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Collectors</span>
                        </button>
                    </div>
                </div>

                {collectors.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <p className="text-gray-500">No pending verification requests</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Collector
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Area
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID Proof
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {collectors.map((collector) => (
                                    <tr key={collector._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                    {collector.profileUrl ? (
                                                        <img
                                                            src={collector.profileUrl}
                                                            alt=""
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="h-6 w-6 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {collector.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {collector.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{collector.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{collector.serviceArea || 'N/A'}</div>
                                            <div className="text-sm text-gray-500">{collector.district || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{collector.idProofType}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(collector)}
                                                    className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md border border-blue-600 hover:bg-blue-50"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(collector, 'approve')}
                                                    className="text-green-600 hover:text-green-900 px-3 py-1 rounded-md border border-green-600 hover:bg-green-50"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(collector, 'reject')}
                                                    className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md border border-red-600 hover:bg-red-50"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showModal && selectedRequest && (
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={`Confirm ${actionType === 'approve' ? 'Approval' : 'Rejection'}`}
                    description={`Are you sure you want to ${actionType} ${selectedRequest.name}'s verification request?`}
                    confirmLabel={actionType === 'approve' ? 'Approve' : 'Reject'}
                    onConfirm={confirmStatusUpdate}
                    confirmButtonClass={`px-4 py-2 rounded-lg text-white ${actionType === 'approve'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-red-600 hover:bg-red-700'
                        } transition-colors`}
                />
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full mx-4 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-900">Verification Details</h3>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                                    <p className="text-gray-900">{selectedRequest.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-gray-900">{selectedRequest.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="text-gray-900">{selectedRequest.phone}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Service Area</p>
                                    <p className="text-gray-900">{selectedRequest.serviceArea || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">District</p>
                                    <p className="text-gray-900">{selectedRequest.district || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Gender</p>
                                    <p className="text-gray-900">{selectedRequest.gender || 'N/A'}</p>
                                </div>
                            </div>

                            {/* ID Proof Images */}
                            <div className="mt-6">
                                <h5 className="text-sm font-semibold text-gray-900 mb-4">
                                    ID Proof Documents ({selectedRequest.idProofType})
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedRequest.idProofFrontUrl && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-500">Front Side</p>
                                            <div className="border rounded-lg overflow-hidden">
                                                <img
                                                    src={selectedRequest.idProofFrontUrl}
                                                    alt="ID Front"
                                                    className="w-full h-48 object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {selectedRequest.idProofBackUrl && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-500">Back Side</p>
                                            <div className="border rounded-lg overflow-hidden">
                                                <img
                                                    src={selectedRequest.idProofBackUrl}
                                                    alt="ID Back"
                                                    className="w-full h-48 object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    handleStatusUpdate(selectedRequest, 'reject');
                                }}
                                className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    handleStatusUpdate(selectedRequest, 'approve');
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default VerificationRequests; 