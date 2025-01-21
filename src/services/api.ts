// import axiosInstance from "./axiosInstance";

import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import store from "../redux/store";
// import { loginSuccess, Logout } from "../redux/authSlice";

const apiClient  = axios.create({
    baseURL: "http://localhost:80",
    withCredentials: true
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const state = store.getState();
        const token = state.auth.token;

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

export default apiClient;
