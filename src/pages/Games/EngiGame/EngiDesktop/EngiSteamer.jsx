import React, { useEffect, useState } from "react";
import SwOn from "../../../../assets/EngiPic/swon.png";
import SwOff from "../../../../assets/EngiPic/swoff.png";
import And from "../../../../assets/EngiPic/and.png";
import Or from "../../../../assets/EngiPic/or.png";
import Xor from "../../../../assets/EngiPic/xor.png";
import Line from "../../../../assets/EngiPic/Group 74.png";
import "../../../../components/Timer/Timer";
import PlayerList from "../../../../components/PlayerList/PlayerList";
import { useGameEngine } from "../../../../hooks/useGameEngine";
import EngiTeach from "./EngiTeach";
import Timer from "../../../../components/Timer/Timer";
import { Howl } from "howler";
import timeUp from '../../../../assets/Sound/timeup.wav'

const EngiSteamer = () => {
  const {
    allAnswer,
    engiGame,
    setEngiGame,
    handleTimeSend,
    TIME,
  } = useGameEngine();
  const AND = "AND",
    OR = "OR",
    XOR = "XOR";
  const gates = [AND, OR, XOR];

  const calculateGate = (gate, x, y) => {
    if (gate === AND) return x && y;
    if (gate === OR) return x || y;
    if (gate === XOR) return x !== y;
    //console.log(`Calculating ${gate}: ${x}, ${y}`);
    return null;
  };

  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [d, setD] = useState("");


  const [randomGate1, setRandomGate1] = useState('');
  const [randomGate2, setRandomGate2] = useState('');
  const [isTeach, setIsTeach] = useState(false);

  // เมื่อเปลี่ยนหน้าจอ ให้สุ่มค่าทั้งหมดใหม่
  useEffect(() => {
    const newA = Math.random() < 0.5;
    const newB = Math.random() < 0.5;
    const newD = Math.random() < 0.5;
    const newGate1 = gates[Math.floor(Math.random() * gates.length)];
    const newGate2 = gates[Math.floor(Math.random() * gates.length)];

    //console.log("🔄 Resetting values...");
    //console.log(`A: ${newA}, B: ${newB}, D: ${newD}`);
    //console.log(`Gate 1: ${newGate1}, Gate 2: ${newGate2}`);

    setA(newA);
    setB(newB);
    setD(newD);
    setRandomGate1(newGate1);
    setRandomGate2(newGate2);
  }, []);

  useEffect(() => {
    if (randomGate1 && randomGate2 && typeof a === "boolean" && typeof b === "boolean" && typeof d === "boolean") {
      const newC = calculateGate(randomGate1, a, b);
      const newE = calculateGate(randomGate2, newC, d);

      setEngiGame([{ c: newC, e: newE }]);

      console.log(`a ${randomGate1} b ==> ${a} ${randomGate1} ${b} ==> ${engiGame[0].c} | C`);
      console.log(`C ${randomGate2} d ==> ${newC} ${randomGate2} ${d} ==> ${engiGame[0].e} | E`);
    }
  }, [a, b, d, randomGate1, randomGate2]);


  // ฟังก์ชันสำหรับเลือกภาพ
  const getImage = (value) => (value ? SwOn : SwOff);
  const getGateImage = (gate) => {
    if (gate === AND) return And;
    if (gate === OR) return Or;
    if (gate === XOR) return Xor;
  };

  useEffect(() => {
    if (allAnswer) {
      const timer = setTimeout(() => {
        setIsTeach(true); // ✅ หลัง 20 วิ
      }, 5000);

      return () => clearTimeout(timer); // cleanup ถ้า unmount
    }
  }, [allAnswer]);

  const [timeUpSound, setTimeUpSound] = useState(null);
  // Initialize sound only once
  useEffect(() => {
    const timeupSFX = new Howl({
      src: [timeUp], // Make sure this file exists in your public folder or import a sound asset.
      loop: false,
      rate: 1.0, // default speed
      volume: 0.5,
    });
    setTimeUpSound(timeupSFX);

    return () => {
      timeupSFX.stop();
    }; // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (!timeUpSound) return;

    if (allAnswer) {
      timeUpSound.play();
    } else {
      timeUpSound.stop();
    }
  }, [allAnswer, timeUpSound]);

  return (
    <>
      {isTeach ? (<EngiTeach />) : (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-200 EngiContainer">
          <div className="flex flex-col bg-gray-300 z-20 w-[150vh] h-[75vh] rounded-[1vh]  p-6 EngiBox  ">
            <div className="flex flex-col justify-center items-center relative">
              {allAnswer ? (
                <>
                  <div className="flex flex-col" >
                    <div className="text-[5vh]">
                      Answer
                    </div>
                    <div>
                      <div className="absolute top-[20vh] left-[20vh]">
                        <img src={Line} className="h-[25vh]" />
                      </div>
                      <div className="absolute top-[45vh] left-[14.6vh]">
                        <img
                          src={getImage(a)}
                          alt="a"
                          className="h-[18vh]"
                        />
                      </div>
                      <div className="absolute top-[45vh] left-[28.9vh]">
                        <img
                          src={getImage(b)}
                          alt="b"
                          className="h-[18vh]"
                        />
                      </div>
                      <div className="absolute top-[17.6vh] left-[38vh]">
                        <img
                          src={getGateImage(randomGate1)}
                          alt="gate"
                          className="h-[11vh]"
                        />
                      </div>
                      <div className="absolute top-[45vh] left-[64.3vh]">
                        <img
                          src={getImage(d)}
                          alt="b"
                          className="h-[18vh]"
                        />
                      </div>
                      <div className="absolute top-[20.5vh] left-[75vh]">
                        <img
                          src={getGateImage(randomGate2)}
                          alt="gate"
                          className="h-[11vh]"
                        />
                      </div>
                      <div className="absolute top-[32vh] left-[112vh]">
                        <div className={`h-[12vh] w-[12vh]  ${engiGame[0]?.e ? "LightOn" : "LightOff"} flex items-center justify-center cursor-default`} />

                      </div>
                      <div className="absolute top-[21vh] left-[56vh] ">
                        <div className="relative">
                          {/* วางข้อความ <p> ทับในกรอบ */}
                          <p className="absolute text-white top-[-10vh] left-[7.5vh] w-[7vh] text-[5.5vh] bg-gray-500 rounded-[1vh] ShadowI">
                            {engiGame[0]?.c ? '1' : '0'}
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-[21vh] left-[49.5vh] ">
                        <div className="relative">
                          {/* วางข้อความ <p> ทับในกรอบ */}
                          <p className="absolute top-[-10vh] left-[7.5vh] w-[7vh] text-[5.5vh]  ">
                            1:
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-[30vh] left-[107vh] ">
                        <div className="relative">
                          {/* วางข้อความ <p> ทับในกรอบ */}
                          <p className="absolute text-white top-[-10vh] left-[7.5vh] w-[7vh] text-[5.5vh] bg-gray-500 rounded-[1vh] ShadowI ">
                            {engiGame[0]?.e ? '1' : '0'}
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-[29vh] left-[100vh] ">
                        <div className="relative">
                          {/* วางข้อความ <p> ทับในกรอบ */}
                          <p className="absolute top-[-9vh] left-[7.5vh] w-[7vh] text-[5.5vh]  ">
                            2:
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col" >
                    <div className="text-[5vh]">
                      Q: Can you guess the logic of both wires?
                    </div>
                    <div>
                      <div className="absolute top-[20vh] left-[20vh]">
                        <img src={Line} className="h-[25vh]" />
                      </div>
                      <div className="absolute top-[45vh] left-[14.6vh]">
                        <img
                          src={getImage(a)}
                          alt="a"
                          className="h-[18vh]"
                        />
                      </div>
                      <div className="absolute top-[45vh] left-[28.9vh]">
                        <img
                          src={getImage(b)}
                          alt="b"
                          className="h-[18vh]"
                        />
                      </div>
                      <div className="absolute top-[17.6vh] left-[38vh]">
                        <img
                          src={getGateImage(randomGate1)}
                          alt="gate"
                          className="h-[11vh]"
                        />
                      </div>
                      <div className="absolute top-[45vh] left-[64.3vh]">
                        <img
                          src={getImage(d)}
                          alt="b"
                          className="h-[18vh]"
                        />
                      </div>
                      <div className="absolute top-[20.5vh] left-[75vh]">
                        <img
                          src={getGateImage(randomGate2)}
                          alt="gate"
                          className="h-[11vh]"
                        />
                      </div>
                      <div className="absolute top-[32vh] left-[112vh]">
                        <div className={`h-[12vh] w-[12vh] LightOff flex items-center justify-center cursor-default text-[6vh]`} >
                          ?
                        </div>
                      </div>
                      <div className="absolute top-[21vh] left-[56vh] ">
                        <div className="relative">
                          {/* วางข้อความ <p> ทับในกรอบ */}
                          <p className="absolute text-white top-[-10vh] left-[7.5vh] w-[7vh] text-[5.5vh] bg-gray-500 rounded-[1vh] ShadowI">
                            ?
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-[21vh] left-[49.5vh] ">
                        <div className="relative">
                          {/* วางข้อความ <p> ทับในกรอบ */}
                          <p className="absolute top-[-10vh] left-[7.5vh] w-[7vh] text-[5.5vh]  ">
                            1:
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-[30vh] left-[107vh] ">
                        <div className="relative">
                          {/* วางข้อความ <p> ทับในกรอบ */}
                          <p className="absolute text-white top-[-10vh] left-[7.5vh] w-[7vh] text-[5.5vh] bg-gray-500 rounded-[1vh] ShadowI ">
                            ?
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-[29vh] left-[100vh] ">
                        <div className="relative">
                          {/* วางข้อความ <p> ทับในกรอบ */}
                          <p className="absolute top-[-9vh] left-[7.5vh] w-[7vh] text-[5.5vh]  ">
                            2:
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col gap-[5vh] absolute right-[2vh] top-3'>
                    <Timer
                      duration={TIME.ENGI}
                      onTimeSend={(time) => {
                        handleTimeSend(time);
                      }}
                      Color={"--color-pro-orange"}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="bg-gray-mid w-[150vh] h-[15vh] fixed bottom-0 z-0 flex justify-center">
            <PlayerList />
          </div>
        </div>
      )}
    </>
  );
};

export default EngiSteamer;
