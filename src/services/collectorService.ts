import { ICollector } from "../types/user";
import { apiClient } from "../apis/api";
import { ApiResponse } from "../types/common";

export const getCollectorData = async ():Promise<ApiResponse<ICollector>> => {
    try {
        const res = await apiClient.get("/user-service/collector");
        return res.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

export const updateCollectorData = async (collectorData: FormData):Promise<ApiResponse<ICollector>> => {
    try {
        const res = await apiClient.put("/user-service/collector", collectorData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
        );
        return res.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}





