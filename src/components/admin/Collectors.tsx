import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Download, X, ChevronLeft, ChevronRight, User } from 'lucide-react';
import Modal from '../common/Modal';
import { getCollectors, updateCollectorStatus } from "../../services/adminService";
import toast from 'react-hot-toast';

interface ICollector {
    _id: string;
    name: string;
    email: string;
    phone: string;
    serviceArea: string;
    district: string;
    gender: string;
    verificationStatus: string;
    isVerified: boolean;
    isBlocked: boolean;
    profileUrl?: string;
    idProofFrontUrl?: string;
    idProofBackUrl?: string;
}

const Collectors: React.FC = () => {
    const [collectors, setCollectors] = useState<ICollector[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedVerification, setSelectedVerification] = useState('all');
    const [showExportMessage, setShowExportMessage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedCollector, setSelectedCollector] = useState<ICollector | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedCollectorDetails, setSelectedCollectorDetails] = useState<ICollector | null>(null);

    const collectorsPerPage = 10;

    useEffect(() => {
        fetchCollectors();
    }, []);

    const fetchCollectors = async () => {
        try {
            setLoading(true);
            const response = await getCollectors();
            console.log("response :", response);
            if(response.success) {
                setCollectors(response.data);
                setError(null);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to fetch collectors. Please try again later.');
            console.error('Error fetching collectors:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (collector: ICollector) => {
        if (!collector?._id || !collector?.name) {
            toast.error('Invalid collector data');
            return;
        }
        setSelectedCollector(collector);
        setShowModal(true);
    };

    const confirmStatusChange = async () => {
        if (!selectedCollector?._id) {
            toast.error('Invalid collector selected');
            setShowModal(false);
            return;
        }

        try {
            setLoading(true);
            const response = await updateCollectorStatus(selectedCollector._id);

            if (response.success) {
                setCollectors(prevCollectors =>
                    prevCollectors.map(collector =>
                        collector._id === selectedCollector._id
                            ? { ...collector, isBlocked: !collector.isBlocked }
                            : collector
                    )
                );
                toast.success(response.message);
            } else {
                toast.error(response.message || 'Failed to update collector status');
            }
            setSelectedCollector(null);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update collector status';
            console.error('Error updating collector status:', error);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    const handleViewDetails = (collector: ICollector) => {
        setSelectedCollectorDetails(collector);
        setShowDetailsModal(true);
    };

    const filteredCollectors = collectors.filter(collector => {
        const matchesSearch = collector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            collector.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' ||
            (selectedStatus === 'blocked' ? collector.isBlocked : !collector.isBlocked);
        const matchesVerification = selectedVerification === 'all' ||
            (selectedVerification === 'verified' ? collector.isVerified : !collector.isVerified);
        return matchesSearch && matchesStatus && matchesVerification;
    });

    const sortedCollectors = [...filteredCollectors].sort((a, b) => {
        let compareResult;
        if (sortField === 'name') {
            compareResult = a.name.localeCompare(b.name);
        } else if (sortField === 'email') {
            compareResult = a.email.localeCompare(b.email);
        } else if (sortField === 'area') {
            compareResult = a.serviceArea.localeCompare(b.serviceArea);
        } else {
            compareResult = a.name.localeCompare(b.name);
        }
        return sortDirection === 'asc' ? compareResult : -compareResult;
    });

    const totalPages = Math.ceil(sortedCollectors.length / collectorsPerPage);
    const indexOfLastCollector = currentPage * collectorsPerPage;
    const indexOfFirstCollector = indexOfLastCollector - collectorsPerPage;
    const currentCollectors = sortedCollectors.slice(indexOfFirstCollector, indexOfLastCollector);

    const handleExport = () => {
        const headers = ['Name', 'Email', 'Phone', 'Area', 'Status', 'Verification'];
        const csvData = collectors.map(collector =>
            [
                collector.name,
                collector.email,
                collector.phone,
                collector.serviceArea,
                collector.isBlocked ? 'Blocked' : 'Active',
                collector.isVerified ? 'Verified' : 'Pending'
            ].join(',')
        );
        const csvContent = [headers.join(','), ...csvData].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'collectors_export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        setShowExportMessage(true);
        setTimeout(() => setShowExportMessage(false), 3000);
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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-6 py-4">
            <div className="max-w-7xl mx-auto bg-white border rounded-lg hover:shadow-md transition-all duration-300">
                <div className="p-6 space-y-6">
                    {showExportMessage && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between text-green-700">
                                Collectors data exported successfully!
                                <button onClick={() => setShowExportMessage(false)}>
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {/* Verification Requests Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => window.location.href = '/admin/collector-verification'}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
                            >
                                <User className="w-5 h-5" />
                                <span className="hidden sm:inline">Verification Requests</span>
                            </button>
                        </div>

                        {/* Search, Filters, and Export Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            {/* Stats Summary */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md">
                                    <span className="text-sm font-medium text-gray-600">Total:</span>
                                    <span className="text-sm font-semibold text-gray-900">{collectors.length}</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-md">
                                    <span className="text-sm font-medium text-gray-600">Verified:</span>
                                    <span className="text-sm font-semibold text-green-600">
                                        {collectors.filter(c => c.isVerified).length}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 rounded-md">
                                    <span className="text-sm font-medium text-gray-600">Pending:</span>
                                    <span className="text-sm font-semibold text-yellow-600">
                                        {collectors.filter(c => !c.isVerified).length}
                                    </span>
                                </div>
                            </div>

                            {/* Search, Filters, and Export Controls */}
                            <div className="flex gap-4 items-center">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search collectors..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-[300px] text-sm pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white shadow-sm"
                                    />
                                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                </div>

                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    <SlidersHorizontal className="w-5 h-5" />
                                    <span className="hidden sm:inline">Filters</span>
                                </button>

                                <button
                                    onClick={handleExport}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
                                >
                                    <Download className="w-5 h-5" />
                                    <span className="hidden sm:inline">Export</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="blocked">Blocked</option>
                                    </select>
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
                                    <select
                                        value={selectedVerification}
                                        onChange={(e) => setSelectedVerification(e.target.value)}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white"
                                    >
                                        <option value="all">All</option>
                                        <option value="verified">Verified</option>
                                        <option value="unverified">Unverified</option>
                                    </select>
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                    <select
                                        value={`${sortField}-${sortDirection}`}
                                        onChange={(e) => {
                                            const [field, direction] = e.target.value.split('-');
                                            setSortField(field);
                                            setSortDirection(direction);
                                        }}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white"
                                    >
                                        <option value="name-asc">Name (A-Z)</option>
                                        <option value="name-desc">Name (Z-A)</option>
                                        <option value="email-asc">Email (A-Z)</option>
                                        <option value="email-desc">Email (Z-A)</option>
                                        <option value="area-asc">Area (A-Z)</option>
                                        <option value="area-desc">Area (Z-A)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100 border-b border-gray-100">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Full name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Phone</th>
                                        {/* <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Area</th> */}
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Verification</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentCollectors.map((collector) => (
                                        <tr key={collector._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
                                                        {collector.profileUrl ? (
                                                            <img src={collector.profileUrl} alt={collector.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className="w-6 h-6 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{collector.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-gray-600">{collector.email}</td>
                                            <td className="px-6 py-3 text-gray-600">{collector.phone}</td>
                                            {/* <td className="px-6 py-3 text-gray-600">{collector.serviceArea}</td> */}
                                            <td className="px-6 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${collector.verificationStatus === 'approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : collector.verificationStatus === 'rejected'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {collector.verificationStatus === 'approved' ? 'Verified' : collector.verificationStatus === 'rejected' ? 'Rejected' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(collector)}
                                                        className="px-4 py-2 rounded-lg text-sm font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                                                    >
                                                        View Details
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(collector)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                            !collector.isBlocked
                                                                ? 'border border-red-700 hover:bg-red-700 text-gray-800 hover:text-white'
                                                                : 'border border-green-700 hover:bg-green-700 text-gray-800 hover:text-white'
                                                        }`}
                                                    >
                                                        {!collector.isBlocked ? 'Block' : 'Unblock'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                            <div className="text-sm text-gray-700">
                                Showing {indexOfFirstCollector + 1} to {Math.min(indexOfLastCollector, sortedCollectors.length)} of {sortedCollectors.length} collectors
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-lg border ${currentPage === 1
                                        ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-lg border ${currentPage === totalPages
                                        ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && selectedCollector && (
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={`Confirm ${!selectedCollector.isBlocked ? 'Block' : 'Unblock'}`}
                    description={`Are you sure you want to ${!selectedCollector.isBlocked ? 'block' : 'unblock'} ${selectedCollector.name}?`}
                    confirmLabel="Confirm"
                    onConfirm={confirmStatusChange}
                    confirmButtonClass={`px-4 py-2 rounded-lg text-white ${!selectedCollector.isBlocked
                        ? 'bg-red-700 hover:bg-red-800'
                        : 'bg-green-700 hover:bg-green-800'
                        } transition-colors`}
                />
            )}
            {showDetailsModal && selectedCollectorDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-3xl w-full mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-semibold text-gray-900">Collector Details</h3>
                            <button 
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="px-6 py-4">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
                                    {selectedCollectorDetails.profileUrl ? (
                                        <img 
                                            src={selectedCollectorDetails.profileUrl} 
                                            alt={selectedCollectorDetails.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-10 h-10 text-blue-600" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900">{selectedCollectorDetails.name}</h4>
                                    <p className="text-gray-500">{selectedCollectorDetails.email}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                                    <p className="text-gray-900">{selectedCollectorDetails.phone || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Service Area</p>
                                    <p className="text-gray-900">{selectedCollectorDetails.serviceArea || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">District</p>
                                    <p className="text-gray-900">{selectedCollectorDetails.district || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Gender</p>
                                    <p className="text-gray-900">{selectedCollectorDetails.gender || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Verification Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        selectedCollectorDetails.verificationStatus === 'approved'
                                            ? 'bg-green-100 text-green-800'
                                            : selectedCollectorDetails.verificationStatus === 'rejected'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {selectedCollectorDetails.verificationStatus === 'approved' ? 'Verified' : selectedCollectorDetails.verificationStatus === 'rejected' ? 'Rejected' : 'Pending'}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Account Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        !selectedCollectorDetails.isBlocked
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {!selectedCollectorDetails.isBlocked ? 'Active' : 'Blocked'}
                                    </span>
                                </div>
                            </div>

                            {/* ID Proof Images Section */}
                            <div className="mt-6">
                                <h5 className="text-sm font-semibold text-gray-900 mb-4">ID Proof Documents</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-500">Front Side</p>
                                        <div className="border rounded-lg overflow-hidden">
                                            {selectedCollectorDetails.idProofFrontUrl ? (
                                                <img 
                                                    src={selectedCollectorDetails.idProofFrontUrl} 
                                                    alt="ID Front" 
                                                    className="w-full h-48 object-cover cursor-pointer"
                                                    onClick={() => window.open(selectedCollectorDetails.idProofFrontUrl, '_blank')}
                                                />
                                            ) : (
                                                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                                                    <p className="text-gray-500">No front ID proof uploaded</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-500">Back Side</p>
                                        <div className="border rounded-lg overflow-hidden">
                                            {selectedCollectorDetails.idProofBackUrl ? (
                                                <img 
                                                    src={selectedCollectorDetails.idProofBackUrl} 
                                                    alt="ID Back" 
                                                    className="w-full h-48 object-cover cursor-pointer"
                                                    onClick={() => window.open(selectedCollectorDetails.idProofBackUrl, '_blank')}
                                                />
                                            ) : (
                                                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                                                    <p className="text-gray-500">No back ID proof uploaded</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 sticky bottom-0">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
export default Collectors;
