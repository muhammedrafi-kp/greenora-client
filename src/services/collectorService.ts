import { apiClient } from "../apis/api";

export const getCollectorData = async () => {
    try {
        const response = await apiClient.get("/user-service/collector");
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

export const updateCollectorData = async (collectorData: FormData) => {
    try {
        const response = await apiClient.put("/user-service/collector", collectorData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
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

export const getDistrictAndServiceArea = async (districtId: string, serviceAreaId: string) => {
    try {
        const response = await apiClient.get(`/location-service/service-area/user/district/${districtId}/service-area/${serviceAreaId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching district and service area:', error);
        throw error;
    }
};

export const getPaymentData = async (paymentId: string) => {
    try {
        const response = await apiClient.get(`/payment-service/collection-payment/${paymentId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching payment data:", error);
        throw error;
    }
}

export const getAssignedCollections = async () => {
    try {
        const response = await apiClient.get('/request-service/collection/collector/assigned-collections');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const completeCollection = async (collectionId: string, formData: FormData) => {
    try {
        const response = await apiClient.patch(`/request-service/collection/${collectionId}`, formData);
        return response.data;
    } catch (error) {
        console.error("Error processing payment:", error);
        throw error;
    }
}

