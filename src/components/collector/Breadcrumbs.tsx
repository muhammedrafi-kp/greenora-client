import React from 'react';

interface BreadcrumbsProps{
    title:string
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({title}) => {
    return (
        <>
            <div className='flex items-center justify-start px-6 py-4'>
                <p className='text-md md:text-xl font-bold text-gray-800'>{title}</p>
            </div>
        </>
    )
}

export default Breadcrumbs;