import { insertCoin, isStreamScreen, useMultiplayerState } from 'playroomkit'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useGameEngine } from '../../hooks/useGameEngine'
import Rank from '../Rank/Rank';
import Random from '../Random/Random';
import PhyGame from '../Games/PhyGame/PhyGame';
import EngiGame from '../Games/EngiGame/EngiGame';
import TechGame from '../Games/TechGame/TechGame';
import ChemGame from '../Games/ChemGame/ChemGame';
import MathGame from '../Games/MathGame/MathGame';

import angry from '../../assets/Character/angry.png'
import cool from '../../assets/Character/cool.png'
import cry from '../../assets/Character/cry.png'
import funny from '../../assets/Character/funny.png'
import happy from '../../assets/Character/happy.png'
import money from '../../assets/Character/money.png'
import sleep from '../../assets/Character/sleep.png'
import sideeye from '../../assets/Character/sideeye.png'

const Lobby = () => {
    const navigate = useNavigate();

    const { phase, setPhase, defaultPlayerStates } = useGameEngine()

    const avatars = [
        angry,
        cool,
        cry,
        funny,
        funny,
        happy,
        money,
        sleep,
        sideeye,
    ]

    useEffect(() => {
        const setupRoom = async () => {
            try {
                localStorage.removeItem('gameTracker');
                await insertCoin({
                    gameId: "783NDZl9yMvIN5rDpFmJ",
                    // Dev
                    // gameId: "nvYUbavyFMEsknLpaRGe",
                    streamMode: true,
                    maxPlayersPerRoom: 7,
                    defaultPlayerStates: defaultPlayerStates,
                    avatars,
                }).then(() => {
                    // alert('start random')
                    setPhase('random')
                }).catch((err) => {
                    console.log(err);
                });
            } catch (error) {
                if (error.message === "ROOM_LIMIT_EXCEEDED") {
                    navigate('/');
                }
            }
        };
        setupRoom()
        console.log('VERSION 1.5.0');
    }, []);

    return (
        <>
            {/* {phase === 'lobby' && ( )} */}
            {phase === 'random' && (
                <Random />
            )}

            {phase === 'rank' && (
                <Rank />
            )}

            {phase === 'phy' && (
                <PhyGame />
            )}
            {phase === 'engi' && (
                <EngiGame />
            )}
            {phase === 'tech' && (
                <TechGame />
            )}
            {phase === 'chem' && (
                <ChemGame />
            )}
            {phase === 'math' && (
                <MathGame />
            )}
        </>
    )
}

export default Lobby