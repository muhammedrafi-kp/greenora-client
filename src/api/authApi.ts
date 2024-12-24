import axios from "axios";

const authApi = axios.create({
    baseURL: "http://localhost:3000/user-service",
    withCredentials: true,
});


export const loginAdmin = async (email: string, password: string) => {
    const response = await authApi.post("/admin/login", { email, password });
    return response.data;
};

export const signupAdmin = async (email: string, password: string) => {
    const response = await authApi.post("/admin/signup", { email, password });
    return response.data;
};

