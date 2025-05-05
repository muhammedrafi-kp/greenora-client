// import React from 'react';
// import {
//   Calendar,
//   Clock,
//   MapPin,
//   Package,
//   TrendingUp,
//   Truck,
// } from 'lucide-react';

// const DashboardCard = ({ title, icon, children }: {
//   title: string;
//   icon: React.ReactNode;
//   children: React.ReactNode;
// }) => (
//   <div className="bg-white rounded-lg border shadow-sm md:p-4 xs:p-3 p-2">
//     <div className="flex items-center justify-between mb-2">
//       <h3 className="md:text-sm xs:text-xs text-xxs font-medium">{title}</h3>
//       {icon}
//     </div>
//     {children}
//   </div>
// );

// const DashboardContent = () => {
//   const todayPickups = [
//     {
//       id: 1,
//       address: "123 Main St, Downtown",
//       time: "10:00 AM",
//       status: "Pending",
//       wasteType: "Recyclable",
//       customerName: "John Smith"
//     },
//     {
//       id: 2,
//       address: "456 Oak Ave, Uptown",
//       time: "11:30 AM",
//       status: "In Progress",
//       wasteType: "Organic",
//       customerName: "Sarah Johnson"
//     },
//     {
//       id: 3,
//       address: "789 Pine Rd, Westside",
//       time: "2:00 PM",
//       status: "Scheduled",
//       wasteType: "General",
//       customerName: "Mike Brown"
//     }
//   ];

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Pending': return 'bg-yellow-100 text-yellow-800';
//       case 'In Progress': return 'bg-blue-100 text-blue-800';
//       case 'Completed': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <main className="flex-1 overflow-x-hidden overflow-y-auto">
//       <div className="md:p-6 xs:p-4 p-3 max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <DashboardCard title="Today's Pickups" icon={<Truck className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-emerald-600" />}>
//             <div className="md:text-3xl xs:text-2xl text-xl font-bold text-gray-800">12</div>
//             <p className="md:text-sm xs:text-xs text-xxs text-emerald-600 font-medium">4 completed</p>
//           </DashboardCard>

//           <DashboardCard title="Total Weight" icon={<Package className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-blue-600" />}>
//             <div className="md:text-2xl xs:text-xl text-lg font-bold text-gray-800">850 kg</div>
//             <p className="md:text-sm xs:text-xs text-xxs text-blue-600 font-medium">+15% from yesterday</p>
//           </DashboardCard>

//           <DashboardCard title="Route Progress" icon={<TrendingUp className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-purple-600" />}>
//             <div className="md:text-3xl xs:text-2xl text-xl font-bold text-gray-800">65%</div>
//             <div className="w-full bg-gray-200 md:h-3 h-2 rounded-full mt-2 overflow-hidden">
//               <div className="bg-purple-500 md:h-3 h-2 rounded-full transition-all duration-500 ease-in-out"
//                 style={{ width: '65%' }}></div>
//             </div>
//           </DashboardCard>

//           <DashboardCard title="Next Pickup" icon={<Clock className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-orange-600" />}>
//             <div className="md:text-3xl xs:text-2xl text-xl font-bold text-gray-800">10:00 AM</div>
//             <p className="md:text-sm xs:text-xs text-xxs text-orange-600 font-medium">123 Main St</p>
//           </DashboardCard>
//         </div>

//         <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-300">
//           <div className="md:p-6 xs:p-4 p-3 border-b">
//             <h3 className="md:text-xl xs:text-lg text-base font-semibold text-gray-800">Today's Schedule</h3>
//           </div>
//           <div className="divide-y">
//             {todayPickups.map((pickup) => (
//               <div key={pickup.id} className="md:p-6 xs:p-4 p-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
//                 <div className="flex items-start md:gap-4 xs:gap-3 gap-2">
//                   <div className="mt-1 md:p-2 p-1.5 bg-gray-100 rounded-lg">
//                     <MapPin className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-gray-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-gray-900 md:text-base xs:text-sm text-xs">{pickup.address}</h3>
//                     <div className="flex items-center md:gap-2 gap-1.5 md:text-sm text-xs text-gray-600 mt-1">
//                       <Calendar className="md:w-4 md:h-4 w-3 h-3" />
//                       <span className="font-medium">{pickup.time}</span>
//                       <span>•</span>
//                       <span>{pickup.customerName}</span>
//                     </div>
//                     <div className="mt-2">
//                       <span className="md:text-sm text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600">
//                         {pickup.wasteType}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <span className={`md:px-4 xs:px-3 px-2 md:py-2 py-1.5 rounded-full md:text-sm text-xs font-medium ${getStatusColor(pickup.status)}`}>
//                   {pickup.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default DashboardContent;





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
  BarChart,
  CircleUser,
  ClipboardList,
  DollarSign,
  Target,
  CheckCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

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

const CollectorDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  
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
  
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto">
      <div className="md:p-6 xs:p-4 p-3 max-w-7xl mx-auto">
        {/* Collector Profile Summary */}
        {/* <div className="mb-6 bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <CircleUser className="w-12 h-12 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{collectorData.name}</h2>
              <p className="text-sm text-gray-600">ID: {collectorData.collectorId}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  collectorData.availabilityStatus === 'available' 
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
        </div> */}
        
        {/* Navigation Tabs */}
        <div className="mb-6 flex border-b">
          <button 
            onClick={() => setSelectedTab('overview')}
            className={`px-4 py-2 font-medium text-sm ${
              selectedTab === 'overview' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setSelectedTab('schedule')}
            className={`px-4 py-2 font-medium text-sm ${
              selectedTab === 'schedule' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Schedule
          </button>
          <button 
            onClick={() => setSelectedTab('performance')}
            className={`px-4 py-2 font-medium text-sm ${
              selectedTab === 'performance' 
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
            
            {/* Daily Route Progress */}
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
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
                  <RechartsBarChart
                    data={wasteTypesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="weight" name="Weight (kg)" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Monthly Overview */}
            <div className="bg-white rounded-lg border shadow-sm p-4 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart
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
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
        
        {selectedTab === 'schedule' && (
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
                      className={`md:w-4 md:h-4 w-3 h-3 ${
                        i < Math.floor(collectorData.performanceMetrics.averageRating) 
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

export default CollectorDashboard;