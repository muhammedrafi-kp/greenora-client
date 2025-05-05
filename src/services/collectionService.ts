import { apiClient } from "../apis/api";


export const addCategory = async (categoryData: object) => {
  try {
    const response = await apiClient.post("/request-service/category", categoryData);
    return response.data;
  } catch (error) {
    console.error('Error adding waste category:', error);
    throw new Error('Failed to add waste category.');
  }
}

export const getCategories = async (type: string) => {
  try {
    const response = await apiClient.get(`/request-service/category/categories?type=${type}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching waste categories:', error);
    throw new Error('Failed to fetch waste categories.');
  }
}

export const updateCategory = async (categoryId: string, categoryData: object) => {
  try {
    const response = await apiClient.put(`/request-service/category/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating waste category:', error);
    throw new Error('Failed to update waste category.');
  }
}

export const deleteCategory = async (categoryId: string) => {
  try {
    const response = await apiClient.delete(`/request-service/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting waste category:', error);
    throw new Error('Failed to delete waste category.');
  }
}





export const scheduleCollection = async (collectionId: string, collectorId: string, userId: string, preferredDate: string) => {
  try {
    const response = await apiClient.post(`/request-service/collection/schedule/${collectionId}`, {
      collectorId,
      userId,
      preferredDate
    });
    return response.data;
  } catch (error) {
    console.error("Error scheduling collection:", error);
    throw error;
  }
}

export const cancelCollection = async (collectionId: string, reason: string) => {
  try {
      const response = await apiClient.put('/request-service/collection/cancel', { collectionId, reason });
      return response.data
  } catch (error) {
      console.error("Error while cancelling collection:", error);
      throw error;
  }
}

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

export const getCollectionRequests = async (params: object) => {
  try {
    const response = await apiClient.get('/request-service/collection/collections', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching collection histories:", error);
    throw error;
  }
}


export const getRevenueData = async (params: object) => {
  try {
    const response = await apiClient.get('/request-service/collection/revenue', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching collection histories:", error);
    throw error;
  }
}


export const getAssignedCollections = async (params: { 
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number; 
  limit?: number; 
}) => {
  try {
      const response = await apiClient.get('/request-service/collection/collector/assigned-collections', { params });
      return response.data;
  } catch (error) {
      throw error;
  }
}