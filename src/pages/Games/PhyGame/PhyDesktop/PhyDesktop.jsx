import React, { useEffect, useState } from 'react'
import knob from '../../../../assets/phyGame/knob.png'
import '../PhyDesktop/phyDesktop.css'
import PlayerList from '../../../../components/PlayerList/PlayerList'
import { useGameEngine } from '../../../../hooks/useGameEngine'
import Timer from '../../../../components/Timer/Timer'
import { Howl } from "howler";
import timeUp from '../../../../assets/Sound/timeup.wav'

const PhyDesktop = () => {

    const {
        allAnswer,
        handleTimeSend,
        TIME,
    } = useGameEngine();

    const PREFIXES = [
        { name: 'pico', symbol: 'p', value: '10⁻¹²' },
        { name: 'nano', symbol: 'n', value: '10⁻⁹' },
        { name: 'micro', symbol: 'μ', value: '10⁻⁶' },
        { name: 'milli', symbol: 'm', value: '10⁻³' },
        { name: 'centi', symbol: 'c', value: '10⁻²' },
        { name: 'deci', symbol: 'd', value: '10⁻¹' },
        { name: 'deca', symbol: 'da', value: '10¹' },
        // { name: 'hecto', symbol: 'h', value: '10²' },
        { name: 'kilo', symbol: 'k', value: '10³' },
        { name: 'mega', symbol: 'M', value: '10⁶' },
        { name: 'giga', symbol: 'G', value: '10⁹' },
        { name: 'tera', symbol: 'T', value: '10¹²' },
    ]

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
        <div className='Bg-mid h-screen justify-center items-center flex flex-col'>
            <div className='bg-gray-light w-[150vh] h-[75vh] rounded-2xl flex justify-center items-center z-1 relative'>
                <div className='bg-gray-dark w-[110vh] h-[65vh] rounded-2xl flex justify-center items-center'>
                    {allAnswer ? (
                        <div className='text-[#1EFC2D] text-center flex flex-col gap-2 items-center w-full h-full'>
                            <div className='text-[5FFvh] font-bold text-[4vh]'>
                                Correct Prefix Matches
                            </div>
                            <div className='grid grid-cols-4 gap-[2vh] w-[100vh] h-[85%]'>
                                {PREFIXES.map((prefix, index) => (
                                    <div key={index} className='flex flex-col border-2 rounded-xl px-5 justify-evenly'>
                                        <div className='text-[5vh] font-extrabold text-white drop-shadow-[0_0_2px_#1EFC2D]'>
                                            {prefix.value}
                                        </div>
                                        <div className='flex gap-3 justify-evenly items-center'>
                                            <div className='text-[4vh] font-semibold'>
                                                [ {prefix.symbol} ]</div>
                                            <div className='text-[3vh] font-semibold'>{prefix.name}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className='text-[#1EFC2D] py-40 px-20  text-[6vh]/normal text-center'>
                                Match the following metric prefixes with their corresponding powers of ten
                            </div>
                            <div className='flex flex-col gap-[5vh] absolute right-[2vh] top-3'>
                                <Timer
                                    duration={TIME.PHY}
                                    onTimeSend={(time) => {
                                        handleTimeSend(time);
                                    }}
                                    Color={"--color-pro-yellow"}
                                />
                            </div>
                        </>

                    )}
                </div>
                <div className='flex flex-col gap-[5vh] absolute right-[4vh] bottom-[6vh]'>
                    <div className='Knob'>
                        <img src={knob} className='w-[12vh] h-[12vh]' />
                    </div>
                    <div className='Knob'>
                        <img src={knob} className='w-[12vh] h-[12vh] rotate-90' />
                    </div>
                </div>
            </div>
            <div className='bg-gray-mid w-[150vh] h-[15vh] fixed bottom-0 z-0 flex justify-center' >
                <PlayerList />
            </div>
        </div>
    )
}

export default PhyDesktop