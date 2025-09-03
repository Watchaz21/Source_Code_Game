import React from 'react'
import { useGameEngine } from '../../hooks/useGameEngine'

const PlayerList = () => {
    const { players, me } = useGameEngine()

    return (
        <div className='flex justify-center items-center gap-[1vh]'>
            {[...Array(6)].map((_, index) => {
                const player = players[index]

                return (
                    <div key={index}
                        style={{
                            border: player && player.id !== me.id ? `4px solid ${player.state.profile.color}` : '4px solid transparent'
                        }}
                        className='w-[8vh] h-[8vh] bg-gray-200 flex justify-center rounded overflow-hidden'>
                        {player && player.id !== me.id && (
                            <img
                                src={player.state.profile.photo}
                                alt="Player Avatar"
                                className='h-[25vh] object-cover object-top rounded-lg '
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default PlayerList
