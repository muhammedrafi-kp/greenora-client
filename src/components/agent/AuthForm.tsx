import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface AuthFormProps {
    initialMode?: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ initialMode = 'login' }) => {
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);
    const toggleMode = () => setIsLogin(!isLogin);

    return (
        <div className="mt-4 flex items-center justify-center">
            <div className="relative bg-white p-10 max-w-md sm:w-full w-3/4 rounded-lg shadow-lg">
                <h2 className="mb-3 text-xl font-semibold sm:mb-5 sm:text-2xl md:text-3xl text-center">
                    {isLogin ? 'Login' : 'Sign Up'}
                </h2>

                <button className="w-full rounded-lg xs:py-2 py-1 px-2 border  md:text-base sm:text-sm text-xs font-sans font-medium shadow-sm hover:bg-slate-50 flex items-center justify-center gap-2">
                    <FcGoogle />
                    <span>Continue with Google</span>
                </button>

                <p className="flex items-center justify-center my-5">
                    <span className="flex-1 border-t border-gray-300"></span>
                    <span className="mx-2 md:text-base xs:text-sm text-xs ">OR</span>
                    <span className="flex-1 border-t border-gray-300"></span>
                </p>

                <form>
                    {!isLogin && (
                        <input
                            type="text"
                            id="fullname"
                            name="fullname"
                                className="w-full border rounded-lg md:h-12 xs:h-10 h-8 focus:outline-secondary-500 px-3 md:text-base xs:text-sm text-xs mb-4"
                                placeholder="Full Name"
                        />
                    )}

                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full border rounded-lg md:h-12 xs:h-10 h-8 focus:outline-secondary-500 px-3 md:text-base xs:text-sm text-xs"
                        placeholder="Email Address"
                    />

                    <div className="relative mt-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            className="w-full border rounded-lg md:h-12 xs:h-10 h-8 focus:outline-secondary-500 px-3 md:text-base xs:text-sm text-xs"
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
                                className="w-full border rounded-lg md:h-12 xs:h-10 h-8 focus:outline-secondary-500 px-3 md:text-base xs:text-sm text-xs"
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
                                className="mt-1 md:h-4 md:w-4 xs:h-3 xs:w-3 rounded border-gray-300 text-green-900 focus:ring-green-900"
                            /> */}
                            <label htmlFor="terms" className="md:text-sm  text-xs text-gray-600">
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
                                onClick={() => navigate('/agent/forgot-password')}
                                className="hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button className="w-full bg-green-900 hover:bg-green-800 text-white font-medium mt-8 xs:py-2 py-1 md:py-3 xs:text-base text-sm rounded-lg">
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
    );
};

export default AuthForm; 