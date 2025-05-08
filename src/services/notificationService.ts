import { apiClient } from "../apis/api";

export const getNotifications = async (pageNumber: number = 1) => {
    try {
        const response = await apiClient.get(`/notification-service/notification/notifications?page=${pageNumber}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
}

export const getUnreadNotificationCount = async () => {
    try {
        const response = await apiClient.get('/notification-service/notification/unread-count');
        console.log("response:", response);
        return response.data;
    } catch (error) {

        console.error("Error fetching unread notification count:", error);
        throw error;
    }
}

export const markNotificationAsRead = async (notificationId: string) => {
    try {
        const response = await apiClient.patch(`/notification-service/notification/read/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching unread notification count:", error);
        throw error;
    }
}

export const markAllNotificationsAsRead = async () => {
    try {
        const response = await apiClient.patch('/notification-service/notification/read-all');
        return response.data;
    } catch (error) {
        console.error("Error fetching unread notification count:", error);
        throw error;
    }
}


export const askChatBot = async () => {
    try {
        const response = await apiClient.post('/chat-service/ask-chatbot');
        return response.data;
    } catch (error) {
        console.error("Error fetching unread notification count:", error);
        throw error;
    }
}
