import React, { useState, useEffect } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";

interface ForgotPasswordProps {
    closeModal: () => void;
}

type Step = 'email' | 'success' | 'resetPassword';

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ closeModal }) => {
    const [showModal, setShowModal] = useState(false);
    const [currentStep, setCurrentStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        setShowModal(true);
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleSubmitEmail = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your email verification logic here
        setCurrentStep('success');
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your password reset logic here
        closeModal();
    };

    const renderStep = () => {
        switch (currentStep) {
            case 'email':
                return (
                    <>
                        <div className="text-center mb-6">
                            <HiOutlineMail className="mx-auto h-12 w-12 text-green-900" />
                            <h2 className="mt-4 text-2xl font-semibold">Forgot Password ?</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmitEmail}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border rounded-lg h-12 focus:outline-secondary-500 px-3 placeholder:font-normal placeholder:text-sm"
                                placeholder="Enter your email address"
                                required
                            />
                            <button 
                                type="submit"
                                className="w-full bg-green-900 hover:bg-green-800 text-white font-medium mt-6 py-3 rounded-lg"
                            >
                                Send Reset Link
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

            case 'resetPassword':
                return (
                    <>
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-semibold">Reset Password</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Please enter your new password.
                            </p>
                        </div>

                        <form onSubmit={handleResetPassword}>
                            <div className="relative mb-4">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full border rounded-lg h-12 focus:outline-secondary-500 px-3 placeholder:font-normal placeholder:text-sm"
                                    placeholder="New Password"
                                    required
                                />
                                <span
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </span>
                            </div>

                            <div className="relative mb-6">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="w-full border rounded-lg h-12 focus:outline-secondary-500 px-3 placeholder:font-normal placeholder:text-sm"
                                    placeholder="Confirm New Password"
                                    required
                                />
                                <span
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                </span>
                            </div>

                            <button 
                                type="submit"
                                className="w-full bg-green-900 hover:bg-green-800 text-white font-medium py-3 rounded-lg"
                            >
                                Reset Password
                            </button>
                        </form>
                    </>
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