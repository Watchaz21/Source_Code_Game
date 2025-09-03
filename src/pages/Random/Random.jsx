import React, { useEffect, useState } from 'react'
import { isStreamScreen, useMultiplayerState } from 'playroomkit';
import { useGameEngine } from '../../hooks/useGameEngine';
import { motion } from "framer-motion";

const Random = () => {

    const { setPhase, round, isHost } = useGameEngine()
    const [isRolling, setIsRolling] = useState(false); // Start rolling after insertCoin
    const [currentLabel, setCurrentLabel] = useMultiplayerState("???");
    const [game, setGame] = useState('');

    const defaultTracker = {
        Physic: 0,
        Engineer: 0,
        Tech: 0,
        Chem: 0,
        Math: 0
    };

    const pages = [
        'Physic',
        'Engineer',
        'Tech',
        'Chem',
        'Math',
    ];

    const getStoredTracker = () => {
        const stored = localStorage.getItem('gameTracker');
        return stored ? JSON.parse(stored) : defaultTracker;
    };

    const [gameTracker, setGameTracker] = useState(() =>
        isHost ? getStoredTracker() : { ...defaultTracker }
    );

    // Save to localStorage whenever gameTracker changes (host only)
    useEffect(() => {
        if (isHost) {
            localStorage.setItem('gameTracker', JSON.stringify(gameTracker));
        }
    }, [gameTracker, isHost]);

    useEffect(() => {
        let spinCount = 0;
        setIsRolling(true);

        const spinInterval = setInterval(() => {
            setCurrentLabel(pages[Math.floor(Math.random() * pages.length)]);
            spinCount++;

            if (spinCount > 10) {
                clearInterval(spinInterval);

                // Check if all are played
                const allPlayed = Object.values(gameTracker).every(value => value === 1);

                if (allPlayed && isHost) {
                    // Reset tracker
                    const resetTracker = Object.fromEntries(
                        Object.keys(gameTracker).map(key => [key, 0])
                    );
                    setGameTracker(resetTracker);
                    // localStorage saved by effect above
                }

                // Use updated tracker after reset or current tracker
                const updatedTracker = allPlayed ? Object.fromEntries(
                    Object.keys(gameTracker).map(key => [key, 0])
                ) : gameTracker;

                const unplayedCategories = Object.keys(updatedTracker).filter(key => updatedTracker[key] === 0);

                let finalLabel = '';
                if (unplayedCategories.length > 0) {
                    finalLabel = unplayedCategories[Math.floor(Math.random() * unplayedCategories.length)];
                } else {
                    finalLabel = pages[Math.floor(Math.random() * pages.length)];
                }

                setCurrentLabel(finalLabel);
                setIsRolling(false);

            }
        }, 200);

        return () => clearInterval(spinInterval);
    }, []);

    useEffect(() => {
        if (!isRolling && currentLabel !== "???") {
            setGame(currentLabel);
        }
    }, [isRolling, currentLabel]);

    useEffect(() => {
        if (!isRolling && game) {
            const phaseMap = {
                Engineer: 'engi',
                Physic: 'phy',
                Tech: 'tech',
                Math: 'math',
                Chem: 'chem',
            };

            const nextPhase = phaseMap[game];
            if (nextPhase) {
                let trackerTimeoutId;
                let phaseTimeoutId;

                trackerTimeoutId = setTimeout(() => {
                    setGameTracker(prev => ({
                        ...prev,
                        [game]: 1,
                    }));
                }, 1000);
                phaseTimeoutId = setTimeout(() => {
                    console.log('Setting phase to:', nextPhase);
                    setPhase(nextPhase);
                }, 2000);
                return () => {
                    clearTimeout(trackerTimeoutId);
                    clearTimeout(phaseTimeoutId);
                };
            }
        }
    }, [isRolling, game, setPhase, setGameTracker]);




    useEffect(() => {
        console.log('gameTracker', gameTracker);
    }, [gameTracker]);

    // useEffect(() => {
    //     if (!isRolling && game) { // Ensure game is set before calling setPhase
    //         if (game === "Engineer") {
    //             setPhase('engi');
    //         } else if (game === "Physic") {
    //             setPhase('phy');
    //         } else if (game === "Tech") {
    //             setPhase('tech')
    //         } else if (game === "Math") {
    //             setPhase('math')
    //         } else if (game === "Chem") {
    //             setPhase('chem')
    //         }

    //     }
    // }, [isRolling, game, setPhase]);

    const getTxtColor = (label) => {
        switch (label) {
            case 'Physic':
                return 'text-[var(--color-pro-yellow)]';
            case 'Engineer':
                return 'text-[var(--color-pro-orange)]';
            case 'Tech':
                return 'text-[var(--color-pro-blue)]';
            case 'Math':
                return 'text-[var(--color-pro-pink)]';
            case 'Chem':
                return 'text-[var(--color-pro-purple)]';
            default:
                return 'text-white';
        }
    };

    const getBgColor = (label) => {
        switch (label) {
            case 'Physic':
                return 'Bg-phy';
            case 'Engineer':
                return 'Bg-engi';
            case 'Tech':
                return 'Bg-tech1';
            case 'Math':
                return 'Bg-math';
            case 'Chem':
                return 'Bg-chem';
            default:
                return 'Bg-mid';
        }
    };

    return (
        <>
            <div className={`flex flex-col justify-center items-center h-screen gap-9 ${isStreamScreen() ? 'Bg-mid' : getBgColor(currentLabel)}`}>
                {isStreamScreen() ? (
                    <>
                        <div className='text-6xl text-center text-white font-medium'>
                            Round {round}
                        </div>
                        <div className="flex flex-col items-center w-1/2">
                            <div className="text-xl font-bold p-2  w-1/2 rounded-2xl text-center bg-white">
                                <motion.div>
                                    <div className={`text-6xl font-semibold ${getTxtColor(currentLabel)}`}>
                                        {currentLabel}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center w-1/2">
                        <div className="text-xl font-bold border-gray-500 rounded text-center">
                            <motion.div>
                                <div className='text-7xl font-semibold text-white'>
                                    {currentLabel}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}

            </div>
        </>
    )
}

export default Random;
