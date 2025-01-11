import React from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  Package,
  MoreVertical,
  ChevronDown,
  Truck
} from 'lucide-react';

const RouteCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-lg border shadow-sm">
    {children}
  </div>
);

const RoutePlanning: React.FC = () => {
  const stops = [
    {
      id: 1,
      time: "09:00 AM",
      address: "123 Main St, Downtown",
      customer: "John Smith",
      wasteType: "Recyclable",
      status: "Next Stop"
    },
    {
      id: 2,
      time: "10:30 AM",
      address: "456 Oak Ave, Uptown",
      customer: "Sarah Johnson",
      wasteType: "Organic",
      status: "Scheduled"
    },
    {
      id: 3,
      time: "11:45 AM",
      address: "789 Pine Rd, Westside",
      customer: "Mike Brown",
      wasteType: "General",
      status: "Scheduled"
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Route Planning</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Navigation className="w-4 h-4" />
            Start Route
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Placeholder for map */}
          <RouteCard>
            <div className="h-[600px] flex items-center justify-center bg-gray-100">
              <span className="text-gray-500">Map View</span>
            </div>
          </RouteCard>
        </div>

        <div className="lg:col-span-1">
          <RouteCard>
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Today's Route</h3>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  <span className="text-sm font-normal text-gray-500">8 stops</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stops.map((stop, index) => (
                  <div key={stop.id} className="relative">
                    {index !== stops.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                    )}
                    <div className="flex items-start gap-4 bg-white p-4 rounded-lg border">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-blue-500" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{stop.address}</h3>
                            <div className="text-sm text-gray-500">{stop.customer}</div>
                          </div>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {stop.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {stop.wasteType}
                          </div>
                        </div>
                        {stop.status === "Next Stop" && (
                          <div className="mt-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              Next Stop
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
                  <ChevronDown className="w-4 h-4" />
                  Show more stops
                </button>
              </div>
            </div>
          </RouteCard>
        </div>
      </div>
    </div>
  );
};

export default RoutePlanning;