import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { changePassword } from '../../services/authService';
import { toast } from 'react-hot-toast';
import Modal from './Modal';

interface ChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({ isOpen, onClose, role }) => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'currentPassword':
        if (!value.trim()) {
          return 'Current password is required';
        }
        if (value.length < 8) {
          return 'Password must be at least 8 characters long';
        }
        return undefined;

      case 'newPassword':
        if (!value.trim()) {
          return 'New password is required';
        }
        if (value.length < 8) {
          return 'Password must be at least 8 characters long';
        }
        if (value === passwords.currentPassword) {
          return 'New password must be different from current password';
        }
        if (!/(?=.*[a-z])/.test(value)) {
          return 'Password must contain at least one lowercase letter';
        }
        if (!/(?=.*\d)/.test(value)) {
          return 'Password must contain at least one number';
        }
        if (!/(?=.*[!@#$%^&*])/.test(value)) {
          return 'Password must contain at least one special character';
        }
        return undefined;

      case 'confirmPassword':
        if (!value.trim()) {
          return 'Please confirm your new password';
        }
        if (value !== passwords.newPassword) {
          return 'Passwords do not match';
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));

    // Only validate if the field has been touched
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setFormErrors(prev => ({
        ...prev,
        [name]: error
      }));

      // Special case: also validate confirmPassword when newPassword changes
      if (name === 'newPassword' && touched.confirmPassword) {
        const confirmError = validateField('confirmPassword', passwords.confirmPassword);
        setFormErrors(prev => ({
          ...prev,
          confirmPassword: confirmError
        }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate on blur
    const error = validateField(name, passwords[name as keyof typeof passwords]);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    setTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    });

    // Validate all fields
    const errors: FormErrors = {};
    Object.keys(passwords).forEach(key => {
      const error = validateField(key, passwords[key as keyof typeof passwords]);
      if (error) {
        errors[key as keyof FormErrors] = error;
      }
    });

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await changePassword(role, passwords.currentPassword, passwords.newPassword);
      if (response.success) {
        toast.success("Password changed", {
          style: { background: "#222", color: "#fff" },
          iconTheme: { primary: "#4CAF50", secondary: "#fff" }, // Green success icon
        });
        onClose();
      }
    } catch (error: any) {
      console.log("error:", error);
      if (error.response?.status === 400) {
        setFormErrors(prev => ({
          ...prev,
          currentPassword: "Current password is incorrect"
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordFormContent = (
    <form className="space-y-4 mt-4">
      <div>
        <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.currentPassword ? "text" : "password"}
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border rounded-lg focus:ring-green-500 focus:border-green-500
              ${touched.currentPassword && formErrors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
          />
          <button
            type="button"
            onClick={() => setShowPasswords(prev => ({ ...prev, currentPassword: !prev.currentPassword }))}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPasswords.currentPassword ?
              <EyeOff className="xs:w-4 xs:h-4 w-3 h-3" /> :
              <Eye className="xs:w-4 xs:h-4 w-3 h-3" />
            }
          </button>
        </div>
        {touched.currentPassword && formErrors.currentPassword && (
          <p className="mt-1 text-xs text-red-500">{formErrors.currentPassword}</p>
        )}
      </div>

      <div>
        <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
          New Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.newPassword ? "text" : "password"}
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border rounded-lg focus:ring-green-500 focus:border-green-500
              ${touched.newPassword && formErrors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
          />
          <button
            type="button"
            onClick={() => setShowPasswords(prev => ({ ...prev, newPassword: !prev.newPassword }))}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPasswords.newPassword ?
              <EyeOff className="xs:w-4 xs:h-4 w-3 h-3" /> :
              <Eye className="xs:w-4 xs:h-4 w-3 h-3" />
            }
          </button>
        </div>
        {touched.newPassword && formErrors.newPassword && (
          <p className="mt-1 text-xs text-red-500">{formErrors.newPassword}</p>
        )}
      </div>

      <div>
        <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.confirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border rounded-lg focus:ring-green-500 focus:border-green-500
              ${touched.confirmPassword && formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
          />
          <button
            type="button"
            onClick={() => setShowPasswords(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPasswords.confirmPassword ?
              <EyeOff className="xs:w-4 xs:h-4 w-3 h-3" /> :
              <Eye className="xs:w-4 xs:h-4 w-3 h-3" />
            }
          </button>
        </div>
        {touched.confirmPassword && formErrors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">{formErrors.confirmPassword}</p>
        )}
      </div>
    </form>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          <span>Change Password</span>
        </div>
      }
      description=""
      confirmLabel={
        isLoading ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Changing...</span>
          </div>
        ) : (
          "Change Password"
        )
      }
      cancelLabel="Cancel"
      onConfirm={handleSubmit}
      confirmButtonClass={`xs:px-4 xs:py-2 px-2 py-1 xs:text-sm text-xs bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      isDisabled={isLoading}
    >
      {passwordFormContent}
    </Modal>
  );
};

export default ChangePassword;

