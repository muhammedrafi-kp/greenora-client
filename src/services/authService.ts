import { IUserSignUpData, ICollectorSignUpData } from "../types/user";
import { publicApiClient } from "../apis/api";
import { apiClient } from "../apis/api";
import { ApiResponse } from "../types/common";
import { IUser, ICollector } from "../types/user";

//admin auth apis
export const loginAdmin = async (email: string, password: string): Promise<ApiResponse<{ token: string, role: string }>> => {
    try {
        const res = await publicApiClient.post("/user-service/admin/login", { email, password });
        return res.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
};

export const signUpAdmin = async (email: string, password: string) => {
    try {
        const res = await publicApiClient.post("/user-service/admin/signup", { email, password });
        return res.data;
    } catch (error) {
        console.error("Signup Error:", error);
        throw error;
    }
};

//user auth apis
export const loginUser = async (email: string, password: string): Promise<ApiResponse<{ token: string, role: string }>> => {
    try {
        const res = await publicApiClient.post("/user-service/users/login", { email, password });
        return res.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

export const signUpUser = async (userData: IUserSignUpData): Promise<ApiResponse<null>> => {
    try {
        const res = await publicApiClient.post("/user-service/users/signup", userData);
        return res.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

export const verifyOtpUser = async (email: string, otp: string): Promise<ApiResponse<{ token: string, role: string, user: IUser }>> => {
    try {
        const res = await publicApiClient.post("/user-service/users/otp/verify", { email, otp });
        return res.data;
    } catch (error) {
        console.error("Error during OTP verification:", error);
        throw error;
    }
};

export const resendOtpUser = async (email: string): Promise<ApiResponse<null>> => {
    try {
        const res = await publicApiClient.post("/user-service/users/otp/resend", { email });
        console.log("response form service :", res);
        return res.data;
    } catch (error) {
        console.error("Error resending OTP:", error);
        throw error;
    }
};

export const googleCallbackUser = async (credential: string): Promise<ApiResponse<{ token: string, role: string, user: IUser }>> => {
    try {
        const res = await publicApiClient.post("/user-service/users/google/callback", { credential });
        return res.data;
    } catch (error) {
        console.error("Error during Google callback:", error);
        throw error;
    }
};

//collector auth apis   
export const loginCollector = async (email: string, password: string): Promise<ApiResponse<{ token: string, role: string, collector: ICollector }>> => {
    try {
        const res = await publicApiClient.post("/user-service/collectors/login", { email, password });
        return res.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

export const signUpCollector = async (userData: ICollectorSignUpData): Promise<ApiResponse<null>> => {
    try {
        const res = await publicApiClient.post("/user-service/collectors/signup", userData);
        return res.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

export const verifyOtpCollector = async (email: string, otp: string): Promise<ApiResponse<{ token: string, role: string, collector: ICollector }>> => {
    try {
        const res = await publicApiClient.post("/user-service/collectors/otp/verify", { email, otp });
        return res.data;
    } catch (error) {
        console.error("Error during OTP verification:", error);
        throw error;
    }
};

export const resendOtpCollector = async (email: string): Promise<ApiResponse<null>> => {
    try {
        const res = await publicApiClient.post("/user-service/collectors/otp/resend", { email });
        console.log("response form service :", res);
        return res.data;
    } catch (error) {
        console.error("Error resending OTP:", error);
        throw error;
    }
};

export const googleCallbackCollector = async (credential: string): Promise<ApiResponse<{ token: string, role: string, collector: ICollector }>> => {
    try {
        const res = await publicApiClient.post("/user-service/collectors/google/callback", { credential });
        return res.data;
    } catch (error) {
        console.error("Error during Google callback:", error);
        throw error;
    }
};


//common auth apis
export const changePassword = async (role: string, currentPassword: string, newPassword: string): Promise<ApiResponse<null>> => {
    try {
        const res = await apiClient.patch(`/user-service/${role}s/me/password`, { currentPassword, newPassword });
        return res.data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
}

export const sendResetLink = async (role: string, email: string): Promise<ApiResponse<null>> => {
    try {
        const res = await publicApiClient.post(`/user-service/${role}s/password-reset`, { email });
        return res.data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
}

export const resetPassword = async (role: string, token: string, password: string): Promise<ApiResponse<null>> => {
    try {
        const res = await publicApiClient.patch(`/user-service/${role}s/password-reset`, { token, password });
        return res.data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
}

export const logout = async (role: string): Promise<ApiResponse<null>> => {
    try {
        const res = await apiClient.post(`/user-service/${role}s/logout`);
        return res.data;
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
}