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
        const response = await apiClient.post('/chat-service/chat', chatData);
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

export const cancelCollection = async (collectionId: string, reason: string) => {
    try {
        const response = await apiClient.patch('/request-service/collection/cancel', { collectionId, reason });
        return response.data
    } catch (error) {
        console.error("Error while cancelling collection:", error);
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

export const getWalletData = async () => {
    try {
        const response = await apiClient.get('/payment-service/wallet');
        return response.data;
    } catch (error) {
        console.error("Error fetching wallet data:", error);
        throw error;
    }
}

export const initiateAddMoney = async (amount: number) => {
    try {
        const response = await apiClient.post('/payment-service/wallet/deposits/initiate', { amount });
        return response.data;
    } catch (error) {
        console.error("Error adding money to wallet:", error);
        throw error;
    }
}

export const verifyAddMoney = async (razorpayVerificationData: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; }) => {
    try {
        const response = await apiClient.post('/payment-service/wallet/deposits/verify', razorpayVerificationData);
        return response.data;
    } catch (error) {
        console.error("Error verifying deposit:", error);
        throw error;
    }
}

export const withdrawMoney = async (amount: number) => {
    try {
        const response = await apiClient.post('/payment-service/wallet/withdrawals', { amount });
        return response.data;
    } catch (error) {
        console.error("Error withdrawing money:", error);
        throw error;
    }
}

export const getNotifications = async (pageNumber: number = 1) => {
    try {
        const response = await apiClient.get(`/notification-service/notification/notifications?page=${pageNumber}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
}

export const getUnreadNotificationCount = async () => {
    try {
        const response = await apiClient.get('/notification-service/notification/unread-count');
        console.log("response:", response);
        return response.data;
    } catch (error) {

        console.error("Error fetching unread notification count:", error);
        throw error;
    }
}

export const markNotificationAsRead = async (notificationId: string) => {
    try {
        const response = await apiClient.patch(`/notification-service/notification/read/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching unread notification count:", error);
        throw error;
    }
}

export const markAllNotificationsAsRead = async () => {
    try {
        const response = await apiClient.patch('/notification-service/notification/read-all');
        return response.data;
    } catch (error) {
        console.error("Error fetching unread notification count:", error);
        throw error;
    }
}


export const askChatBot = async () => {
    try {
        const response = await apiClient.post('/chat-service/ask-chatbot');
        return response.data;
    } catch (error) {
        console.error("Error fetching unread notification count:", error);
        throw error;
    }
}
