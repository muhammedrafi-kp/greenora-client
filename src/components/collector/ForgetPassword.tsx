import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMail } from "react-icons/hi";
import { sendResetLink } from '../../services/authService';
import toast from 'react-hot-toast';
import { ApiResponse } from '../../types/common';

const ForgetPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res: ApiResponse<null> = await sendResetLink('collector', email);
            console.log('response :', res);
            if (res.success) {
                setSuccess(true);
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                setError("User with this email doesn't exist");
            } else {
                toast.error('Failed to send reset link');
            }
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
                {success ? (
                    <div className="text-center">
                        <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                            <HiOutlineMail className="h-8 w-8 text-green-900" />
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold">Check your email</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            We have sent a password reset link to
                            <br />
                            <span className="font-medium text-gray-900">{email}</span>
                        </p>
                        <button
                            onClick={() => navigate('/collector/login')}
                            className="w-full bg-green-900 hover:bg-green-800 text-white font-medium mt-8 sm:py-2 py-1 xs:text-base text-sm rounded-lg disabled:opacity-50"
                        >
                            Close
                        </button>
                    </div>

                ) : (
                    <>
                        <div className="text-center mb-6">
                            <HiOutlineMail className="mx-auto h-12 w-12 text-green-900" />
                            <h2 className="mt-4 text-2xl font-semibold">Forgot Password ?</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>


                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full border rounded-lg md:h-10 h-8 px-3 md:text-sm text-xs ${error ? 'border-red-700' : 'border-gray-300'
                                    }`}
                                placeholder="Email Address"
                            />
                            {error && <p className="text-xs text-red-700 mt-1">{error}</p>}

                            <button
                                type="submit"
                                className="w-full bg-green-900 hover:bg-green-800 text-white font-medium mt-8 sm:py-2 py-1 xs:text-base text-sm rounded-lg disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Please wait...' : 'Send Reset Link'}
                            </button>

                            <div className="text-center md:text-sm xs:text-xs text-xs mt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/collector/login')}
                                    className="text-green-900 hover:underline"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgetPassword;


