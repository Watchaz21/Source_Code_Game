import Google from "../../../../assets/TechPic/google.png";
import Chip from "../../../../assets/TechPic/chip.png";
import Keyboard from "../../../../assets/TechPic/keyboard.png";
import Computer from "../../../../assets/TechPic/computer.png";
import Github from "../../../../assets/TechPic/github.png";
import Www from "../../../../assets/TechPic/www.png";
import JSLogo from "../../../../assets/TechPic/js.png";
import Mouse from "../../../../assets/TechPic/mouse.png";
import Facebook from "../../../../assets/TechPic/facebook.png";
import React, { useEffect, useState } from "react";
import "../techGame.css";
import { useGameEngine } from "../../../../hooks/useGameEngine";
import { useMultiplayerState } from "playroomkit";
import PlayerPoint from "../../../../components/PlayerPoint/PlayerPoint";
// [import และส่วนอื่นคงเดิม]

const TechPlayer = () => {
  const [shuffledButtons, setShuffledButtons] = useState([]);
  const [selectedGates, setSelectedGates] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [answerSended, setAnswerSended] = useState(false);
  const [correctCount, setCorrectCount] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [lockButtons, setLockButtons] = useState(false);
  const [shuffledButtonsShared, setShuffledButtonsShared] = useMultiplayerState("shuffledButtons", null);
  const [TechQ, setTechQ] = useMultiplayerState("TechQ", null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [techPoint, setTechPoint] = useState(null);
  const [techLoading, settechLoading] = useState(true);
  const {
    players,
    me,
    setAllAnswer,
    isTimeUp,
    handleRemain,
    pointCal,
    TIME,
    setTechGame,
    updatePlayerTotalScore
  } = useGameEngine();

  const originalButtons = [
    { name: "Google", img: Google, id: "software" },
    { name: "Keyboard", img: Keyboard, id: "hardware" },
    { name: "Chip", img: Chip, id: "hardware" },
    { name: "Computer", img: Computer, id: "hardware" },
    { name: "Www", img: Www, id: "software" },
    { name: "Js", img: JSLogo, id: "software" },
    { name: "Github", img: Github, id: "software" },
    { name: "Mouse", img: Mouse, id: "hardware" },
    { name: "Facebook", img: Facebook, id: "software" },
  ];

  const positionsWithSize = [
    { top: 30.625, left: 6 },
    { top: 30, left: 21.25 },
    { top: 30, left: 35 },
    { top: 48.75, left: 10 },
    { top: 48.75, left: 22.5 },
    { top: 48.75, left: 35 },
    { top: 66.25, left: 9.375 },
    { top: 66.25, left: 21.25 },
    { top: 66.25, left: 33.75 },
  ];

  const shuffleArray = (array) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  useEffect(() => {
    if (TechQ === 'hardware') {
      setTechGame(true);
    } else {
      setTechGame(false);
    }

    // สร้าง timeout เพื่อเปลี่ยน techLoading หลังจาก 1 วินาที
    const techTimer = setTimeout(() => {
      settechLoading(false); // ตั้งค่าการโหลดให้เป็น false หลังจาก 1 วินาที
    }, 500);

    // การทำความสะอาด (clean up) ในกรณีที่ component ถูก unmount หรือมีการอัปเดตใหม่
    return () => clearTimeout(techTimer);
  }, [TechQ]);


  useEffect(() => {
    const isHost = players[0]?.id === me.id;
    if (isHost) {
      setShuffledButtonsShared(null);
      setTechQ(null);
    }
  }, []);

  useEffect(() => {
    const isHost = players[0]?.id === me.id;

    // ตรวจสอบว่าเป็น host หรือไม่
    if (isHost) {
      if (!shuffledButtonsShared) {
        // ทำการสุ่มปุ่มก่อนการแสดงผล
        const shuffled = shuffleArray(originalButtons);
        const merged = positionsWithSize.map((pos, index) => ({
          ...shuffled[index],
          ...pos,
        }));

        // ตั้งค่า shuffledButtonsShared หลังจากสุ่มเสร็จ
        setShuffledButtonsShared(merged);
      }

      // สุ่มคำถาม (TechQ)
      if (!TechQ) {
        const randomQuestion = Math.random() < 0.5 ? "software" : "hardware";
        setTechQ(randomQuestion);
      }
    }
  }, [players, me, shuffledButtonsShared, TechQ]);

  useEffect(() => {
    if (shuffledButtonsShared) {
      setShuffledButtons(shuffledButtonsShared); // ตั้งค่า shuffledButtons หลังจากที่ได้รับ shuffledButtonsShared
    }
  }, [shuffledButtonsShared]);


  const toggleGateSelection = (name) => {
    setSelectedGates((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  useEffect(() => {
    players.forEach((player) => {
      if (player.id === me.id) {
        player.setState("answerSended", answerSended);
      }
    });
  }, [answerSended]);

  useEffect(() => {
    const realPlayers = players.filter((player) => player.getState("isPlayer"));
    const allAnswered = realPlayers.every((player) => player.getState("answerSended"));

    if ((allAnswered && answerSended) || isTimeUp) {
      const selectedCorrect = selectedGates.filter((name) => {
        const btn = originalButtons.find((b) => b.name === name);
        return btn?.id === TechQ;
      });

      const notSelectedIncorrect = originalButtons.filter((btn) => {
        return btn.id !== TechQ && !selectedGates.includes(btn.name);
      });

      // รวม 2 อย่างที่ถือว่าถูก
      const finalScore = selectedCorrect.length + notSelectedIncorrect.length;
      console.log('คะแนนรวม:', finalScore);
      setCorrectCount(finalScore);
      setAllAnswer(true);
      setShowAnswers(true);
      setIsConfirmed(true);
      // const calfinalScore = Math.round(finalScore * (1000 / 9) * (0.5 + 0.5 * 1));
      // console.log('คะแนนรวม:', calfinalScore);
      // setCalFinalScore(calfinalScore);

      players.forEach((player) => {
        if (player.id === me.id) {

          const payload = {
            choice: 9,
            correct: answerSended ? finalScore : 0,
            remainingTime: player.getState('PlayerTime'),
            totalTime: TIME.TECH
          };

          const TechPoint = pointCal(payload)
          setTechPoint(TechPoint)
          const newScore = TechPoint + player.getState('TechScore')
          player.setState('TechScore', newScore)
          updatePlayerTotalScore()

        }
      });

    }
  }, [
    players
      .map((p) => p.getState("isPlayer") && p.getState("answerSended"))
      .join(","),
    answerSended, isTimeUp
  ]);

  const checkCorrectlogic = () => {
    // setIsClicked(true);
    setLockButtons(true);
    setAnswerSended(true);
    handleRemain()
  };


  return (
    <div
      className={`flex flex-col items-center justify-evenly h-screen ${correctCount === null
        ? "Bg-mid"
        : correctCount >= 7
          ? "Bg-mid-correct"
          : "Bg-mid-wrong"
        }`}
    >
      <div className="flex justify-end items-end text-[3vh] w-full text-white px-[3vh]" >
        <PlayerPoint />
      </div>
      <div className={"flex flex-col justify-center items-center"}>
        <div className="flex flex-col bg-gray-300 w-[40vh] h-[75vh] rounded-2xl relative p-5 gap-5">
          {techLoading ? (
            <div className="text-[2.5vh] text-black font-semibold text-center">
              Choose the one that are{" "}
              {/* <span className="uppercase">{TechQ}</span> */}
            </div>
          ) : (<div className="text-[2.5vh] text-black font-semibold text-center">
            Choose the one that are{" "}
            <span className="uppercase">{TechQ}</span>
          </div>)}
          {techLoading ? (
            <div className="h-[80vh] w-full rounded-2xl bg-gray-mid Shadow flex justify-center items-center">
            <div className="flex justify-center items-center h-full w-full">
              <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            </div>
            </div>
          ) : (
            <div className="h-[80vh] w-full rounded-2xl bg-gray-mid Shadow flex justify-center items-center">
              <div className="grid grid-cols-3 gap-0">
                {shuffledButtons.map((button, index) => {
                  const row = Math.floor(index / 3);
                  const col = index % 3;

                  const borderClass = `
                  ${row < 2 ? "border-b-3 " : ""} 
                  ${col < 2 ? "border-r-3" : ""} 
                  border-[#1EFC2D]`;

                  const isSelected = selectedGates.includes(button.name);

                  const isCorrect =
                    isConfirmed &&
                    ((isSelected && button.id === TechQ) ||
                      (!isSelected && button.id !== TechQ));

                  const isIncorrect =
                    isConfirmed &&
                    ((isSelected && button.id !== TechQ) ||
                      (!isSelected && button.id === TechQ));

                  return (
                    <button
                      key={button.name}
                      onClick={() => {
                        if (!lockButtons && !isConfirmed) {
                          toggleGateSelection(button.name);
                        }
                      }}
                      className={`relative p-4 pt-10 pb-10 focus:outline-none ${borderClass} ${isConfirmed ? "cursor-default" : "cursor-pointer"
                        } ${isSelected ? "bg-pro-blue " : ""} ${isCorrect ? "bg-pro-green" : isIncorrect ? "bg-pro-red" : ""}`}
                    >
                      <img
                        src={button.img}
                        alt={button.name}
                        className={`w-[8vh] h-[8vh] rounded-lg transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-50"
                          } ${isConfirmed ? "opacity-30" : ""} hover:opacity-70`}
                      />

                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="">
        <button
          className={`text-5xl font-semibold py-3.5 w-[50vw] rounded-2xl transition-all duration-200
        ${isConfirmed
              ? "bg-gray-mid text-gray-light cursor-not-allowed"
              : isClicked
                ? "bg-gray-dark text-gray-light" // ถ้ากดแล้ว เปลี่ยนสีค้าง
                : "bg-gray-light text-gray-mid"
            }`}
          onClick={checkCorrectlogic}
          disabled={isConfirmed || showAnswers || answerSended || techLoading} // ยังคุม disabled ตาม isConfirmed เหมือนเดิม
        >
          {showAnswers ? `+${techPoint}` ?? '0' : answerSended ? 'SENDED' : 'SEND'}
        </button>
      </div>
      {answerSended && !isConfirmed && (
        <div className="text-xl mt-4 text-gray-light">
          Waiting for other players to send...
        </div>
      )}
    </div>
  );
};

export default TechPlayer;

