import { apiClient } from "../apis/api";

export const getUserData = async () => {
    try {
        const response = await apiClient.get("/user-service/user");
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

export const getAdminData = async () => {
    try {
        const response = await apiClient.get("/user-service/user/admin");
        return response.data;
    } catch (error) {
        console.error("Error fetching admin data:", error);
        throw error;
    }
}

export const initiateChat = async (chatData: object) => {
    try {
        const response = await apiClient.post('/chat-service/chat',chatData);
        return response.data;
    } catch (error) {
        console.error("Error fetching chat history:", error);
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

export const calculatePickupCost = async (items: Array<object>) => {
    try {
        console.log("items:", items);
        const response = await apiClient.post('/request-service/category/total-cost', { items });
        return response.data;
    } catch (error) {
        console.error("Error calculating pickup cost:", error);
        throw error;
    }
}

export const initiatePayment = async (collectionData: any) => {
    try {
        const response = await apiClient.post('/payment-service/collection-payment/initiate-payment', collectionData);
        return response.data;
    } catch (error) {
        console.error("Error creating payment order:", error);
        throw error;
    }
}

export const verifyPayment = async (paymentData: any) => {
    try {
        const response = await apiClient.post('/payment-service/collection-payment/verify-payment', paymentData);
        return response.data;
    } catch (error) {
        console.error("Error verifying payment:", error);
        throw error;
    }
}

// export const createPickupRequest = async (collectionData: object) => {
//     try {
//         const response = await apiClient.post('/request-service/collection', collectionData);
//         return response.data;
//     } catch (error) {
//         console.error("Error creating pickup request:", error);
//         throw error;
//     }
// }

export const getCollectionHistory = async () => {
    try {
        const response = await apiClient.get('/request-service/collection');
        return response.data;
    } catch (error) {
        console.error("Error fetching collection histories:", error);
        throw error;
    }
}

export const getCollectorData = async (collectorId?: string) => {
    try {
        const response = await apiClient.get(`/user-service/user/collector/${collectorId}`);
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

export const getDistrictAndServiceArea = async (districtId: string, serviceAreaId: string) => {
    try {
        const response = await apiClient.get(`/location-service/service-area/user/district/${districtId}/service-area/${serviceAreaId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching district and service area:', error);
        throw error;
    }
};


