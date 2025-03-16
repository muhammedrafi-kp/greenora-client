import React, { useEffect, useState } from 'react';
import { Search, X, SlidersHorizontal, Download, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getCollectionHistories } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';

interface ICollection {
  _id: string;
  collectionId: string;
  user: {
    userId: string;
    name: string;
    email: string;
    phone: string;
  };
  type: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
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
  collector?: {
    serviceArea?: string;
  };
}

const Requests: React.FC = () => {
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<ICollection | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showExportMessage, setShowExportMessage] = useState(false);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedServiceArea, setSelectedServiceArea] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortAscending, setSortAscending] = useState(false);
  const navigate = useNavigate();

  const serviceAreas = [
    'Kochi',
    'Thrissur',
    'Kozhikode',
    'Malappuram',
    'Kannur',
    // Add more service areas as needed
  ];

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await getCollectionHistories();
      console.log(response);
      if (response.success) {
        setCollections(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const headers = ['Collection ID', 'User', 'Type', 'Status', 'Created At'];
    const csvData = collections.map(collection =>
      [
        collection.collectionId,
        collection.user.name,
        collection.type,
        collection.status,
        new Date(collection.createdAt).toLocaleDateString()
      ].join(',')
    );
    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'collection_requests.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportMessage(true);
    setTimeout(() => setShowExportMessage(false), 3000);
  };

  const filteredCollections = collections.filter((collection) => {
    const matchesSearch = (
      collection.collectionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = selectedStatus === 'all' || collection.status === selectedStatus;
    const matchesServiceArea = selectedServiceArea === 'all' || 
      (collection.collector?.serviceArea?.toLowerCase() === selectedServiceArea.toLowerCase());
    
    // Date filtering
    const collectionDate = new Date(collection.createdAt);
    const matchesDateRange = (!startDate || collectionDate >= new Date(startDate)) && 
      (!endDate || collectionDate <= new Date(endDate));
    
    return matchesSearch && matchesStatus && matchesServiceArea && matchesDateRange;
  });

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

  const handleViewDetails = (collection: ICollection) => {
    navigate('/admin/collection-details', { state: { collection } });
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-6 py-4">
      <div className="max-w-7xl mx-auto bg-white border rounded-lg hover:shadow-md transition-all duration-300">
        <div className="p-6 space-y-6">
          <div className="flex flex-col gap-4">
            {showExportMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between text-green-700">
                  Collection requests data exported successfully!
                  <button onClick={() => setShowExportMessage(false)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Combined Stats Summary and Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Stats Summary */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md">
                  <span className="text-sm font-medium text-gray-600">Total:</span>
                  <span className="text-sm font-semibold text-gray-900">{collections.length}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-md">
                  <span className="text-sm font-medium text-gray-600">Completed:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {collections.filter(r => r.status === 'completed').length}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 rounded-md">
                  <span className="text-sm font-medium text-gray-600">Pending:</span>
                  <span className="text-sm font-semibold text-yellow-600">
                    {collections.filter(r => r.status === 'pending').length}
                  </span>
                </div>
              </div>

              {/* Search, Filters, and Export Controls */}
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by request ID, name, email or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-[300px] text-sm pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white shadow-sm"
                  />
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

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Status Filter */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Service Area Filter */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Area</label>
                    <select
                      value={selectedServiceArea}
                      onChange={(e) => setSelectedServiceArea(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white"
                    >
                      <option value="all">All Areas</option>
                      {serviceAreas.map((area) => (
                        <option key={area} value={area.toLowerCase()}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range Filter */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white text-sm"
                        placeholder="Start Date"
                      />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white text-sm"
                        placeholder="End Date"
                        min={startDate}
                      />
                    </div>
                  </div>

                  {/* Sort By Filter */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By Date</label>
                    <select
                      value={sortAscending ? 'asc' : 'desc'}
                      onChange={(e) => setSortAscending(e.target.value === 'asc')}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white"
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => {
                      setSelectedStatus('all');
                      setSelectedServiceArea('all');
                      setStartDate('');
                      setEndDate('');
                      setSortAscending(false);
                    }}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" /> Clear Filters
                  </button>
                  <button
                    onClick={() => {
                      // Add your apply filter logic here
                      fetchCollections();
                    }}
                    className="px-4 py-2.5 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Collections Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-100">
                    <th className="lg:px-6 px-4 lg:py-4 py-3 text-left text-sm font-semibold text-gray-600">Request ID</th>
                    <th className="lg:px-6 px-4 lg:py-4 py-3 text-left text-sm font-semibold text-gray-600">User</th>
                    <th className="lg:px-6 px-4 lg:py-4 py-3 text-left text-sm font-semibold text-gray-600">Type</th>
                    <th className="lg:px-6 px-4 lg:py-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="lg:px-6 px-4 lg:py-4 py-3 text-left text-sm font-semibold text-gray-600">Created At</th>
                    <th className="lg:px-6 px-4 lg:py-4 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredCollections.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No requests found</td>
                    </tr>
                  ) : (
                    collections.map((collection) => (
                      <tr key={collection._id} className="border-b  border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                          #{collection.collectionId.toLocaleUpperCase()}
                        </td>
                        <td className="px-6 py-3">
                          <div className="text-sm font-medium text-gray-900">{collection.user.name}</div>
                          <div className="text-sm text-gray-500">{collection.user.email}</div>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">{collection.type}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(collection.status)}`}>
                            {collection.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {new Date(collection.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-2 text-right">
                          <button
                            onClick={() => handleViewDetails(collection)}
                            className="px-4 py-2 rounded-lg text-sm font-medium border border-blue-600 text-blue-600 hover:bg-blue-200 transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Requests;
