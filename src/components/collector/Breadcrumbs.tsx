import React from 'react'

const Breadcrumbs: React.FC = () => {
    return (
        <>
            <div className='flex items-center justify-start px-6 py-4'>
                <p className='text-md md:text-lg font-semibold'>Dashboard</p>
                {/* <p className='text-md md:text-lg text-gray-700'>breadcrumbs</p> */}
            </div>
        </>
    )
}

export default Breadcrumbs;
