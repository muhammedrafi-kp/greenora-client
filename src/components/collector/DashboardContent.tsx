import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Package,
  TrendingUp,
  Truck,
} from 'lucide-react';

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

const DashboardContent = () => {
  const todayPickups = [
    {
      id: 1,
      address: "123 Main St, Downtown",
      time: "10:00 AM",
      status: "Pending",
      wasteType: "Recyclable",
      customerName: "John Smith"
    },
    {
      id: 2,
      address: "456 Oak Ave, Uptown",
      time: "11:30 AM",
      status: "In Progress",
      wasteType: "Organic",
      customerName: "Sarah Johnson"
    },
    {
      id: 3,
      address: "789 Pine Rd, Westside",
      time: "2:00 PM",
      status: "Scheduled",
      wasteType: "General",
      customerName: "Mike Brown"
    }
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard title="Today's Pickups" icon={<Truck className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-emerald-600" />}>
            <div className="md:text-3xl xs:text-2xl text-xl font-bold text-gray-800">12</div>
            <p className="md:text-sm xs:text-xs text-xxs text-emerald-600 font-medium">4 completed</p>
          </DashboardCard>

          <DashboardCard title="Total Weight" icon={<Package className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-blue-600" />}>
            <div className="md:text-2xl xs:text-xl text-lg font-bold text-gray-800">850 kg</div>
            <p className="md:text-sm xs:text-xs text-xxs text-blue-600 font-medium">+15% from yesterday</p>
          </DashboardCard>

          <DashboardCard title="Route Progress" icon={<TrendingUp className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-purple-600" />}>
            <div className="md:text-3xl xs:text-2xl text-xl font-bold text-gray-800">65%</div>
            <div className="w-full bg-gray-200 md:h-3 h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-purple-500 md:h-3 h-2 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: '65%' }}></div>
            </div>
          </DashboardCard>

          <DashboardCard title="Next Pickup" icon={<Clock className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-orange-600" />}>
            <div className="md:text-3xl xs:text-2xl text-xl font-bold text-gray-800">10:00 AM</div>
            <p className="md:text-sm xs:text-xs text-xxs text-orange-600 font-medium">123 Main St</p>
          </DashboardCard>
        </div>

        <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="md:p-6 xs:p-4 p-3 border-b">
            <h3 className="md:text-xl xs:text-lg text-base font-semibold text-gray-800">Today's Schedule</h3>
          </div>
          <div className="divide-y">
            {todayPickups.map((pickup) => (
              <div key={pickup.id} className="md:p-6 xs:p-4 p-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start md:gap-4 xs:gap-3 gap-2">
                  <div className="mt-1 md:p-2 p-1.5 bg-gray-100 rounded-lg">
                    <MapPin className="md:w-5 md:h-5 xs:w-4 xs:h-4 w-3 h-3 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 md:text-base xs:text-sm text-xs">{pickup.address}</h3>
                    <div className="flex items-center md:gap-2 gap-1.5 md:text-sm text-xs text-gray-600 mt-1">
                      <Calendar className="md:w-4 md:h-4 w-3 h-3" />
                      <span className="font-medium">{pickup.time}</span>
                      <span>•</span>
                      <span>{pickup.customerName}</span>
                    </div>
                    <div className="mt-2">
                      <span className="md:text-sm text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                        {pickup.wasteType}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`md:px-4 xs:px-3 px-2 md:py-2 py-1.5 rounded-full md:text-sm text-xs font-medium ${getStatusColor(pickup.status)}`}>
                  {pickup.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;