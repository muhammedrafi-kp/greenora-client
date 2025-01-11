// interface FormErrors {
//     name?: string;
//     email?: string;
//     phone?: string;
//     password?: string;
//     confirmPassword?: string;
// }
import { IFormErrors } from "../interfaces/interfaces";

export const validateForm = (formData: any, mode: 'login' | 'signup' = 'signup') => {
    let errors: any = {};
    let isValid = true;

    // Email validation (required for both login and signup)
    if (!formData.email) {
        errors.email = 'Email is required';
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email is invalid';
        isValid = false;
    }

    // Password validation 
    if (!formData.password) {
        errors.password = "Password is required";
        isValid = false;
    } else {
        if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
            isValid = false;
        }
        if (!/[A-Za-z]/.test(formData.password)) {
            errors.password = "Must contain at least 1 letter";
            isValid = false;
        }
        if (!/\d/.test(formData.password)) {
            errors.password = "Must contain at least 1 number";
            isValid = false;
        }
        if (!/[@$!%*?&]/.test(formData.password)) {
            errors.password = "Must contain at least 1 special character";
            isValid = false;
        }
    }

    //validations only for signup
    if (mode === 'signup') {

        // Full name validation
        if (!formData.name) {
            errors.name = "Full name is required";
            isValid = false;
        } else if (/[^a-zA-Z\s]/.test(formData.name)) {
            errors.name = "Full name cannot contain special characters";
            isValid = false;
        }

        // Phone number validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!formData.phone) {
            errors.phone = 'Phone number is required';
            isValid = false;
        } else if (!phoneRegex.test(formData.phone)) {
            errors.phone = "Phone number must be 10 digits long";
            isValid = false;
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }
    }

    return { isValid, errors };
};

