import { insertCoin, isStreamScreen, usePlayersList ,useMultiplayerState} from "playroomkit";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TechSteamer from "./TechDesktop/TechSteamer";
import TechPlayer from "./TechMobile/TechPlayer";
const TechGame = () => {

  return (
    <div className="flex flex-col  h-screen justify-center">
      <div
        className={`${
          isStreamScreen() ? "bg-white text-black" : "bg-gray-400  text-white"
        } text-center`}
      >
        {isStreamScreen() ? (
          <>
            <div className="">
              <TechSteamer />
            </div>
          </>
        ) : (
          <div>
            {/* <Setgame /> */}
            <TechPlayer />
          </div>
        )}
      </div>
    </div>
  );
};

export default TechGame;
