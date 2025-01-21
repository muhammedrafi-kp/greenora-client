import { IUserSignUpData, ICollectorSignUpData } from "../interfaces/interfaces";
import apiClient from "./api";

//admin auth apis
export const loginAdmin = async (email: string, password: string) => {
    try {
        const response = await apiClient.post("/user-service/admin/login", { email, password });
        return response.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
};

export const signUpAdmin = async (email: string, password: string) => {
    try {
        const response = await apiClient.post("/user-service/admin/signup", { email, password });
        return response.data;
    } catch (error) {
        console.error("Signup Error:", error);
        throw error;
    }
};

//user auth apis
export const loginUser = async (email: string, password: string) => {
    try {
        const response = await apiClient.post("/user-service/user/login", { email, password });
        return response.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

export const signUpUser = async (userData: IUserSignUpData) => {
    try {
        const response = await apiClient.post("/user-service/user/signup", userData);
        return response.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

export const verifyOtpUser = async (email: string, otp: string) => {
    try {
        const response = await apiClient.post("/user-service/user/verify-otp", { email, otp });
        return response.data;
    } catch (error) {
        console.error("Error during OTP verification:", error);
        throw error;
    }
};

export const resendOtpUser = async (email: string) => {
    try {
        const response = await apiClient.post("/user-service/user/resend-otp", { email });
        console.log("response form service :", response);
        return response.data;
    } catch (error) {
        console.error("Error resending OTP:", error);
        throw error;
    }
};

//collector auth apis   
export const loginCollector = async (email: string, password: string) => {
    try {
        const response = await apiClient.post("/user-service/collector/login", { email, password });
        return response.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

export const signUpCollector = async (userData: ICollectorSignUpData) => {
    try {
        const response = await apiClient.post("/user-service/collector/signup", userData);
        return response.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

export const verifyOtpCollector = async (email: string, otp: string) => {
    try {
        const response = await apiClient.post("/user-service/collector/verify-otp", { email, otp });
        return response.data;
    } catch (error) {
        console.error("Error during OTP verification:", error);
        throw error;
    }
};

export const resendOtpCollector = async (email: string) => {
    try {
        const response = await apiClient.post("/user-service/collector/resend-otp", { email });
        console.log("response form service :", response);
        return response.data;
    } catch (error) {
        console.error("Error resending OTP:", error);
        throw error;
    }
};

