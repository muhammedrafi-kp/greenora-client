import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from "react-icons/fa";
import { getDistricts, getServiceAreas } from '../../services/locationService';
import { getDashboardData, getRevenueData,getCollectionGraphData } from '../../services/collectionService';
import { ApiResponse } from '../../types/common';
import { IDistrict, IServiceArea } from '../../types/location';
import { ICollectionChartData } from '../../types/collection';


interface IRevenueData {
  date: string;
  waste: number;
  scrap: number;
  total: number;
  wasteCollections: number;
  scrapCollections: number;
}

interface IDashboardData {
  totalCollections: number;
  totalRevenue: number;
  wasteCollections: number;
  scrapCollections: number;
}

const AdminDashboard:React.FC = () => {

  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [serviceAreas, setServiceAreas] = useState<IServiceArea[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedServiceArea, setSelectedServiceArea] = useState<string>('all');
  const [dashboardData, setDashboardData] = useState<IDashboardData>({
    totalCollections: 0,
    totalRevenue: 0,
    wasteCollections: 0,
    scrapCollections: 0
  });
  const [revenueData, setRevenueData] = useState<IRevenueData[]>([]);
  const [collectionGraphData, setCollectionGraphData] = useState<ICollectionChartData>({
    collectionTypeData: [],
    collectionStatusData: []
  });
  // const [timeRange, setTimeRange] = useState('month');
  
  // Filter states for pie charts (commented out since we're using fetched data without filters)
  // const [chartTimeFilter, setChartTimeFilter] = useState('last30days');
  // const [chartDistrictFilter, setChartDistrictFilter] = useState('all');
  // const [chartServiceAreaFilter, setChartServiceAreaFilter] = useState('all');
  // const [chartStatusFilter, setChartStatusFilter] = useState('all');
  // const [chartCollectorFilter, setChartCollectorFilter] = useState('all');
  // const [chartRevenueFilter, setChartRevenueFilter] = useState('all');

  // Filter states for revenue chart
  // const [revenueTimeFilter, setRevenueTimeFilter] = useState('last30days');
  // const [revenueServiceAreaFilter, setRevenueServiceAreaFilter] = useState('all');
  // const [revenueStatusFilter, setRevenueStatusFilter] = useState('all');
  // const [revenueCollectorFilter, setRevenueCollectorFilter] = useState('all');
  // const [revenueTypeFilter, setRevenueTypeFilter] = useState('all');
  // const [revenueSortBy, setRevenueSortBy] = useState('total');

  // Filter states for collectors table
  // const [collectorTimeFilter, setCollectorTimeFilter] = useState('last30days');
  // const [collectorDistrictFilter, setCollectorDistrictFilter] = useState('all');
  // const [collectorServiceAreaFilter, setCollectorServiceAreaFilter] = useState('all');
  // const [collectorStatusFilter, setCollectorStatusFilter] = useState('all');
  // const [collectorSortBy, setCollectorSortBy] = useState('revenue');
  // const [collectorLimit, setCollectorLimit] = useState('all');

  // Filter states for items table
  // const [itemTimeFilter, setItemTimeFilter] = useState('last30days');
  // const [itemDistrictFilter, setItemDistrictFilter] = useState('all');
  // const [itemServiceAreaFilter, setItemServiceAreaFilter] = useState('all');
  // const [itemCategoryFilter, setItemCategoryFilter] = useState('all');
  // const [itemSortBy, setItemSortBy] = useState('revenue');
  // const [itemLimit, setItemLimit] = useState('all');

  // Collection type distribution - now using fetched data
  const collectionTypeData = useMemo(() => {
    return collectionGraphData.collectionTypeData || [];
  }, [collectionGraphData.collectionTypeData]);
  
  // Revenue by district - now dynamic based on filters
  // const districtRevenueData = useMemo(() => {
  //   let baseData = [
  //     { district: 'Palakkad', waste: 1440, scrap: 160, total: 1600 },
  //     { district: 'Malappuram', waste: 330, scrap: 222, total: 552 },
  //     { district: 'Kozhikode', waste: 0, scrap: 0, total: 0 },
  //     { district: 'Thrissur', waste: 890, scrap: 110, total: 1000 },
  //     { district: 'Ernakulam', waste: 1200, scrap: 300, total: 1500 },
  //   ];
    
    // Apply time-based filters
    // switch (revenueTimeFilter) {
    //   case 'last7days':
    //     baseData = baseData.map(item => ({
    //       ...item,
    //       waste: Math.floor(item.waste * 0.2),
    //       scrap: Math.floor(item.scrap * 0.2),
    //       total: Math.floor(item.total * 0.2)
    //     }));
    //     break;
    //   case 'last30days':
    //     baseData = baseData.map(item => ({
    //       ...item,
    //       waste: Math.floor(item.waste * 0.8),
    //       scrap: Math.floor(item.scrap * 0.8),
    //       total: Math.floor(item.total * 0.8)
    //     }));
    //     break;
    //   case 'last3months':
    //     baseData = baseData.map(item => ({
    //       ...item,
    //       waste: Math.floor(item.waste * 1.2),
    //       scrap: Math.floor(item.scrap * 1.2),
    //       total: Math.floor(item.total * 1.2)
    //     }));
    //     break;
    //   case 'last6months':
    //     baseData = baseData.map(item => ({
    //       ...item,
    //       waste: Math.floor(item.waste * 1.5),
    //       scrap: Math.floor(item.scrap * 1.5),
    //       total: Math.floor(item.total * 1.5)
    //     }));
    //     break;
    //   case 'lastyear':
    //     baseData = baseData.map(item => ({
    //       ...item,
    //       waste: Math.floor(item.waste * 2.0),
    //       scrap: Math.floor(item.scrap * 2.0),
    //       total: Math.floor(item.total * 2.0)
    //     }));
    //     break;
    // }
    
    // Apply revenue type filter
    // if (revenueTypeFilter === 'waste') {
    //   baseData = baseData.map(item => ({
    //     ...item,
    //     scrap: 0,
    //     total: item.waste
    //   }));
    // } else if (revenueTypeFilter === 'scrap') {
    //   baseData = baseData.map(item => ({
    //     ...item,
    //     waste: 0,
    //     total: item.scrap
    //   }));
    // }
    
    // Apply status filter (affects revenue calculation)
    // if (revenueStatusFilter === 'completed') {
    //   baseData = baseData.map(item => ({
    //     ...item,
    //     waste: Math.floor(item.waste * 0.9),
    //     scrap: Math.floor(item.scrap * 0.9),
    //     total: Math.floor(item.total * 0.9)
    //   }));
    // } else if (revenueStatusFilter === 'pending') {
    //   baseData = baseData.map(item => ({
    //     ...item,
    //     waste: Math.floor(item.waste * 0.1),
    //     scrap: Math.floor(item.scrap * 0.1),
    //     total: Math.floor(item.total * 0.1)
    //   }));
    // }
    
    // Apply sorting
    // if (revenueSortBy === 'waste') {
    //   baseData.sort((a, b) => b.waste - a.waste);
    // } else if (revenueSortBy === 'scrap') {
    //   baseData.sort((a, b) => b.scrap - a.scrap);
    // } else if (revenueSortBy === 'total') {
    //   baseData.sort((a, b) => b.total - a.total);
    // } else if (revenueSortBy === 'district') {
    //   baseData.sort((a, b) => a.district.localeCompare(b.district));
    // }
    
    // Filter out districts with zero revenue if needed
    // if (revenueTypeFilter === 'waste') {
    //   baseData = baseData.filter(item => item.waste > 0);
    // } else if (revenueTypeFilter === 'scrap') {
    //   baseData = baseData.filter(item => item.scrap > 0);
    // }
    
    // return baseData;
  // }, [revenueTimeFilter, revenueServiceAreaFilter, revenueStatusFilter, revenueCollectorFilter, revenueTypeFilter, revenueSortBy]);
  
  // Collection status distribution - now using fetched data
  const statusData = useMemo(() => {
    return collectionGraphData.collectionStatusData || [];
  }, [collectionGraphData.collectionStatusData]);
  
  // Monthly collection trends
  // const monthlyTrendsData = [
  //   { month: 'Jan', waste: 12, scrap: 4 },
  //   { month: 'Feb', waste: 8, scrap: 3 },
  //   { month: 'Mar', waste: 15, scrap: 2 },
  //   { month: 'Apr', waste: 7, scrap: 6 },
  //   { month: 'May', waste: 13, scrap: 4 },
  //   { month: 'Jun', waste: 8, scrap: 3 },
  // ];
  
  // Top collector performance - now dynamic based on filters
  // const collectorPerformanceData = useMemo(() => {
  //   // This would be replaced with actual API call based on filters
  //   let baseData = [
  //     { name: 'collector.', collections: 5, revenue: 1500, rating: 4.8, district: 'Palakkad', status: 'active' },
  //     { name: 'Leo', collections: 4, revenue: 1400, rating: 4.9, district: 'Malappuram', status: 'active' },
  //     { name: 'John.', collections: 3, revenue: 1200, rating: 4.7, district: 'Kozhikode', status: 'active' },
  //     { name: 'Rajesh', collections: 2, revenue: 1100, rating: 4.6, district: 'Thrissur', status: 'active' },
  //     { name: 'Alex', collections: 1, revenue: 1000, rating: 4.6, district: 'Ernakulam', status: 'active' },
  //     { name: 'Sarah', collections: 6, revenue: 1800, rating: 4.9, district: 'Palakkad', status: 'active' },
  //     { name: 'Mike', collections: 3, revenue: 900, rating: 4.3, district: 'Malappuram', status: 'inactive' },
  //     { name: 'Priya', collections: 4, revenue: 1300, rating: 4.8, district: 'Thrissur', status: 'active' },
  //   ];
    
  //   // Apply time-based filters
  //   switch (collectorTimeFilter) {
  //     case 'last7days':
  //       baseData = baseData.map(item => ({
  //         ...item,
  //         collections: Math.floor(item.collections * 0.3),
  //         revenue: Math.floor(item.revenue * 0.3)
  //       }));
  //       break;
  //     case 'last30days':
  //       baseData = baseData.map(item => ({
  //         ...item,
  //         collections: Math.floor(item.collections * 0.8),
  //         revenue: Math.floor(item.revenue * 0.8)
  //       }));
  //       break;
  //     case 'last3months':
  //       baseData = baseData.map(item => ({
  //         ...item,
  //         collections: Math.floor(item.collections * 1.2),
  //         revenue: Math.floor(item.revenue * 1.2)
  //       }));
  //       break;
  //     case 'last6months':
  //       baseData = baseData.map(item => ({
  //         ...item,
  //         collections: Math.floor(item.collections * 1.5),
  //         revenue: Math.floor(item.revenue * 1.5)
  //       }));
  //       break;
  //     case 'lastyear':
  //       baseData = baseData.map(item => ({
  //         ...item,
  //         collections: Math.floor(item.collections * 2.0),
  //         revenue: Math.floor(item.revenue * 2.0)
  //       }));
  //       break;
  //   }
    
  //   // Apply district filter
  //   if (collectorDistrictFilter !== 'all') {
  //     const selectedDistrict = districts.find(d => d._id === collectorDistrictFilter);
  //     if (selectedDistrict) {
  //       baseData = baseData.filter(item => item.district === selectedDistrict.name);
  //     }
  //   }
    
  //   // Apply status filter
  //   if (collectorStatusFilter === 'active') {
  //     baseData = baseData.filter(item => item.status === 'active');
  //   } else if (collectorStatusFilter === 'inactive') {
  //     baseData = baseData.filter(item => item.status === 'inactive');
  //   }
    
  //   // Apply sorting
  //   if (collectorSortBy === 'collections') {
  //     baseData.sort((a, b) => b.collections - a.collections);
  //   } else if (collectorSortBy === 'revenue') {
  //     baseData.sort((a, b) => b.revenue - a.revenue);
  //   } else if (collectorSortBy === 'rating') {
  //     baseData.sort((a, b) => b.rating - a.rating);
  //   } else if (collectorSortBy === 'name') {
  //     baseData.sort((a, b) => a.name.localeCompare(b.name));
  //   }
    
  //   // Apply limit
  //   if (collectorLimit !== 'all') {
  //     const limit = parseInt(collectorLimit);
  //     baseData = baseData.slice(0, limit);
  //   }
    
  //   return baseData;
  // }, [collectorTimeFilter, collectorDistrictFilter, collectorServiceAreaFilter, collectorStatusFilter, collectorSortBy, collectorLimit, districts]);
  
  // Most collected items - now dynamic based on filters
  // const topItemsData = useMemo(() => {
  //   // This would be replaced with actual API call based on filters
  //   let baseData = [
  //     { name: 'Cardboard', quantity: 25, revenue: 2000, category: 'paper', district: 'Palakkad' },
  //     { name: 'Paper', quantity: 28, revenue: 2500, category: 'paper', district: 'Malappuram' },
  //     { name: 'Glass', quantity: 10, revenue: 1000, category: 'glass', district: 'Kozhikode' },
  //     { name: 'Plastic', quantity: 19, revenue: 1500, category: 'plastic', district: 'Thrissur' },
  //     { name: 'Metal', quantity: 17, revenue: 2000, category: 'metal', district: 'Ernakulam' },
  //     { name: 'Aluminum', quantity: 12, revenue: 1800, category: 'metal', district: 'Palakkad' },
  //     { name: 'Textiles', quantity: 8, revenue: 1200, category: 'textile', district: 'Malappuram' },
  //     { name: 'Electronics', quantity: 5, revenue: 3000, category: 'electronics', district: 'Thrissur' },
  //   ];
    
  //   // Apply time-based filters
  //   switch (itemTimeFilter) {
  //     case 'last7days':
  //       baseData = baseData.map(item => ({
  //         ...item,
  //         quantity: Math.floor(item.quantity * 0.3),
  //         revenue: Math.floor(item.revenue * 0.3)
  //       }));
  //       break;
  //     case 'last30days':
  //       baseData = baseData.map(item => ({
  //         ...item,
  //         quantity: Math.floor(item.quantity * 0.8),
  //         revenue: Math.floor(item.revenue * 0.8)
  //       }));
  //       break;
  //     case 'last3months':
  //       baseData = baseData.map(item => ({
  //         ...item,
  //         quantity: Math.floor(item.quantity * 1.2),
  //         revenue: Math.floor(item.revenue * 1.2)
  //       }));
  //       break;
  //     case 'last6months':
  //       baseData = baseData.map(item => ({
  //         ...item,
  //         quantity: Math.floor(item.quantity * 1.5),
  //         revenue: Math.floor(item.revenue * 1.5)
  //       }));
  //       break;
  //     case 'lastyear':
  //       baseData = baseData.map(item => ({
  //         ...item,
  //         quantity: Math.floor(item.quantity * 2.0),
  //         revenue: Math.floor(item.revenue * 2.0)
  //       }));
  //       break;
  //   }
    
  //   // Apply district filter
  //   if (itemDistrictFilter !== 'all') {
  //     const selectedDistrict = districts.find(d => d._id === itemDistrictFilter);
  //     if (selectedDistrict) {
  //       baseData = baseData.filter(item => item.district === selectedDistrict.name);
  //     }
  //   }
    
  //   // Apply category filter
  //   if (itemCategoryFilter !== 'all') {
  //     baseData = baseData.filter(item => item.category === itemCategoryFilter);
  //   }
    
  //   // Apply sorting
  //   if (itemSortBy === 'quantity') {
  //     baseData.sort((a, b) => b.quantity - a.quantity);
  //   } else if (itemSortBy === 'revenue') {
  //     baseData.sort((a, b) => b.revenue - a.revenue);
  //   } else if (itemSortBy === 'name') {
  //     baseData.sort((a, b) => a.name.localeCompare(b.name));
  //   }
    
  //   // Apply limit
  //   if (itemLimit !== 'all') {
  //     const limit = parseInt(itemLimit);
  //     baseData = baseData.slice(0, limit);
  //   }
    
  //   return baseData;
  // }, [itemTimeFilter, itemDistrictFilter, itemServiceAreaFilter, itemCategoryFilter, itemSortBy, itemLimit, districts]);

  // const dashboardData = [
  //   {
  //     title: 'Total Collections',
  //     value: '10',
  //     color: 'bg-white border-l-4 border-emerald-400',
  //     iconColor: 'text-emerald-400'
  //   },
  //   {
  //     title: 'Total Revenue',
  //     value: '₹2460',
  //     color: 'bg-white border-l-4 border-sky-400',
  //     iconColor: 'text-sky-400'
  //   },
  //   {
  //     title: 'Active Collectors',
  //     value: '5',
  //     color: 'bg-white border-l-4 border-violet-400',
  //     iconColor: 'text-violet-400'
  //   },
  //   {
  //     title: 'Pending Collections',
  //     value: '12',
  //     color: 'bg-white border-l-4 border-amber-400',
  //     iconColor: 'text-amber-400'
  //   }
  // ]
  
  // Colors for charts
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // New state for revenue filters
  const [dateFilter, setDateFilter] = useState('last7days');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    fetchDistricts();
    fetchRevenueData();
    fetchDashboardData();
    fetchCollectionGraphData();
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
    fetchRevenueData();
  }, [selectedDistrict, selectedServiceArea, dateFilter, startDate, endDate]);

  const fetchDashboardData = async () => {
    const response = await getDashboardData();
    console.log("dashboard data",response);
    if (response.success) {
      setDashboardData(response.data);
    }
  };

  const fetchCollectionGraphData = async () => {
    try {
      const response = await getCollectionGraphData();
      console.log("collection graph data", response);
      if (response.success) {
        setCollectionGraphData(response.data);
      }
    } catch (error) {
      console.log('Failed to fetch collection graph data:', error);
    }
  };

  const fetchDistricts = async () => {
    try {
      const res: ApiResponse<IDistrict[]> = await getDistricts();

      if (res.success) {
        setDistricts(res.data);
      }
    } catch (error) {
      console.log('Failed to fetch districts:',error);
    }
  };

  const fetchServiceAreas = async (district: string) => {
    try {
      const res: ApiResponse<IServiceArea[]> = await getServiceAreas(district);
      if (res.success) {
        setServiceAreas(res.data);
      }
    } catch (error) {
      console.log('Failed to fetch service areas:',error);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const params = {
        districtId: selectedDistrict === 'all' ? undefined : selectedDistrict,
        serviceAreaId: selectedServiceArea === 'all' ? undefined : selectedServiceArea,
        dateFilter: dateFilter,
        startDate: startDate,
        endDate: endDate
      };
      const response = await getRevenueData(params);
      if (response.success) {
        setRevenueData(response.data);
      }
    } catch (error) {
      console.log('Failed to fetch revenue data:',error);
    }
  };

  // Remove the dummy data generation function and use revenueData directly
  const getRevenueData1 = useMemo(() => {
    return revenueData.map(item => ({
      date: item.date,
      waste: item.waste,
      scrap: item.scrap,
      total: item.total,
      wasteCollections: item.wasteCollections,
      scrapCollections: item.scrapCollections
    }));
  }, [revenueData]);

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-6 py-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border-l-4 border-emerald-400 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-base font-medium mb-1">Total Collections</h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.totalCollections || 0}</p>
              </div>
              <div className="text-emerald-400 opacity-80">
                {/* Icon would go here */}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-l-4 border-sky-400 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-base font-medium mb-1">Total Revenue</h3>
                <p className="text-2xl font-bold text-gray-800">₹{dashboardData.totalRevenue || 0}</p>
              </div>
              <div className="text-sky-400 opacity-80">
                {/* Icon would go here */}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-l-4 border-violet-400 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-base font-medium mb-1">Waste Collections</h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.wasteCollections || 0}</p>
              </div>
              <div className="text-violet-400 opacity-80">
                {/* Icon would go here */}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-l-4 border-amber-400 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-base font-medium mb-1">Scrap Collections</h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.scrapCollections || 0}</p>
              </div>
              <div className="text-amber-400 opacity-80">
                {/* Icon would go here */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Graph Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Revenue Overview</h2>
        
        {/* Filters Section */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* District Filter */}
          <div className="relative">
            <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700">
              District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              {districts.map((district) => (
                <option key={district._id} value={district._id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          {/* Service Area Filter */}
          <div className="relative">
            <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700">
              Service Area
            </label>
            <select
              value={selectedServiceArea}
              onChange={(e) => setSelectedServiceArea(e.target.value)}
              disabled={selectedDistrict === 'all'}
              className="border rounded-md px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              
            >
              <option value="all">All</option>
              {serviceAreas.map((area) => (
                <option key={area._id} value={area._id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700">
              Date Range
            </label>
            <div className="flex items-center gap-2">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 Days</option>
                <option value="thismonth">This Month</option>
                <option value="lastmonth">Last Month</option>
                <option value="thisyear">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
              {dateFilter === 'custom' && (
                <div className="flex gap-2">
                  <div className="relative">
                    <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700 z-10">
                      Start Date
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date || undefined)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText=""
                        className="border rounded-md pl-3 pr-8 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FaCalendarAlt className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700 z-10">
                      End Date
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date || undefined)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        placeholderText=""
                        className="border rounded-md pl-3 pr-8 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FaCalendarAlt className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Revenue Graph */}
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getRevenueData1}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={dateFilter === 'thismonth' || dateFilter === 'lastmonth' ? -45 : 0}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  const formattedValue = `₹${Math.abs(value).toLocaleString()}`;
                  if (name === 'Waste Revenue') {
                    return [formattedValue, 'Waste Revenue'];
                  } else if (name === 'Scrap Expense') {
                    return [formattedValue, 'Scrap Expense'];
                  } else {
                    return [formattedValue, 'Net Total'];
                  }
                }}
                labelFormatter={(label) => {
                  const tooltipDataPoint = getRevenueData1.find(d => d.date === label);
                  return (
                    <span>
                      <span>Date: {label}</span>
                      {tooltipDataPoint && (
                        <span className="text-xs text-gray-500 mt-1 block">
                          <span>Waste Collections: {tooltipDataPoint.wasteCollections}</span>
                          <span>Scrap Collections: {tooltipDataPoint.scrapCollections}</span>
                        </span>
                      )}
                    </span>
                  );
                }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  padding: '0.5rem'
                }}
              />
              <Legend />
              <Bar dataKey="waste" name="Waste Revenue" fill="#0088FE" />
              <Bar dataKey="scrap" name="Scrap Expense" fill="#FF8042" />
              <Bar dataKey="total" name="Net Total" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time range selector */}
      {/* <div className="mt-6 flex justify-end">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              timeRange === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Week
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 text-sm font-medium ${
              timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Month
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              timeRange === 'year' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Year
          </button>
        </div>
      </div> */}

      {/* Charts Row 1 - Collection Type and Status */}
      <div className="mt-6">
        {/* Chart Filters */}
        {/* <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Chart Filters</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"> */}
            {/* Time Filter */}
            {/* <div className="relative">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700">
                Time Period
              </label>
              <select
                value={chartTimeFilter}
                onChange={(e) => setChartTimeFilter(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last3months">Last 3 Months</option>
                <option value="last6months">Last 6 Months</option>
                <option value="lastyear">Last Year</option>
                <option value="alltime">All Time</option>
              </select>
            </div> */}

            {/* District Filter */}
            {/* <div className="relative">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700">
                District
              </label>
              <select
                value={chartDistrictFilter}
                onChange={(e) => setChartDistrictFilter(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Districts</option>
                {districts.map((district) => (
                  <option key={district._id} value={district._id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Service Area Filter */}
            {/* <div className="relative">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700">
                Service Area
              </label>
              <select
                value={chartServiceAreaFilter}
                onChange={(e) => setChartServiceAreaFilter(e.target.value)}
                disabled={chartDistrictFilter === 'all'}
                className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Areas</option>
                {serviceAreas.map((area) => (
                  <option key={area._id} value={area._id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Status Filter */}
            {/* <div className="relative">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700">
                Status
              </label>
              <select
                value={chartStatusFilter}
                onChange={(e) => setChartStatusFilter(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Only</option>
                <option value="scheduled">Scheduled Only</option>
                <option value="inprogress">In Progress Only</option>
                <option value="completed">Completed Only</option>
                <option value="cancelled">Cancelled Only</option>
                <option value="active">Active (Pending + Scheduled + In Progress)</option>
                <option value="inactive">Inactive (Completed + Cancelled)</option>
              </select>
            </div> */}

            {/* Collector Filter */}
            {/* <div className="relative">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700">
                Collector
              </label>
              <select
                value={chartCollectorFilter}
                onChange={(e) => setChartCollectorFilter(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Collectors</option>
                <option value="top5">Top 5 Collectors</option>
                <option value="active">Active Collectors Only</option>
                <option value="inactive">Inactive Collectors Only</option>
              </select>
            </div> */}

            {/* Revenue Filter */}
            {/* <div className="relative">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700">
                Revenue Range
              </label>
              <select
                value={chartRevenueFilter}
                onChange={(e) => setChartRevenueFilter(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Collections</option>
                <option value="high">High Value (₹500+)</option>
                <option value="medium">Medium Value (₹100-500)</option>
                <option value="low">Low Value (Below ₹100)</option>
                <option value="custom">Custom Range</option>
              </select>
            </div> */}

            {/* Reset Filters Button */}
            {/* <div className="flex items-end">
              <button
                onClick={() => {
                  setChartTimeFilter('last30days');
                  setChartDistrictFilter('all');
                  setChartServiceAreaFilter('all');
                  setChartStatusFilter('all');
                  setChartCollectorFilter('all');
                  setChartRevenueFilter('all');
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
              >
                Reset Filters
              </button>
            </div> */}
          {/* </div>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collection Type Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Collection Type Distribution</h2>
            <div className="text-sm text-gray-500">
              Total: {collectionTypeData.reduce((sum, item) => sum + item.count, 0)} collections
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={collectionTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                label={({type, percent}) => `${type}: ${(percent * 100).toFixed(0)}%`}
              >
                {collectionTypeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value} collections (${((value / collectionTypeData.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%)`,
                  name
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  padding: '0.5rem'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Collection Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Collection Status</h2>
            <div className="text-sm text-gray-500">
              Total: {statusData.reduce((sum, item) => sum + item.count, 0)} collections
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                label={({status, percent}) => `${status}: ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value} collections (${((value / statusData.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%)`,
                  name
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  padding: '0.5rem'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        </div>
      </div>

      {/* Charts Row 2 - Revenue and Trends */}
      <div className="mt-6 grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">

          {/* <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Revenue by District</h2>
            <div className="text-sm text-gray-500">
              Total Revenue: ₹{districtRevenueData.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
            </div>
          </div> */}
          
          {/* Revenue Chart Filters */}
          {/* <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold mb-3 text-gray-600">Revenue Chart Filters</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 "> */}
              
              {/* <div className="relative">
                <label className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs font-medium text-gray-700">
                  Time Period
                </label>
                <select
                  value={revenueTimeFilter}
                  onChange={(e) => setRevenueTimeFilter(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last3months">Last 3 Months</option>
                  <option value="last6months">Last 6 Months</option>
                  <option value="lastyear">Last Year</option>
                  <option value="alltime">All Time</option>
                </select>
              </div> */}

              {/* Service Area Filter */}
              {/* <div className="relative">
                <label className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs font-medium text-gray-700">
                  Service Area
                </label>
                <select
                  value={revenueServiceAreaFilter}
                  onChange={(e) => setRevenueServiceAreaFilter(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Areas</option>
                  {serviceAreas.map((area) => (
                    <option key={area._id} value={area._id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* Status Filter */}
              {/* <div className="relative">
                <label className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={revenueStatusFilter}
                  onChange={(e) => setRevenueStatusFilter(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed Only</option>
                  <option value="pending">Pending Only</option>
                  <option value="scheduled">Scheduled Only</option>
                  <option value="inprogress">In Progress Only</option>
                  <option value="cancelled">Cancelled Only</option>
                </select>
              </div> */}

              {/* Revenue Type Filter */}
              {/* <div className="relative">
                <label className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs font-medium text-gray-700">
                  Revenue Type
                </label>
                <select
                  value={revenueTypeFilter}
                  onChange={(e) => setRevenueTypeFilter(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="waste">Waste Only</option>
                  <option value="scrap">Scrap Only</option>
                </select>
              </div> */}

              {/* Sort By Filter */}
              {/* <div className="relative">
                <label className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs font-medium text-gray-700">
                  Sort By
                </label>
                <select
                  value={revenueSortBy}
                  onChange={(e) => setRevenueSortBy(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="total">Total Revenue</option>
                  <option value="waste">Waste Revenue</option>
                  <option value="scrap">Scrap Revenue</option>
                  <option value="district">District Name</option>
                </select>
              </div> */}

              {/* Reset Revenue Filters Button */}
              {/* <div className="flex items-end">
                <button
                  onClick={() => {
                    setRevenueTimeFilter('last30days');
                    setRevenueServiceAreaFilter('all');
                    setRevenueStatusFilter('all');
                    setRevenueCollectorFilter('all');
                    setRevenueTypeFilter('all');
                    setRevenueSortBy('total');
                  }}
                  className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm w-full"
                >
                  Reset
                </button>
              </div> */}
            {/* </div>
          </div> */}
          {/* <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={districtRevenueData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="district" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  const formattedValue = `₹${Math.abs(value).toLocaleString()}`;
                  if (name === 'Waste Revenue') {
                    return [formattedValue, 'Waste Revenue'];
                  } else if (name === 'Scrap Revenue') {
                    return [formattedValue, 'Scrap Revenue'];
                  } else {
                    return [formattedValue, 'Total Revenue'];
                  }
                }}
                labelFormatter={(label) => {
                  const tooltipDataPoint = districtRevenueData.find(d => d.district === label);
                  return (
                    <span>
                      <span>District: {label}</span>
                      {tooltipDataPoint && (
                        <span className="text-xs text-gray-500 mt-1 block">
                          <span>Total: ₹{tooltipDataPoint.total.toLocaleString()}</span>
                        </span>
                      )}
                    </span>
                  );
                }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  padding: '0.5rem'
                }}
              />
              <Legend />
              <Bar dataKey="waste" name="Waste Revenue" fill="#0088FE" />
              <Bar dataKey="scrap" name="Scrap Revenue" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer> */}
          
          {/* Revenue Summary */}
          {/* <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Top District</div>
              <div className="text-lg font-bold text-blue-800">
                {districtRevenueData.length > 0 ? districtRevenueData[0].district : 'N/A'}
              </div>
              <div className="text-xs text-blue-600">
                ₹{districtRevenueData.length > 0 ? districtRevenueData[0].total.toLocaleString() : '0'}
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Avg per District</div>
              <div className="text-lg font-bold text-green-800">
                ₹{districtRevenueData.length > 0 ? Math.floor(districtRevenueData.reduce((sum, item) => sum + item.total, 0) / districtRevenueData.length).toLocaleString() : '0'}
              </div>
              <div className="text-xs text-green-600">
                {districtRevenueData.length} districts
              </div>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Waste Revenue</div>
              <div className="text-lg font-bold text-purple-800">
                ₹{districtRevenueData.reduce((sum, item) => sum + item.waste, 0).toLocaleString()}
              </div>
              <div className="text-xs text-purple-600">
                {((districtRevenueData.reduce((sum, item) => sum + item.waste, 0) / districtRevenueData.reduce((sum, item) => sum + item.total, 0)) * 100).toFixed(1)}% of total
              </div>
            </div>
            
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-sm text-orange-600 font-medium">Scrap Revenue</div>
              <div className="text-lg font-bold text-orange-800">
                ₹{districtRevenueData.reduce((sum, item) => sum + item.scrap, 0).toLocaleString()}
              </div>
              <div className="text-xs text-orange-600">
                {((districtRevenueData.reduce((sum, item) => sum + item.scrap, 0) / districtRevenueData.reduce((sum, item) => sum + item.total, 0)) * 100).toFixed(1)}% of total
              </div>
            </div>
          </div> */}
        </div>

        {/* Monthly Collection Trends */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Monthly Collection Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyTrendsData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="waste" name="Waste Collections" fill="#8884d8" />
              <Bar dataKey="scrap" name="Scrap Collections" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div> */}
      </div>

      {/* Tables Row - Top Collectors and Top Items */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Collectors */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Top Collectors</h2>
            <div className="text-sm text-gray-500">
              Total: {collectorPerformanceData.length} collectors
            </div>
          </div> */}
          
          {/* Collector Table Filters */}
          {/* <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold mb-3 text-gray-600">Collector Table Filters</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"> */}
              {/* Time Filter */}
              {/* <div className="relative">
                <label className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs font-medium text-gray-700">
                  Time Period
                </label>
                <select
                  value={collectorTimeFilter}
                  onChange={(e) => setCollectorTimeFilter(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last3months">Last 3 Months</option>
                  <option value="last6months">Last 6 Months</option>
                  <option value="lastyear">Last Year</option>
                  <option value="alltime">All Time</option>
                </select>
              </div> */}

              {/* District Filter */}
              {/* <div className="relative">
                <label className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs font-medium text-gray-700">
                  District
                </label>
                <select
                  value={collectorDistrictFilter}
                  onChange={(e) => setCollectorDistrictFilter(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Districts</option>
                  {districts.map((district) => (
                    <option key={district._id} value={district._id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* Status Filter */}
              {/* <div className="relative">
                <label className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={collectorStatusFilter}
                  onChange={(e) => setCollectorStatusFilter(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div> */}

              {/* Sort By Filter */}
              {/* <div className="relative">
                <label className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs font-medium text-gray-700">
                  Sort By
                </label>
                <select
                  value={collectorSortBy}
                  onChange={(e) => setCollectorSortBy(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="revenue">Revenue</option>
                  <option value="collections">Collections</option>
                  <option value="rating">Rating</option>
                  <option value="name">Name</option>
                </select>
              </div> */}

              {/* Limit Filter */}
              {/* <div className="relative">
                <label className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs font-medium text-gray-700">
                  Show Top
                </label>
                <select
                  value={collectorLimit}
                  onChange={(e) => setCollectorLimit(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="3">Top 3</option>
                  <option value="5">Top 5</option>
                  <option value="10">Top 10</option>
                </select>
              </div> */}

              {/* Reset Button */}
              {/* <div className="flex items-end">
                <button
                  onClick={() => {
                    setCollectorTimeFilter('last30days');
                    setCollectorDistrictFilter('all');
                    setCollectorServiceAreaFilter('all');
                    setCollectorStatusFilter('all');
                    setCollectorSortBy('revenue');
                    setCollectorLimit('all');
                  }}
                  className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm w-full"
                >
                  Reset
                </button>
              </div> */}
            {/* </div>
          </div> */}

          {/* <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Collector
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Collections
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {collectorPerformanceData.map((collector, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b border-gray-200">{collector.name}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{collector.collections}</td>
                    <td className="py-2 px-4 border-b border-gray-200">₹{collector.revenue.toLocaleString()}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{collector.rating}/5.0</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
          
          {/* Collector Summary */}
          {/* <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Top Performer</div>
              <div className="text-lg font-bold text-blue-800">
                {collectorPerformanceData.length > 0 ? collectorPerformanceData[0].name : 'N/A'}
              </div>
              <div className="text-xs text-blue-600">
                ₹{collectorPerformanceData.length > 0 ? collectorPerformanceData[0].revenue.toLocaleString() : '0'} revenue
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Total Revenue</div>
              <div className="text-lg font-bold text-green-800">
                ₹{collectorPerformanceData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
              </div>
              <div className="text-xs text-green-600">
                {collectorPerformanceData.length} collectors
              </div>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Total Collections</div>
              <div className="text-lg font-bold text-purple-800">
                {collectorPerformanceData.reduce((sum, item) => sum + item.collections, 0)}
              </div>
              <div className="text-xs text-purple-600">
                collections
              </div>
            </div>
            
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-sm text-orange-600 font-medium">Avg Rating</div>
              <div className="text-lg font-bold text-orange-800">
                {collectorPerformanceData.length > 0 ? (collectorPerformanceData.reduce((sum, item) => sum + item.rating, 0) / collectorPerformanceData.length).toFixed(1) : '0.0'}/5.0
              </div>
              <div className="text-xs text-orange-600">
                average
              </div>
            </div>
          </div> */}
        {/* </div> */}

        {/* Top Items */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border"> */}
          {/* <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Most Collected Items</h2>
            <div className="text-sm text-gray-500">
              Total: {topItemsData.length} items
            </div>
          </div> */}
          
          {/* Items Table Filters */}
          {/* <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold mb-3 text-gray-600">Items Table Filters</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"> */}

              {/* Time Filter */}
              {/* <div className="relative">
                <label className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs font-medium text-gray-700">
                  Time Period
                </label>
                <select
                  value={itemTimeFilter}
                  onChange={(e) => setItemTimeFilter(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last3months">Last 3 Months</option>
                  <option value="last6months">Last 6 Months</option>
                  <option value="lastyear">Last Year</option>
                  <option value="alltime">All Time</option>
                </select>
              </div> */}

              {/* District Filter */}
              {/* <div className="relative">
                <label className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs font-medium text-gray-700">
                  District
                </label>
                <select
                  value={itemDistrictFilter}
                  onChange={(e) => setItemDistrictFilter(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Districts</option>
                  {districts.map((district) => (
                    <option key={district._id} value={district._id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* Category Filter */}
              {/* <div className="relative">
                <label className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={itemCategoryFilter}
                  onChange={(e) => setItemCategoryFilter(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="paper">Paper</option>
                  <option value="glass">Glass</option>
                  <option value="plastic">Plastic</option>
                  <option value="metal">Metal</option>
                  <option value="textile">Textile</option>
                  <option value="electronics">Electronics</option>
                </select>
              </div> */}

              {/* Sort By Filter */}
              {/* <div className="relative">
                <label className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs font-medium text-gray-700">
                  Sort By
                </label>
                <select
                  value={itemSortBy}
                  onChange={(e) => setItemSortBy(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="revenue">Revenue</option>
                  <option value="quantity">Quantity</option>
                  <option value="name">Name</option>
                </select>
              </div> */}

              {/* Limit Filter */}
              {/* <div className="relative">
                <label className="absolute -top-2 left-2 bg-gray-50 px-1 text-xs font-medium text-gray-700">
                  Show Top
                </label>
                <select
                  value={itemLimit}
                  onChange={(e) => setItemLimit(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="3">Top 3</option>
                  <option value="5">Top 5</option>
                  <option value="10">Top 10</option>
                </select>
              </div> */}

              {/* Reset Button */}
              {/* <div className="flex items-end">
                <button
                  onClick={() => {
                    setItemTimeFilter('last30days');
                    setItemDistrictFilter('all');
                    setItemServiceAreaFilter('all');
                    setItemCategoryFilter('all');
                    setItemSortBy('revenue');
                    setItemLimit('all');
                  }}
                  className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm w-full"
                >
                  Reset
                </button>
              </div> */}
            {/* </div>
          </div> */}

          {/* <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {topItemsData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b border-gray-200">{item.name}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{item.quantity} kg</td>
                    <td className="py-2 px-4 border-b border-gray-200">₹{item.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
          
          {/* Items Summary */}
          {/* <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Top Item</div>
              <div className="text-lg font-bold text-blue-800">
                {topItemsData.length > 0 ? topItemsData[0].name : 'N/A'}
              </div>
              <div className="text-xs text-blue-600">
                ₹{topItemsData.length > 0 ? topItemsData[0].revenue.toLocaleString() : '0'} revenue
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Total Revenue</div>
              <div className="text-lg font-bold text-green-800">
                ₹{topItemsData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
              </div>
              <div className="text-xs text-green-600">
                {topItemsData.length} items
              </div>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Total Quantity</div>
              <div className="text-lg font-bold text-purple-800">
                {topItemsData.reduce((sum, item) => sum + item.quantity, 0)} kg
              </div>
              <div className="text-xs text-purple-600">
                collected
              </div>
            </div>
            
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-sm text-orange-600 font-medium">Avg per Item</div>
              <div className="text-lg font-bold text-orange-800">
                ₹{topItemsData.length > 0 ? Math.floor(topItemsData.reduce((sum, item) => sum + item.revenue, 0) / topItemsData.length).toLocaleString() : '0'}
              </div>
              <div className="text-xs text-orange-600">
                revenue
              </div>
            </div>
          </div> */}

        {/* </div> */}
      </div>
    </main>
  );
};

export default AdminDashboard;