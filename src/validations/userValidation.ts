// interface FormErrors {
//     name?: string;
//     email?: string;
//     phone?: string;
//     password?: string;
//     confirmPassword?: string;
// }
// import { IFormErrors } from "../interfaces/interfaces";

// export const validateForm = (formData: any, mode: 'login' | 'signup' = 'signup') => {
//     let errors: any = {};
//     let isValid = true;

//     // Email validation (required for both login and signup)
//     if (!formData.email) {
//         errors.email = 'Email is required';
//         isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//         errors.email = 'Email is invalid';
//         isValid = false;
//     }

//     // Password validation 
//     if (!formData.password) {
//         errors.password = "Password is required";
//         isValid = false;
//     } else {
//         if (formData.password.length < 6) {
//             errors.password = "Password must be at least 6 characters";
//             isValid = false;
//         }
//         if (!/[A-Za-z]/.test(formData.password)) {
//             errors.password = "Must contain at least 1 letter";
//             isValid = false;
//         }
//         if (!/\d/.test(formData.password)) {
//             errors.password = "Must contain at least 1 number";
//             isValid = false;
//         }
//         if (!/[@$!%*?&]/.test(formData.password)) {
//             errors.password = "Must contain at least 1 special character";
//             isValid = false;
//         }
//     }

//     //validations only for signup
//     if (mode === 'signup') {

//         // Full name validation
//         if (!formData.name) {
//             errors.name = "Full name is required";
//             isValid = false;
//         } else if (/[^a-zA-Z\s]/.test(formData.name)) {
//             errors.name = "Full name cannot contain special characters";
//             isValid = false;
//         }

//         // Phone number validation
//         const phoneRegex = /^[0-9]{10}$/;
//         if (!formData.phone) {
//             errors.phone = 'Phone number is required';
//             isValid = false;
//         } else if (!phoneRegex.test(formData.phone)) {
//             errors.phone = "Phone number must be 10 digits long";
//             isValid = false;
//         }

//         if (!formData.confirmPassword) {
//             errors.confirmPassword = 'Please confirm your password';
//             isValid = false;
//         } else if (formData.password !== formData.confirmPassword) {
//             errors.confirmPassword = 'Passwords do not match';
//             isValid = false;
//         }
//     }

//     return { isValid, errors };
// };


export interface IFormErrors {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }
  
  export const validateField = (name: string, value: string, isLogin: boolean = false): string | undefined => {
    switch (name) {
      case 'name':
        if (!isLogin) {
          if (!value.trim()) return "Full name is required";
          // if (/[^a-zA-Z\s]/.test(value)) return "Full name cannot contain special characters";
          if (value.trim().length < 2) return "Full name must be at least 2 characters";
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return "Email address is required";
        if (!emailRegex.test(value)) return "Invalid email address format";
        break;
      case 'phone':
        if (!isLogin) {
          if (!value.trim()) return "Phone number is required";
          if (!/^[0-9]{10}$/.test(value)) return "Phone number must be 10 digits";
        }
        break;
      case 'password':
        if (!value.trim()) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(value)) return "Password must contain at least one number";
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return "Password must contain at least one special character";
        break;
      case 'confirmPassword':
        if (!isLogin) {
          if (!value.trim()) return "Confirm password is required";
          // This check will be done in the form submit handler
        }
        break;
    }
    return undefined;
  };
  
  export const validateForm = (formData: any, mode: 'login' | 'signup') => {
    const isLogin = mode === 'login';
    const errors: IFormErrors = {};
  
    const fieldValidations = isLogin 
      ? ['email', 'password'] 
      : ['name', 'email', 'phone', 'password', 'confirmPassword'];
  
    fieldValidations.forEach(field => {
      const error = validateField(field, formData[field], isLogin);
      if (error) errors[field as keyof IFormErrors] = error;
    });
  
    // Special validation for confirm password in signup mode
    if (!isLogin && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
