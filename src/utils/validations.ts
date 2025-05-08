import { IAddress } from "../types/location";

export interface IAddressFormErrors {
  name: string;
  mobile: string;
  pinCode: string;
  locality: string;
  addressLine: string;
}

export interface IAddressFormData {
  name: string;
  mobile: string;
  // districtId: string;
  // serviceAreaId: string;
  pinCode: string;
  locality: string;
  addressLine: string;
}

export const validateAddressForm = (formData: Partial<IAddress>): { isValid: boolean; errors: IAddressFormErrors } => {
  let isValid = true;
  const errors: IAddressFormErrors = {
    name: '',
    mobile: '',
    // districtId: '',
    // serviceAreaId: '',
    pinCode: '',
    locality: '',
    addressLine: ''
  };

  // Name validation
  if (!formData.name?.trim()) {
    errors.name = 'Please enter name';
    isValid = false;
  }

  // Mobile validation
  if (!formData.mobile) {
    errors.mobile = 'Please enter mobile number';
    isValid = false;
  } else if (!/^\d{10}$/.test(formData.mobile)) {
    errors.mobile = 'Mobile number must be 10 digits';
    isValid = false;
  }

  // // District validation
  // if (!formData.districtId) {
  //   errors.districtId = 'Please select a district';
  //   isValid = false;
  // }

  // // Service Area validation
  // if (!formData.serviceAreaId) {
  //   errors.serviceAreaId = 'Please select a service area';
  //   isValid = false;
  // }

  // Pin Code validation
  if (!formData.pinCode) {
    errors.pinCode = 'Please enter pin code';
    isValid = false;
  } else if (!/^\d{6}$/.test(formData.pinCode)) {
    errors.pinCode = 'Pin code must be 6 digits';
    isValid = false;
  }

  // Place validation
  if (!formData.locality?.trim()) {
    errors.locality = 'Please enter locality';
    isValid = false;
  }

  // Address Line validation
  if (!formData.addressLine?.trim()) {
    errors.addressLine = 'Please enter address line';
    isValid = false;
  }

  return { isValid, errors };
};

// Utility function to validate pin code input
export const validatePinCodeInput = (pinCode: string): boolean => {
  return /^\d{0,6}$/.test(pinCode);
};

// Add mobile number validation utility
export const validateMobileInput = (mobile: string): boolean => {
  return /^\d{0,10}$/.test(mobile);
};

interface PasswordValidation {
    isValid: boolean;
    errors: {
        password?: string;
        confirmPassword?: string;
    };
}

export const validatePassword = (
    password: string,
    confirmPassword?: string,
    isConfirmRequired: boolean = true
): PasswordValidation => {
    const result: PasswordValidation = {
        isValid: true,
        errors: {}
    };

    // Password strength validation
    if (!password) {
        result.errors.password = 'Password is required';
        result.isValid = false;
    } else if (password.length < 8) {
        result.errors.password = 'Password must be at least 8 characters long';
        result.isValid = false;
    } else if (!/[a-z]/.test(password)) {
        result.errors.password = 'Password must contain at least one lowercase letter';
        result.isValid = false;
    } else if (!/\d/.test(password)) {
        result.errors.password = 'Password must contain at least one number';
        result.isValid = false;
    } else if (!/[!@#$%^&*]/.test(password)) {
        result.errors.password = 'Password must contain at least one special character (!@#$%^&*)';
        result.isValid = false;
    }

    // Password match validation (only if confirmPassword is provided or required)
    if (isConfirmRequired) {
        if (!confirmPassword) {
            result.errors.confirmPassword = 'Please confirm your password';
            result.isValid = false;
        } else if (password !== confirmPassword) {
            result.errors.confirmPassword = "Passwords don't match";
            result.isValid = false;
        }
    }

    return result;
}; 