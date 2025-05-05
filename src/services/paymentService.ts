import { apiClient } from "../apis/api";

export const sendPaymentRequest = async (formData: FormData) => {
    try {
        const response = await apiClient.post('/request-service/collection/payment-request', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error sending payment request:", error);
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

export const getWalletData = async () => {
    try {
        const response = await apiClient.get('/payment-service/wallet');
        return response.data;
    } catch (error) {
        console.error("Error fetching wallet data:", error);
        throw error;
    }
}

export const initiateAdvancePayment = async (collectionData: any, paymentMethod: string) => {
    try {
        // const response = await apiClient.post('/payment-service/collection-payment/initiate-advance-payment', { collectionData, paymentMethod });
        const response = await apiClient.post('/request-service/collection/initiate-payment/advance', { collectionData, paymentMethod });

        return response.data;
    } catch (error) {
        console.error("Error creating payment order:", error);
        throw error;
    }
}


export const verifyAdvancePayment = async (paymentData: any) => {
    try {
        const response = await apiClient.post('/request-service/collection/verify-payment/advance', paymentData);
        return response.data;
    } catch (error) {
        console.error("Error verifying payment:", error);
        throw error;
    }
}

export const verifyCollectionPayment = async ( collectionId: string, razorpayVerificationData: any ) => {
    try {
        const response = await apiClient.post('/request-service/collection/verify-payment', { collectionId, razorpayVerificationData });
        return response.data;
    } catch (error) {
        console.error("Error verifying payment:", error);
        throw error;
    }
}