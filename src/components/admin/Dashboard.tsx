import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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