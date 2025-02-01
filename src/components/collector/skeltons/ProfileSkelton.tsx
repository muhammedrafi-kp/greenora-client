import React from 'react'

const ProfileSkelton:React.FC = () => {
    return (
        <div className="animate-pulse">
            <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full bg-gray-200 sm:w-20 sm:h-20 w-14 h-14" />
                <div className="h-4 bg-gray-200 rounded-md w-32" />
                <div className="h-3 bg-gray-200 rounded-md w-24" />
            </div>
            {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg mt-6 p-4 space-y-2">
                <div className="h-3 bg-yellow-200 rounded-md w-full" />
                <div className="h-3 bg-yellow-200 rounded-md w-3/4" />
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <div className="h-3 bg-gray-200 rounded-md w-1/2 mb-2" />
                    <div className="h-10 bg-gray-200 rounded-lg" />
                </div>
                <div>
                    <div className="h-3 bg-gray-200 rounded-md w-1/2 mb-2" />
                    <div className="h-10 bg-gray-200 rounded-lg" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <div className="h-3 bg-gray-200 rounded-md w-1/2 mb-2" />
                    <div className="h-10 bg-gray-200 rounded-lg" />
                </div>
                <div>
                    <div className="h-3 bg-gray-200 rounded-md w-1/2 mb-2" />
                    <div className="h-10 bg-gray-200 rounded-lg" />
                </div>
            </div>
        </div>
    )
}

export default ProfileSkelton
