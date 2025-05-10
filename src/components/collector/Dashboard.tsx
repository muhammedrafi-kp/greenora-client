import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Package,
  TrendingUp,
  Truck,
  Star,
  Award,
  BarChart as BarChartIcon,
  CircleUser,
  ClipboardList,
  DollarSign,
  Target,
  CheckCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from "react-icons/fa";

const DashboardCard = ({ title, icon, children }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg border shadow-sm md:p-4 xs:p-3 p-2">
    <div className="flex items-center justify-between mb-2">
      <h3 className="md:text-sm xs:text-xs text-xxs font-medium">{title}</h3>
      {icon}
    </div>
    {children}
  </div>
);

const Dashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [dateFilter, setDateFilter] = useState('today');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Sample collector data - would be fetched from API in real implementation
  const collectorData = {
    name: "Alex Johnson",
    collectorId: "COL1245",
    performanceMetrics: {
      totalCollections: 328,
      averageRating: 4.8,
      onTimeRate: 92
    },
    currentTasks: 3,
    maxCapacity: 5,
    availabilityStatus: "available",
    weeklyEarnings: 2580,
    monthlyEarnings: 9450
  };

  // Collection stats data
  const collectionTypeData = [
    { name: 'Waste', value: 65 },
    { name: 'Scrap', value: 35 },
  ];

  // Monthly collections data
  const monthlyData = [
    { name: 'Jan', collections: 38, earnings: 9450 },
    { name: 'Feb', collections: 42, earnings: 8620 },
    { name: 'Mar', collections: 45, earnings: 9780 },
    { name: 'Apr', collections: 40, earnings: 9580 },
    { name: 'May', collections: 48, earnings: 9920 },
    { name: 'Jun', collections: 52, earnings: 9100 },
  ];

  // Daily schedule data
  const todayPickups = [
    {
      id: 1,
      address: "123 Main St, Downtown",
      time: "10:00 AM",
      status: "Pending",
      wasteType: "Recyclable",
      customerName: "John Smith",
      estimatedWeight: "25 kg",
      estimatedEarning: "$12.50"
    },
    {
      id: 2,
      address: "456 Oak Ave, Uptown",
      time: "11:30 AM",
      status: "In Progress",
      wasteType: "Organic",
      customerName: "Sarah Johnson",
      estimatedWeight: "18 kg",
      estimatedEarning: "$9.00"
    },
    {
      id: 3,
      address: "789 Pine Rd, Westside",
      time: "2:00 PM",
      status: "Scheduled",
      wasteType: "General",
      customerName: "Mike Brown",
      estimatedWeight: "32 kg",
      estimatedEarning: "$16.00"
    }
  ];

  // Performance over time
  const performanceData = [
    { month: 'Jan', rating: 4.5, onTimeRate: 88 },
    { month: 'Feb', rating: 4.6, onTimeRate: 90 },
    { month: 'Mar', rating: 4.7, onTimeRate: 92 },
    { month: 'Apr', rating: 4.8, onTimeRate: 91 },
    { month: 'May', rating: 4.8, onTimeRate: 94 },
    { month: 'Jun', rating: 4.9, onTimeRate: 95 },
  ];

  // Waste types collected
  const wasteTypesData = [
    { name: 'Paper', weight: 120 },
    { name: 'Plastic', weight: 85 },
    { name: 'Metal', weight: 65 },
    { name: 'Glass', weight: 45 },
    { name: 'Organic', weight: 95 },
  ];

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Dummy revenue data
  const revenueData = [
    { date: '2024-03-01', waste: 1200, scrap: 800, total: 2000, wasteCollections: 12, scrapCollections: 8 },
    { date: '2024-03-02', waste: 1500, scrap: 900, total: 2400, wasteCollections: 15, scrapCollections: 9 },
    { date: '2024-03-03', waste: 1300, scrap: 850, total: 2150, wasteCollections: 13, scrapCollections: 8 },
    { date: '2024-03-04', waste: 1600, scrap: 950, total: 2550, wasteCollections: 16, scrapCollections: 9 },
    { date: '2024-03-05', waste: 1400, scrap: 880, total: 2280, wasteCollections: 14, scrapCollections: 8 },
    { date: '2024-03-06', waste: 1700, scrap: 1000, total: 2700, wasteCollections: 17, scrapCollections: 10 },
    { date: '2024-03-07', waste: 1450, scrap: 920, total: 2370, wasteCollections: 14, scrapCollections: 9 },
  ];

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto">
      <div className="md:p-6 xs:p-4 p-3 max-w-7xl mx-auto">
       

        {/* Collector Profile Summary */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <CircleUser className="w-12 h-12 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{collectorData.name}</h2>
              <p className="text-sm text-gray-600">ID: {collectorData.collectorId}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${collectorData.availabilityStatus === 'available'
                  ? 'bg-green-100 text-green-800'
                  : collectorData.availabilityStatus === 'unavailable'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {collectorData.availabilityStatus.charAt(0).toUpperCase() + collectorData.availabilityStatus.slice(1)}
                </span>
                <span className="text-xs text-gray-500">
                  {collectorData.currentTasks}/{collectorData.maxCapacity} Tasks
                </span>
              </div>
            </div>
            <div className="ml-auto flex flex-col items-end">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-gray-800">{collectorData.performanceMetrics.averageRating}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {collectorData.performanceMetrics.onTimeRate}% On-time
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 flex border-b">
          <button
            onClick={() => setSelectedTab('schedule')}
            className={`px-4 py-2 font-medium text-sm ${selectedTab === 'schedule'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-4 py-2 font-medium text-sm ${selectedTab === 'overview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab('performance')}
            className={`px-4 py-2 font-medium text-sm ${selectedTab === 'performance'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Performance
          </button>
        </div>

        {selectedTab === 'overview' && (
          <>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DashboardCard title="Today's Pickups" icon={<Truck className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-emerald-600" />}>
                <div className="md:text-3xl xs:text-2xl text-xl font-bold text-gray-800">12</div>
                <p className="md:text-sm xs:text-xs text-xxs text-emerald-600 font-medium">4 completed</p>
              </DashboardCard>

              <DashboardCard title="Total Weight" icon={<Package className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-blue-600" />}>
                <div className="md:text-2xl xs:text-xl text-lg font-bold text-gray-800">85 kg</div>
                <p className="md:text-sm xs:text-xs text-xxs text-blue-600 font-medium">+15% from yesterday</p>
              </DashboardCard>

              <DashboardCard title="Weekly Earnings" icon={<DollarSign className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-purple-600" />}>
                <div className="md:text-2xl xs:text-xl text-lg font-bold text-gray-800">₹{collectorData.weeklyEarnings}</div>
                <p className="md:text-sm xs:text-xs text-xxs text-purple-600 font-medium">+12% from last week</p>
              </DashboardCard>

              <DashboardCard title="Next Pickup" icon={<Clock className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-orange-600" />}>
                <div className="md:text-2xl xs:text-xl text-lg font-bold text-gray-800">10:00 AM</div>
                <p className="md:text-sm xs:text-xs text-xxs text-orange-600 font-medium">123 Main St</p>
              </DashboardCard>
            </div>


           {/* Revenue Graph Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Revenue Overview</h2>
          
          {/* Filters Section */}
          <div className="flex flex-wrap gap-4 mb-6">
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
                data={revenueData}
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
                    } else if (name === 'Scrap Revenue') {
                      return [formattedValue, 'Scrap Revenue'];
                    } else {
                      return [formattedValue, 'Net Total'];
                    }
                  }}
                  labelFormatter={(label) => {
                    const tooltipDataPoint = revenueData.find(d => d.date === label);
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
                <Bar dataKey="scrap" name="Scrap Revenue" fill="#FF8042" />
                <Bar dataKey="total" name="Net Total" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


          

            {/* Daily Route Progress */}


            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Collection Types */}
              <div className="bg-white rounded-lg border shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Collection Types</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={collectionTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {collectionTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Waste Types Collected */}
              <div className="bg-white rounded-lg border shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Waste Types Collected</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={wasteTypesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="weight" name="Weight (kg)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Overview */}
            <div className="bg-white rounded-lg border shadow-sm p-4 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="collections" name="Collections" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="earnings" name="Earnings ($)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {selectedTab === 'schedule' && (
          <div>
            <div className="bg-white rounded-lg border shadow-sm mb-8 p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Route Progress</h3>
              <div className="w-full bg-gray-200 h-4 rounded-full mt-2 mb-4 overflow-hidden">
                <div className="bg-blue-500 h-4 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <div>
                  <span className="font-medium">8 / 12</span> Pickups Completed
                </div>
                <div>
                  <span className="font-medium">65%</span> Complete
                </div>
                <div>
                  Est. Completion: <span className="font-medium">4:30 PM</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="md:p-6 xs:p-4 p-3 border-b">
                <h3 className="md:text-xl xs:text-lg text-base font-semibold text-gray-800">Today's Schedule</h3>
              </div>
              <div className="divide-y">
                {todayPickups.map((pickup) => (
                  <div key={pickup.id} className="md:p-6 xs:p-4 p-3 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex items-start md:gap-4 xs:gap-3 gap-2">
                        <div className="mt-1 md:p-2 p-1.5 bg-gray-100 rounded-lg">
                          <MapPin className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 md:text-base xs:text-sm text-xs">{pickup.address}</h3>
                          <div className="flex items-center md:gap-2 gap-1.5 md:text-sm text-xs text-gray-600 mt-1">
                            <Clock className="md:w-4 md:h-4 w-3 h-3" />
                            <span className="font-medium">{pickup.time}</span>
                            <span>•</span>
                            <span>{pickup.customerName}</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="md:text-sm text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                              {pickup.wasteType}
                            </span>
                            <span className="md:text-sm text-xs px-3 py-1 bg-blue-50 rounded-full text-blue-600">
                              {pickup.estimatedWeight}
                            </span>
                            <span className="md:text-sm text-xs px-3 py-1 bg-green-50 rounded-full text-green-600">
                              {pickup.estimatedEarning}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <span className={`md:px-4 xs:px-3 px-2 md:py-2 py-1.5 rounded-full md:text-sm text-xs font-medium ${getStatusColor(pickup.status)}`}>
                          {pickup.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'performance' && (
          <>
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <DashboardCard title="Total Collections" icon={<ClipboardList className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-blue-600" />}>
                <div className="md:text-3xl xs:text-2xl text-xl font-bold text-gray-800">
                  {collectorData.performanceMetrics.totalCollections}
                </div>
                <p className="md:text-sm xs:text-xs text-xxs text-blue-600 font-medium">Lifetime collections</p>
              </DashboardCard>

              <DashboardCard title="Average Rating" icon={<Star className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-yellow-500" />}>
                <div className="md:text-3xl xs:text-2xl text-xl font-bold text-gray-800">
                  {collectorData.performanceMetrics.averageRating}
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`md:w-4 md:h-4 w-3 h-3 ${i < Math.floor(collectorData.performanceMetrics.averageRating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
              </DashboardCard>

              <DashboardCard title="On-Time Rate" icon={<CheckCircle className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-green-600" />}>
                <div className="md:text-3xl xs:text-2xl text-xl font-bold text-gray-800">
                  {collectorData.performanceMetrics.onTimeRate}%
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${collectorData.performanceMetrics.onTimeRate}%` }}
                  ></div>
                </div>
              </DashboardCard>
            </div>

            {/* Monthly Performance */}
            <div className="bg-white rounded-lg border shadow-sm p-4 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={performanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" domain={[4, 5]} />
                  <YAxis yAxisId="right" orientation="right" domain={[80, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="rating"
                    name="Customer Rating"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="onTimeRate"
                    name="On-Time Rate (%)"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Earnings Overview */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Earnings Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">Today's Earnings</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">₹356</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">Weekly Earnings</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">₹{collectorData.weeklyEarnings}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium">Monthly Earnings</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">₹{collectorData.monthlyEarnings}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Dashboard;