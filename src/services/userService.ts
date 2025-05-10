import { apiClient } from "../apis/api";
import { ApiResponse } from "../types/common";
import { IAdmin, IUser, ICollector } from "../types/user";

//admin
export const getAdminData = async (): Promise<ApiResponse<IAdmin>> => {
    try {
        const res = await apiClient.get("/user-service/user/admin");
        return res.data;
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
}): Promise<ApiResponse<{ users: IUser[], totalItems: number, totalPages: number, currentPage: number }>> => {
    try {
        const res = await apiClient.get("/user-service/admin/users", { params });
        return res.data;
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
        const res = await apiClient.get("/user-service/admin/collectors", { params });
        return res.data;
    } catch (error) {
        console.error('Error fetching collectors:', error);
        throw new Error('Failed to fetch collectors. Please try again later.');
    }
}

export const getVerificationRequests = async () => {
    try {
        const res = await apiClient.get("/user-service/admin/verification-requests");
        return res.data;
    } catch (error) {
        console.error('Error fetching verification requests:', error);
        throw new Error('Failed to fetch verification requests. Please try again later.');
    }
}

export const updateVerificationStatus = async (id: string, status: string): Promise<ApiResponse<null>> => {
    try {
        const res = await apiClient.patch(`/user-service/admin/verification-status/${id}`, { status });
        return res.data;
    } catch (error) {
        console.error('Error updating verification status:', error);
        throw new Error('Failed to update verification status.');
    }
}

export const updateUserStatus = async (id: string):Promise<ApiResponse<null>> => {
    try {
        const res = await apiClient.patch(`/user-service/admin/user-status/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error updating user status:', error);
        throw new Error('Failed to update user status.');
    }
}

export const updateCollectorStatus = async (id: string):Promise<ApiResponse<null>> => {
    try {
        const res = await apiClient.patch(`/user-service/admin/collector-status/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error updating collector status:', error);
        throw new Error('Failed to update collector status.');
    }
}

export const getAvailableCollectors = async (serviceAreaId: string, preferredDate: string):Promise<ApiResponse<ICollector[]>> => {
    try {
        const res = await apiClient.get("/user-service/admin/available-collectors", {
            params: { serviceArea: serviceAreaId, preferredDate }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching available collectors:", error);
        throw new Error('Failed to fetch available collectors. Please try again later.');
    }
}


//user
export const getUserData = async ():Promise<ApiResponse<IUser>> => {
    try {
        const res = await apiClient.get("/user-service/user");
        return res.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

export const updateUserData = async (userData: FormData):Promise<ApiResponse<IUser>> => {
    try {
        const res = await apiClient.put("/user-service/user", userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
        );
        console.log("response:", res);

        return res.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}

export const uploadProfileImage = async (data: FormData):Promise<ApiResponse<string>> => {
    try {
        const res = await apiClient.patch("/user-service/user/upload-profile-image", data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error uploading user profile image:", error);
        throw error;
    }
}


//collector
export const getCollectorData = async (role: string, collectorId?: string):Promise<ApiResponse<ICollector>> => {
    try {
        const res = await apiClient.get(`/user-service/${role}/collector/${collectorId}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching collector data:", error);
        throw error;
    }
}







