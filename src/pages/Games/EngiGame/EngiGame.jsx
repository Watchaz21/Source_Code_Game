import { isStreamScreen } from "playroomkit";
import React, { useEffect } from "react";

import EngiSteamer from "./EngiDesktop/EngiSteamer";
import EngiPlayer from "./EngiMobile/EngiPlayer";


const EngiGame = () => {
  return (
    <div className="flex flex-col  h-screen justify-center">
      <div
        className={`${isStreamScreen() ? "bg-white text-black" : "bg-gray-400  text-white"
          } text-center`}
      >
        {isStreamScreen() ? (
          <>
            <div className="">
              <EngiSteamer />
            </div>
          </>
        ) : (
          <div>
            <EngiPlayer />
          </div>
        )}
      </div>
    </div>
  );
};

export default EngiGame;
