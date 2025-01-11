import { loginUser, signUpUser, verifyOtpUser, resendOtpUser } from '../api/authApi';
import { getUserDataApi } from "../api/userApi";

import { IUserSignUpData } from "../interfaces/interfaces";

export const handleUserLogin = async (email: string, password: string) => {
    try {
        const response = await loginUser(email, password);
        return response;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

export const handleUserSignUp = async (userData: IUserSignUpData) => {
    try {
        const response = await signUpUser(userData);
        return response;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}


export const handleVerifyOtp = async (email: string, otp: string) => {
    try {
        const response = await verifyOtpUser(email, otp);
        console.log("OTP verified successfully:", response);
        return response;
    } catch (error) {
        console.error("Error during OTP verification:", error);
        throw error;
    }
};

export const handleResendOtp = async (email: string) => {
    try {
        const response = await resendOtpUser(email);
        console.log("OTP resent successfully");
        return response;
    } catch (error) {
        console.error("Error resending OTP:", error);
        throw error;
    }
};

export const getUserData = async () => {
    try {
        return await getUserDataApi();
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}


