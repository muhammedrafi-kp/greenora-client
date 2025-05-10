import { apiClient } from "../apis/api";
import { ApiResponse } from "../types/common";
import { INotification } from "../types/notification";

export const getNotifications = async (pageNumber: number = 1):Promise<ApiResponse<INotification[]>> => {
    try {
        const response = await apiClient.get(`/notification-service/notification/notifications?page=${pageNumber}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
}

export const getUnreadNotificationCount = async ():Promise<ApiResponse<number>> => {
    try {
        const response = await apiClient.get('/notification-service/notification/unread-count');
        return response.data;
    } catch (error) {
        console.error("Error fetching unread notification count:", error);
        throw error;
    }
}

export const markNotificationAsRead = async (notificationId: string):Promise<ApiResponse<null>> => {
    try {
        const response = await apiClient.patch(`/notification-service/notification/read/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching unread notification count:", error);
        throw error;
    }
}

export const markAllNotificationsAsRead = async ():Promise<ApiResponse<null>> => {
    try {
        const response = await apiClient.patch('/notification-service/notification/read-all');
        return response.data;
    } catch (error) {
        console.error("Error fetching unread notification count:", error);
        throw error;
    }
}

