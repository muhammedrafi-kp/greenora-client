import React, { useState, useEffect } from 'react';

interface OtpVerificationProps {
    email: string;
    // closeModal: () => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ email }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
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
        if (isNaN(Number(element.value))) return;

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

        if (otpString.length !== 6) {
            setError('Please enter complete OTP');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Add your OTP verification API call here
            // const response = await handleVerifyOtp(email, otpString);
            // if (response.success) {
            //     closeModal();
            // }
            // setTimeout(() => {
            //     closeModal();
            // }, 2000);
        } catch (error: any) {
            setError('Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setTimer(30);
        setError('');
        // Add your resend OTP API call here
        // await handleResendOtp(email);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-[#237A57] to-[#093028]">
            <div className="relative bg-white xs:p-8 p-6 max-w-md sm:w-full w-3/4 border rounded-lg shadow-md">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-900"></div>
                    </div>
                )}

                {/* <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                >
                    ×
                </button> */}

                <h2 className="mb-3 text-xl font-semibold sm:mb-5 sm:text-2xl md:text-3xl text-center">
                    Verify OTP
                </h2>

                <p className="text-center md:text-sm text-xs text-gray-600 mb-6">
                    We have sent a verification code to<br />
                    <span className="font-medium">{email}</span>
                </p>

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
                                    className={`w-full h-full text-center text-xl font-semibold border rounded-lg 
                                        md:h-12 h-10
                                        focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none
                                        ${error ? 'border-red-700' : 'border-gray-300'}`}
                                />
                            </div>
                        ))}
                    </div>

                    {error && (
                        <p className="text-xs text-red-700 text-center mb-4">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-green-900 hover:bg-green-800 text-white font-medium mt-8 sm:py-2 py-1 xs:text-base text-sm rounded-lg disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Verifying...' : 'Verify'}
                    </button>

                    <div className="text-center md:text-sm xs:text-xs text-xs mt-4">
                        <p className="text-gray-600">
                            Didn't receive the code?{' '}
                            {timer > 0 ? (
                                <span className="text-gray-500">
                                    Resend in {timer}s
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="text-green-900 hover:underline"
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