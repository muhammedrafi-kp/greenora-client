import React, { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";

interface ResetPasswordFormProps {
    token: string;
    onSuccess: () => void;
}


// Component for setting new password
 const ResetPassword: React.FC<ResetPasswordFormProps> = ({ token, onSuccess }) => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Add your API call here to reset password
            // await resetPassword(token, formData.password);
            onSuccess();
        } catch (error: any) {
            setError('Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#237A57] to-[#093028]">
            <div className="relative bg-white xs:p-8 p-6 max-w-md sm:w-full w-3/4 border rounded-lg shadow-md">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-900"></div>
                    </div>
                )}

                <h2 className="mb-3 text-xl font-semibold sm:mb-5 sm:text-2xl md:text-3xl text-center">
                    Reset Password
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="relative mb-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={`w-full border rounded-lg md:h-10 h-8 px-3 md:text-sm text-xs ${
                                error ? 'border-red-700' : 'border-gray-300'
                            }`}
                            placeholder="New Password"
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className={`w-full border rounded-lg md:h-10 h-8 px-3 md:text-sm text-xs ${
                                error ? 'border-red-700' : 'border-gray-300'
                            }`}
                            placeholder="Confirm New Password"
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {error && <p className="text-xs text-red-700 mt-1">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-green-900 hover:bg-green-800 text-white font-medium mt-8 sm:py-2 py-1 xs:text-base text-sm rounded-lg disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Please wait...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;