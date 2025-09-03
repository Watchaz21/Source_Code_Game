import { isStreamScreen, myPlayer, useIsHost, useMultiplayerState, usePlayersList } from "playroomkit";
import { createContext, useContext, useEffect, useState } from "react";

const GameEngineContext = createContext(); // Create Context

export const GameEngineProvider = ({ children }) => {

    // GAME STATE
    const [round, setRound] = useMultiplayerState("round", 1);
    const [phase, setPhase] = useMultiplayerState("phase", "lobby");

    const [time, setTime] = useMultiplayerState("time", null);
    const [isTimeUp, setIsTimeUp] = useMultiplayerState("isTimeUp", false);

    const [allAnswer, setAllAnswer] = useMultiplayerState("allAnswer", false);
    const [streamScreenId, setStreamScreenId] = useMultiplayerState("streamScreenId", "");

    const [engiGame, setEngiGame] = useMultiplayerState("engiGame", [
        { c: null, e: null },
    ]);

    const [techGame, setTechGame] = useMultiplayerState("techGame",null);

    const defaultPlayerStates = {
        score: 0,
        PhyScore: 0,
        ChemScore: 0,
        TechScore: 0,
        EngiScore: 0,
        MathScore: 0,
        isPlayer: null,
        PlayerTime: 0,
    }

    const TIME = {

        PHY: 30,
        CHEM: 30,
        TECH: 30,
        ENGI: 30,
        MATH: 30,

    }


    const me = myPlayer();
    const players = usePlayersList(true);
    const isHost = useIsHost()

    const handleTimeSend = (remainingTime) => {
        if (remainingTime === undefined) return;
        console.log("Time sent:", remainingTime);
        if (remainingTime === 0) {
            console.log('TIME UP!!!!!');
            setIsTimeUp(true)
            setTime(null)
            setAllAnswer(true)
        }
    };

    const handleRemain = () => {
        players.forEach((player) => {
            if (player.id === me.id) {
                player.setState('PlayerTime', time)
                console.log('PlayerTime: ', player.getState('PlayerTime'));
            }
        });
    };

    const pointCal = (payload) => {
        const { choice, correct, remainingTime, totalTime } = payload;

        // if (correct === 0 || remainingTime === 0) return 0;

        const k = 1000 / choice;
        const x = 0.5 + (0.5 * remainingTime / totalTime);
        const point = Math.round(Math.round(k) * correct * x);

        console.log('choice =', choice);
        console.log('correct =', correct);
        console.log('remainingTime =', remainingTime);
        console.log('totalTime =', totalTime);
        console.log('k =', Math.round(k));
        console.log('x =', x);
        console.log('Point = ', point);

        return point;
    };

    function updatePlayerTotalScore() {
        players.forEach((player) => {
            // Safely get scores, fallback to 0 if undefined
            const subjects = ['PhyScore', 'ChemScore', 'TechScore', 'EngiScore', 'MathScore'];
            const totalScore = subjects.reduce((sum, key) => {
                const score = player.getState(key);
                return sum + (typeof score === 'number' ? score : 0);
            }, 0);

            player.setState('score', totalScore);
        });
    }

    const gameState = {
        round,
        setRound,

        phase,
        setPhase,
        players,
        isHost,
        me,
        defaultPlayerStates,

        allAnswer,
        setAllAnswer,

        engiGame,
        setEngiGame,

        techGame,
        setTechGame,

        time,
        setTime,
        TIME,
        handleTimeSend,
        isTimeUp,
        setIsTimeUp,
        handleRemain,

        pointCal,
        updatePlayerTotalScore
    };

    useEffect(() => {
        console.log('Phase', phase);
        console.log('round', round);

        setAllAnswer(false);
        setIsTimeUp(false);

        players.forEach((player) => {
            player.setState('PlayerTime', 0);

            // // Safely get scores, fallback to 0 if undefined
            // const subjects = ['PhyScore', 'ChemScore', 'TechScore', 'EngiScore', 'MathScore'];
            // const totalScore = subjects.reduce((sum, key) => {
            //     const score = player.getState(key);
            //     return sum + (typeof score === 'number' ? score : 0);
            // }, 0);

            // player.setState('score', totalScore);
        });
    }, [phase]);

    useEffect(() => {
        players.forEach((player) => {
            // console.log('in context players', players);
            if (player.id === me.id) {
                console.log(`${player.state.profile.name} player state`, player.state);
            }
        })
    }, [players]);

    // Set the stream screen ID when it's the current player
    useEffect(() => {
        players.forEach((player) => {
            if (!player) return; // skip if player is undefined

            if (player.id === me?.id && isStreamScreen()) {
                setStreamScreenId(player.id);
                if (streamScreenId === me?.id) {
                    player.setState("isPlayer", false);
                }
            }
            else if (player.id === me?.id && !isStreamScreen()) {
                player.setState("isPlayer", true);
            }

            // console.log('Stream screen ID:', streamScreenId);
            // console.log(`${player.state?.profile?.name} isPlayer: ${player.state?.isPlayer} | id: ${player.id}`);
        });
    }, [players]);

    useEffect(() => {
        const runRounds = () => {
            const roundLoop = Number(localStorage.getItem('roundLoop'));
            const newRound = round + 1
            console.log('newRound', newRound);
            setRound(newRound);
            if (newRound <= roundLoop) {
                console.log(`round ${newRound} of ${roundLoop} round`);
                setPhase('random');
            }
            else if (newRound > roundLoop) {
                console.log(`round ${newRound} > ${roundLoop} round`);
                setPhase('rank');
            }
        };
        if (allAnswer && isStreamScreen()) {
            const timeout = setTimeout(() => {
                runRounds();
            }, 15000); // 30 seconds
            return () => clearTimeout(timeout); // cleanup if component unmounts or allAnswer changes
        }
    }, [allAnswer]);

    return (
        <GameEngineContext.Provider
            value={{
                ...gameState,
            }}>
            {children}
        </GameEngineContext.Provider>
    );
};

export const useGameEngine = () => {
    const context = useContext(GameEngineContext);
    if (context === undefined) {
        throw new Error("useGameEngine must be used within a GameEngineProvider");
    }
    return context;
};