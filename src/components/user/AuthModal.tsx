import React, { useEffect, useState } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import OtpVerification from './OtpVerification';
import ForgotPassword from './ForgotPassword';
import { IUserSignUpData, IFormErrors } from "../../types/user";
import { validateForm } from "../../validations/userValidation"
import { useDispatch } from 'react-redux';
import { loginSuccess } from "../../redux/authSlice";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import toast from 'react-hot-toast';
import { googleCallbackUser } from "../../services/authService";
import { loginUser, signUpUser } from "../../services/authService";
import { ApiResponse } from '../../types/common';
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
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { isValid, errors } = validateForm(formData, isLogin ? 'login' : 'signup');

        setFormError(errors);

        if (isValid) {
            setIsLoading(true);
            try {
                if (isLogin) {
                    const res:ApiResponse<{token:string,role:string}> = await loginUser(formData.email, formData.password);
                    console.log(res)
                    if (res.success) {
                        // Dispatch user login action with user data
                        dispatch(loginSuccess({ token: res.data.token, role: res.data.role }));
                        closeModal();
                        toast.success("Login successful!");
                    }
                } else {
                    const res:ApiResponse<null> = await signUpUser(formData);
                    if (res.success) {
                        setShowOtpVerification(true); // Show OTP verification for signup
                    }
                }
            } catch (error: any) {
                if (error.status === 404) {
                    errors.email = "User with this email doesn't exists"
                    setFormError(errors);
                } else if (error.status === 401) {
                    errors.password = "Incorrect password"
                    setFormError(errors);
                } if (error.status === 409) {
                    errors.email = "Email already exists";
                    setFormError(errors);
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
        try {
            console.log("credentialResponse", credentialResponse)

            const res:ApiResponse<{token:string,role:string}> = await googleCallbackUser(credentialResponse.credential);
            console.log("response", res)
            if (res.success) {
                dispatch(loginSuccess({ token: res.data.token, role: res.data.role }));
                closeModal();
                toast.success("Login successful!");
            }

        } catch (error) {
            console.error('Google login error:', error);
            toast.error("Google login failed. Please try again.");
        }finally{
            setIsLoading(false)
        }
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
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value.trim() });
    };

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
                // onClick={closeModal}
                >
                    <div
                        className={`relative bg-white px-8 py-10 rounded-xl shadow-lg max-w-md sm:w-full w-11/12 transform transition-all duration-300 ${showModal ? 'translate-y-0' : 'translate-y-20'
                            } max-h-[90vh] overflow-y-auto ${isLoading ? 'opacity-50' : ''}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center z-50">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-900"></div>
                            </div>
                        )}
                        <button onClick={closeModal} className="absolute top-5 right-5 text-3xl font-normal">
                            &times;
                        </button>

                        <h2 className="mb-3 text-xl font-semibold sm:mb-5 sm:text-2xl md:text-3xl text-center">
                            {isLogin ? 'Login' : 'Sign Up'}
                        </h2>

                        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}>
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

                        <p className="flex items-center justify-center my-5">
                            <span className="flex-1 border-t border-gray-300"></span>
                            <span className="mx-2 sm:text-base text-xs">OR</span>
                            <span className="flex-1 border-t border-gray-300"></span>
                        </p>

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className='mb-4'>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        onChange={handleInputChange}
                                        value={formData.name}

                                        className={`w-full border rounded-lg sm:h-12 h-10 focus:outline-secondary-500 px-3 sm:text-base text-xs ${formError.name ? 'border-red-700' : 'border-gray-300'}`}

                                        placeholder="Full Name"
                                    />

                                    {formError.name && <p className="text-xs text-red-700">{formError.name}</p>}

                                </div>
                            )}



                            <input
                                type="email"
                                id="email"
                                name="email"
                                onChange={handleInputChange}
                                value={formData.email}
                                className={`w-full border rounded-lg sm:h-12 h-10 px-3 sm:text-base text-xs ${formError.email ? 'border-red-700' : 'border-gray-300'}`}
                                placeholder="Email Address"
                            />
                            {formError.email && <p className="text-xs text-red-700">{formError.email}</p>}


                            {!isLogin && (
                                <>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        onChange={handleInputChange}
                                        value={formData.phone}
                                        className={`w-full border rounded-lg sm:h-12 h-10 focus:outline-secondary-500 px-3 sm:text-base text-xs mt-4 ${formError.phone ? 'border-red-700' : 'border-gray-300'}`}
                                        placeholder="Phone Number"
                                    />
                                    {formError.phone && <p className="text-xs text-red-700">{formError.phone}</p>}
                                </>
                            )}

                            <div className="relative mt-4">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    onChange={handleInputChange}
                                    value={formData.password}
                                    className={`w-full border rounded-lg sm:h-12 h-10 focus:outline-secondary-500 px-3 sm:text-base text-xs ${formError.password ? 'border-red-700' : 'border-gray-300'}`}
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
                                        onChange={handleInputChange}
                                        value={formData.confirmPassword}
                                        className={`w-full border rounded-lg sm:h-12  h-10 focus:outline-secondary-500 px-3 sm:text-base text-xs ${formError.confirmPassword ? 'border-red-700' : 'border-gray-300'}`}
                                        placeholder="Confirm Password"
                                    />
                                    <span
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                        onClick={toggleConfirmPasswordVisibility}
                                    >
                                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </span>

                                    {formError.confirmPassword && <p className="text-xs text-red-700">{formError.confirmPassword}</p>}
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

                            <button
                                className="w-full bg-green-800 hover:bg-green-900 text-white font-medium mt-8 py-2 md:py-3 rounded-lg disabled:opacity-50"
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
                </div>
            ) : (
                <OtpVerification
                    closeModal={closeModal}
                    email={formData.email}
                />
            )}
        </>
    );
};

export default AuthModal;