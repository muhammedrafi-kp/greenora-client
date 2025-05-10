import React, { useState, useEffect } from 'react';
import { getNotifications,markNotificationAsRead,markAllNotificationsAsRead } from '../../../services/notificationService';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUnreadCount } from '../../../redux/notificationSlice';
import { INotification } from '../../../types/notification';
import { ApiResponse } from '../../../types/common';
const socket = io(import.meta.env.VITE_NOTIFICATION_SERVICE_URL, {
    withCredentials: true,
    transports: ['websocket'],
});

console

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const unreadCount = useSelector((state: any) => state.notification.unreadCount);

    const fetchNotifications = async (pageNum: number = 1) => {
        try {
            setIsLoading(true);
            const res:ApiResponse<INotification[]> = await getNotifications(pageNum);
            if(res.success){
                const existingIds = new Set(notifications.map(n => n._id));
                const newNotifications = res.data.filter(
                    (notification: INotification) => !existingIds.has(notification._id)
                );

                if (pageNum === 1) {
                    setNotifications(res.data);
                } else {
                    setNotifications(prev => [...prev, ...newNotifications]);
                }
                
                setHasMore(newNotifications.length > 0);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications(page);

        socket.connect();
        socket.emit("join-room", "67bddc928b682fd63bb7bdb2");
        // Listen for new notifications
        socket.on("receive-notification", (notification: INotification) => {
            console.log("notification:", notification);
            setNotifications(prev => [notification, ...prev]);
        });

        return () => {
            socket.off("receive-notification");
            socket.disconnect();
        };
    }, [page]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight * 1.5 && !isLoading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const handleNotificationClick = async (notificationId: string, url: string) => {
        try {
            const res:ApiResponse<null> = await markNotificationAsRead(notificationId);
            if (res.success) {
                setNotifications(prev => 
                    prev.map(notif => 
                        notif._id === notificationId 
                            ? { ...notif, isRead: true }
                            : notif
                    )
                );
                dispatch(setUnreadCount(Math.max(0, unreadCount - 1)));
                
                if (url) {
                    navigate(url);
                }
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const res:ApiResponse<null> = await markAllNotificationsAsRead();
            if (res.success) {
                setNotifications(prev => 
                    prev.map(notif => ({ ...notif, isRead: true }))
                );
                // Set unread count to 0 in Redux store
                dispatch(setUnreadCount(0));
            }
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-800 lg:text-xl xs:text-base text-sm font-bold">
                    Notifications
                </h2>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-green-700 hover:text-green-800 font-medium px-2 py-1 rounded-md hover:bg-green-50 transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div 
                onScroll={handleScroll}
                className="space-y-3 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2"
            >
                {notifications && notifications.length > 0 ? (
                    <>
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification._id, notification.url)}
                                className={`p-3 rounded-lg ${notification.isRead ? 'bg-gray-50' : 'bg-white'} border border-gray-200 cursor-pointer hover:shadow-md transition-shadow relative`}
                            >
                                {!notification.isRead && (
                                    <div className="absolute right-2 top-2">
                                        <div className="bg-red-500 h-1 rounded-full w-1"></div>
                                    </div>
                                )}
                                <div className="flex justify-between items-center mt-2"> 
                                    <h4 className={'text-gray-800 text-sm font-semibold'}>
                                        {notification.title}
                                    </h4>
                                    <span className="text-gray-500 text-xs">
                                        {new Date(notification.createdAt).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        }).replace(' at ', ' ')}
                                    </span>
                                </div>
                                <p className={`text-gray-600 text-sm mt-3 ${!notification.isRead ? 'font-medium' : 'font-normal'}`}>
                                    {notification.message}
                                </p>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="text-center py-4">
                                <div className="border-b-2 border-green-700 h-6 rounded-full w-6 animate-spin inline-block"></div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center text-gray-500 py-4">
                        No notifications
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;