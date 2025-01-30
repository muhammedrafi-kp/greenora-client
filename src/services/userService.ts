import { apiClient } from "./api";

export const getUserData = async () => {
    try {
        const response = await apiClient.get("/user-service/user/profile");
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

export const updateUserData = async (userData: FormData) => {
    try {
        const response = await apiClient.put("/user-service/user/update-profile", userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}

export const uploadProfileImage = async (data: FormData) => {
    try {
        const response = await apiClient.patch("/user-service/user/upload-profile-image", data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading user profile image:", error);
        throw error;
    }
}

