import React, { useEffect, useState } from "react";
import knob from "../../../../assets/TechPic/knob.png";
import Chip from "../../../../assets/TechPic/chip.png";
import Keyboard from "../../../../assets/TechPic/keyboard.png";
import Google from "../../../../assets/TechPic/google.png";
import Github from "../../../../assets/TechPic/github.png";
import "../TechDesktop/TechSteamer.css";
import PlayerList from "../../../../components/PlayerList/PlayerList";
import { useGameEngine } from "../../../../hooks/useGameEngine";
import Timer from "../../../../components/Timer/Timer";
import { Howl } from "howler";
import timeUp from '../../../../assets/Sound/timeup.wav'

const TechSteamer = () => {

  const {
    allAnswer,
    handleTimeSend,
    TIME,
    techGame
  } = useGameEngine();

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
    <div className="Bg-mid h-screen justify-center items-center flex flex-col">
      <div className="bg-gray-light w-[150vh] h-[75vh] rounded-2xl flex justify-center items-center z-1 relative">
        <div className="bg-gray-dark w-[110vh] h-[65vh] rounded-2xl flex justify-center items-center">
          {allAnswer ? (

            <>
              <div className="py-20 px-10 text-center">
                {/* Main Heading */}
                <h1 className="text-[#1EFC2D] text-[4vh] font-bold mb-10">
                  Difference between Software and Hardware
                </h1>

                {/* Summary Table */}
                <div className="inline-block border border-[#1EFC2D] rounded-xl overflow-hidden mb-12">
                  <div className="grid grid-cols-2">
                    {/* Hardware Side */}
                    <div className="bg-[#1EFC2D]/20 p-8">
                      <h2 className="text-[#1EFC2D] text-[3vh] font-bold mb-4">Hardware</h2>
                      <p className="text-white text-[2.5vh]">
                        Physical components you can touch, like keyboard, monitor, CPU.
                      </p>
                    </div>

                    {/* Software Side */}
                    <div className="bg-[#1EFC2D]/10 p-8">
                      <h2 className="text-[#1EFC2D] text-[3vh] font-bold mb-4">Software</h2>
                      <p className="text-white text-[2.5vh]">
                        Programs you can't physically touch but can see or use, like apps, games, and operating systems.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Section */}
                <div className="flex justify-center gap-12">
                  {/* Hardware Image Box */}
                  <div className="flex flex-col items-center">
                    <div className="flex gap-4">
                      {/* Insert Hardware Images Here */}
                      <div className="w-40 h-40 bg-white/10 border border-[#1EFC2D] rounded-lg flex items-center justify-center">
                        <img src={Keyboard} alt="Keyboard" className="w-full h-full object-contain" />
                      </div>
                      <div className="w-40 h-40 bg-white/10 border border-[#1EFC2D] rounded-lg flex items-center justify-center">
                        <img src={Chip} alt="Keyboard" className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <p className="text-white mt-4 text-[2vh]">Hardware</p>
                  </div>

                  {/* Software Image Box */}
                  <div className="flex flex-col items-center">
                    <div className="flex gap-4">
                      {/* Insert Software Images Here */}
                      <div className="w-40 h-40 bg-white/10 border border-[#1EFC2D] rounded-lg flex items-center justify-center">
                        <img src={Google} alt="Keyboard" className="w-full h-full object-contain" />
                      </div>
                      <div className="w-40 h-40 bg-white/10 border border-[#1EFC2D] rounded-lg flex items-center justify-center">
                        <img src={Github} alt="Keyboard" className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <p className="text-white mt-4 text-[2vh]">Software</p>
                  </div>
                </div>
              </div>
            </>


          ) : (
            <>
              <div className="text-[#1EFC2D] py-40 px-20 text-[6vh] font-normal text-center">
                Which one are
                <p>
                  {techGame ? "HARDWARE" : "SOFTWARE"}
                </p>
              </div>
              <div className='flex flex-col gap-[5vh] absolute right-[2vh] top-3'>
                <Timer
                  duration={TIME.TECH}
                  onTimeSend={(time) => {
                    handleTimeSend(time);
                  }}
                  Color={"--color-pro-blue"}
                />
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-[5vh] absolute right-[4vh] bottom-[6vh]">
          <div className="Knob">
            <img src={knob} className="w-[12vh] h-[12vh]" />
          </div>
          <div className="Knob">
            <img src={knob} className="w-[12vh] h-[12vh] rotate-90" />
          </div>
        </div>
      </div>
      <div className="bg-gray-mid w-[150vh] h-[15vh] fixed bottom-0 z-0 flex justify-center">
        <PlayerList />
      </div>
    </div>
  );
};

export default TechSteamer;
