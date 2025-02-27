import React from 'react'

interface BreadcrumbsProps{
    title:string
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({title}) => {
    return (
        <>
            {/* <nav className="bg-gray-100 p-4">
                    <ol className="flex space-x-2">
                        {breadcrumbs.map((breadcrumb, index) => (
                            <li key={index} className="flex items-center">
                                {index > 0 && (
                                    <span className="mx-2 text-gray-600">/</span>
                                )}
                                <a href={breadcrumb.href} className="text-green-700 hover:text-green-900">
                                    {breadcrumb.name}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav> */}
            <div className='flex items-center justify-between px-6 py-4'>
            <p className='text-lg md:text-xl font-semibold'>{title}</p>
                <p className='text-md md:text-lg text-gray-700'></p>
            </div>
        </>
    )
}

export default Breadcrumbs
