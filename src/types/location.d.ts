export interface IDistrict {
    _id: string;
    name: string;
    serviceAreas: IServiceArea[];
}

export interface IServiceArea {
    _id: string;
    name: string;
    center: { type: string; coordinates: [number, number] };
    location: string;
    postalCodes: string[];
    capacity: number;
    serviceDays: string[];
    collectors: string[];
}

export interface IAddress {
    _id: string;
    name: string;
    mobile: string;
    pinCode: string;
    locality: string;
    addressLine: string;
}