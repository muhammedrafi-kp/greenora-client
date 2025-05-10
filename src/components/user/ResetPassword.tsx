import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { resetPassword } from '../../services/authService';
import { validatePassword } from '../../utils/validations';
import toast from 'react-hot-toast';
import { ApiResponse } from '../../types/common';

interface FormErrors {
    password?: string;
    confirmPassword?: string;
}

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        password: false,
        confirmPassword: false
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error('Invalid reset link');
            navigate('/');
        }
    }, [token, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        const validation = validatePassword(
            name === 'password' ? value : formData.password,
            name === 'confirmPassword' ? value : formData.confirmPassword
        );

        setErrors(validation.errors);
    };

    const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validatePassword(formData.password, formData.confirmPassword);
        setErrors(validation.errors);

        if (!validation.isValid) {
            return;
        }

        setIsLoading(true);
        try {
            const res:ApiResponse<null> = await resetPassword("user", token!, formData.password);
            console.log("response :",res);
            if (res.success) {
                toast.success('Password updated');
                navigate('/');
            }
        } catch (error) {
            toast.error('Failed to reset password');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900">Reset Password</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter and confirm your new password
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {['password', 'confirmPassword'].map((field) => (
                            <div key={field} className="relative">
                                <input
                                    type={showPasswords[field as keyof typeof showPasswords] ? "text" : "password"}
                                    name={field}
                                    value={formData[field as keyof typeof formData]}
                                    onChange={handleInputChange}
                                    className={`w-full border rounded-lg h-12 px-3 focus:border-transparent ${
                                        errors[field as keyof FormErrors] ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder={field === 'password' ? 'New Password' : 'Confirm New Password'}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    onClick={() => togglePasswordVisibility(field as 'password' | 'confirmPassword')}
                                >
                                    {showPasswords[field as keyof typeof showPasswords] ? <FiEyeOff /> : <FiEye />}
                                </button>
                                {errors[field as keyof FormErrors] && (
                                    <p className="mt-1 text-xs text-red-500">{errors[field as keyof FormErrors]}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || Boolean(errors.password || errors.confirmPassword)}
                        className="w-full bg-green-900 hover:bg-green-800 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword; 