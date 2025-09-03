import {
  isStreamScreen,
} from "playroomkit";

import ChemPC from "./ChemDesktop/ChemPC";
import ChemMobile from "./ChemMobile/ChemMobile";


const ChemGame = () => {

  return (
    <div>
      {isStreamScreen() ? (
        <ChemPC />
      ) : (
        <ChemMobile />
      )}
    </div>
  );
};
export default ChemGame;
