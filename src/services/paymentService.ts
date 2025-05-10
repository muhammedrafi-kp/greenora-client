import { apiClient } from "../apis/api";
import { ApiResponse } from "../types/common";
import { IWallet } from "../types/payment";


export const getWalletData = async ():Promise<ApiResponse<IWallet>> => {
    try {
        const response = await apiClient.get('/payment-service/wallet');
        return response.data;
    } catch (error) {
        console.error("Error fetching wallet data:", error);
        throw error;
    }
}

export const initiateAddMoney = async (amount: number):Promise<ApiResponse<{amount:number,orderId:string}>> => {
    try {
        const response = await apiClient.post('/payment-service/wallet/deposits/initiate', { amount });
        return response.data;
    } catch (error) {
        console.error("Error adding money to wallet:", error);
        throw error;
    }
}

export const verifyAddMoney = async (razorpayVerificationData: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; }):Promise<ApiResponse<null>> => {
    try {
        const response = await apiClient.post('/payment-service/wallet/deposits/verify', razorpayVerificationData);
        return response.data;
    } catch (error) {
        console.error("Error verifying deposit:", error);
        throw error;
    }
}

export const withdrawMoney = async (amount: number):Promise<ApiResponse<null>> => {
    try {
        const response = await apiClient.post('/payment-service/wallet/withdrawals', { amount });
        return response.data;
    } catch (error) {
        console.error("Error withdrawing money:", error);
        throw error;
    }
}