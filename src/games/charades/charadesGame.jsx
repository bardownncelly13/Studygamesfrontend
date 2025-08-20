import GameLoader from "../../components/GameLoader";
import CharadesPlay from "./charadesLogic";
import CharadesDeckMaker from "./CharadesDeckMaker";
import { getAllCardDecks } from "./cardDecks";

export default function CharadesGame({ onBack }) {
  return (
    <GameLoader
      getAllDecks={getAllCardDecks} 
      PlayComponent={CharadesPlay}
      DeckMakerComponent={CharadesDeckMaker}
      title="Charades"
      searchPlaceholder="Search for Charades Decks to use"
      requireMotion={true}
      onBack={onBack}
    />
  );
}