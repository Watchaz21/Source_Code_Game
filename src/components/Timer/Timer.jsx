import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGameEngine } from "../../hooks/useGameEngine";
import { Howl } from "howler";
import tick from '../../assets/Sound/timer.wav'

const Timer = ({ duration = 10, sizeVH = 15, onTimeSend, Color }) => {

    const { time, setTime } = useGameEngine();
    const [sizePx, setSizePx] = useState(0);
    const [timeSound, setTimeSound] = useState(null);

    useEffect(() => {
        setTime(duration);
    }, []);

    // Initialize sound only once
    useEffect(() => {
        const timerSFX = new Howl({
            src: [tick], // Make sure this file exists in your public folder or import a sound asset.
            loop: true,
            rate: 1.0, // default speed
            volume: 1,
        });

        setTimeSound(timerSFX);
        timerSFX.play();

        return () => {
            timerSFX.stop();
        }; // Cleanup on unmount
    }, [duration]);

    useEffect(() => {
        const updateSize = () => {
            setSizePx((window.innerHeight * sizeVH) / 100);
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const size = typeof window !== 'undefined' ? (window.innerHeight * sizeVH) / 100 : 0;

    const progress = 1 - time / duration;
    const angle = progress * 360;
    const largeArcFlag = angle > 180 ? 1 : 0;

    const x = sizePx / 2 + (sizePx / 2 - 10) * Math.sin((angle * Math.PI) / 180);
    const y = sizePx / 2 - (sizePx / 2 - 10) * Math.cos((angle * Math.PI) / 180);

    const path =
        progress === 0
            ? ""
            : progress === 1
                ? `M ${sizePx / 2} ${sizePx / 2 - (sizePx / 2 - 10)} A ${(sizePx / 2) - 10} ${(sizePx / 2) - 10} 0 1 1 ${sizePx / 2 - 0.01} ${sizePx / 2 - (sizePx / 2 - 10)} Z`
                : `M ${sizePx / 2} ${sizePx / 2} L ${sizePx / 2} ${sizePx / 2 - (sizePx / 2 - 10)} A ${(sizePx / 2) - 10} ${(sizePx / 2) - 10} 0 ${largeArcFlag} 1 ${x} ${y} Z`;

    useEffect(() => {
        if (!timeSound) return;// Don't run until sound is ready

        if (onTimeSend) {
            onTimeSend(time); // Send the time every second
        }

        if (time <= 10) {
            timeSound.rate(2); // Speed up the ticking sound
        }
        else{
             timeSound.rate(1);
        }

        if (time > 0) {
            const timer = setTimeout(() => setTime(time - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            timeSound.stop();
        }
    }, [time, timeSound]);

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative">
                {/* SVG Pie Timer */}
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Background Circle */}
                    <circle cx={size / 2} cy={size / 2} r={(size / 2) - 10} style={{ fill: `var(${Color})` }} />
                    {/* Animated Pie Slice */}
                    <motion.path
                        d={path}
                        fill="lightgray"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            duration: 0.5,
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                        }}
                    />
                </svg>
                {/* Centered Text with Remaining Time */}
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                    <p className="text-3xl font-bold">{time}s</p>
                </div>
            </div>
        </div>
    );
};

export default Timer;
