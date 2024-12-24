import React, { useEffect, useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import OtpVerification from './OtpVerification';
import ForgotPassword from './ForgotPassword';

interface AuthModalProps {
    closeModal: () => void;
    initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ closeModal, initialMode = 'login' }) => {
    const [showModal, setShowModal] = useState(false);
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOtpVerification, setShowOtpVerification] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);
    const toggleMode = () => setIsLogin(!isLogin);

    useEffect(() => {
        setShowModal(true);
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <>
            {showForgotPassword ? (
                <ForgotPassword closeModal={() => {
                    setShowForgotPassword(false);
                    closeModal();
                }} />
            ) : !showOtpVerification ? (
                <div
                    className={` fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}`}
                    onClick={closeModal}
                >
                    <div
                        className={`relative bg-white p-10 rounded-xl shadow-lg max-w-md sm:w-full w-3/4 transform transition-all duration-300 ${
                            showModal ? 'translate-y-0' : 'translate-y-20'
                        } max-h-[90vh] overflow-y-auto`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={closeModal} className="absolute top-5 right-5 text-3xl font-normal">
                            &times;
                        </button>

                        <h2 className="mb-3 text-xl font-semibold sm:mb-5 sm:text-2xl md:text-3xl text-center">
                            {isLogin ? 'Login' : 'Sign Up'}
                        </h2>

                        <button className="w-full rounded-lg xs:py-2 py-1 border  sm:text-base text-xs font-sans font-medium shadow-sm hover:bg-slate-50 flex items-center justify-center gap-2">
                            <FcGoogle />
                            <span>Continue with Google</span>
                        </button>

                        <p className="flex items-center justify-center my-5">
                            <span className="flex-1 border-t border-gray-300"></span>
                            <span className="mx-2 sm:text-base text-xs">OR</span>
                            <span className="flex-1 border-t border-gray-300"></span>
                        </p>

                        <form>
                            {!isLogin && (
                                <input
                                    type="text"
                                    id="fullname"
                                    name="fullname"
                                    className="w-full border rounded-lg sm:h-12 xs:h-10 h-8 focus:outline-secondary-500 px-3 sm:text-base text-xs mb-4"
                                    placeholder="Full Name"
                                />
                            )}

                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full border rounded-lg sm:h-12 xs:h-10 h-8 focus:outline-secondary-500 px-3 sm:text-base text-xs"
                                placeholder="Email Address"
                            />

                            <div className="relative mt-4">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className="w-full border rounded-lg sm:h-12 xs:h-10 h-8 focus:outline-secondary-500 px-3 sm:text-base text-xs"
                                    placeholder="Password"
                                />
                                <span
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </span>
                            </div>

                            {!isLogin && (
                                <div className="relative mt-4">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="w-full border rounded-lg sm:h-12 xs:h-10 h-8 focus:outline-secondary-500 px-3 sm:text-base text-xs"
                                        placeholder="Confirm Password"
                                    />
                                    <span
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                        onClick={toggleConfirmPasswordVisibility}
                                    >
                                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </span>
                                </div>
                            )}

                            {!isLogin && (
                                <div className="mt-4 flex items-start gap-2">
                                    {/* <input
                                        type="checkbox"
                                        id="terms"
                                        className="mt-1 sm:h-4 sm:w-4 xs:h-3 xs:w-3 rounded border-gray-300 text-green-900 focus:ring-green-900"
                                    /> */}
                                    <label htmlFor="terms" className="md:text-sm xs:text-xs text-xs text-gray-600">
                                        By creating an account, you agree to our{' '}
                                        <a href="/terms" className="text-green-900 hover:underline">Terms of Use</a>
                                        {' '}and{' '}
                                        <a href="/privacy" className="text-green-900 hover:underline">Privacy Policy.</a>
                                    </label>
                                </div>
                            )}

                            {isLogin && (
                                <div className="md:text-sm xs:text-xs text-xs text-green-900 mt-3">
                                    <button 
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="hover:underline"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            )}

                            <button className="w-full bg-green-900 hover:bg-green-800 text-white font-medium mt-8 xs:py-2 py-1 md:py-3 rounded-lg">
                                {isLogin ? 'Login' : 'Sign Up'}
                            </button>

                            <div className="text-center md:text-sm xs:text-xs text-xs mt-4">
                                <p>
                                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                                    <button 
                                        type="button"
                                        onClick={toggleMode}
                                        className="text-green-900 hover:underline"
                                    >
                                        {isLogin ? 'Sign up' : 'Login'}
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <OtpVerification 
                    closeModal={closeModal}
                    email={userEmail}
                />
            )}
        </>
    );
};

export default AuthModal;