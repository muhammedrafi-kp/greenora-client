import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch } from 'react-redux';
import { loginSuccess } from "../../redux/authSlice";
import { validateField, validateForm } from "../../validations/userValidation";
import { IUserSignUpData, IFormErrors } from "../../interfaces/interfaces";
import { loginCollector, signUpCollector,googleCallbackCollector } from "../../services/authService";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import toast from 'react-hot-toast';

interface AuthFormProps {
    initialMode?: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ initialMode = 'login' }) => {
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    // const [showOtpVerification, setShowOtpVerification] = useState(false);

    const dispatch = useDispatch();

    const [formData, setFormData] = useState<IUserSignUpData>({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const [formError, setFormError] = useState<IFormErrors>({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const trimmedValue = value.trim();
        setFormData({ ...formData, [name]: trimmedValue });

        const error = validateField(name, trimmedValue, isLogin);
        setFormError(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value.trim(), isLogin);
        setFormError(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { isValid, errors } = validateForm(formData, isLogin ? 'login' : 'signup');

        setFormError(errors);
        console.log("clicked! isValid:", isValid, errors)
        if (isValid) {
            console.log("clicked again!")

            setIsLoading(true);
            try {
                if (isLogin) {
                    // Add your collector login API call here
                    const response = await loginCollector(formData.email, formData.password);
                    console.log("response :", response);
                    if (response.success) {
                        dispatch(loginSuccess({ token: response.token, role: response.role }));
                    }
                } else {
                    // Add your collector signup API call here
                    const response = await signUpCollector(formData);
                    if (response.success) {
                        navigate('/collector/verify-otp', {
                            state: {
                                email: formData.email,
                                fromSignup: true
                            }
                        });
                    }
                }
            } catch (error: any) {
                if (error.status === 404) {
                    setFormError(prev => ({ ...prev, email: "Email doesn't exist." }));
                } else if (error.status === 401) {
                    setFormError(prev => ({ ...prev, password: "Incorrect password." }));
                } else if (error.status === 409) {
                    setFormError(prev => ({ ...prev, email: "Email already exists." }));
                }
            } finally {
                setIsLoading(false);
            }
        }
        console.log("click failed!")
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);
    const toggleMode = () => {

        setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        });
        setFormError({});

        setIsLogin(!isLogin);
    }

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
        try {
            const response = await googleCallbackCollector(credentialResponse.credential);
            if (response.success) {
                dispatch(loginSuccess({ token: response.token, role: response.role }));
                navigate('/collector');
                toast.success("Login successful!");
            }
        } catch (error) {
            console.error('Google login error:', error);
            toast.error("Google login failed. Please try again.");
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
                    {isLogin ? 'Login' : 'Sign Up'}
                </h2>

                <div className="w-full">
                    <GoogleOAuthProvider clientId="180114315510-l6uvuq8k7kcj93re4uf79ae6dh1kaejt.apps.googleusercontent.com">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                toast.error("Google login failed. Please try again.");
                            }}
                            useOneTap
                            type="standard"
                            theme="outline"
                            size="large"
                            text="continue_with"
                            shape="rectangular"
                            width="100%"
                        />
                    </GoogleOAuthProvider>
                </div>

                <p className="flex items-center justify-center my-5">
                    <span className="flex-1 border-t border-gray-300"></span>
                    <span className="mx-2 md:text-sm text-xs ">OR</span>
                    <span className="flex-1 border-t border-gray-300"></span>
                </p>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="mb-4">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`w-full border rounded-lg md:h-10 h-8 px-3 md:text-sm text-xs ${formError.name ? 'border-red-700' : 'border-gray-300'
                                    }`}
                                placeholder="Full Name"
                            />
                            {formError.name && <p className="text-xs text-red-700">{formError.name}</p>}
                        </div>
                    )}

                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full border rounded-lg md:h-10 h-8 px-3 md:text-sm text-xs ${formError.email ? 'border-red-700' : 'border-gray-300'
                            }`}
                        placeholder="Email Address"
                    />
                    {formError.email && <p className="text-xs text-red-700">{formError.email}</p>}

                    {!isLogin && (
                        <div className="mt-4">
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`w-full border rounded-lg md:h-10 h-8 px-3 md:text-sm text-xs ${formError.phone ? 'border-red-700' : 'border-gray-300'
                                    }`}
                                placeholder="Phone Number"
                            />
                            {formError.phone && <p className="text-xs text-red-700">{formError.phone}</p>}
                        </div>
                    )}

                    <div className="relative mt-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`w-full border rounded-lg md:h-10 h-8 px-3 md:text-sm text-xs ${formError.password ? 'border-red-700' : 'border-gray-300'
                                }`}
                            placeholder="Password"
                        />
                        <span
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>
                    {formError.password && <p className="text-xs text-red-700">{formError.password}</p>}

                    {!isLogin && (
                        <div className="relative mt-4">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`w-full border rounded-lg md:h-10 h-8 px-3 md:text-sm text-xs ${formError.confirmPassword ? 'border-red-700' : 'border-gray-300'
                                    }`}
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
                    {formError.confirmPassword && <p className="text-xs text-red-700">{formError.confirmPassword}</p>}

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
                                onClick={() => navigate('/collector/forgot-password')}
                                className="hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button
                        className="w-full bg-green-900 hover:bg-green-800 text-white font-medium mt-8  sm:py-2 py-1 xs:text-base text-sm rounded-lg disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
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
            {/* {showOtpVerification ? (
                <OtpVerification 
                    email={formData.email}
                    closeModal={() => navigate('/collector/dashboard')}
                />
            ) : (
                // Your existing form JSX
            )} */}
        </div>
    );
};

export default AuthForm; 