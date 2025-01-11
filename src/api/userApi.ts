// import axiosInstance from "./axiosInstance";

import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import store from "../redux/store";
import { userLogin, userLogout } from "../redux/userAuthSlice";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const state = store.getState();
        const token = state.userAuth.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
    }
);



export const getUserDataApi = async () => {
    const response = await axiosInstance.get("/user-service/user/profile");
    return response.data;
}
