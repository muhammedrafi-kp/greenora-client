import { apiClient } from "../apis/api";
import { IChat } from "../interfaces/interfaces";


export const initiateChat = async (chatData: IChat) => {
    try {
        const response = await apiClient.post('/chat-service/chat', chatData);
        return response.data;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error;
    }
}

export const getGreenoBotResponse = async (prompt: string) => {
    try {
        const response = await apiClient.post('/chat-service/chatbot', { prompt });
        return response.data;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error;
    }
}

