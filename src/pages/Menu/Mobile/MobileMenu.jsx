import React from 'react'

const MobileMenu = () => {
    return (
        <div className='flex flex-col bg-[#F0E9E3] h-screen '>
            <div className='flex flex-col m-6 text-center'>
                <div className="w-full h-0.5 bg-black my-4"></div>
                <div className='text-5xl'>
                    Breaking News
                </div>
                <div className="w-full h-1 bg-black mt-4"></div>
                <div className="w-full h-0.5 bg-black my-4"></div>
                <div className='text-3xl'>
                    Be a part of
                    <p>
                        Space Recruit
                    </p>
                    <p className='text-5xl mt-10'>
                        SCAN NOW!!!
                    </p>
                    <div className="w-full h-0.5 bg-black my-4"></div>
                </div>
            </div>
        </div>
    )
}

export default MobileMenu