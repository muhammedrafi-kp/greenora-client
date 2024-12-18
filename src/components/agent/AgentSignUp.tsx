import React, { useState, } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";

const AgentSignup: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const navigateToLogin = () => {
        navigate('/agent/login');
    };

    return (
        <>
            <div className="mt-2 flex items-center justify-center">
                <div className="relative bg-white p-10 max-w-md w-full">
                    <h2 className="mb-3 text-xl font-semibold sm:mb-5 sm:text-2xl md:text-3xl text-center">Sign Up</h2>
                    <button className="w-full rounded-lg py-2 border text-sm md:text-base font-sans font-medium shadow-sm hover:bg-slate-50 flex items-center justify-center gap-2">
                        <FcGoogle />
                        <span>Continue with Google</span>
                    </button>

                    <p className="flex items-center justify-center my-5">
                        <span className="flex-1 border-t border-gray-300"></span>
                        <span className="mx-2 text-sm md:text-base">OR</span>
                        <span className="flex-1 border-t border-gray-300"></span>
                    </p>

                    <form>
                        <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            className="w-full border rounded-lg h-12 focus:outline-secondary-500 px-3 placeholder:font-normal placeholder:text-sm"
                            placeholder="Full Name"
                        />

                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full border rounded-lg h-12 focus:outline-secondary-500 mt-4 px-3 placeholder:font-normal placeholder:text-sm"
                            placeholder="Email Address"
                        />

                        <div className="relative mt-4">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className="w-full border rounded-lg h-12 focus:outline-secondary-500 px-3 placeholder:font-normal placeholder:text-sm"
                                placeholder="Password"
                            />
                            <span
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>

                        <div className="relative mt-4">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                className="w-full border rounded-lg h-12 focus:outline-secondary-500 px-3 placeholder:font-normal placeholder:text-sm"
                                placeholder="Confirm Password"
                            />
                            <span
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>

                        <button className="w-full bg-green-900 hover:bg-green-800 text-white font-medium mt-8 py-2 md:py-3 rounded-lg">
                            Sign Up
                        </button>

                        <div className="text-center text-sm md:text-base mt-4">
                            <p>
                                Already have an account?{" "}
                                <span className="text-green-900 cursor-pointer" onClick={navigateToLogin}>Login</span>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AgentSignup;
