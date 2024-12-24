// import axios from "axios";
// import { store } from "../redux/store";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:4000/", 
//   withCredentials: true, 
// });


// axiosInstance.interceptors.request.use(
//   (config) => {
//     const state = store.getState();
//     const adminAccessToken = state.adminAuth.accessToken;
//     const userAccessToken = state.userAuth.accessToken;
//     const accessToken = adminAccessToken || userAccessToken;

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
