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


export const getCollectorData = async (role:string,collectorId?: string) => {
    try {
        const response = await apiClient.get(`/user-service/${role}/collector/${collectorId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching collector data:", error);
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


//admin services


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
        params: { serviceArea:serviceAreaId, preferredDate }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching available collectors:", error);
      throw error;
    }
  }