import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from "react-icons/fa";


const AdminDashboard:React.FC = () => {
  // Sample data - in a real implementation, you would fetch this from your MongoDB
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
  const [districtFilter, setDistrictFilter] = useState('all');
  const [serviceAreaFilter, setServiceAreaFilter] = useState('all');

  // Sample data for different time ranges
  const getRevenueData = useMemo(() => {
    switch (dateFilter) {
      case 'today':
      case 'yesterday':
        // Single day data
        return [
          { 
            date: 'Today', 
            waste: 15000, 
            scrap: -8000,
            total: 7000
          }
        ];
      
      case 'last7days':
        // Daily data for last 7 days
        return [
          { date: 'Mon', waste: 15000, scrap: -8000, total: 7000 },
          { date: 'Tue', waste: 18000, scrap: -9500, total: 8500 },
          { date: 'Wed', waste: 12000, scrap: -6500, total: 5500 },
          { date: 'Thu', waste: 20000, scrap: -11000, total: 9000 },
          { date: 'Fri', waste: 16000, scrap: -9000, total: 7000 },
          { date: 'Sat', waste: 14000, scrap: -7500, total: 6500 },
          { date: 'Sun', waste: 17000, scrap: -8500, total: 8500 }
        ];
      
      case 'thismonth':
        // Daily data for current month
        return Array.from({ length: 30 }, (_, i) => ({
          date: `${i + 1}`,
          waste: Math.floor(Math.random() * 20000) + 10000,
          scrap: -(Math.floor(Math.random() * 10000) + 5000),
          total: Math.floor(Math.random() * 10000) + 5000
        }));
      
      case 'lastmonth':
        // Daily data for last month
        return Array.from({ length: 31 }, (_, i) => ({
          date: `${i + 1}`,
          waste: Math.floor(Math.random() * 20000) + 10000,
          scrap: -(Math.floor(Math.random() * 10000) + 5000),
          total: Math.floor(Math.random() * 10000) + 5000
        }));
      
      case 'thisyear':
        // Monthly data for current year
        return [
          { date: 'Jan', waste: 450000, scrap: -240000, total: 210000 },
          { date: 'Feb', waste: 480000, scrap: -250000, total: 230000 },
          { date: 'Mar', waste: 420000, scrap: -220000, total: 200000 },
          { date: 'Apr', waste: 460000, scrap: -230000, total: 230000 },
          { date: 'May', waste: 490000, scrap: -260000, total: 230000 },
          { date: 'Jun', waste: 440000, scrap: -210000, total: 230000 },
          { date: 'Jul', waste: 470000, scrap: -240000, total: 230000 },
          { date: 'Aug', waste: 430000, scrap: -220000, total: 210000 },
          { date: 'Sep', waste: 460000, scrap: -230000, total: 230000 },
          { date: 'Oct', waste: 480000, scrap: -250000, total: 230000 },
          { date: 'Nov', waste: 450000, scrap: -240000, total: 210000 },
          { date: 'Dec', waste: 500000, scrap: -270000, total: 230000 }
        ];
      
      case 'custom':
        // For custom range, we'll show daily data
        if (startDate && endDate) {
          const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          return Array.from({ length: days + 1 }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            return {
              date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              waste: Math.floor(Math.random() * 20000) + 10000,
              scrap: -(Math.floor(Math.random() * 10000) + 5000),
              total: Math.floor(Math.random() * 10000) + 5000
            };
          });
        }
        return [];
      
      default:
        return [];
    }
  }, [dateFilter, startDate, endDate]);

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
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All </option>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
              <option value="central">Central</option>
            </select>
          </div>

          {/* Service Area Filter */}
          <div className="relative">
            <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-700">
              Service Area
            </label>
            <select
              value={serviceAreaFilter}
              onChange={(e) => setServiceAreaFilter(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All </option>
              <option value="area1">Area 1</option>
              <option value="area2">Area 2</option>
              <option value="area3">Area 3</option>
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
              data={getRevenueData}
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
                    return [formattedValue, 'Waste'];
                  } else if (name === 'Scrap Expense') {
                    return [formattedValue, 'Scrap'];
                  } else {
                    return [formattedValue, 'Net Total'];
                  }
                }}
                labelFormatter={(label) => `Date: ${label}`}
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