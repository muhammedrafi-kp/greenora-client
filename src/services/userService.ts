import { apiClient } from "../apis/api";

//admin
export const getAdminData = async () => {
    try {
        const response = await apiClient.get("/user-service/user/admin");
        return response.data;
    } catch (error) {
        console.error("Error fetching admin data:", error);
        throw error;
    }
}

export const getUsers = async (params?: {
    search?: string;
    status?: string;
    sortField?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
}) => {
    try {
        const response = await apiClient.get("/user-service/admin/users", { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users. Please try again later.');
    }
}

export const getCollectors = async (params?: {
    search?: string;
    status?: string;
    verificationStatus?: string;
    district?: string;
    serviceArea?: string;
    sortField?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
}) => {
    console.log("params :", params);
    try {
        const response = await apiClient.get("/user-service/admin/collectors", { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching collectors:', error);
        throw new Error('Failed to fetch collectors. Please try again later.');
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
        const response = await apiClient.patch(`/user-service/admin/verification-status/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating verification status:', error);
        throw new Error('Failed to update verification status.');
    }
}

export const updateUserStatus = async (id: string) => {
    try {
        const response = await apiClient.patch(`/user-service/admin/user-status/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error updating user status:', error);
        throw new Error('Failed to update user status.');
    }
}

export const updateCollectorStatus = async (id: string) => {
    try {
        const response = await apiClient.patch(`/user-service/admin/collector-status/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error updating collector status:', error);
        throw new Error('Failed to update collector status.');
    }
}

export const getAvailableCollectors = async (serviceAreaId: string, preferredDate: string) => {
    try {
        // const encodedDate = encodeURIComponent(preferredDate);
        console.log("preferredDate :", preferredDate);
        const response = await apiClient.get("/user-service/admin/available-collectors", {
            params: { serviceArea: serviceAreaId, preferredDate }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching available collectors:", error);
        throw error;
    }
}



//user
export const getUserData = async () => {
    try {
        const response = await apiClient.get("/user-service/user");
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

export const updateUserData = async (userData: FormData) => {
    try {
        const response = await apiClient.put("/user-service/user", userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
        );
        console.log("response:", response);

        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}

export const uploadProfileImage = async (data: FormData) => {
    try {
        const response = await apiClient.patch("/user-service/user/upload-profile-image", data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading user profile image:", error);
        throw error;
    }
}





//collector


export const getCollectorData = async (role: string, collectorId?: string) => {
    try {
        const response = await apiClient.get(`/user-service/${role}/collector/${collectorId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching collector data:", error);
        throw error;
    }
}







