import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Package, Clock, Phone, User, Filter } from 'lucide-react';
import { getAssignedCollections } from '../../services/collectorService';
import toast from 'react-hot-toast';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [filteredCollections, setFilteredCollections] = useState<ICollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const navigate = useNavigate();
  
  const fetchAssignedCollections = async () => {
    try {
      const response = await getAssignedCollections();
      console.log("response :", response);
      if (response.success) {
        setCollections(response.collections);
        setFilteredCollections(response.collections);
      }
    } catch (error) {
      toast.error('Failed to fetch assigned collections');
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedCollections();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [activeFilter, selectedDate, collections]);

  const applyFilters = () => {
    let filtered = [...collections];
    
    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(collection => collection.status === activeFilter);
    }
    
    // Apply date filter
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      filtered = filtered.filter(collection => {
        const collectionDate = new Date(collection.preferredDate).toISOString().split('T')[0];
        return collectionDate === dateString;
      });
    }
    
    setFilteredCollections(filtered);
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900"></div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto">
      <div className="md:p-6 xs:p-4 p-3 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div className="flex gap-2 flex-wrap">
              <button 
                className={`px-4 py-2 rounded-lg text-sm ${activeFilter === 'all' ? 'bg-green-800 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => handleFilterClick('all')}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm ${activeFilter === 'pending' ? 'bg-green-800 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => handleFilterClick('pending')}
              >
                Pending
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm ${activeFilter === 'scheduled' ? 'bg-green-800 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => handleFilterClick('scheduled')}
              >
                Scheduled
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm ${activeFilter === 'completed' ? 'bg-green-800 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => handleFilterClick('completed')}
              >
                Completed
              </button>
            </div>
            
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <button 
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border ${selectedDate ? 'bg-green-50 border-green-300' : 'bg-white border-gray-300'}`}
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{selectedDate ? selectedDate.toLocaleDateString() : 'Filter by Date'}</span>
                  </button>
                  
                  {selectedDate && (
                    <button 
                      className="ml-2 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                      onClick={clearDateFilter}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              
              {isCalendarOpen && (
                <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-lg border border-gray-200">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date:any) => {
                      setSelectedDate(date);
                      setIsCalendarOpen(false);
                    }}
                    inline
                    calendarClassName="rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
          
          {selectedDate && (
            <div className="mb-4 text-sm text-gray-600">
              Showing collections for: <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {filteredCollections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No collections found for the selected filters.
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCollections.map((collection) => (
              <div key={collection._id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">#{collection.collectionId.toUpperCase()}</h3>
                      <p className="text-sm text-gray-600">{collection.type === 'waste' ? 'Waste Collection' : 'Scrap Collection'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(collection.status)}`}>
                      {collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>
                          {collection.user.name}
                          {/* {collection.customer.name} */}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>
                          {collection.user.phone}

                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{collection.address.name}, {collection.address.addressLine}, {collection.address.locality}, {collection.address.pinCode}, {collection.address.mobile}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(collection.preferredDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{collection.preferredTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package className="w-4 h-4" />
                        <span>
                          {collection.items.reduce((total, item) => total + item.qty, 0)}
                          {collection.type === 'waste' ? ' bags' : ' kg'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    {collection.status === 'scheduled' && 
                     new Date(collection.preferredDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0] && (
                      <button className="px-4 py-2 text-sm bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors">
                        Start Collection
                      </button>
                    )}
                    <button onClick={() => navigate(`/collector/collection-details`, { state: { collection } })} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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