// import React, { useState, useEffect } from 'react';
// import { FaBell, FaCheckCircle, FaExclamationCircle, FaClock } from 'react-icons/fa';

// // Define notification types
// interface Notification {
//   id: string;
//   title: string;
//   message: string;
//   type: 'success' | 'warning' | 'pending';
//   timestamp: string;
//   read: boolean;
// }

// const Notifications: React.FC = () => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulated fetch notifications - replace with actual API call
//     const fetchNotifications = async () => {
//       // Simulate API call with mock data
//       const mockNotifications: Notification[] = [
//         {
//           id: '1',
//           title: 'Pickup Scheduled',
//           message: 'Your waste pickup for 15 kg of electronic waste is scheduled for tomorrow.',
//           type: 'success',
//           timestamp: '2 hours ago',
//           read: false
//         },
//         {
//           id: '2',
//           title: 'Pending Verification',
//           message: 'Your recent waste collection needs admin verification.',
//           type: 'pending',
//           timestamp: '1 day ago',
//           read: false
//         },
//         {
//           id: '3',
//           title: 'Collection Complete',
//           message: 'Your waste collection of 25 kg has been processed.',
//           type: 'success',
//           timestamp: '3 days ago',
//           read: true
//         }
//       ];

//       setNotifications(mockNotifications);
//       setLoading(false);
//     };

//     fetchNotifications();
//   }, []);

//   const getIconAndColor = (type: 'success' | 'warning' | 'pending') => {
//     switch (type) {
//       case 'success': 
//         return { icon: <FaCheckCircle />, color: 'text-green-600' };
//       case 'warning': 
//         return { icon: <FaExclamationCircle />, color: 'text-yellow-600' };
//       case 'pending': 
//         return { icon: <FaClock />, color: 'text-blue-600' };
//     }
//   };

//   const markAllAsRead = () => {
//     setNotifications(notifications.map(n => ({ ...n, read: true })));
//   };

//   if (loading) {
//     return <div className="text-center text-gray-500 py-8">Loading notifications...</div>;
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="lg:text-lg xs:text-base text-sm font-semibold flex  items-center gap-2">
//           {/* <FaBell />  */}
//           Notifications
//         </h2>
//         {notifications.some(n => !n.read) && (
//           <button 
//             onClick={markAllAsRead}
//             className="text-xs text-green-700 hover:underline"
//           >
//             Mark All as Read
//           </button>
//         )}
//       </div>

//       {notifications.length === 0 ? (
//         <div className="text-center text-gray-500 py-8">
//           No notifications yet
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {notifications.map((notification) => {
//             const { icon, color } = getIconAndColor(notification.type);
//             return (
//               <div 
//                 key={notification.id} 
//                 className={`
//                   p-4 rounded-lg border 
//                   ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-white border-green-100'}
//                   flex items-start gap-4
//                 `}
//               >
//                 <div className={`mt-1 ${color} text-xl`}>
//                   {icon}
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-sm mb-1">{notification.title}</h3>
//                   <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
//                   <span className="text-xs text-gray-500">{notification.timestamp}</span>
//                 </div>
//                 {!notification.read && (
//                   <div className="w-2 h-2 bg-green-500 rounded-full self-start"></div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notifications;





// import React, { useState, useEffect } from 'react';
// import { FaBell, FaCheckCircle, FaExclamationCircle, FaClock, FaTimes } from 'react-icons/fa';

// // Define notification types
// interface Notification {
//   id: string;
//   title: string;
//   message: string;
//   type: 'success' | 'warning' | 'pending';
//   timestamp: string;
//   read: boolean;
// }

// const Notifications: React.FC = () => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulated fetch notifications - replace with actual API call
//     const fetchNotifications = async () => {
//       // Simulate API call with mock data
//       const mockNotifications: Notification[] = [
//         {
//           id: '1',
//           title: 'Pickup Scheduled',
//           message: 'Your waste pickup for 15 kg of electronic waste is scheduled for tomorrow.',
//           type: 'success',
//           timestamp: '2 hours ago',
//           read: false
//         },
//         {
//           id: '2',
//           title: 'Pending Verification',
//           message: 'Your recent waste collection needs admin verification.',
//           type: 'pending',
//           timestamp: '1 day ago',
//           read: false
//         },
//         {
//           id: '3',
//           title: 'Collection Complete',
//           message: 'Your waste collection of 25 kg has been processed.',
//           type: 'success',
//           timestamp: '3 days ago',
//           read: true
//         },
//         {
//           id: '4',
//           title: 'Payment Failed',
//           message: 'Your recent payment for waste collection failed. Please retry.',
//           type: 'warning',
//           timestamp: '5 days ago',
//           read: true
//         }
//       ];

//       setNotifications(mockNotifications);
//       setLoading(false);
//     };

//     fetchNotifications();
//   }, []);

//   const getIconAndColor = (type: 'success' | 'warning' | 'pending') => {
//     switch (type) {
//       case 'success':
//         return { icon: <FaCheckCircle />, color: 'bg-green-100 text-green-600' };
//       case 'warning':
//         return { icon: <FaExclamationCircle />, color: 'bg-yellow-100 text-yellow-600' };
//       case 'pending':
//         return { icon: <FaClock />, color: 'bg-blue-100 text-blue-600' };
//     }
//   };

//   const markAllAsRead = () => {
//     setNotifications(notifications.map(n => ({ ...n, read: true })));
//   };

//   const markAsRead = (id: string) => {
//     setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
//   };

//   const deleteNotification = (id: string) => {
//     setNotifications(notifications.filter(n => n.id !== id));
//   };

//   if (loading) {
//     return (
//       <div className="text-center text-gray-500 py-8">
//         Loading notifications...
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="lg:text-xl xs:text-lg text-base font-semibold flex items-center gap-2">
//           <FaBell className="text-green-600" /> Notifications
//         </h2>
//         {notifications.some(n => !n.read) && (
//           <button
//             onClick={markAllAsRead}
//             className="text-sm text-green-700 hover:text-green-800 hover:underline"
//           >
//             Mark All as Read
//           </button>
//         )}
//       </div>

//       {notifications.length === 0 ? (
//         <div className="text-center text-gray-500 py-8">
//           No notifications yet
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {notifications.map((notification) => {
//             const { icon, color } = getIconAndColor(notification.type);
//             return (
//               <div
//                 key={notification.id}
//                 className={`
//                   p-4 rounded-lg border 
//                   ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-white border-green-100'}
//                   flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow
//                 `}
//               >
//                 {/* Notification Icon */}
//                 <div className={`p-3 rounded-full ${color}`}>
//                   {icon}
//                 </div>

//                 {/* Notification Content */}
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-sm mb-1">{notification.title}</h3>
//                   <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
//                   <span className="text-xs text-gray-500">{notification.timestamp}</span>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex items-center gap-2">
//                   {!notification.read && (
//                     <button
//                       onClick={() => markAsRead(notification.id)}
//                       className="text-xs text-green-700 hover:text-green-800 hover:underline"
//                     >
//                       Mark as Read
//                     </button>
//                   )}
//                   <button
//                     onClick={() => deleteNotification(notification.id)}
//                     className="text-xs text-gray-500 hover:text-red-600"
//                   >
//                     <FaTimes />
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notifications;



// import React, { useState, useEffect } from 'react';

// // Define notification types
// interface Notification {
//   id: string;
//   title: string;
//   message: string;
//   type: 'success' | 'warning' | 'pending';
//   timestamp: string;
//   read: boolean;
// }

// const Notifications: React.FC = () => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulated fetch notifications - replace with actual API call
//     const fetchNotifications = async () => {
//       // Simulate API call with mock data
//       const mockNotifications: Notification[] = [
//         {
//           id: '1',
//           title: 'Pickup Scheduled',
//           message: 'Your waste pickup for 15 kg of electronic waste is scheduled for tomorrow.',
//           type: 'success',
//           timestamp: '2 hours ago',
//           read: false
//         },
//         {
//           id: '2',
//           title: 'Pending Verification',
//           message: 'Your recent waste collection needs admin verification.',
//           type: 'pending',
//           timestamp: '1 day ago',
//           read: false
//         },
//         {
//           id: '3',
//           title: 'Collection Complete',
//           message: 'Your waste collection of 25 kg has been processed.',
//           type: 'success',
//           timestamp: '3 days ago',
//           read: true
//         }
//       ];

//       setNotifications(mockNotifications);
//       setLoading(false);
//     };

//     fetchNotifications();
//   }, []);

//   const markAllAsRead = () => {
//     setNotifications(notifications.map(n => ({ ...n, read: true })));
//   };

//   const markAsRead = (id: string) => {
//     setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
//   };

//   if (loading) {
//     return (
//       <div className="text-center text-gray-500 py-8">
//         Loading notifications...
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
//         {notifications.some(n => !n.read) && (
//           <button
//             onClick={markAllAsRead}
//             className="text-sm text-green-600 hover:text-green-700 hover:underline"
//           >
//             Mark All as Read
//           </button>
//         )}
//       </div>

//       {notifications.length === 0 ? (
//         <div className="text-center text-gray-500 py-8">
//           No notifications yet
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {notifications.map((notification) => (
//             <div
//               key={notification.id}
//               className={`
//                 p-4 rounded-lg border 
//                 ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-white border-green-100'}
//                 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow
//               `}
//             >
//               {/* Notification Content */}
//               <div className="flex-1">
//                 <h3 className="font-semibold text-sm text-gray-800 mb-1">{notification.title}</h3>
//                 <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
//                 <span className="text-xs text-gray-500">{notification.timestamp}</span>
//               </div>

//               {/* Mark as Read Button */}
//               {!notification.read && (
//                 <button
//                   onClick={() => markAsRead(notification.id)}
//                   className="text-xs text-green-600 hover:text-green-700 hover:underline"
//                 >
//                   Mark as Read
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notifications;



// import React, { useState, useEffect } from 'react';

// // Define notification types
// interface Notification {
//   id: string;
//   title: string;
//   message: string;
//   type: 'success' | 'warning' | 'pending';
//   timestamp: string;
//   read: boolean;
// }

// const Notifications: React.FC = () => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulated fetch notifications - replace with actual API call
//     const fetchNotifications = async () => {
//       // Simulate API call with mock data
//       const mockNotifications: Notification[] = [
//         {
//           id: '1',
//           title: 'Pickup Scheduled',
//           message: 'Your waste pickup for 15 kg of electronic waste is scheduled for tomorrow.',
//           type: 'success',
//           timestamp: '2 hours ago',
//           read: false
//         },
//         {
//           id: '2',
//           title: 'Pending Verification',
//           message: 'Your recent waste collection needs admin verification.',
//           type: 'pending',
//           timestamp: '1 day ago',
//           read: false
//         },
//         {
//           id: '3',
//           title: 'Collection Complete',
//           message: 'Your waste collection of 25 kg has been processed.',
//           type: 'success',
//           timestamp: '3 days ago',
//           read: true
//         }
//       ];

//       setNotifications(mockNotifications);
//       setLoading(false);
//     };

//     fetchNotifications();
//   }, []);

//   const markAllAsRead = () => {
//     setNotifications(notifications.map(n => ({ ...n, read: true })));
//   };

//   const markAsRead = (id: string) => {
//     setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
//   };

//   const deleteAllNotifications = () => {
//     setNotifications([]); // Clear all notifications
//   };

//   if (loading) {
//     return (
//       <div className="text-center text-gray-500 py-8">
//         Loading notifications...
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
//         <div className="flex items-center gap-4">
//           {notifications.some(n => !n.read) && (
//             <button
//               onClick={markAllAsRead}
//               className="text-sm text-green-600 hover:text-green-700 hover:underline"
//             >
//               Mark All as Read
//             </button>
//           )}
//           {notifications.length > 0 && (
//             <button
//               onClick={deleteAllNotifications}
//               className="text-sm text-red-600 hover:text-red-700 hover:underline"
//             >
//               Delete All
//             </button>
//           )}
//         </div>
//       </div>

//       {notifications.length === 0 ? (
//         <div className="text-center text-gray-500 py-8">
//           No notifications yet
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {notifications.map((notification) => (
//             <div
//               key={notification.id}
//               className={`
//                 p-4 rounded-lg border 
//                 ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-white border-green-100'}
//                 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow
//               `}
//             >
//               {/* Notification Content */}
//               <div className="flex-1">
//                 <h3 className="font-semibold text-sm text-gray-800 mb-1">{notification.title}</h3>
//                 <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
//                 <span className="text-xs text-gray-500">{notification.timestamp}</span>
//               </div>

//               {/* Mark as Read Button */}
//               {!notification.read && (
//                 <button
//                   onClick={() => markAsRead(notification.id)}
//                   className="text-xs text-green-600 hover:text-green-700 hover:underline"
//                 >
//                   Mark as Read
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notifications;




import React, { useState, useEffect } from 'react';
import { FaBell, FaCheckCircle, FaExclamationCircle, FaClock, FaTrash, FaCheck } from 'react-icons/fa';

// Define notification types
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'pending';
  timestamp: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch notifications - replace with actual API call
    const fetchNotifications = async () => {
      // Simulate API call with mock data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Pickup Scheduled',
          message: 'Your waste pickup for 15 kg of electronic waste is scheduled for tomorrow.',
          type: 'success',
          timestamp: '2 hours ago',
          read: false
        },
        {
          id: '2',
          title: 'Pending Verification',
          message: 'Your recent waste collection needs admin verification.',
          type: 'pending',
          timestamp: '1 day ago',
          read: false
        },
        {
          id: '3',
          title: 'Collection Complete',
          message: 'Your waste collection of 25 kg has been processed.',
          type: 'success',
          timestamp: '3 days ago',
          read: true
        }
      ];

      setNotifications(mockNotifications);
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteAllNotifications = () => {
    setNotifications([]); // Clear all notifications
  };

  const getNotificationIcon = (type: 'success' | 'warning' | 'pending') => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-600" />;
      case 'warning':
        return <FaExclamationCircle className="text-yellow-600" />;
      case 'pending':
        return <FaClock className="text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-8">
        Loading notifications...
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          {/* <FaBell className="text-green-600" /> */}
           Notifications
        </h2>
        <div className="flex items-center gap-4">
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1 "
            >
              {/* <FaCheck />  */}
              Mark All as Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={deleteAllNotifications}
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 "
            >
              {/* <FaTrash /> */}
               Delete All
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                p-4 rounded-lg border 
                ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-white border-green-100'}
                flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow
              `}
            >
              {/* Notification Icon */}
              <div className="mt-1">
                {getNotificationIcon(notification.type)}
              </div>

              {/* Notification Content */}
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-gray-800 mb-1">{notification.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
                <span className="text-xs text-gray-500">{notification.timestamp}</span>
              </div>

              {/* Mark as Read Button */}
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                >
                  {/* <FaCheck />  */}
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;