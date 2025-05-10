import { apiClient } from "../apis/api";
import { ICategory, IItem, ICollection } from "../types/collection";
import { ApiResponse } from "../types/common";

export const addCategory = async (categoryData: object):Promise<ApiResponse<ICategory>> => {
  try {
    const res = await apiClient.post("/request-service/category", categoryData);
    return res.data;
  } catch (error) {
    console.error('Error adding waste category:', error);
    throw new Error('Failed to add waste category.');
  }
}

export const getCategories = async (type?: string):Promise<ApiResponse<ICategory[]>> => {
  try {
    const res = await apiClient.get(`/request-service/category/categories?type=${type}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching waste categories:', error);
    throw new Error('Failed to fetch waste categories.');
  }
}

export const updateCategory = async (categoryId: string, categoryData: object):Promise<ApiResponse<ICategory>> => {
  try {
    const res = await apiClient.put(`/request-service/category/${categoryId}`, categoryData);
    return res.data;
  } catch (error) {
    console.error('Error updating waste category:', error);
    throw new Error('Failed to update waste category.');
  }
}

export const deleteCategory = async (categoryId: string):Promise<ApiResponse<ICategory>> => {
  try {
    const res = await apiClient.delete(`/request-service/category/${categoryId}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting waste category:', error);
    throw new Error('Failed to delete waste category.');
  }
}


export const calculatePickupCost = async (items: IItem[]):Promise<ApiResponse<number>> => {
  try {
      console.log("items:", items);
      const res = await apiClient.post('/request-service/category/total-cost', { items });
      return res.data;
  } catch (error) {
      console.error("Error calculating pickup cost:", error);
      throw error;
  }
}




export const sendPaymentRequest = async (formData: FormData):Promise<ApiResponse<null>> => {
  try {
      const response = await apiClient.post('/request-service/collection/payment-request', formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      });
      return response.data;
  } catch (error) {
      console.error("Error sending payment request:", error);
      throw error;
  }
}

export const initiateRazorpayAdvance = async (collectionData: any) => {
  try {
      const response = await apiClient.post('/request-service/collection/payment/advance/razorpay/initiate', collectionData);
      return response.data;
  } catch (error) {
      console.error("Error creating payment order:", error);
      throw error;
  }
}

export const verifyRazorpayAdvance = async (paymentData: any) => {
  try {
      const response = await apiClient.post('/request-service/collection/payment/advance/razorpay/verify', paymentData);
      return response.data;
  } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
  }
}

export const payAdvanceWithWallet = async (collectionData: any) => {
  try {
      const response = await apiClient.post('/request-service/collection/payment/advance/wallet', collectionData);
      return response.data;
  } catch (error) {
      console.error("Error creating payment order:", error);
      throw error;
  }
}


export const paywithRazorpay = async (collectionId: string, razorpayVerificationData: any) => {
  try {
      const response = await apiClient.post('/request-service/collection/payment/razorpay/verify', { collectionId, razorpayVerificationData });
      return response.data;
  } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
  }
}

export const paywithWallet = async (collectionId: string) => {
  try {
      const response = await apiClient.post('/request-service/collection/payment/wallet', { collectionId });
      return response.data;
  } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
  }
}





export const completeCollection = async (collectionId: string, formData: FormData):Promise<ApiResponse<null>> => {
  try {
      const res = await apiClient.patch(`/request-service/collection/${collectionId}`, formData);
      return res.data;
  } catch (error) {
      console.error("Error processing payment:", error);
      throw error;
  }
}

export const scheduleCollection = async (collectionId: string, collectorId: string, userId: string, preferredDate: string):Promise<ApiResponse<null>> => {
  try {
    const res = await apiClient.post(`/request-service/collection/schedule/${collectionId}`, {
      collectorId,
      userId,
      preferredDate
    });
    return res.data;
  } catch (error) {
    console.error("Error scheduling collection:", error);
    throw error;
  }
}

export const cancelCollection = async (collectionId: string, reason: string):Promise<ApiResponse<null>> => {
  try {
      const res = await apiClient.put('/request-service/collection/cancel', { collectionId, reason });
      return res.data
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
}):Promise<ApiResponse<ICollection[]>> => {
    try {
        const res = await apiClient.get('/request-service/collection', { params });
        return res.data;
    } catch (error) {
        console.error("Error fetching collection histories:", error);
        throw error;
    }
}

// export const getCollectionRequests = async (params: object):Promise<ApiResponse<{collections:ICollection[],totalItems:number}>> => {
export const getCollectionRequests = async (params: object) => {
  try {
    const res = await apiClient.get('/request-service/collection/collections', { params });
    return res.data;
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
      const res = await apiClient.get('/request-service/collection/collector/assigned-collections', { params });
      return res.data;
  } catch (error) {
      throw error;
  }
}