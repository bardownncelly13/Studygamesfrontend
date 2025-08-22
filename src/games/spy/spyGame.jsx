import GameLoader from "../../components/GameLoader";
import SpyDeckMaker from "./SpyDeckMaker.jsx";
import { getAllCardDecks } from "./cardDecks";
import SpyLobby from "./SpyLobby.jsx";


export default function spyGame({ onBack }) {
  return (
    <GameLoader
      getAllDecks={getAllCardDecks} 
      PlayComponent={SpyLobby}
      DeckMakerComponent={SpyDeckMaker}
      title="Spy"
      searchPlaceholder="Search for Spy Decks to use"
      requireMotion={false}
      onBack={onBack}
    />
  );
}