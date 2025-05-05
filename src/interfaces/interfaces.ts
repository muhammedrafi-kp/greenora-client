export interface IUserSignUpData {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword?: string;
}

export interface IUserData {
    id: string;
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
    verificationStatus?: string;
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


export interface IChat  {
    participant1?: string;
    participant2?: string;
    participant2Name?: string;
    participant2ProfileUrl?: string;
    lastMessage?: string;
    participant1Role?: 'admin' ;
    participant2Role?: 'user' | 'collector';
}