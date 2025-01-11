import React from 'react';
import { 
  Calendar,
  Filter,
  Download,
  Search,
  MapPin,
  Package,
} from 'lucide-react';

const PickupHistory:React.FC = () => {
  const pickups = [
    {
      id: "PU-001",
      date: "2024-12-26",
      time: "09:30 AM",
      address: "123 Main St, Downtown",
      customer: "John Doe",
      wasteType: "Recyclable",
      weight: "50kg",
      status: "Completed"
    },
    {
      id: "PU-002",
      date: "2024-12-26",
      time: "11:00 AM",
      address: "456 Oak Ave, Uptown",
      customer: "Jane Smith",
      wasteType: "Organic",
      weight: "30kg",
      status: "Completed"
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pickup History</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by ID, address, or customer..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <input
                type="date"
                className="px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left">ID</th>
                  <th className="pb-3 text-left">Date & Time</th>
                  <th className="pb-3 text-left">Location</th>
                  <th className="pb-3 text-left">Customer</th>
                  <th className="pb-3 text-left">Waste Type</th>
                  <th className="pb-3 text-left">Weight</th>
                  <th className="pb-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {pickups.map((pickup) => (
                  <tr key={pickup.id} className="border-b hover:bg-gray-50">
                    <td className="py-4">{pickup.id}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div>{pickup.date}</div>
                          <div className="text-sm text-gray-500">{pickup.time}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {pickup.address}
                      </div>
                    </td>
                    <td className="py-4">{pickup.customer}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        {pickup.wasteType}
                      </div>
                    </td>
                    <td className="py-4">{pickup.weight}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {pickup.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupHistory;