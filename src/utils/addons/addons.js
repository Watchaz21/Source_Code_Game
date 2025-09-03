export const handleTimeSend = (remainingTime, setRound, round) => {
    console.log("Time sent:", remainingTime);
    if (remainingTime === 0) {
        handleRound(setRound, round);
    }
};

export const handleRound = (setRound, round) => {
    setRound(round + 1);
    // setPhase('lobby'); // Uncomment if needed
};

export const pointCal = (choice, correct, remainingTime, totalTime) => {
    // If correct answers are 0 or remaining time is 0, return 0
    if (correct === 0 || remainingTime === 0) return 0;

    const k = 1000 / choice;  // k is calculated first
    const x = 0.5 + (0.5 * remainingTime / totalTime);  // x is calculated next
    const point = Math.round(k) * correct * x;  // Round k before multiplication

    console.log('choice =', choice);
    console.log('correct =', correct);
    console.log('remainingTime =', remainingTime);
    console.log('totalTime =', totalTime);
    console.log('k =', Math.round(k));
    console.log('x =', x);

    return Math.round(point);  // Return the point as an integer
};


