// import React from 'react';

// const ProfileSkeleton: React.FC = () => (
//     <div className="animate-pulse">
//         {/* Profile Header Skeleton */}
//         <div className="mb-6">
//             <div className="h-6 w-32 bg-gray-200 rounded mx-auto sm:mx-0"></div>
//         </div>

//         {/* Profile Image Skeleton */}
//         <div className="lg:hidden flex justify-center mb-6">
//             <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto"></div>
//         </div>

//         {/* Personal Information Skeleton */}
//         <div className="space-y-6">
//             <div>
//                 <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
//                 <div className="h-10 w-full bg-gray-200 rounded"></div>
//             </div>

//             {/* Contact Information Skeleton */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                     <div className="flex items-center gap-2 mb-1">
//                         <div className="h-4 w-24 bg-gray-200 rounded"></div>
//                     </div>
//                     <div className="h-10 w-full bg-gray-200 rounded"></div>
//                 </div>
//                 <div>
//                     <div className="flex items-center gap-2 mb-1">
//                         <div className="h-4 w-24 bg-gray-200 rounded"></div>
//                     </div>
//                     <div className="h-10 w-full bg-gray-200 rounded"></div>
//                 </div>
//             </div>

//             {/* Password Section Skeleton */}
//             <div className="pt-4">
//                 <div className="h-10 w-40 bg-gray-200 rounded mx-auto sm:mx-0"></div>
//             </div>

//             {/* Actions Skeleton */}
//             <div className="flex justify-end pt-6 gap-4">
//                 <div className="h-10 w-28 bg-gray-200 rounded"></div>
//             </div>
//         </div>
//     </div>
// );

// export default ProfileSkeleton;


import React from 'react';

const ProfileSkeleton: React.FC = () => (
    <div>
        {/* Profile Header Skeleton */}
        <div className="mb-6">
            <div className="h-6 w-32 bg-gray-200 rounded mx-auto sm:mx-0"></div>
        </div>

        {/* Profile Image Skeleton */}
        <div className="lg:hidden flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto"></div>
        </div>

        {/* Personal Information Skeleton */}
        <div className="space-y-6">
            <div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
                {/* Apply pulse effect to input fields */}
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Contact Information Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    {/* Apply pulse effect to input fields */}
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    {/* Apply pulse effect to input fields */}
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>

            {/* Password Section Skeleton */}
            <div className="pt-4">
                <div className="h-10 w-40 bg-gray-200 rounded mx-auto sm:mx-0"></div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex justify-end pt-6 gap-4">
                <div className="h-10 w-28 bg-gray-200 rounded"></div>
            </div>
        </div>
    </div>
);

export default ProfileSkeleton;
