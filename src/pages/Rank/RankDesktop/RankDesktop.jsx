import React, { useEffect, useState } from 'react'
import { useGameEngine } from '../../../hooks/useGameEngine'
import RankCard from '../../../components/Rank/RankCard'
import { Howl } from "howler";
import rankSFX from '../../../assets/Sound/rankSFX.wav'

const RankDesktop = () => {
    const { players, me } = useGameEngine()

    // Filter out yourself and sort by score descending
    const otherPlayers = players
        .filter(player => player.id !== me.id)
        .sort((a, b) => b.state.score - a.state.score)
        .slice(0, 3)

    // Get the highest score (if any players exist)
    const topScore = otherPlayers[0]?.state.score

    // Initialize sound only once
    useEffect(() => {
        const RankSFX = new Howl({
            src: [rankSFX], // Make sure this file exists in your public folder or import a sound asset.
            loop: false,
            rate: 1.0, // default speed
            volume: 0.5,
        });
        RankSFX.play();
        return () => {
            RankSFX.stop();
        }; // Cleanup on unmount
    }, []);

    return (
        <>
            <div className='flex flex-col w-screen h-screen justify-around items-center text-white Bg-mid '>
                <div className='text-6xl bg-pro-green p-5 rounded-2xl font-semibold'>
                    LEADER BOARD
                </div>
                {/* <div className='grid grid-cols-3 gap-10'>
                    {otherPlayers.map((player) => (
                        <React.Fragment key={player.id}>
                            <RankCard
                                player={player}
                                isTopScorer={player.state.score === topScore}
                            />
                        </React.Fragment>
                    ))}
                </div> */}
                <div className='flex justify-center items-end gap-6'>
                    {/* 2nd place - left */}
                    {otherPlayers[1] && (
                        <>
                            <div className='flex flex-col gap-4'>
                                <div className='flex justify-center items-end gap-1 text-4xl'>
                                    <div className='text-center font-extrabold'>
                                        2
                                    </div>
                                    <span className='text-xl'>
                                        nd
                                    </span>
                                </div>
                                <RankCard
                                    key={otherPlayers[1].id}
                                    player={otherPlayers[1]}
                                    isTopScorer={false}
                                />
                            </div>
                        </>
                    )}

                    {/* 1st place - center */}
                    {otherPlayers[0] && (
                        <>
                            <div className='flex flex-col gap-4'>
                                <div className='flex justify-center items-end gap-1 text-5xl'>
                                    <div className='text-center font-extrabold'>
                                        1
                                    </div>
                                    <span className='text-xl'>
                                        st
                                    </span>
                                </div>
                                <RankCard
                                    key={otherPlayers[0].id}
                                    player={otherPlayers[0]}
                                    isTopScorer={true}
                                />
                            </div>
                        </>
                    )}

                    {/* 3rd place - right */}
                    {otherPlayers[2] && (
                        <>
                            <div className='flex flex-col gap-4'>
                                <div className='flex justify-center items-end gap-1 text-4xl'>
                                    <div className='text-center font-extrabold'>
                                        3
                                    </div>
                                    <span className='text-xl'>
                                        rd
                                    </span>
                                </div>
                                <RankCard
                                    key={otherPlayers[2].id}
                                    player={otherPlayers[2]}
                                    isTopScorer={false}
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className='flex justify-between items-center w-full px-5'>
                    <button
                        className='text-3xl font-semibold py-3.5 px-3 rounded-2xl bg-gray-mid text-gray-light'
                        // onClick={() => window.location.href = 'http://localhost:5173/'}
                        // onClick={() => window.location.href = 'https://progame.playroom.gg'}
                        onClick={() => window.location.href = 'https://spacerecruit.playroom.gg'}
                    //open in a new tab
                    // onClick={() => window.open('https://progame.playroom.gg', '_blank')}
                    >
                        Menu
                    </button>
                    {/* <button className=' text-3xl font-semibold py-3.5 px-3  rounded-2xl bg-gray-mid text-gray-light'
                    //  onClick={}
                    >
                        Export Excel
                    </button> */}
                </div>
            </div>
        </>
    )
}

export default RankDesktop