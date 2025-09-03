import React, { useEffect, useState } from "react";
import OnOne from "../../../../assets/EngiPic/onone.png";
import OffZero from "../../../../assets/EngiPic/offzero.png";
import CorOnOne from "../../../../assets/EngiPic/correctonone.png";
import CorOffZero from "../../../../assets/EngiPic/correctoffzero.png";
import InOnOne from "../../../../assets/EngiPic/incorrectonone.png";
import InOffZero from "../../../../assets/EngiPic/incorrectoffzero.png";
import Note from "../../../../assets/EngiPic/note.png";
// import LoadingScreen from "../../../../components/LoadingScreen";
import NotePanel from "../NotePanel/NotePanel";
import "../engiGame.css";
import { useGameEngine } from "../../../../hooks/useGameEngine";
import PlayerPoint from "../../../../components/PlayerPoint/PlayerPoint";

const EngiPlayer = () => {
  const {
    players,
    me,
    setAllAnswer,
    engiGame,
    isTimeUp,
    handleRemain,
    pointCal,
    TIME,
    updatePlayerTotalScore
  } = useGameEngine();
  const [isLoading, setIsLoading] = useState(true); // กำหนดค่าเริ่มต้นของ isLoading เป็น true
  const [isAnswered, setIsAnswered] = useState(false);
  const [answerSended, setAnswerSended] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("SEND");
  const [point, setPoint] = useState(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [engiPoint, setEngiPoint] = useState(null);

  // ใช้ useEffect เพื่อซ่อนหน้าโหลดหลังจาก 3 วินาที
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false); // ซ่อนหน้าโหลดหลังจาก 1 วินาที
    }, 2000);

    return () => clearTimeout(timeout); // ล้าง timeout เมื่อคอมโพเนนต์ unmount หรือมีการ re-render
  }, []);

  // Toggle สำหรับ answerone
  const handleanswerone = () => {
    if (isAnswered) return; // ถ้า isAnswered เป็น true จะไม่สามารถกดได้
    players.forEach((player) => {
      if (player.id === me.id) {
        const currentAnswerone = player.getState("answerone") || false;
        const newAnswerone = !currentAnswerone;
        player.setState("answerone", newAnswerone);
      }
    });
  };

  // Toggle สำหรับ answertwo
  const handleanswertwo = () => {
    if (isAnswered) return; // ถ้า isAnswered เป็น true จะไม่สามารถกดได้
    players.forEach((player) => {
      if (player.id === me.id) {
        const currentAnswertwo = player.getState("answertwo") || false;
        const newAnswertwo = !currentAnswertwo;
        player.setState("answertwo", newAnswertwo);
      }
    });
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
    const allAnswered = realPlayers.every((player) => player.getState("answerSended")
    );
    if ((allAnswered && answerSended) || isTimeUp) {
      const myPlayerData = players.find((player) => player.id === me.id);
      if (!myPlayerData) return; // ป้องกัน Error

      const playerAnswerOne = myPlayerData.getState("answerone");
      const playerAnswerTwo = myPlayerData.getState("answertwo");
      const isCorrect =
        Boolean(playerAnswerOne) === Boolean(engiGame[0].c) &&
        Boolean(playerAnswerTwo) === Boolean(engiGame[0].e);

      setIsAnswerCorrect(isCorrect);
      setIsAnswered(true);
      setShowAnswers(true);
      setAllAnswer(true);
      // if (isCorrect) {
      //   setPoint(Math.round(1000 * (0.5 + 0.5 * 1)));
      // }
      // console.log(myPlayerData.state);
      // console.log("point :", point)
      console.log("Answer One:", playerAnswerOne);
      console.log("Answer Two:", playerAnswerTwo);
      console.log("Expected One (c):", engiGame[0].c);
      console.log("Expected Two (e):", engiGame[0].e);

      players.forEach((player) => {
        if (player.id === me.id) {

          const payload = {
            choice: 1,
            correct: answerSended && isCorrect ? 1 : 0,
            remainingTime: player.getState('PlayerTime'),
            totalTime: TIME.ENGI
          };

          const EngiPoint = pointCal(payload)
          setEngiPoint(EngiPoint)
          const newScore = EngiPoint + player.getState('EngiScore')
          player.setState('EngiScore', newScore)
          updatePlayerTotalScore()
        }
      })

    }
  }, [
    players.map((p) => p.getState("isPlayer") && p.getState("answerSended")).join(","),
    answerSended, isTimeUp
  ]);

  useEffect(() => {
    if (point !== null) {
      setButtonLabel(`+${point}`);
    }
  }, [point]);

  const checkCorrectlogic = () => {
    // setIsClicked(true);
    setAnswerSended(true);
    handleRemain()
  };

  useEffect(() => {
    if (isAnswered && currentScore < point) {
      const interval = setInterval(() => {
        setCurrentScore((prevScore) => {
          if (prevScore < point) {
            return prevScore + 1;
          } else {
            clearInterval(interval);
            return point;
          }
        });
      }, 1); // ค่าจังหวะในการเพิ่มคะแนน (10 ms หรือ 0.01s ต่อครั้ง)

      return () => clearInterval(interval); // ล้าง interval เมื่อมีการยกเลิกหรือเมื่อคะแนนครบ
    }
  }, [isAnswered, currentScore, point]);

  return (
    <div>
      <div
        className={`flex flex-col items-center justify-center h-screen ${isAnswerCorrect === null
          ? "Bg-mid"
          : isAnswerCorrect
            ? "Bg-mid-correct"
            : "Bg-mid-wrong"
          }`}
      >
        <div
          className={`flex flex-col justify-evenly items-center w-full h-full `}
        >
          <div className="flex justify-end items-end text-[3vh] w-full text-white px-[3vh]" >
            <PlayerPoint />
          </div>
          <div className="flex flex-col justify-around bg-gray-300 w-[40vh] h-[75vh] top-[9.48vh] rounded-2xl p-6 z-10 ">
            <div className="text-[4.5vh] text-black font-semibold text-center">
              Guess the logic in both wires.
            </div>
            <div>
              <button onClick={handleanswerone} disabled={isAnswered}>
                {players.map((player) => {
                  if (player.id === me.id) {
                    const playerAnswerOne =
                      player.getState("answerone") === true;
                    let imageSrc = playerAnswerOne ? OnOne : OffZero; // ค่าเริ่มต้น

                    if (isAnswered) {
                      if (playerAnswerOne === engiGame[0].c) {
                        imageSrc = playerAnswerOne ? CorOnOne : CorOffZero;
                      } else {
                        imageSrc = playerAnswerOne ? InOnOne : InOffZero;
                      }
                    }

                    return (
                      <img
                        key={player.id}
                        className="w-[18vh] "
                        src={imageSrc}
                        alt={`answerone - player ${player.id}`}
                      />
                    );
                  }
                })}
              </button>
            </div>
            <div>
              <button onClick={handleanswertwo} disabled={isAnswered}>
                {players.map((player) => {
                  if (player.id === me.id) {
                    const playerAnswerTwo =
                      player.getState("answertwo") === true;
                    let imageSrc = playerAnswerTwo ? OnOne : OffZero; // ค่าเริ่มต้น

                    if (isAnswered) {
                      if (playerAnswerTwo === engiGame[0].e) {
                        imageSrc = playerAnswerTwo ? CorOnOne : CorOffZero;
                      } else {
                        imageSrc = playerAnswerTwo ? InOnOne : InOffZero;
                      }
                    }

                    return (
                      <img
                        key={player.id}
                        className="w-[18vh]"
                        src={imageSrc}
                        alt={`answertwo - player ${player.id}`}
                      />
                    );
                  }
                })}
              </button>
            </div>

            <div className="">
              <button
                className={`text-5xl font-semibold py-3.5 w-[50vw] rounded-2xl transition-all duration-200
        ${isAnswered
                    ? "bg-gray-mid text-gray-light cursor-not-allowed"
                    : isAnswered  //isClicked
                      ? "bg-gray-dark text-gray-light" // ถ้ากดแล้ว เปลี่ยนสีค้าง
                      : "bg-gray-light text-gray-mid"
                  }`}
                onClick={checkCorrectlogic}
                disabled={isAnswered || showAnswers || answerSended} // ยังคุม disabled ตาม isConfirmed เหมือนเดิม
              >
                {showAnswers ? `+${engiPoint}` ?? '0' : answerSended ? 'SENDED' : 'SEND'}
              </button>
              {answerSended && !showAnswers && ( //{buttonLabel} ใส่ตรง SEND
                <div className="text-xl mt-4 text-gray-light ">
                  Waiting for other players to send...
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="bg-gray-600 w-[39.8vh] h-[20vh] flex flex-col fixed bottom-0 z-9 justify-end">
              <div className="text-[2vh] text-black  font-semibold h-1/2 NoteColor">
                You can see <br /> how the logic <br /> work here
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-[79.5vh] right-0 flex flex-col items-center text-center z-100">
          <img
            src={Note}
            alt="Note Icon"
            onClick={() => setIsNoteOpen(!isNoteOpen)}
            className="w-[13vh] h-[10vh] cursor-pointer hover:opacity-80 transition"
          />
          {/* Note Panel ที่จะ Slide ออกมา */}
          <NotePanel isOpen={isNoteOpen} setIsOpen={setIsNoteOpen} />
        </div>
        <div className=" absolute  text-black top-[36.5vh]  left-[8vh] bg-gray-400 w-[5vh] text-[5vh] z-11  rounded-[1vh] ShadowI">
          1
        </div>
        <div className=" absolute  text-black top-[53.5vh]  left-[8vh]  bg-gray-400  w-[5vh]  text-[5vh] z-11 rounded-[1vh] ShadowI ">
          2
        </div>
      </div>
    </div>
  );
};

export default EngiPlayer;
