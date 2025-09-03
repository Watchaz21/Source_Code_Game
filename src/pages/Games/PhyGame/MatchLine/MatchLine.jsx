import { useMultiplayerState } from "playroomkit";
import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Text, Rect } from "react-konva";
import { useGameEngine } from "../../../../hooks/useGameEngine";
import PlayerPoint from "../../../../components/PlayerPoint/PlayerPoint";

const PREFIXES = [
    { value: "10⁻¹²", symbol: "p" },
    { value: "10⁻⁹", symbol: "n" },
    { value: "10⁻⁶", symbol: "μ" },
    { value: "10⁻³", symbol: "m" },
    { value: "10⁻²", symbol: "c" },
    { value: "10⁻¹", symbol: "d" },
    { value: "10¹", symbol: "da" },
    // { value: "10²", symbol: "h" },
    { value: "10³", symbol: "k" },
    { value: "10⁶", symbol: "M" },
    { value: "10⁹", symbol: "G" },
    { value: "10¹²", symbol: "T" },
];

const LINE_COLORS = [
    "#5E9CE5", // pro-blue
    "#FEC062", // pro-yellow
    "#F48548", // pro-orange
    "#D27ADA", // pro-pink
    "#8970F5", // pro-purple
];

// Function to get 5 random unique prefixes
const getRandomPrefixes = () => PREFIXES.sort(() => 0.5 - Math.random()).slice(0, 5);

const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
    }
    return shuffledArray;
};

const MatchLine = () => {
    const {
        players,
        me,
        isTimeUp,
        handleRemain,
        setAllAnswer,
        pointCal,
        TIME,
        updatePlayerTotalScore
    } = useGameEngine();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);

    const [prefixPairs, setPrefixPairs] = useMultiplayerState('prefixpairs', []);
    const [shuffledPrefixPairs, setShuffledPrefixPairs] = useMultiplayerState('shuffledprefixpairs', []);

    const [lines, setLines] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const [currentLine, setCurrentLine] = useState({ start: null, end: { x: 0, y: 0 } });
    const [connectedDots, setConnectedDots] = useState(new Set());
    const stageRef = useRef(null);

    const [answerSended, setAnswerSended] = useState(false);
    const [showAnswers, setShowAnswers] = useState(false);
    const [correctCount, setCorrectCount] = useState(null); // null = not checked yet
    const [phyPoint, setPhyPoint] = useState(null);

    // const hasCalculatedRef = useRef(false);

    useEffect(() => {
        players.forEach((player) => {
            if (player.id === me.id) {
                player.setState("answerSended", answerSended);
            }
        });
    }, [answerSended])

    useEffect(() => {
        const realPlayers = players.filter(player => player.getState("isPlayer"));
        const allAnswered = realPlayers.every(player => player.getState("answerSended"));

        if ((allAnswered && answerSended) || isTimeUp) {
            let count = 0;

            const updatedLines = lines.map((line) => {
                const { start, end } = line;
                const isTopToBottom = start.y < end.y;
                const top = isTopToBottom ? start : end;
                const bottom = isTopToBottom ? end : start;
                const isCorrect = top.prefixValue === bottom.prefixValue;
                if (isCorrect) count++;
                return { ...line, isCorrect };
            });

            setLines(updatedLines);
            setCorrectCount(count);
            setShowAnswers(true);
            setAllAnswer(true);

            // if (hasCalculatedRef.current) return;
            // hasCalculatedRef.current = true;

            players.forEach((player) => {
                if (player.id === me.id) {

                    const payload = {
                        choice: 5,
                        correct: count,
                        remainingTime: player.getState('PlayerTime'),
                        totalTime: TIME.PHY
                    };

                    const PhyPoint = pointCal(payload)
                    setPhyPoint(PhyPoint)
                    const newScore = PhyPoint + player.getState('PhyScore')
                    player.setState('PhyScore', newScore)
                    updatePlayerTotalScore()

                }
            })
        }
    }, [
        players.map(p => p.getState("isPlayer") && p.getState("answerSended")).join(','),
        answerSended, isTimeUp
    ]);

    useEffect(() => {
        const initialPairs = getRandomPrefixes();
        setPrefixPairs(initialPairs)
        const shuffledPrefixPairs = shuffleArray(initialPairs)
        setShuffledPrefixPairs(shuffledPrefixPairs)
    }, []);

    // useEffect(() => {
    //     console.log('prefixPairs', prefixPairs);
    //     console.log('shuffledPrefixPairs', shuffledPrefixPairs);
    // }, []);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
            setScreenHeight(window.innerHeight);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Scaling logic
    const scaleX = (screenWidth * 0.9) / 600;
    const scaleY = (screenHeight * 0.6) / 100;

    const TOPPOINT = 20
    const BOTPOINT = 80

    // Assigning id to prefixPairs and keeping track of them
    const topPoints = prefixPairs.map((prefix, i) => ({
        x: (i + 1) * 100,
        y: TOPPOINT,
        id: i + 1,
        prefixValue: prefix.value, // Adding the prefix value to the point
        prefixSymbol: prefix.symbol, // Adding the prefix symbol to the point
    }));

    const bottomPoints = shuffledPrefixPairs.map((prefix, i) => ({
        x: (i + 1) * 100,
        y: BOTPOINT,
        id: i + 6,
        prefixValue: prefix.value, // Adding the prefix value to the point
        prefixSymbol: prefix.symbol, // Adding the prefix symbol to the point
    }));

    const allPoints = [...topPoints, ...bottomPoints];

    const scaledPoints = allPoints.map((p) => ({
        x: p.x * scaleX,
        y: p.y * scaleY,
        id: p.id,
        prefixValue: p.prefixValue, // Make sure to include the prefix value
        prefixSymbol: p.prefixSymbol, // Make sure to include the prefix symbol
    }));

    const findAndRemoveLine = (pointId) => {
        if (showAnswers) return;
        const connectedLine = lines.find((line) => line.start.id === pointId || line.end.id === pointId);
        if (connectedLine) {
            setLines((prev) => prev.filter((line) => line !== connectedLine));
            setConnectedDots((prev) => {
                const newSet = new Set(prev);
                newSet.delete(connectedLine.start.id);
                newSet.delete(connectedLine.end.id);
                return newSet;
            });
        }
    };

    const handleStart = (point) => {
        if (showAnswers) return; // Prevent interaction after showing answers
        if (connectedDots.has(point.id)) findAndRemoveLine(point.id);
        setDrawing(true);
        setCurrentLine({ start: point, end: { x: point.x, y: point.y } });
    };

    const handleMove = (e) => {
        if (!drawing || showAnswers) return;
        const stage = stageRef.current;
        const point = stage.getPointerPosition();
        if (point) setCurrentLine((prev) => ({ ...prev, end: point }));
    };

    const handleEnd = (endPoint) => {
        if (!drawing || !currentLine.start || showAnswers) return;

        // Check if the endpoint is already connected
        if (
            endPoint &&
            currentLine.start.id !== endPoint.id &&
            !connectedDots.has(currentLine.start.id) &&
            currentLine.start.y !== endPoint.y
        ) {
            // If the endpoint is already used, remove the old line using findAndRemoveLine
            if (connectedDots.has(endPoint.id)) {
                findAndRemoveLine(endPoint.id); // Remove the existing line that connects to the endpoint
            }

            // Add the new line connecting the start point and the new endpoint
            setLines((prev) => [...prev, { start: currentLine.start, end: endPoint }]);
            setConnectedDots((prev) => new Set(prev.add(currentLine.start.id).add(endPoint.id)));

            // Log the connected prefix pairs (from both top and bottom points)
            const startValue = currentLine.start.prefixValue;
            const startSymbol = currentLine.start.prefixSymbol;
            const endValue = endPoint.prefixValue;
            const endSymbol = endPoint.prefixSymbol;

            console.log(`Connected: ${startValue}|${startSymbol}  <---> ${endValue}|${endSymbol} `);
        }

        setDrawing(false);
        setCurrentLine({ start: null, end: { x: 0, y: 0 } });
    };

    const checkCorrectMatches = () => {
        setAnswerSended(true)
        handleRemain()
    };

    return (
        <>
            <div className={`flex flex-col justify-evenly items-center overflow-hidden h-screen ${correctCount === null
                ? 'Bg-mid'
                : correctCount >= 3
                    ? 'Bg-mid-correct'
                    : 'Bg-mid-wrong'
                }`}>
                <div className="flex justify-end items-end text-[3vh] w-full text-white px-[3vh]" >
                    <PlayerPoint />
                </div>
                <div className="bg-gray-light rounded-2xl flex flex-col">
                    <div className="flex justify-center items-center text-3xl font-medium w-full py-5" >
                        Match the Prefix
                    </div>
                    <div>
                        <Stage
                            width={screenWidth * 0.9}
                            height={screenHeight * 0.6}
                            ref={stageRef}
                            onPointerMove={handleMove}
                            onPointerUp={() => handleEnd(null)}
                            className="w-full h-full"
                            style={{ touchAction: "none" }}
                        >

                            <Layer>
                                {scaledPoints.filter(p => Math.abs(p.y - TOPPOINT * scaleY) < 10).map((point) => (
                                    <React.Fragment key={point.id}>
                                        <Rect
                                            x={point.x - 26}
                                            y={point.y - 26}
                                            width={52}
                                            height={52}
                                            fill="#222832"
                                            cornerRadius={10}
                                        />
                                    </React.Fragment>
                                ))}

                                {lines.map((line) => (
                                    <Line
                                        key={line.start.id + "-" + line.end.id}
                                        points={[line.start.x, line.start.y, line.end.x, line.end.y]}
                                        stroke={line.isCorrect === undefined ? "#5E9CE5" : line.isCorrect ? "#31C3A4" : "#F94F58"}
                                        strokeWidth={8}
                                        lineCap="round"
                                    />
                                ))}

                                {drawing && currentLine.start && (
                                    <Line
                                        points={[currentLine.start.x, currentLine.start.y, currentLine.end.x, currentLine.end.y]}
                                        stroke="#8970F5"
                                        strokeWidth={8}
                                        // dash={[5, 5]}
                                        lineCap="round"
                                    />
                                )}

                                {scaledPoints.filter(p => Math.abs(p.y - TOPPOINT * scaleY) < 10).map((point) => (
                                    <React.Fragment key={point.id}>
                                        <Rect
                                            x={point.x - 26}
                                            y={0}
                                            width={52}
                                            height={52}
                                            // fill="#222832"
                                            cornerRadius={10}
                                        />
                                        <Text
                                            x={point.x - 26}
                                            y={0}
                                            width={52}
                                            height={52}
                                            text={point.prefixValue}
                                            fontSize={20}
                                            fill="#222832"
                                            align="center"
                                            verticalAlign="middle"
                                            listening={false} // <- disables interaction
                                        />
                                    </React.Fragment>
                                ))}

                                {/* Answer */}
                                {scaledPoints.filter(p => Math.abs(p.y - TOPPOINT * scaleY) < 10).map((point) => (
                                    <React.Fragment key={point.id}>
                                        <Rect
                                            x={point.x - 26}
                                            y={point.y - 26}
                                            width={52}
                                            height={52}
                                            // fill="black"
                                            onPointerDown={() => handleStart(point)}
                                            onPointerUp={() => handleEnd(point)}
                                            cornerRadius={10}
                                        />

                                        {showAnswers && (() => {
                                            // Find the line that this point is part of
                                            const matchedLine = lines.find(
                                                (line) => line.start.id === point.id || line.end.id === point.id
                                            );
                                            const isCorrect = matchedLine?.isCorrect;

                                            return (
                                                <React.Fragment>
                                                    <Rect
                                                        x={point.x - 26}
                                                        y={point.y - 26}
                                                        width={52}
                                                        height={52}
                                                        fill={
                                                            isCorrect === undefined
                                                                ? "#F94F58"
                                                                : isCorrect
                                                                    ? "#31C3A4"
                                                                    : "#F94F58"
                                                        }
                                                        cornerRadius={10}
                                                    />
                                                    <Text
                                                        x={point.x - 26}
                                                        y={point.y - 26}
                                                        width={52}
                                                        height={52}
                                                        text={point.prefixSymbol}
                                                        fontSize={24}
                                                        fill="white"
                                                        align="center"
                                                        verticalAlign="middle"
                                                        listening={false}
                                                    />
                                                </React.Fragment>
                                            );
                                        })()}
                                    </React.Fragment>
                                ))}

                                {/* Draw bottom points AFTER lines */}
                                {scaledPoints.filter(p => Math.abs(p.y - BOTPOINT * scaleY) < 10).map((point) => (
                                    <React.Fragment key={point.id}>
                                        <Rect
                                            x={point.x - 26}
                                            y={point.y}
                                            width={52}
                                            height={52}
                                            fill="#222832"
                                            onPointerDown={() => handleStart(point)}
                                            onPointerUp={() => handleEnd(point)}
                                            cornerRadius={10}
                                        />
                                        <Text
                                            x={point.x - 26}
                                            y={point.y}
                                            width={52}
                                            height={52}
                                            text={point.prefixSymbol}
                                            fontSize={20}
                                            fill="white"
                                            align="center"
                                            verticalAlign="middle"
                                            listening={false} // <- disables interaction
                                        />
                                    </React.Fragment>
                                ))}

                            </Layer>
                        </Stage>
                    </div>
                </div>
                <div>
                    <button
                        className={`text-5xl font-semibold py-3.5 w-[50vw] rounded-2xl transition-all duration-200
                        ${showAnswers
                                ? 'bg-gray-mid text-gray-light cursor-not-allowed'
                                : lines.length === 5
                                    ? 'bg-gray-light text-gray-mid'
                                    : 'bg-gray-light text-gray-mid opacity-50 cursor-not-allowed'
                            }`}
                        onClick={checkCorrectMatches}
                        disabled={lines.length !== 5 || showAnswers || answerSended}
                    >
                        {showAnswers ? `+${phyPoint}` ?? '0' : answerSended ? 'SENDED' : 'SEND'}
                    </button>
                </div>
                {answerSended && !showAnswers && (
                    <div className="text-xl mt-4 text-gray-light">
                        Waiting for other players to send...
                    </div>
                )}
            </div>
        </>
    );
};

export default MatchLine;
