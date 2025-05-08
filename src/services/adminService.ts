import { apiClient } from "../apis/api";

export const getCollectorData = async (role:string,collectorId?: string) => {
  try {
    const response = await apiClient.get(`/user-service/${role}/${collectorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching collector data:", error);
    throw error;
  }
}




