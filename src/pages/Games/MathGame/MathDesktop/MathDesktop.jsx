import React, { useEffect, useState } from 'react';
import PCImage from '/src/assets/MathPic/PC.png';
import "../mathGame.css";
import PlayerList from '../../../../components/PlayerList/PlayerList';
import Timer from '../../../../components/Timer/Timer';
import { useGameEngine } from '../../../../hooks/useGameEngine';
import Mathanswer from './Mathanswer';
import { Howl } from "howler";
import timeUp from '../../../../assets/Sound/timeup.wav'

function MathDesktop() {
  // ขนาด SVG และวงกลม
  const size = 400;
  const center = size / 2;
  const radius = 165;
  const arrow = 30;

  const {
    TIME,
    handleTimeSend,
    allAnswer
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
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-default">
        {allAnswer ? (
          <Mathanswer />
        ) : (
          <>
            <div className="relative w-full flex justify-center px-4">
              <img
                src={PCImage}
                alt="PC Frame"
                className="w-full max-w-[1328px] h-auto object-contain"
              />
              <div className='flex flex-col gap-[5vh] absolute right-[24vh] top-3'>
                <Timer
                  duration={TIME.MATH}
                  onTimeSend={(time) => {
                    handleTimeSend(time);
                  }}
                  Color={"--color-pro-pink"}
                />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="-mt-30 text-3xl md:text-4xl font-bold text-gray-800 text-center drop-shadow-md select-none">
                  Find the correct quadrant<br />of the circle
                </div>
                {/* SVG วงกลม + แกน XY + ลูกศร + หมายเลขควอแดรนท์ */}
                <svg
                  width={size}
                  height={size}
                  viewBox={`0 0 ${size} ${size}`}
                  className="mt-10"
                >
                  {/* วงกลม */}
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="black"
                    strokeWidth={2}
                  />
                  {/* หมายเลข Quadrant */}
                  <text
                    x={center + radius / 2}
                    y={center - radius / 2}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="25"
                    fontWeight="bold"
                    fill="#2942ff"
                  >
                    Q1
                  </text>
                  <text
                    x={center - radius / 2}
                    y={center - radius / 2}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="25"
                    fontWeight="bold"
                    fill="#13ba7c"
                  >
                    Q2
                  </text>
                  <text
                    x={center - radius / 2}
                    y={center + radius / 2}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="25"
                    fontWeight="bold"
                    fill="#ffbe25"
                  >
                    Q3
                  </text>
                  <text
                    x={center + radius / 2}
                    y={center + radius / 2}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="25"
                    fontWeight="bold"
                    fill="#e23b52"
                  >
                    Q4
                  </text>
                  {/* แกน X */}
                  <line
                    x1={center - radius - arrow}
                    y1={center}
                    x2={center + radius + arrow}
                    y2={center}
                    stroke="black"
                    strokeWidth={2}
                    markerEnd="url(#arrowhead)"             // ขวา (x+)
                    markerStart="url(#arrowhead-reverse)"   // ซ้าย (x-)
                  />
                  {/* แกน Y */}
                  <line
                    x1={center}
                    y1={center + radius + arrow}
                    x2={center}
                    y2={center - radius - arrow}
                    stroke="black"
                    strokeWidth={2}
                    markerEnd="url(#arrowhead)"             // บน (y+)
                    markerStart="url(#arrowhead-reverse)"   // ล่าง (y-)
                  />
                  {/* Marker ลูกศร */}
                  <defs>
                    {/* หัวลูกศรปกติ */}
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="10"
                      refY="5"
                      orient="auto"
                    >
                      <polygon points="0,2.5 10,5 0,7.5" fill="black" />
                    </marker>
                    {/* หัวลูกศร reverse (กลับหัว) */}
                    <marker
                      id="arrowhead-reverse"
                      markerWidth="10"
                      markerHeight="10"
                      refX="0"
                      refY="5"
                      orient="auto"
                    >
                      <polygon points="10,2.5 0,5 10,7.5" fill="black" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>
          </>
        )}
        <div className=' w-[150vh] h-[15vh] fixed bottom-0 z-0 flex justify-center' >
          <PlayerList />
        </div>
      </div>
    </>
  );
}

export default MathDesktop;
