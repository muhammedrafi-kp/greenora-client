import { apiClient } from "./api";

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
    const response = await apiClient.post("/location-service/district/create-district", { name });
    return response.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw new Error('Failed to create district.');
  }
}

export const getDistricts = async () => {
  try {
    const response = await apiClient.get("/location-service/district/districts-with-servic-areas");
    return response.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw new Error('Failed to fetch districts.');
  }
}

export const updateDistrict = async (districtId: string, name: string) => {
  try {
    const response = await apiClient.put(`/location-service/district/update-district/${districtId}`, { name });
    return response.data;
  } catch (error) {
    console.error('Error updating district:', error);
    throw new Error('Failed to update district.');
  }
}

export const deleteDistrict = async (districtId: string) => {
  try {
    const response = await apiClient.put(`/location-service/district/delete-district/${districtId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting district:', error);
    throw new Error('Failed to delete district.');
  }
}

