import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from "react-icons/fa";
import { getDistricts, getServiceAreas } from '../../services/locationService';
import { getRevenueData } from '../../services/collectionService';

interface IDistrict {
  _id: string;
  name: string;
}

interface IServiceArea {
  _id: string;
  name: string;
}

interface IRevenueData {
  date: string;
  waste: number;
  scrap: number;
  total: number;
  wasteCollections: number;
  scrapCollections: number;
}

const AdminDashboard:React.FC = () => {

  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [serviceAreas, setServiceAreas] = useState<IServiceArea[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedServiceArea, setSelectedServiceArea] = useState<string>('all');
  const [revenueData, setRevenueData] = useState<IRevenueData[]>([]);
  const [timeRange, setTimeRange] = useState('month');
  
  // Collection type distribution
  const collectionTypeData = [
    { name: 'Waste', value: 65 },
    { name: 'Scrap', value: 35 },
  ];
  
  // Revenue by district
  const districtRevenueData = [
    { district: 'North', waste: 12500, scrap: 18000 },
    { district: 'South', waste: 9800, scrap: 15200 },
    { district: 'East', waste: 7600, scrap: 11000 },
    { district: 'West', waste: 11200, scrap: 14500 },
    { district: 'Central', waste: 13400, scrap: 19800 },
  ];
  
  // Collection status distribution
  const statusData = [
    { name: 'Pending', value: 15 },
    { name: 'Scheduled', value: 25 },
    { name: 'In Progress', value: 20 },
    { name: 'Completed', value: 35 },
    { name: 'Cancelled', value: 5 },
  ];
  
  // Monthly collection trends
  const monthlyTrendsData = [
    { month: 'Jan', waste: 65, scrap: 45 },
    { month: 'Feb', waste: 75, scrap: 48 },
    { month: 'Mar', waste: 82, scrap: 52 },
    { month: 'Apr', waste: 70, scrap: 55 },
    { month: 'May', waste: 85, scrap: 62 },
    { month: 'Jun', waste: 90, scrap: 68 },
  ];
  
  // Top collector performance
  const collectorPerformanceData = [
    { name: 'John D.', collections: 52, revenue: 15800, rating: 4.8 },
    { name: 'Sarah K.', collections: 48, revenue: 14200, rating: 4.9 },
    { name: 'Mike T.', collections: 43, revenue: 12900, rating: 4.7 },
    { name: 'Lisa M.', collections: 41, revenue: 12400, rating: 4.6 },
  ];
  
  // Most collected items
  const topItemsData = [
    { name: 'Cardboard', quantity: 325, revenue: 5200 },
    { name: 'Paper', quantity: 280, revenue: 4200 },
    { name: 'Glass', quantity: 210, revenue: 3800 },
    { name: 'Plastic', quantity: 195, revenue: 3500 },
    { name: 'Metal', quantity: 175, revenue: 6200 },
  ];
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // New state for revenue filters
  const [dateFilter, setDateFilter] = useState('today');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    fetchDistricts();
    fetchRevenueData();
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

  const fetchDistricts = async () => {
    try {
      const response = await getDistricts();
      if (response.success) {
        setDistricts(response.data);
      }
    } catch (error) {
      console.log('Failed to fetch districts:',error);
    }
  };

  const fetchServiceAreas = async (district: string) => {
    try {
      const response = await getServiceAreas(district);
      if (response.success) {
        setServiceAreas(response.data);
      }
    } catch (error) {
      console.log('Failed to fetch service areas:',error);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const params = {
        district: selectedDistrict,
        serviceArea: selectedServiceArea,
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
        {[
          {
            title: 'Total Collections',
            value: '10',
            color: 'bg-white border-l-4 border-emerald-400',
            iconColor: 'text-emerald-400'
          },
          {
            title: 'Total Revenue',
            value: '₹2460',
            color: 'bg-white border-l-4 border-sky-400',
            iconColor: 'text-sky-400'
          },
          {
            title: 'Active Collectors',
            value: '5',
            color: 'bg-white border-l-4 border-violet-400',
            iconColor: 'text-violet-400'
          },
          {
            title: 'Pending Collections',
            value: '12',
            color: 'bg-white border-l-4 border-amber-400',
            iconColor: 'text-amber-400'
          }
        ].map((card, index) => (
          <div key={index}
            className={`${card.color} rounded-lg shadow-sm hover:shadow-md transition-all duration-300`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-600 text-base font-medium mb-1">{card.title}</h3>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`${card.iconColor} opacity-80`}>
                  {/* Icon would go here */}
                </div>
              </div>
            </div>
          </div>
        ))}
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
      <div className="mt-6 flex justify-end">
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
      </div>

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
                {collectionTypeData.map((entry, index) => (
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
                {statusData.map((entry, index) => (
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
                    <td className="py-2 px-4 border-b border-gray-200">${collector.revenue.toLocaleString()}</td>
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
                    <td className="py-2 px-4 border-b border-gray-200">${item.revenue.toLocaleString()}</td>
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