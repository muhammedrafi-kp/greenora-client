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
    serviceArea:string;
    profileUrl?: string; 
}

export interface IFormErrors {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
}