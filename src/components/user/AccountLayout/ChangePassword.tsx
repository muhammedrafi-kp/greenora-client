// import React from 'react';
// import { Lock } from 'lucide-react';


// interface ChangePasswordProps {
//     onCancel: () => void;
// }

// const ChangePassword: React.FC<ChangePasswordProps> = ({ onCancel }) => {
//     return (
//         <div >
//             <form className="space-y-6">
//                 <span className="flex items-center gap-2 lg:text-lg xs:text-base text-sm sm:text-left text-center font-semibold mb-6" >
//                 {/* <Lock className="w-4 h-4"  /> */}
//                 <h2 >Change Password</h2>

//                 </span>

//                 <div className="space-y-4  ">
//                     {/* Current Password */}
//                     <div>
//                         {/* <label className="block text-sm font-medium text-gray-700 mb-1">
//                             <span className="flex items-center gap-2">
//                                 <Lock className="w-4 h-4" /> Current Password
//                             </span>
//                         </label> */}
//                         <input
//                             type="password"
//                             placeholder="Current password"
//                             className="sm:w-2/4 w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:border-transparent"
//                         />
//                     </div>

//                     {/* New Password */}
//                     <div>
//                         {/* <label className="block text-sm font-medium text-gray-700 mb-1">
//                             <span className="flex items-center gap-2">
//                                 <Lock className="w-4 h-4" /> New Password
//                             </span>
//                         </label> */}
//                         <input
//                             type="password"
//                             placeholder="New password"
//                             className="sm:w-2/4 w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:border-transparent"
//                         />
//                     </div>

//                     {/* Confirm New Password */}
//                     <div>
//                         {/* <label className="block text-sm font-medium text-gray-700 mb-1">
//                             <span className="flex items-center gap-2">
//                                 <Lock className="w-4 h-4" /> Confirm New Password
//                             </span>
//                         </label> */}
//                         <input
//                             type="password"
//                             placeholder="Confirm new password"
//                             className="sm:w-2/4 w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:border-transparent"
//                         />
//                     </div>
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex justify-end space-x-4 pt-6">
//                     <button
//                         type="button"
//                         onClick={onCancel}
//                         className="xs:px-4 xs:py-2 px-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg  text-gray-700 hover:bg-gray-50 transition-colors"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         className="xs:px-4 xs:py-2 px-2 py-1 xs:text-sm text-xs bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors"
//                     >
//                         Change Password
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default ChangePassword;

