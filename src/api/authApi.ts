import axios from "axios";
import {IUserSignUpData} from "../interfaces/interfaces";

const authApi = axios.create({
    baseURL: "http://localhost:3000/user-service",
    withCredentials: true,
});


//user auth apis
export const loginUser = async (email: string, password: string) => {
    const response = await authApi.post("/user/login", { email, password });
    return response.data;
}

export const signUpUser = async (userData:IUserSignUpData) => {
    const response = await authApi.post("/user/signup",userData);
    return response.data;
}

export const verifyOtpUser = async (email:string,otp:string) => {
    const response = await authApi.post("/user/verify-otp",{email,otp});
    return response.data;
}

export const resendOtpUser = async(email:string)=>{
    const response = await authApi.post("/user/resend-otp",{email});
    console.log("response form service :",response);
    return response.data;
}


//collector auth apis
export const loginCollector = async (email: string, password: string) => {
    const response = await authApi.post("/collector/login", { email, password });
    return response.data;
}

export const signUpCollector = async (userData:IUserSignUpData) => {
    const response = await authApi.post("/collector/signup",userData);
    return response.data;
}

export const verifyOtpCollector = async (email:string,otp:string) => {
    const response = await authApi.post("/collector/verify-otp",{email,otp});
    return response.data;
}

export const resendOtpCollector = async(email:string)=>{
    const response = await authApi.post("/collector/resend-otp",{email});
    console.log("response form service :",response);
    return response.data;
}


//admin auth apis
export const loginAdmin = async (email: string, password: string) => {
    const response = await authApi.post("/admin/login", { email, password });
    return response.data;
};

export const signUpAdmin = async (email: string, password: string) => {
    const response = await authApi.post("/admin/signup", { email, password });
    return response.data;
};

