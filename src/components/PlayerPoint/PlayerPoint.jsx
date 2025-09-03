import React from 'react'
import { useGameEngine } from '../../hooks/useGameEngine';

const PlayerPoint = () => {

    const {
        players,
        me,
    } = useGameEngine();
    return (
        <div>
            {players
                .filter((player) => player.id === me.id)
                .map((player) => {
                    const score = player.getState("score") ?? 0; // or another fallback
                    return <span key={player.id}>{score} Point</span>;
                })}
        </div>
    )
}

export default PlayerPoint