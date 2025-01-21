import apiClient from "./api";

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



