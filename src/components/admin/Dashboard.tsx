import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from "react-icons/fa";
import { getDistricts, getServiceAreas } from '../../services/locationService';
import { getDashboardData, getRevenueData } from '../../services/collectionService';
import { ApiResponse } from '../../types/common';
import { IDistrict, IServiceArea } from '../../types/location';


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
  // const [timeRange, setTimeRange] = useState('month');
  
  // Collection type distribution
  const collectionTypeData = [
    { name: 'Waste', value: 90 },
    { name: 'Scrap', value: 10 },
  ];
  
  // Revenue by district
  const districtRevenueData = [
    { district: 'Palakkad', waste: 1440, scrap:160 },
    { district: 'Malappuram', waste: 330, scrap: 222 },
    { district: 'Kozhikode', waste: 0, scrap: 0 },
  ];
  
  // Collection status distribution
  const statusData = [
    { name: 'Pending', value: 2 },
    { name: 'Scheduled', value: 5 },
    { name: 'In Progress', value: 2 },
    { name: 'Completed', value: 6 },
    { name: 'Cancelled', value: 2 },
  ];
  
  // Monthly collection trends
  const monthlyTrendsData = [
    { month: 'Jan', waste: 12, scrap: 4 },
    { month: 'Feb', waste: 8, scrap: 3 },
    { month: 'Mar', waste: 15, scrap: 2 },
    { month: 'Apr', waste: 7, scrap: 6 },
    { month: 'May', waste: 13, scrap: 4 },
    { month: 'Jun', waste: 8, scrap: 3 },
  ];
  
  // Top collector performance
  const collectorPerformanceData = [
    { name: 'collector.', collections: 5, revenue: 1500, rating: 4.8 },
    { name: 'Leo', collections: 4, revenue: 1400, rating: 4.9 },
    { name: 'John.', collections: 3, revenue: 1200, rating: 4.7 },
    { name: 'Rajesh', collections: 2, revenue: 1100, rating: 4.6 },
    { name: 'Alex', collections: 1, revenue: 1000, rating: 4.6 },
  ];
  
  // Most collected items
  const topItemsData = [
    { name: 'Cardboard', quantity: 25, revenue: 2000 },
    { name: 'Paper', quantity: 28, revenue: 2500 },
    { name: 'Glass', quantity: 10, revenue: 1000 },
    { name: 'Plastic', quantity: 19, revenue: 1500 },
    { name: 'Metal', quantity: 17, revenue: 2000 },
  ];

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
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collection Type Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Collection Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={collectionTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {collectionTypeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Collection Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Collection Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 - Revenue and Trends */}
      <div className="mt-6 grid grid-cols-1 gap-6">
        {/* Revenue by District */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Revenue by District</h2>
          <ResponsiveContainer width="100%" height={300}>
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
              <XAxis dataKey="district" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="waste" name="Waste Revenue" fill="#0088FE" />
              <Bar dataKey="scrap" name="Scrap Revenue" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Collection Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
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
        </div>
      </div>

      {/* Tables Row - Top Collectors and Top Items */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Collectors */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Top Collectors</h2>
          <div className="overflow-x-auto">
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
          </div>
        </div>

        {/* Top Items */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Most Collected Items</h2>
          <div className="overflow-x-auto">
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
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;