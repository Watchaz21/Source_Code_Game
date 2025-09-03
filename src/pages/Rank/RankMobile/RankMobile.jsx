import React from 'react'
import { useGameEngine } from '../../../hooks/useGameEngine'

const RankMobile = () => {
    const { players, me, } = useGameEngine()
    return (
        <>
            {players.map((player, index) => player.id === me.id && (
                <React.Fragment key={player.id}>
                    <div style={{ border: `10px solid ${player.state.profile.color}` }}
                        className=' text-white w-screen h-screen flex flex-col justify-evenly items-center Bg-mid'>
                        <div className='text-5xl text-center flex flex-col gap-6'>
                            <div className='font-semibold'>
                                YOUR SCORE
                            </div>
                            <div className='font-bold'>
                                {player.state.profile.name}
                            </div>
                        </div>
                        <img src={player.state.profile.photo} alt="Player Avatar" className='h-[25vh]' />
                        <div className='flex justify-center items-center p-5 bg-pro-green rounded-2xl'>
                            <div className='text-3xl font-bold'>
                                {player.state.score}
                            </div>
                        </div>
                        <div className='flex flex-col justify-center items-center w-full'>
                            <div className='grid grid-cols-2 text-center text-2xl font-semiboldbold bg-pro-yellow w-full py-3'>
                                <div className='flex justify-end'>
                                    Physic :
                                </div>
                                <div>
                                    {player.state.PhyScore}
                                </div>
                            </div>
                            <div className='grid grid-cols-2 text-center text-2xl font-semiboldbold bg-pro-purple w-full  py-3'>
                                <div className='flex justify-end'>
                                    Chem :
                                </div>
                                <div>
                                    {player.state.ChemScore}
                                </div>
                            </div>
                            <div className=' grid grid-cols-2 text-center text-2xl font-semiboldbold bg-pro-blue w-full  py-3'>

                                <div className='flex justify-end'>
                                    Technology :
                                </div>
                                <div>
                                    {player.state.TechScore}
                                </div>
                            </div>
                            <div className='grid grid-cols-2 text-center text-2xl font-semiboldbold bg-pro-orange w-full  py-3'>

                                <div className='flex justify-end'>
                                    Engineer :
                                </div>
                                <div>
                                    {player.state.EngiScore}
                                </div>
                            </div>
                            <div className='grid grid-cols-2 text-center text-2xl font-semiboldbold bg-pro-pink w-full  py-3'>

                                <div className='flex justify-end'>
                                    Math :
                                </div>
                                <div>
                                    {player.state.MathScore}
                                </div>
                            </div>
                        </div>
                        <div>
                            <button
                                className='text-3xl font-semibold py-2 w-[20vh] rounded-2xl bg-gray-mid text-gray-light'
                                // onClick={() => window.location.href = 'http://localhost:5173/'}
                                // onClick={() => window.location.href = 'https://progame.playroom.gg'}
                                onClick={() => window.location.href = 'https://spacerecruit.playroom.gg'}
                            //open in a new tab
                            // onClick={() => window.open('https://progame.playroom.gg', '_blank')}
                            >
                                Menu
                            </button>
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </>
    )
}

export default RankMobile