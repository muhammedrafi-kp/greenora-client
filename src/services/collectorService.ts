import { loginCollector, signUpCollector, verifyOtpCollector, resendOtpCollector } from "../api/authApi";
import { getCollectorDataApi } from "../api/collectorApi"
import { ICollectorSignUpData } from "../interfaces/interfaces";

export const handleCollectorLogin = async (email: string, password: string) => {
    try {
        const response = await loginCollector(email, password);
        return response;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

export const handleCollectorSignUp = async (userData: ICollectorSignUpData) => {
    try {
        const response = await signUpCollector(userData);
        return response;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}


export const handleVerifyOtp = async (email: string, otp: string) => {
    try {
        const response = await verifyOtpCollector(email, otp);
        console.log("OTP verified successfully:", response);
        return response;
    } catch (error) {
        console.error("Error during OTP verification:", error);
        throw error;
    }
};

export const handleResendOtp = async (email: string) => {
    try {
        const response = await resendOtpCollector(email);
        console.log("OTP resent successfully");
        return response;
    } catch (error) {
        console.error("Error resending OTP:", error);
        throw error;
    }
};

export const getCollectorData = async () => {
    try {
        return await getCollectorDataApi();
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}