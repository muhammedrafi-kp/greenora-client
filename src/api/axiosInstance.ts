import axios, { AxiosRequestConfig, AxiosError } from "axios";
import store from "../redux/store";
import { userLogin, userLogout } from "../redux/userAuthSlice";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

axiosInstance.interceptors.request.use(
    (config) => {
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

// axiosInstance.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response?.status == 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 const response = await axiosInstance.post("http://localhost:3000/refresh", {}, {
//                     withCredentials: true
//                 });

//                 const { token } = response.data;

//                 store.dispatch(userLogin({ token }));
//             } catch (error) {
//                 console.error("Token refresh failed:", error);
//                 store.dispatch(userLogout());
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;
