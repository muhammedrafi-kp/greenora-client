export interface IUserSignUpData {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword?: string;
}

export interface IAdmin {
    _id: string;
    name: string;
    email: string;
}

export interface IUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profileUrl?: string; 
    isBlocked: boolean;
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

export interface ICollector{
    _id: string;
    collectorId:string;
    name: string;
    email: string;
    phone: string;
    gender?: string;
    district: string;
    serviceArea: string;
    idProofType?: string;
    idProofFrontUrl?: string;
    idProofBackUrl?: string;
    profileUrl?: string; 
    taskCount?: number;
    verificationStatus?: string;
    isBlocked?: boolean;
    isVerified?: boolean;
    editAccess?:boolean;
}

export interface IFormErrors {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
}

