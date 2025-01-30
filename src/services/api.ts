import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import store from "../redux/store";
import { loginSuccess, Logout } from "../redux/authSlice";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:80",
    withCredentials: true,
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

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {

            originalRequest._retry = true;

            try {
                const state = store.getState();
                const role = state.auth.role;
                console.log("role:", role);
                const response = await axios.post(`http://localhost:80/user-service/${role}/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                if (response.status === 200) {
                    console.log("response:", response)
                    store.dispatch(loginSuccess({ token: response.data.token, role: response.data.role }));
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers["Authorization"] = `Bearer ${response.data.token}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                console.error("Refresh Token Error:", refreshError);
                store.dispatch(Logout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


/**
 * Instance for unauthenticated requests
 */
const publicApiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:80",
    withCredentials: true, // Use if needed for public APIs
});

export { apiClient, publicApiClient };
