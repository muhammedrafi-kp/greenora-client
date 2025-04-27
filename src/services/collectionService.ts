import { apiClient } from "../apis/api";

export const getCollectionHistory = async (params?: {
  startDate?: string;
  endDate?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}) => {
    try {
        const response = await apiClient.get('/request-service/collection', { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching collection histories:", error);
        throw error;
    }
}

export const getCollectionHistories = async (params: object) => {
  try {
    const response = await apiClient.get('/request-service/collection/collections', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching collection histories:", error);
    throw error;
  }
}