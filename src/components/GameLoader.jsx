import { useState, useEffect } from "react";
import Search from "./search";
import LoginModal from './LoginModal';
import LoginButton from "./loginbutton";
import { useAuth } from "../context/Authcontext";
import Adddeck from "./addDeck";
import DeckCard from "./deckCard"
import { deleteDeck } from "./deleteDeck";

function searchbyName(searchTerm, cardDecks){ 
    return cardDecks
    .filter(deck => deck.name.toLowerCase().includes(searchTerm.toLowerCase())) 
    .sort((a , b) => { 
      const indexa = a.name.toLowerCase().indexOf(searchTerm.toLowerCase())  
      const indexb = b.name.toLowerCase().indexOf(searchTerm.toLowerCase())
      
      if(indexa < indexb ) return -1;
      if(indexb > indexa ) return 1;
      
      return a.name.localeCompare(b.name);
    });
  }


export default function GameLoader({
  getAllDecks,
  PlayComponent,
  DeckMakerComponent,
  title,
  searchPlaceholder,
  onBack,
}) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDeck, setCurrentDeck] = useState(null);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [deckMaker, setDeckMaker] = useState(false);
  const [cardDecks, setCardDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const filteredDecks = searchbyName(searchTerm, cardDecks);

  async function handleDelete(deckId) {
    const confirmDelete = window.confirm("Are you sure you want to delete this deck?");
      if (!confirmDelete) {
        return; 
      }
    const { error } = await deleteDeck(deckId);
    if (error) {
      alert("Failed to delete deck: Default decks cannot be removed ");
    } else {
      alert("Deck deleted successfully!");
      setCardDecks((prevDecks) => prevDecks.filter((deck) => deck.id !== deckId));

      if (selectedDeck === deckId) {
        setSelectedDeck(null);
      } 
    }
  }

  useEffect(() => {
    if (user) setShowLoginModal(false);
  }, [user]);

  useEffect(() => {
    async function loadDecks() {
      const allDecks = await getAllDecks();
      setCardDecks(allDecks);
      setLoading(false);
    }
    loadDecks();
  }, [getAllDecks]);

  if (deckMaker && DeckMakerComponent) {
    return <DeckMakerComponent onBack={() => setDeckMaker(false)} />;
  }

  if (currentDeck) {
    return (
      <PlayComponent
        deck={currentDeck}
        onBack={() => setCurrentDeck(null)}
      />
    );
  }

  return (
    <main>
      <div className="p-4 flex justify-between items-center relative z-1">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-light-100/10 text-white hover:bg-light-100/20 transition-colors"
        >
          ← Back to Games
        </button>
        <LoginButton onLoginClick={() => setShowLoginModal(true)} />
      </div>

      <div className="pattern" />
      <div className="wrapper">
        <header>
          <h1>
            <span className="text-gradient">{title}</span>
          </h1>
          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder={searchPlaceholder}
          />
        </header>

        <section className="p-6 all-games">
          <h2>Select a Deck</h2>
          <ul>
            {filteredDecks.length > 0 && filteredDecks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onClick={() => setSelectedDeck(deck.id)}
                isSelected={deck.id === selectedDeck}
                playDeck={() => setCurrentDeck(deck)}
                onDelete={() => handleDelete(deck.id)}
              />
            ))}
            {Adddeck && (
              <Adddeck
                onClick={() => {
                  setSelectedDeck("deckMaker");
                  if (typeof Adddeck === "function") Adddeck();
                }}
                isSelected={"deckMaker" === selectedDeck}
                button={() => setDeckMaker(true)}
              />
            )}
          </ul>
        </section>
      </div>

      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </main>
  );
}
