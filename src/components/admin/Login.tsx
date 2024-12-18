import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
// import logo from '../../assets/logo.svg'

const Login: React.FC = () => {

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-10 max-w-md w-full shadow-lg rounded-lg">
                    {/* <div >
                        <img src={logo}  alt=""   />
                    </div> */}
                    <h2 className="mb-3 text-xl font-semibold sm:mb-10 sm:text-2xl md:text-3xl text-center">
                        Admin Login
                    </h2>

                    <form>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full border rounded-lg h-12 focus:outline-gray-700 px-2 placeholder:font-normal placeholder:text-sm"
                            placeholder="Enter Email"
                        />

                        <div className="relative mt-4">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className="w-full border rounded-lg h-12 focus:outline-gay-700 px-3 placeholder:font-normal placeholder:text-sm"
                                placeholder="Password"
                            />
                            <span
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>

                        <button className="w-full bg-green-900 hover:bg-green-800 text-white font-medium mt-8 py-2 md:py-3 rounded-lg">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login;