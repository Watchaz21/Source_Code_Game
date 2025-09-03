import React from 'react'
import knob from "../../../../assets/TechPic/knob.png";
import And from "../../../../assets/EngiPic/and.png";
import Or from "../../../../assets/EngiPic/or.png";
import Xor from "../../../../assets/EngiPic/xor.png";
import "../../TechGame/TechDesktop/TechSteamer.css";
import PlayerList from '../../../../components/PlayerList/PlayerList';
const EngiTeach = () => {
    return (

        <div className="Bg-mid h-screen justify-center items-center flex flex-col">
            <div className="bg-gray-light w-[150vh] h-[75vh] rounded-2xl flex justify-center items-center z-1 relative">
                <div className="bg-gray-dark w-[110vh] h-[65vh] rounded-2xl flex justify-center items-center ">
                    <div className=" text-center w-[95%] flex flex-col gap-5">
                        {/* Main Heading */}
                        <h1 className="text-[#1EFC2D] text-[4vh] font-bold ">
                            Difference between AND, OR, and XOR Operations
                        </h1>

                        {/* Combined Grid */}
                        <div className="inline-block border border-[#1EFC2D] rounded-xl overflow-hidden">
                            <div className="grid grid-cols-3 gap-8">
                                {/* AND Column */}
                                <div className="bg-[#1EFC2D]/20 p-5 flex flex-col items-center text-center h-full justify-between gap-3">
                                    <h2 className="text-[#1EFC2D] text-[3vh] font-bold ">AND</h2>
                                    <p className="text-white text-[2.5vh] ">
                                        Returns true only if both operands are true.
                                    </p>
                                    <div className="w-40 h-40 bg-white/10 border border-[#1EFC2D] rounded-lg flex items-center justify-center ">
                                        <img src={And} alt="AND" className="w-full h-full object-contain" />
                                    </div>
                                    <p className="text-white text-[2vh]">AND Gate</p>
                                </div>

                                {/* OR Column */}
                                <div className="bg-[#1EFC2D]/10 p-5 flex flex-col items-center text-center h-full justify-between gap-3">
                                    <h2 className="text-[#1EFC2D] text-[3vh] font-bold ">OR</h2>
                                    <p className="text-white text-[2.5vh] ">
                                        Returns true if at least one operand is true.
                                    </p>
                                    <div className="w-40 h-40 bg-white/10 border border-[#1EFC2D] rounded-lg flex items-center justify-center">
                                        <img src={Or} alt="OR" className="w-full h-full object-contain" />
                                    </div>
                                    <p className="text-white text-[2vh]">OR Gate</p>
                                </div>

                                {/* XOR Column */}
                                <div className="bg-[#1EFC2D]/5 p-5 flex flex-col gap-3 items-center text-center h-full justify-between">
                                    <h2 className="text-[#1EFC2D] text-[3vh] font-bold">XOR</h2>
                                    <p className="text-white text-[2.3vh]">
                                        Returns true if one, and only one, operand is true.
                                    </p>
                                    <div className="w-40 h-40 bg-white/10 border border-[#1EFC2D] rounded-lg flex items-center justify-center">
                                        <img src={Xor} alt="XOR" className="w-full h-full object-contain" />
                                    </div>
                                    <p className="text-white text-[2vh]">XOR Gate</p>
                                </div>
                            </div>
                        </div>
                    </div>
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

    )
}

export default EngiTeach