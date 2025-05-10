import { apiClient } from "../apis/api";
import { IChat } from "../types/chat";
import { ApiResponse } from "../types/common";


export const initiateChat = async (chatData: IChat):Promise<ApiResponse<IChat>> => {
    try {
        const response = await apiClient.post('/chat-service/chat', chatData);
        return response.data;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error;
    }
}

export const getGreenoBotResponse = async (prompt: string):Promise<ApiResponse<string>> => {
    try {
        const response = await apiClient.post('/chat-service/chatbot', { prompt });
        return response.data;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error;
    }
}

export const getChats = async ():Promise<ApiResponse<IChat[]>> => {
    try {
        const response = await apiClient.get(`/chat-service/chats`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        throw new Error('Failed to fetch chat messages.');
    }
}