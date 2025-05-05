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

export const getPaymentData = async (paymentId: string) => {
  try {
    const response = await apiClient.get(`/payment-service/collection-payment/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching payment data:", error);
    throw error;
  }
}





export const getPricingPlans = async () => {
  try {
    const response = await apiClient.get("/subscription-service/subscription/plans");
    return response.data;
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    throw new Error('Failed to fetch pricing plans.');
  }
}

export const addPricingPlan = async (PlanData: object) => {
  try {
    const response = await apiClient.post("/subscription-service/subscription/plan", PlanData);
    return response.data;
  } catch (error) {
    console.error('Error adding pricing plan:', error);
    throw new Error('Failed to add pricing plan.');
  }
}

export const updatePricingPlan = async (planId: string, planData: object) => {
  try {
    const response = await apiClient.put(`/subscription-service/subscription/plan/${planId}`, planData);
    return response.data;
  } catch (error) {
    console.error('Error updating pricing plan:', error);
    throw new Error('Failed to update pricing plan.');
  }
}

export const deletePricingPlan = async (planId: string) => {
  try {
    const response = await apiClient.delete(`/subscription-service/subscription/plan/${planId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting pricing plan:', error);
    throw new Error('Failed to delete pricing plan.');
  }
}

export const getChats = async () => {
  try {
    const response = await apiClient.get(`/chat-service/chats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw new Error('Failed to fetch chat messages.');
  }
}

