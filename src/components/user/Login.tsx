// import React, { useEffect, useState } from 'react';
// import { FcGoogle } from "react-icons/fc";
// import { FiEye, FiEyeOff } from "react-icons/fi";

// interface LoginProps {
//     closeModal: () => void;
// }

// const Login: React.FC<LoginProps> = ({ closeModal }) => {
//     const [showModal, setShowModal] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);

//     const togglePasswordVisibility = () => setShowPassword(!showPassword);

//     // Trigger modal show effect when modal is mounted
//     useEffect(() => {
//         setShowModal(true);
//         document.body.style.overflow = 'hidden'; // Disable scrolling on body

//         return () => {
//             document.body.style.overflow = 'auto'; // Re-enable scrolling when modal unmounts
//         };
//     }, []);

//     return (
//         <>
//             <div
//                 className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}`}
//                 onClick={closeModal}
//             >
//                 <div
//                     className={`relative bg-white p-10 rounded-xl shadow-lg max-w-md w-full transform transition-all duration-300 ${
//                         showModal ? 'translate-y-0' : 'translate-y-20 '
//                     }`}
//                     onClick={(e) => e.stopPropagation()}
//                 >
//                     <button onClick={closeModal} className="absolute top-5 right-5 text-3xl font-normal">
//                         &times;
//                     </button>

//                     <h2 className="mb-3 text-xl font-semibold sm:mb-5 sm:text-2xl md:text-3xl text-center">Login</h2>
//                     <button className='w-full rounded-lg py-2 border text-sm md:text-base font-sans font-medium shadow-sm hover:bg-slate-50 flex items-center justify-center gap-2'>
//                         <FcGoogle />
//                         <span>Continue with Google</span>
//                     </button>


//                     <p className="flex items-center justify-center my-5">
//                         <span className="flex-1 border-t border-gray-300"></span>
//                         <span className="mx-2 text-sm md:text-base">OR</span>
//                         <span className="flex-1 border-t border-gray-300"></span>
//                     </p>
//                     <form >
//                         {/* <label htmlFor="email" className="block text-sm md:text-base text-left font-medium  mb-2">
//                             Email
//                         </label> */}
//                         <input
//                             type="email"
//                             id='email'
//                             name='email'
//                             className='w-full border rounded-lg h-12 focus:secondary-500 px-2 placeholder:font-normal placeholder:text-sm placeholder:text-left  focus:border-gray-500'
//                             placeholder='Enter Email'
//                         />
//                         {/* <label htmlFor="password" className="block text-sm md:text-base  text-left font-sans font-medium mb-2 mt-4">
//                             Password
//                         </label> */}
//                        <div className="relative mt-4">
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 id="password"
//                                 name="password"
//                                 className="w-full border rounded-lg h-12 focus:outline-secondary-500 px-3 placeholder:font-normal placeholder:text-sm"
//                                 placeholder="Password"
//                             />
//                             <span
//                                 className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
//                                 onClick={togglePasswordVisibility}
//                             >
//                                 {showPassword ? <FiEyeOff /> : <FiEye />}
//                             </span>
//                         </div>
//                         <div className="text-sm text-green-900 mt-3">
//                             <a href="" >Forgot Paasword?</a>
//                         </div>
//                         <button className='w-full bg-green-900 hover:bg-green-800 text-white font-medium mt-8 py-2 md:py-3 rounded-lg'>
//                             Login
//                         </button>
//                         <div className="text-center text-sm mt-4">
//                             <p>Don't have an account? <a href="" className="text-green-900"> Sign up</a></p>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Login;
