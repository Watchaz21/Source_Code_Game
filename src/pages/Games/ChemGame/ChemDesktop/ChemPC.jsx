import React, { useState, useEffect } from 'react';
import { useGameEngine } from "../../../../hooks/useGameEngine";
import Chempcanswer from "./Chempcanswer";
import PlayerList from '../../../../components/PlayerList/PlayerList';
import Timer from '../../../../components/Timer/Timer';
import { Howl } from "howler";
import timeUp from '../../../../assets/Sound/timeup.wav'

const ChemPC = () => {
  const {
    allAnswer,
    setAllAnswer,
    TIME,
    handleTimeSend,
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
    allAnswer ? (
      <Chempcanswer />
    ) : (
      <div className='Bg-light h-screen justify-center items-center flex flex-col'>
        <div className='bg-white w-[150vh] h-[75vh] top-[189px] rounded-[2vh] p-4 shadow-lg '>
          <div className='border-[0.75vh] w-full h-full rounded-[2vh] flex flex-col justify-center items-center relative'>
            <div className="text-[5vh] font-semibold">
              Match each GHS symbol to its <br />
              correct hazard category
            </div>
            <div className='flex flex-col gap-[5vh] absolute right-[2vh] top-3'>
              <Timer
                duration={TIME.CHEM}
                onTimeSend={(time) => {
                  handleTimeSend(time);
                }}
                Color={"--color-pro-purple"}
              />
            </div>
          </div>
        </div>
        <div className=' w-[150vh] h-[15vh] fixed bottom-0 z-0 flex justify-center' >
          <PlayerList />
        </div>
      </div>
    )
  );
};

export default ChemPC