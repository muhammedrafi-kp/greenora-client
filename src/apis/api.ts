import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import store from "../redux/store";
import { loginSuccess, Logout } from "../redux/authSlice";
import { toast } from "react-hot-toast";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_URL,
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
                const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user-service/${role}/refresh-token`,
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

        if (error.response?.status === 403 &&
            typeof error.response.data === 'object' &&
            error.response.data !== null &&
            'message' in error.response.data &&
            error.response.data.message === "User is blocked") {
            toast.error("Your account is blocked");
            store.dispatch(Logout());
            return Promise.reject(error);
        }


        if ([500, 502, 503, 504].includes(error.response?.status || 0)) {
            // window.location.href = '/error/500';
        }

        return Promise.reject(error);
    }
);


const publicApiClient = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_URL,
    withCredentials: true,
});

publicApiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 403 &&
            typeof error.response.data === 'object' &&
            error.response.data !== null &&
            'message' in error.response.data &&
            error.response.data.message === "User is blocked.") {
            toast.error("Your account is blocked.");
            store.dispatch(Logout());
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export { apiClient, publicApiClient };
