export interface IUserSignUpData {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword?: string;
}

export interface IUserData {
    name: string;
    email: string;
    phone: string;
    profileUrl?: string; 
}

export interface IUserUpdateData {
    name: string;
    phone: string;
    profileUrl?: string; 
}


export interface ICollectorSignUpData {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword?: string;
}

export interface ICollectorData{
    name: string;
    email: string;
    phone: string;
    district?: string;
    serviceArea?: string;
    idProofType?: string;
    idProofFrontUrl?: string;
    idProofBackUrl?: string;
    profileUrl?: string; 
    isVerified?: boolean;
}

export interface IFormErrors {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
}