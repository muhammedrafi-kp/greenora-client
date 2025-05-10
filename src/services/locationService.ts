import { apiClient } from "../apis/api";
import { ApiResponse } from "../types/common";
import { IDistrict, IServiceArea, IAddress } from "../types/location"


export const addDistrict = async (name: string): Promise<ApiResponse<IDistrict>> => {
  try {
    const res = await apiClient.post("/location-service/service-area/admin/district", { name });
    return res.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw new Error('Failed to create district.');
  }
}


export const getDistrictsWithServiceAreas = async ():Promise<ApiResponse<IDistrict[]>> => {
  try {
    const res = await apiClient.get("/location-service/service-area/admin/districts/service-areas");
    return res.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw new Error('Failed to fetch districts.');
  }
}

export const getDistrictAndServiceArea = async (districtId: string, serviceAreaId: string) => {
  try {
    const res = await apiClient.get(`/location-service/service-area/user/district/${districtId}/service-area/${serviceAreaId}`);
    console.log("district and service area response :", res)
    return res.data;
  } catch (error) {
    console.error('Error fetching district and service area:', error);
    throw error;
  }
};

export const updateDistrict = async (districtId: string, name: string):Promise<ApiResponse<IDistrict>> => {
  try {
    const res = await apiClient.put(`/location-service/service-area/admin/district/${districtId}`, { name });
    return res.data;
  } catch (error) {
    console.error('Error updating district:', error);
    throw new Error('Failed to update district.');
  }
}

export const deleteDistrict = async (districtId: string):Promise<ApiResponse<null>> => {
  try {
    const res = await apiClient.delete(`/location-service/service-area/admin/district/${districtId}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting district:', error);
    throw new Error('Failed to delete district.');
  }
}

export const addServiceArea = async (serviceAreaData: object):Promise<ApiResponse<IServiceArea>> => {
  try {
    const res = await apiClient.post("/location-service/service-area/admin/service-area", serviceAreaData);
    return res.data;
  } catch (error) {
    console.error('Error adding service area:', error);
    throw new Error('Failed to add service area.');
  }
}

export const updateServiceArea = async (serviceAreaId: string, serviceAreaData: object) => {
  try {
    const res = await apiClient.put(`/location-service/service-area/admin/service-area/${serviceAreaId}`, serviceAreaData);
    return res.data;
  } catch (error) {
    console.error('Error updating service area:', error);
    throw new Error('Failed to update service area.');
  }
}


export const getDistricts = async ():Promise<ApiResponse<IDistrict[]>> => {
  try {
    const res = await apiClient.get(`/location-service/service-area/user/districts`);
    return res.data;
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
}

export const getServiceAreas = async (districtId: string):Promise<ApiResponse<IServiceArea[]>> => {
  try {
    const res = await apiClient.get(`/location-service/service-area/user/service-areas/${districtId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching service areas:", error);
    throw error;
  }
}

export const getAddresses = async ():Promise<ApiResponse<IAddress[]>> => {
  try {
    const res = await apiClient.get(`/location-service/address/addresses`);
    return res.data;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw error;
  }
}

export const addAddress = async (addressData: object):Promise<ApiResponse<IAddress>> => {
  try {
    const res = await apiClient.post("/location-service/address", addressData);
    return res.data;
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
}

export const updateAddress = async (addressId: string, addressData: object):Promise<ApiResponse<IAddress>> => {
  try {
    const res = await apiClient.put(`/location-service/address/${addressId}`, addressData);
    return res.data;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
}

export const deleteAddress = async (addressId: string):Promise<ApiResponse<IAddress>> => {
  try {
    const res = await apiClient.delete(`/location-service/address/${addressId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
}


export const checkPinCode = async (serviceAreaId: string, pinCode: string):Promise<ApiResponse<null>> => {
  try {
    const res = await apiClient.post('/location-service/service-area/user/check-pin-code', {
      serviceAreaId,
      pinCode
    });
    return res.data;
  } catch (error: any) {
    // Return a structured error response instead of throwing
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred',
      data: null
    };
  }
}