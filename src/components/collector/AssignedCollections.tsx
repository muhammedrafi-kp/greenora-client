import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Package, Clock, Phone, User, Filter, ChevronDown } from 'lucide-react';
import { getAssignedCollections } from '../../services/collectionService';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../../styles/scrollbar.css';

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
  districtId: string
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
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

const AssignedCollections: React.FC = () => {
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dateFilterType, setDateFilterType] = useState<string>('all');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const fetchAssignedCollections = async (pageNum: number, status?: string) => {
    try {
      let startDate: string | undefined;
      let endDate: string | undefined;

      if (dateFilterType !== 'all') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        switch (dateFilterType) {
          case 'today':
            startDate = today.toISOString().split('T')[0];
            endDate = today.toISOString().split('T')[0];
            break;
          case 'yesterday':
            startDate = yesterday.toISOString().split('T')[0];
            endDate = yesterday.toISOString().split('T')[0];
            break;
          case 'custom':
            if (selectedDate) {
              startDate = selectedDate.toISOString().split('T')[0];
              endDate = selectedDate.toISOString().split('T')[0];
            }
            break;
          case 'range':
            if (selectedDate) {
              startDate = selectedDate.toISOString().split('T')[0];
              if (endDate) {
                endDate = new Date(endDate).toISOString().split('T')[0];
              } else {
                endDate = startDate;
              }
            }
            break;
        }
      }

      const params = {
        status: status !== 'all' ? status : undefined,
        startDate,
        endDate,
        page: pageNum,
        limit,
      }
      console.log("params ", params)
      const response = await getAssignedCollections(params);

      console.log("collections ", response)
      if (response.success) {
        if (pageNum === 1) {
          setCollections(response.collections);
        } else {
          setCollections(prev => [...prev, ...response.collections]);
        }
        setHasMore(response.collections.length === limit);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedCollections(1, activeFilter);
  }, [activeFilter, dateFilterType, selectedDate, endDate]);

  useEffect(() => {
    if (page > 1) {
      fetchAssignedCollections(page, activeFilter);
    }
  }, [page]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || !hasMore) return;
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleDateFilterChange = (type: string) => {
    setDateFilterType(type);
    setIsDatePickerOpen(false);
    setIsDateRangePickerOpen(false);
    
    if (type === 'all') {
      setSelectedDate(null);
      setEndDate(null);
    } else if (type === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setSelectedDate(today);
    } else if (type === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      setSelectedDate(yesterday);
    }
  };

  const clearDateFilter = () => {
    setDateFilterType('all');
    setSelectedDate(null);
    setEndDate(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-800 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 custom-scrollbar">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' }
              ].map((status) => (
                <button
                  key={status.value}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeFilter === status.value
                      ? 'bg-green-800 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => handleFilterClick(status.value)}
                >
                  {status.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <select
                    value={dateFilterType}
                    onChange={(e) => handleDateFilterChange(e.target.value)}
                    className="appearance-none px-4 py-2 rounded-lg text-sm border bg-white border-gray-300 pr-8 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="custom">Custom Date</option>
                    <option value="range">Date Range</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                {(dateFilterType === 'custom' || dateFilterType === 'range') && (
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border bg-white border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                      onClick={() => {
                        if (dateFilterType === 'custom') {
                          setIsDatePickerOpen(!isDatePickerOpen);
                          setIsDateRangePickerOpen(false);
                        } else {
                          setIsDateRangePickerOpen(!isDateRangePickerOpen);
                          setIsDatePickerOpen(false);
                        }
                      }}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>
                        {dateFilterType === 'custom'
                          ? (selectedDate ? selectedDate.toLocaleDateString() : 'Select Date')
                          : (selectedDate && endDate
                            ? `${selectedDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                            : 'Select Date Range')}
                      </span>
                    </button>

                    {(selectedDate || endDate) && (
                      <button
                        className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        onClick={clearDateFilter}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}
              </div>

              {isDatePickerOpen && (
                <div className="absolute z-10 mt-2 bg-white shadow-xl rounded-lg border border-gray-200">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => {
                      setSelectedDate(date);
                      setIsDatePickerOpen(false);
                    }}
                    inline
                    calendarClassName="rounded-lg"
                  />
                </div>
              )}

              {isDateRangePickerOpen && (
                <div className="absolute z-10 mt-2 bg-white shadow-xl rounded-lg border border-gray-200">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(dates: [Date | null, Date | null]) => {
                      const [start, end] = dates;
                      setSelectedDate(start);
                      setEndDate(end);
                      if (end) {
                        setIsDateRangePickerOpen(false);
                      }
                    }}
                    startDate={selectedDate}
                    endDate={endDate}
                    selectsRange
                    inline
                    calendarClassName="rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {(dateFilterType !== 'all') && (
            <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              Showing collections for: <span className="font-medium">
                {dateFilterType === 'today' && 'Today'}
                {dateFilterType === 'yesterday' && 'Yesterday'}
                {dateFilterType === 'custom' && selectedDate && selectedDate.toLocaleDateString()}
                {dateFilterType === 'range' && selectedDate && endDate &&
                  `${selectedDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
              </span>
            </div>
          )}
        </div>

        {collections.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-gray-500 text-lg">No collections found for the selected filters.</div>
            <p className="text-gray-400 mt-2">Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {collections.map((collection) => (
              <div key={collection._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">#{collection.collectionId.toUpperCase()}</h3>
                      <p className="text-sm text-gray-600 mt-1">{collection.type === 'waste' ? 'Waste Collection' : 'Scrap Collection'}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(collection.status)}`}>
                      {collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 text-sm text-gray-600">
                        <User className="w-5 h-5 mt-0.5 text-gray-400" />
                        <span className="flex-1">
                          {collection.user.name}
                        </span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-gray-600">
                        <Phone className="w-5 h-5 mt-0.5 text-gray-400" />
                        <span className="flex-1">
                          {collection.user.phone}
                        </span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-gray-600">
                        <MapPin className="w-5 h-5 mt-0.5 text-gray-400" />
                        <span className="flex-1">{collection.address.name}, {collection.address.addressLine}, {collection.address.locality}, {collection.address.pinCode}, {collection.address.mobile}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3 text-sm text-gray-600">
                        <Calendar className="w-5 h-5 mt-0.5 text-gray-400" />
                        <span className="flex-1">{new Date(collection.preferredDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-gray-600">
                        <Clock className="w-5 h-5 mt-0.5 text-gray-400" />
                        <span className="flex-1">{collection.preferredTime}</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-gray-600">
                        <Package className="w-5 h-5 mt-0.5 text-gray-400" />
                        <span className="flex-1">
                          {collection.items.reduce((total, item) => total + item.qty, 0)}
                          {collection.type === 'waste' ? ' bags' : ' kg'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap justify-end gap-3">
                    {collection.status === 'scheduled' &&
                      new Date(collection.preferredDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0] && (
                        <button className="px-6 py-2.5 text-sm font-medium bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2">
                          Start Collection
                        </button>
                      )}
                    <button 
                      onClick={() => navigate(`/collector/collection-details`, { state: { collection } })} 
                      className="px-6 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AssignedCollections;