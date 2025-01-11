import React from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Trash2,
  MoreVertical
} from 'lucide-react';

interface Notification {
  id: number;
  type: 'urgent' | 'success' | 'info';
  title: string;
  message: string;
  time: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const NotificationsCenter: React.FC = () => {
  const notifications: Notification[] = [
    {
      id: 1,
      type: 'urgent',
      title: 'New Pickup Added',
      message: 'A new pickup has been added to your route at 123 Main St.',
      time: '5 minutes ago',
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      id: 2,
      type: 'success',
      title: 'Route Completed',
      message: 'You have successfully completed all pickups for today.',
      time: '1 hour ago',
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      type: 'info',
      title: 'Schedule Update',
      message: 'Your tomorrow\'s schedule has been updated.',
      time: '2 hours ago',
      icon: Info,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            3 new
          </span>
        </div>
        <button className="text-blue-500 hover:text-blue-600 text-sm">
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${notification.bgColor} p-4 rounded-lg flex items-start gap-4`}
              >
                <div className={`${notification.color} mt-1`}>
                  <notification.icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500 mt-2 block">
                        {notification.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsCenter;