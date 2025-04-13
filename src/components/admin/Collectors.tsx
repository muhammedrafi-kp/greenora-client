import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Download, X, ChevronLeft, ChevronRight, User, Table, File } from 'lucide-react';
import Modal from '../common/Modal';
import DataTable from '../common/DataTable';
import { getCollectors, updateCollectorStatus } from "../../services/adminService";
import { getDistricts, getServiceAreas } from '../../services/userService';
import toast from 'react-hot-toast';
import { exportTableData } from '../../utils/exportUtils';

interface IDistrict {
    _id: string;
    name: string;
}

interface IServiceArea {
    _id: string;
    name: string;
}

interface ICollector {
    _id: string;
    name: string;
    email: string;
    phone: string;
    district: {
        _id: string;
        name: string;
    };
    serviceArea: {
        _id: string;
        name: string;
    };
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
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedVerification, setSelectedVerification] = useState('all');
    const [selectedDistrict, setSelectedDistrict] = useState('all');
    const [selectedServiceArea, setSelectedServiceArea] = useState('all');
    const [districts, setDistricts] = useState<IDistrict[]>([]);
    const [serviceAreas, setServiceAreas] = useState<IServiceArea[]>([]);
    const [showExportMessage, setShowExportMessage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedCollector, setSelectedCollector] = useState<ICollector | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedCollectorDetails, setSelectedCollectorDetails] = useState<ICollector | null>(null);
    const [exportType, setExportType] = useState<'csv' | 'pdf' | null>(null);

    const collectorsPerPage = 10;

    useEffect(() => {
        fetchDistricts();
        fetchCollectors();
    }, [searchTerm, selectedStatus, selectedVerification, selectedDistrict, selectedServiceArea, sortField, sortDirection, currentPage]);

    useEffect(() => {
        if (selectedDistrict !== 'all') {
            fetchServiceAreas(selectedDistrict);
        } else {
            setServiceAreas([]);
            setSelectedServiceArea('all');
        }
    }, [selectedDistrict]);

    const fetchDistricts = async () => {
        try {
            const response = await getDistricts();
            if (response.success) {
                setDistricts(response.data);
            }
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    const fetchServiceAreas = async (districtId: string) => {
        try {
            const response = await getServiceAreas(districtId);
            if (response.success) {
                setServiceAreas(response.data);
            }
        } catch (error) {
            console.error('Error fetching service areas:', error);
        }
    };

    const fetchCollectors = async () => {
        try {
            setLoading(true);
            const response = await getCollectors({
                search: searchTerm,
                status: selectedStatus,
                verificationStatus: selectedVerification,
                district: selectedDistrict,
                serviceArea: selectedServiceArea,
                sortField,
                sortOrder: sortDirection,
                page: currentPage,
                limit: collectorsPerPage
            });

            if (response.success) {
                console.log("response :", response);
                setCollectors(response.collectors);
                setTotalItems(response.totalItems);
                setTotalPages(response.totalPages);
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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(e.target.value);
        setCurrentPage(1);
    };

    const handleVerificationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVerification(e.target.value);
        setCurrentPage(1);
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDistrict(e.target.value);
        setCurrentPage(1);
    };

    const handleServiceAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedServiceArea(e.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [field, direction] = e.target.value.split('-');
        setSortField(field);
        setSortDirection(direction);
        setCurrentPage(1);
    };

    const handleStatusChangeModal = (collector: ICollector) => {
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

    const handleExport = (type: 'csv' | 'pdf') => {
        setExportType(type);

        const headers = ['Name', 'Email', 'Phone', 'District', 'Service Area', 'Status', 'Verification'];
        const exportData = {
            headers,
            data: collectors.map((collector) => ({
                Name: collector.name,
                Email: collector.email,
                Phone: collector.phone,
                District: collector.district?.name || 'N/A',
                'Service Area': collector.serviceArea?.name || 'N/A',
                Status: collector.isBlocked ? 'Blocked' : 'Active',
                Verification: collector.isVerified ? 'Verified' : 'Pending'
            })),
            fileName: 'collectors_export'
        };

        exportTableData(type, exportData);

        setShowExportMessage(true);
        setTimeout(() => {
            setShowExportMessage(false);
            setExportType(null);
        }, 3000);
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
        <main className="flex-1  overflow-y-auto bg-gray-50 px-6 py-4">
            <div className="max-w-7xl mx-auto bg-white border rounded-lg hover:shadow-md transition-all duration-300">
                <div className="p-6 space-y-6">
                    {showExportMessage && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between text-green-700">
                                Collectors data exported successfully as {exportType?.toUpperCase()}!
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
                                    <span className="text-sm font-semibold text-gray-900">{totalItems}</span>
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
                                        onChange={handleSearch}
                                        className="w-[300px] text-sm pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white shadow-sm"
                                    />
                                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleExport('csv')}
                                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                        title="Export as CSV"
                                    >
                                        <Table className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={() => handleExport('pdf')}
                                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                        title="Export as PDF"
                                    >
                                        <File className="w-5 h-5 text-red-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            {/* Status Filter */}
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={selectedStatus}
                                    onChange={handleStatusChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white text-sm"
                                >
                                    <option value="all">All</option>
                                    <option value="active">Active</option>
                                    <option value="blocked">Blocked</option>
                                </select>
                            </div>

                            {/* Verification Filter */}
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Verification</label>
                                <select
                                    value={selectedVerification}
                                    onChange={handleVerificationChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white text-sm"
                                >
                                    <option value="all">All</option>
                                    <option value="verified">Verified</option>
                                    <option value="unverified">Unverified</option>
                                </select>
                            </div>

                            {/* District Filter */}
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                <select
                                    value={selectedDistrict}
                                    onChange={handleDistrictChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white text-sm"
                                >
                                    <option value="all">All Districts</option>
                                    {districts.map((district) => (
                                        <option key={district._id} value={district._id}>
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Service Area Filter */}
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service Area</label>
                                <select
                                    value={selectedServiceArea}
                                    onChange={handleServiceAreaChange}
                                    disabled={selectedDistrict === 'all'}
                                    className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white text-sm ${selectedDistrict === 'all' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                >
                                    <option value="all">All Service Areas</option>
                                    {serviceAreas.map((area) => (
                                        <option key={area._id} value={area._id}>
                                            {area.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort Filter */}
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                                <select
                                    value={`${sortField}-${sortDirection}`}
                                    onChange={handleSortChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white text-sm"
                                >
                                    <option value="name-asc">Name (A-Z)</option>
                                    <option value="name-desc">Name (Z-A)</option>
                                    <option value="email-asc">Email (A-Z)</option>
                                    <option value="email-desc">Email (Z-A)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <DataTable
                            columns={[
                                {
                                    header: 'Full name',
                                    accessor: 'name',
                                    render: (row) => (
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {row.profileUrl ? (
                                                    <img src={row.profileUrl} alt={row.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-4 h-4 text-blue-600" />
                                                )}
                                            </div>
                                            <span className="font-medium text-gray-900 truncate">{row.name}</span>
                                        </div>
                                    )
                                },
                                {
                                    header: 'Email',
                                    accessor: 'email',
                                    className: 'text-sm text-gray-600 truncate'
                                },
                                {
                                    header: 'Phone',
                                    accessor: 'phone',
                                    className: 'text-sm text-gray-600 truncate'
                                },
                                {
                                    header: 'District',
                                    accessor: 'district',
                                    render: (row) => (
                                        <span className="text-sm text-gray-600 truncate">{row.district?.name || 'N/A'}</span>
                                    )
                                },

                                {
                                    header: 'Service Area',
                                    accessor: 'serviceArea',
                                    render: (row) => (
                                        <span className="text-sm text-gray-600 truncate">{row.serviceArea?.name || 'N/A'}</span>
                                    )
                                },
                                {
                                    header: 'Verification',
                                    accessor: 'verification',
                                    render: (row) => (
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${row.verificationStatus === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : row.verificationStatus === 'rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {row.verificationStatus === 'approved' ? 'Verified' : row.verificationStatus === 'rejected' ? 'Rejected' : 'Pending'}
                                        </span>
                                    )
                                },
                                {
                                    header: 'Action',
                                    accessor: 'action',
                                    render: (row) => (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleViewDetails(row)}
                                                className="px-3 py-1 rounded-lg text-xs font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleStatusChangeModal(row)}
                                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${!row.isBlocked
                                                        ? 'border border-red-700 hover:bg-red-700 text-gray-800 hover:text-white'
                                                        : 'border border-green-700 hover:bg-green-700 text-gray-800 hover:text-white'
                                                    }`}
                                            >
                                                {!row.isBlocked ? 'Block' : 'Unblock'}
                                            </button>
                                        </div>
                                    )
                                }
                            ]}
                            data={collectors}
                            loading={loading}
                            emptyState={{
                                icon: <User className="w-12 h-12 mb-2 text-gray-400" />,
                                title: 'No collectors found',
                                subtitle: 'Try adjusting your search or filters'
                            }}
                            pagination={{
                                currentPage,
                                totalPages,
                                totalItems,
                                itemsPerPage: collectorsPerPage,
                                onPageChange: setCurrentPage
                            }}
                        />
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
                                    <p className="text-gray-900">{selectedCollectorDetails.serviceArea.name || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">District</p>
                                    <p className="text-gray-900">{selectedCollectorDetails.district.name || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Gender</p>
                                    <p className="text-gray-900">{selectedCollectorDetails.gender || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Verification Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedCollectorDetails.verificationStatus === 'approved'
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
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${!selectedCollectorDetails.isBlocked
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
