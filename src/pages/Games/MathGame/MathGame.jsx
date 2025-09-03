import {
    insertCoin,
    isStreamScreen,
    usePlayersList,
  } from "playroomkit";
  import React, { useEffect } from "react";
  import { useNavigate } from "react-router-dom";


  import MathDesktop from "./MathDesktop/MathDesktop";
  import MathMobile from "./MathMobile/MathMobile";

  import Mathanswer from "./MathDesktop/Mathanswer";
  


  const MathGame = () => {
    const playersList = usePlayersList(); 



    
    return (
      <div>
          {isStreamScreen() ? (
            <MathDesktop players={playersList} />
          ) : (
            <MathMobile players={playersList} />
          )}
      </div>
    );
};
  export default MathGame;
  