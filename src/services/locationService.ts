import { apiClient } from "../apis/api";


export const addDistrict = async (name: string) => {
    try {
      const response = await apiClient.post("/location-service/service-area/admin/district", { name });
      return response.data;
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw new Error('Failed to create district.');
    }
  }
  
  
  export const getDistrictsWithServiceAreas = async () => {
    try {
      const response = await apiClient.get("/location-service/service-area/admin/districts/servic-areas");
      return response.data;
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw new Error('Failed to fetch districts.');
    }
  }
  
  export const getDistrictAndServiceArea = async (districtId: string, serviceAreaId: string) => {
    try {
      const response = await apiClient.get(`/location-service/service-area/user/district/${districtId}/service-area/${serviceAreaId}`);
      console.log("district and service area response :",response)
      return response.data;
    } catch (error) {
      console.error('Error fetching district and service area:', error);
      throw error;
    }
  };
  
  export const updateDistrict = async (districtId: string, name: string) => {
    try {
      const response = await apiClient.put(`/location-service/service-area/admin/district/${districtId}`, { name });
      return response.data;
    } catch (error) {
      console.error('Error updating district:', error);
      throw new Error('Failed to update district.');
    }
  }
  
  export const deleteDistrict = async (districtId: string) => {
    try {
      const response = await apiClient.delete(`/location-service/service-area/admin/district/${districtId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting district:', error);
      throw new Error('Failed to delete district.');
    }
  }
  
  export const addServiceArea = async (serviceAreaData: object) => {
    try {
      const response = await apiClient.post("/location-service/service-area/admin/service-area", serviceAreaData);
      return response.data;
    } catch (error) {
      console.error('Error adding service area:', error);
      throw new Error('Failed to add service area.');
    }
  }
  
  export const updateServiceArea = async (serviceAreaId: string, serviceAreaData: object) => {
    try {
      const response = await apiClient.put(`/location-service/service-area/admin/service-area/${serviceAreaId}`, serviceAreaData);
      return response.data;
    } catch (error) {
      console.error('Error updating service area:', error);
      throw new Error('Failed to update service area.');
    }
  }
  

export const getDistricts = async () => {
    try {
        const response = await apiClient.get(`/location-service/service-area/user/districts`);
        return response.data;
    } catch (error) {
        console.error("Error fetching districts:", error);
        throw error;
    }
}

export const getServiceAreas = async (districtId: string) => {
    try {
        const response = await apiClient.get(`/location-service/service-area/user/service-areas/${districtId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching service areas:", error);
        throw error;
    }
}

export const getAddresses = async () => {
    try {
        const response = await apiClient.get(`/location-service/address/addresses`);
        return response.data;
    } catch (error) {
        console.error("Error fetching addresses:", error);
        throw error;
    }
}

export const addAddress = async (addressData: object) => {
    try {
        const response = await apiClient.post("/location-service/address", addressData);
        return response.data;
    } catch (error) {
        console.error("Error adding address:", error);
        throw error;
    }
}

export const updateAddress = async (addressId: string, addressData: object) => {
    try {
        const response = await apiClient.put(`/location-service/address/${addressId}`, addressData);
        return response.data;
    } catch (error) {
        console.error("Error updating address:", error);
        throw error;
    }
}

export const deleteAddress = async (addressId: string) => {
    try {
        const response = await apiClient.delete(`/location-service/address/${addressId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting address:", error);
        throw error;
    }
}


export const checkPinCode = async (serviceAreaId: string, pinCode: string) => {
    try {
        const response = await apiClient.post('/location-service/service-area/user/check-pin-code', {
            serviceAreaId,
            pinCode
        });
        return response.data;
    } catch (error: any) {
        // Return a structured error response instead of throwing
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to validate pin code'
        };
    }
}