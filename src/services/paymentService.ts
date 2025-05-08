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

export const initiateRazorpayAdvance = async (collectionData: any) => {
    try {
        const response = await apiClient.post('/request-service/collection/payment/advance/razorpay/initiate', collectionData);
        return response.data;
    } catch (error) {
        console.error("Error creating payment order:", error);
        throw error;
    }
}

export const verifyRazorpayAdvance = async (paymentData: any) => {
    try {
        const response = await apiClient.post('/request-service/collection/payment/advance/razorpay/verify', paymentData);
        return response.data;
    } catch (error) {
        console.error("Error verifying payment:", error);
        throw error;
    }
}

export const payAdvanceWithWallet = async (collectionData: any) => {
    try {
        const response = await apiClient.post('/request-service/collection/payment/advance/wallet', collectionData);
        return response.data;
    } catch (error) {
        console.error("Error creating payment order:", error);
        throw error;
    }
}


export const paywithRazorpay = async (collectionId: string, razorpayVerificationData: any) => {
    try {
        const response = await apiClient.post('/request-service/collection/payment/razorpay/verify', { collectionId, razorpayVerificationData });
        return response.data;
    } catch (error) {
        console.error("Error verifying payment:", error);
        throw error;
    }
}

export const paywithWallet = async (collectionId: string) => {
    try {
        const response = await apiClient.post('/request-service/collection/payment/wallet', { collectionId });
        return response.data;
    } catch (error) {
        console.error("Error verifying payment:", error);
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