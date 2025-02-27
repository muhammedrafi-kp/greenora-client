import { apiClient } from "../apis/api";

export const getUsers = async () => {
  try {
    const response = await apiClient.get("/user-service/admin/users");
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users. Please try again later.');
  }
}

export const getCollectors = async () => {
  try {
    const response = await apiClient.get("/user-service/admin/collectors");
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users. Please try again later.');
  }
}

export const getVerificationRequests = async () => {
  try {
    const response = await apiClient.get("/user-service/admin/verification-requests");
    return response.data;
  } catch (error) {
    console.error('Error fetching verification requests:', error);
    throw new Error('Failed to fetch verification requests. Please try again later.');
  }
}

export const updateVerificationStatus = async (id: string, status: string) => {
  try {
    const response = await apiClient.patch(`/user-service/admin/update-verification-status/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating verification status:', error);
    throw new Error('Failed to update verification status.');
  }
}

export const updateUserStatus = async (id: string) => {
  try {
    const response = await apiClient.patch(`/user-service/admin/update-user-status/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw new Error('Failed to update user status.');
  }
}

export const updateCollectorStatus = async (id: string) => {
  try {
    const response = await apiClient.patch(`/user-service/admin/update-collector-status/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error updating collector status:', error);
    throw new Error('Failed to update collector status.');
  }
}

export const addCategory = async (categoryData: object) => {
  try {
    const response = await apiClient.post("/request-service/category/create-category", categoryData);
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
    const response = await apiClient.put(`/request-service/category/update-category/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating waste category:', error);
    throw new Error('Failed to update waste category.');
  }
}

export const deleteCategory = async (categoryId: string) => {
  try {
    const response = await apiClient.put(`/request-service/category/delete-category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting waste category:', error);
    throw new Error('Failed to delete waste category.');
  }
}

export const addDistrict = async (name: string) => {
  try {
    const response = await apiClient.post("/location-service/service-area/admin/create-district", { name });
    return response.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw new Error('Failed to create district.');
  }
}


export const getDistrictsWithServiceAreas = async () => {
  try {
    const response = await apiClient.get("/location-service/service-area/admin/districts-with-servic-areas");
    return response.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw new Error('Failed to fetch districts.');
  }
}

export const updateDistrict = async (districtId: string, name: string) => {
  try {
    const response = await apiClient.put(`/location-service/service-area/admin/update-district/${districtId}`, { name });
    return response.data;
  } catch (error) {
    console.error('Error updating district:', error);
    throw new Error('Failed to update district.');
  }
}

export const deleteDistrict = async (districtId: string) => {
  try {
    const response = await apiClient.put(`/location-service/service-area/admin/delete-district/${districtId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting district:', error);
    throw new Error('Failed to delete district.');
  }
}

export const addServiceArea = async (serviceAreaData: object) => {
  try {
    const response = await apiClient.post("/location-service/service-area/admin/create-service-area", serviceAreaData);
    return response.data;
  } catch (error) {
    console.error('Error adding service area:', error);
    throw new Error('Failed to add service area.');
  }
}

export const updateServiceArea = async (serviceAreaId: string, serviceAreaData: object) => {
  try {
    const response = await apiClient.put(`/location-service/service-area/admin/update-service-area/${serviceAreaId}`, serviceAreaData);
    return response.data;
  } catch (error) {
    console.error('Error updating service area:', error);
    throw new Error('Failed to update service area.');
  }
}


export const getCollectionHistories = async () => {
  try {
    const response = await apiClient.get('/request-service/collection/histories');
    return response.data;
  } catch (error) {
    console.error("Error fetching collection histories:", error);
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
