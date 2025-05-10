import React, { useState, useEffect } from 'react';
import { HiOutlineMail } from "react-icons/hi";
import toast from 'react-hot-toast';
import { sendResetLink } from '../../services/authService';
import { ApiResponse } from '../../types/common';

interface ForgotPasswordProps {
    closeModal: () => void;
}

type Step = 'email' | 'success';

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ closeModal }) => {
    const [showModal, setShowModal] = useState(false);
    const [currentStep, setCurrentStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setShowModal(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError(''); 
        setIsLoading(true);
        try {
            const res: ApiResponse<null> = await sendResetLink('user', email);
            console.log('response :',res);
            if (res.success) {
                setCurrentStep('success');
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                setEmailError("User with this email doesn't exist");
            } else {
                toast.error('Failed to send reset link');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailError('');
    };

    const renderStep = () => {
        switch (currentStep) {
            case 'email':
                return (
                    <>
                        <div className="text-center mb-6">
                            <HiOutlineMail className="mx-auto h-12 w-12 text-green-900" />
                            <h2 className="mt-4 text-2xl font-semibold">Forgot Password?</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-1">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={`w-full border rounded-lg h-12 focus:outline-secondary-500 px-3 placeholder:font-normal placeholder:text-sm ${
                                        emailError ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your email address"
                                    required
                                />
                                {emailError && (
                                    <p className="text-red-500 text-xs">{emailError}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-green-900 hover:bg-green-800 text-white font-medium mt-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                );

            case 'success':
                return (
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
                            onClick={closeModal}
                            className="w-full bg-green-900 hover:bg-green-800 text-white font-medium mt-6 py-3 rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                );
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeModal}
        >
            <div
                className="relative bg-white p-8 rounded-xl shadow-lg max-w-md w-full transform transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-2xl font-normal"
                >
                    &times;
                </button>

                {renderStep()}
            </div>
        </div>
    );
};

export default ForgotPassword; 