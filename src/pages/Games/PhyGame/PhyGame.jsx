import { isStreamScreen } from 'playroomkit'
import React from 'react'
import PhyDesktop from './PhyDesktop/PhyDesktop'
import PhyMobile from './PhyMobile/PhyMobile'

const PhyGame = () => {
    return (
        // <div className='flex flex-col justify-center items-center h-screen gap-9'>
        <div>
            {isStreamScreen() ? (
                <>
                    <PhyDesktop />
                </>
            ) : (
                <>
                    <PhyMobile />
                </>
            )}
        </div>
    )
}

export default PhyGame