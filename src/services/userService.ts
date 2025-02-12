import { apiClient } from "./api";

export const getUserData = async () => {
    try {
        const response = await apiClient.get("/user-service/user/profile");
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

export const updateUserData = async (userData: FormData) => {
    try {
        const response = await apiClient.put("/user-service/user/update-profile", userData, {
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

export const getCategories = async () => {
    try {
        const response = await apiClient.get(`/request-service/category/categories`);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}

export const getAddresses = async () => {
    try {
        const response = await apiClient.get(`/location-service/address/addresses`);
        return response.data;
    } catch (error) {
        console.error("Error fetching addresses:", error);
        throw error;
    }
}

export const addAddress = async (addressData: object) => {
    try {
        const response = await apiClient.post("/location-service/address", addressData);
        return response.data;
    } catch (error) {
        console.error("Error adding address:", error);
        throw error;
    }
}

export const updateAddress = async (addressId: string, addressData: object) => {
    try {
        const response = await apiClient.put(`/location-service/address/${addressId}`, addressData);
        return response.data;
    } catch (error) {
        console.error("Error updating address:", error);
        throw error;
    }
}

export const deleteAddress = async (addressId: string) => {
    try {
        const response = await apiClient.delete(`/location-service/address/${addressId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting address:", error);
        throw error;
    }
}

export const getDistricts = async () => {
    try {
        const response = await apiClient.get(`/location-service/service-area/user/districts`);
        return response.data;
    } catch (error) {
        console.error("Error fetching districts:", error);
        throw error;
    }
}

export const getServiceAreas = async (districtId: string) => {
    try {
        const response = await apiClient.get(`/location-service/service-area/user/service-areas/${districtId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching service areas:", error);
        throw error;
    }
}

export const checkPinCode = async (serviceAreaId: string, pinCode: string) => {
    try {
        const response = await apiClient.post('/location-service/service-area/user/check-pin-code', {
            serviceAreaId,
            pinCode
        });
        return response.data;
    } catch (error: any) {
        // Return a structured error response instead of throwing
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to validate pin code'
        };
    }
}
