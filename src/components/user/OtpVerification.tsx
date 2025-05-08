import React, { useState, useEffect } from 'react';
import { verifyOtpUser, resendOtpUser } from "../../services/authService";
import { useDispatch } from 'react-redux';
import { loginSuccess } from "../../redux/authSlice";

interface OtpVerificationProps {
    closeModal: () => void;
    email: string;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ closeModal, email }) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        setShowModal(true);
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(countdown);
        }
    }, [timer]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.value && index < 5) {
            const nextInput = element.parentElement?.nextElementSibling?.querySelector('input');
            if (nextInput) nextInput.focus();
        }
    };

    const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = e.currentTarget.parentElement?.previousElementSibling?.querySelector('input');
            if (prevInput) {
                prevInput.focus();
                setOtp(otp.map((d, idx) => (idx === index - 1 ? '' : d)));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join('');

        if (otpString.length !== 4) {
            setError('Please enter complete OTP.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await verifyOtpUser(email, otpString);
            if (response.success) {
                dispatch(loginSuccess({ token: response.token, role: response.role }));
                closeModal();
            }
        } catch (error: any) {
            console.log(error)
            setError('Invalid OTP, Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        const response = await resendOtpUser(email);
        console.log(response);
        setOtp(['', '', '', '']);
        setTimer(30);
        setError('');
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}`}
        // onClick={closeModal}
        >
            <div
                className={`relative bg-white p-8 rounded-xl shadow-lg max-w-md w-full transform transition-all duration-300 ${isLoading ? 'opacity-50' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-900"></div>
                    </div>
                )}

                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-2xl font-normal"
                >
                    &times;
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Verify OTP</h2>
                    <p className="text-gray-600">
                        We have sent a verification code to
                        <br />
                        <span className="font-medium text-gray-800">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center gap-2 mb-6">
                        {otp.map((digit, index) => (
                            <div key={index} className="w-12 h-12">
                                <input
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleBackspace(e, index)}
                                    className="w-full h-full text-center text-xl font-semibold border rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                                />
                            </div>
                        ))}
                    </div>

                    {error && (
                        <p className="text-red-700 text-xs text-center mb-4">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-green-900 hover:bg-green-800 text-white font-medium py-3 rounded-lg mb-4 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Verifying...' : 'Verify'}
                    </button>

                    <div className="text-center">
                        <p className="text-gray-600 text-sm">
                            Didn't receive the code?{' '}
                            {timer > 0 ? (
                                <span className="text-gray-500">
                                    Resend in {timer}s
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    className="text-green-900 hover:underline font-medium"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OtpVerification; 