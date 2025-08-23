import GameLoader from "../../components/GameLoader";
import TODDeckMaker from "./TODDeckMaker.jsx";
import { getAllCardDecks } from "./cardDecks";
import SpyLobby from "./TruthOrDareLobby.jsx";


export default function TruthOrDareGame({ onBack }) {
  return (
    <GameLoader
      getAllDecks={getAllCardDecks} 
      PlayComponent={SpyLobby}
      DeckMakerComponent={TODDeckMaker}
      title="Truth Or Dare"
      searchPlaceholder="Search for Truth Or Dare Decks to use"
      onBack={onBack}
    />
  );
}