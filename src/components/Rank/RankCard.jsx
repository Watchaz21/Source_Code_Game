import React from 'react'

const RankCard = ({ player, isTopScorer }) => {

    return (
        <div>
            <div style={{ border: `4px solid ${player.state.profile.color}` }}
                className="flex flex-col justify-center items-center gap-6 p-5 rounded-2xl bg-gray-dark text-xl">
                {isTopScorer && <div>👑</div>}
                <img src={player.state.profile.photo} alt="Player Avatar" className={`${isTopScorer ? 'h-[35vh]' : 'h-[30vh]'}`} />
                <div>{player.state.profile.name}</div>
                <div>{player.state.score}</div>
            </div>
        </div >
    )
}

export default RankCard