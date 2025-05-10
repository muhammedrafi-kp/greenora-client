import React, { useEffect, useState } from 'react';
import { Search, X, SlidersHorizontal, Calendar, ChevronLeft, ChevronRight, Table, File } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getCollectionRequests } from '../../services/collectionService';
import { getDistricts, getServiceAreas } from '../../services/locationService';
import { useNavigate } from 'react-router-dom';
import { exportTableData } from '../../utils/exportUtils';
import { ApiResponse } from '../../types/common';
import { IDistrict, IServiceArea } from '../../types/location';

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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showExportMessage, setShowExportMessage] = useState(false);
  const [exportType, setExportType] = useState<'csv' | 'pdf' | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedServiceArea, setSelectedServiceArea] = useState('all');
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [serviceAreas, setServiceAreas] = useState<IServiceArea[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortAscending, setSortAscending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCollections, setTotalCollections] = useState(0);
  const collectionsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    fetchDistricts();
    fetchCollections();
  }, []);

  useEffect(() => {
    if (selectedDistrict !== 'all') {
      fetchServiceAreas(selectedDistrict);
    } else {
      setServiceAreas([]);
      setSelectedServiceArea('all');
    }
  }, [selectedDistrict]);

  useEffect(() => {
    fetchCollections();
  }, [selectedStatus, selectedDistrict, selectedServiceArea, startDate, endDate, sortAscending, currentPage]);

  const fetchDistricts = async () => {
    try {
      const res: ApiResponse<IDistrict[]> = await getDistricts();
      if (res.success) {
        setDistricts(res.data);
      }
    } catch (error) {
      toast.error('Failed to fetch districts');
    }
  };

  const fetchServiceAreas = async (district: string) => {
    try {
      const res: ApiResponse<IServiceArea[]> = await getServiceAreas(district);
      if (res.success) {
        setServiceAreas(res.data);
      }
    } catch (error) {
      toast.error('Failed to fetch service areas');
    }
  };

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const params = {
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        districtId: selectedDistrict !== 'all' ? selectedDistrict : undefined,
        serviceAreaId: selectedServiceArea !== 'all' ? selectedServiceArea : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sortBy: 'createdAt',
        sortOrder: sortAscending ? 'asc' : 'desc',
        search: searchTerm || undefined,
        page: currentPage,
        limit: collectionsPerPage
      };
      console.log("params ", params)
      const res:ApiResponse<{collections:ICollection[],totalItems:number}> = await getCollectionRequests(params);
      console.log(res);
      if (res.success) {
        setCollections(res.data.collections || []);
        setTotalCollections(res.data.totalItems || 0);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (type: 'csv' | 'pdf') => {
    setExportType(type);

    const headers = ['Collection ID', 'User', 'Type', 'Status', 'Estimated Cost', 'Created At'];
    const exportData = {
      headers,
      data: collections.map((collection) => ({
        'Collection ID': collection.collectionId.toLocaleUpperCase(),
        'User': collection.user.name,
        'Type': collection.type,
        'Status': collection.status,
        'Estimated Cost': collection.estimatedCost,
        'Created At': new Date(collection.createdAt).toLocaleDateString()
      })),
      fileName: 'collection_requests'
    };

    exportTableData(type, exportData);

    setShowExportMessage(true);
    setTimeout(() => {
      setShowExportMessage(false);
      setExportType(null);
    }, 3000);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Debounce the search
    const timeoutId = setTimeout(() => {
      fetchCollections();
    }, 500);
    return () => clearTimeout(timeoutId);
  };

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
    navigate('/admin/collection', { state: { collection } });
  };

  // Pagination calculations
  const totalPages = Math.ceil(totalCollections / collectionsPerPage);
  const indexOfLastCollection = currentPage * collectionsPerPage;
  const indexOfFirstCollection = indexOfLastCollection - collectionsPerPage;

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-6 py-4 ">
      <div className="max-w-7xl mx-auto bg-white border rounded-lg hover:shadow-md transition-all duration-300">
        <div className="p-6 space-y-6">
          <div className="flex flex-col gap-4">
            {showExportMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between text-green-700">
                  Collection requests exported successfully as {exportType?.toUpperCase()}!
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
                  <span className="text-sm font-semibold text-gray-900">{totalCollections}</span>
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
                    placeholder="Search by request ID"
                    value={searchTerm}
                    onChange={handleSearch}
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

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div className="relative">
                    <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700 z-10">
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white text-sm"
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* District Filter */}
                  <div className="relative">
                    <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700 z-10">
                      District
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white text-sm"
                    >
                      <option value="all">All </option>
                      {districts.map((district) => (
                        <option key={district._id} value={district._id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Service Area Filter */}
                  <div className="relative">
                    <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700 z-10">
                      Service Area
                    </label>
                    <select
                      value={selectedServiceArea}
                      onChange={(e) => setSelectedServiceArea(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white text-sm"
                      disabled={selectedDistrict === 'all'}
                    >
                      <option value="all">All </option>
                      {serviceAreas.map((area) => (
                        <option key={area._id} value={area._id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range Filter */}
                  <div className="relative">
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700 z-10">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white text-sm"
                        />
                      </div>
                      <div className="relative">
                        <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700 z-10">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white text-sm"
                          min={startDate}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sort By Filter */}
                  <div className="relative">
                    <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700 z-10">
                      Sort By Date
                    </label>
                    <select
                      value={sortAscending ? 'asc' : 'desc'}
                      onChange={(e) => setSortAscending(e.target.value === 'asc')}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none bg-white text-sm"
                    >
                      <option value="desc">Newest </option>
                      <option value="asc">Oldest </option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-4">
                  {(selectedStatus !== 'all' || 
                    selectedDistrict !== 'all' || 
                    selectedServiceArea !== 'all' || 
                    startDate || 
                    endDate || 
                    sortAscending) && (
                    <button
                      onClick={() => {
                        setSelectedStatus('all');
                        setSelectedDistrict('all');
                        setSelectedServiceArea('all');
                        setStartDate('');
                        setEndDate('');
                        setSortAscending(false);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium text-gray-700 flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" /> Clear Filters
                    </button>
                  )}
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
                  ) : collections.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Calendar className="w-12 h-12 mb-2 text-gray-400" />
                          <p className="text-sm font-medium">No collections found</p>
                          <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    collections.map((collection) => (
                      <tr key={collection._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
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

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstCollection + 1} to {Math.min(indexOfLastCollection, totalCollections)} of {totalCollections} collections
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
    </main>
  );
};

export default Requests;
