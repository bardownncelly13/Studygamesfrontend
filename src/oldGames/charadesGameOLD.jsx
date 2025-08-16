import { useState, useEffect } from "react" //imports
import Search from "../../components/search";
import DeckCard from "../../components/deckCard"
import { getAllCardDecks } from "./cardDecks"
import CharadesPlay from "./charadesLogic";
import Adddeck from "../../components/addDeck";
import CharadesDeckMaker from "./charadesDeckMaker";
import LoginModal from '../../components/LoginModal'
import LoginButton from "../../components/loginbutton"
import { useAuth } from "../../context/Authcontext"

function searchbyName(searchTerm, cardDecks){ //seaching functionality 
    return cardDecks
    .filter(deck => deck.name.toLowerCase().includes(searchTerm.toLowerCase())) //filter for if the letter is included 
    .sort((a , b) => { //sort by first time the seachterm is found in the word
      const indexa = a.name.toLowerCase().indexOf(searchTerm.toLowerCase())  
      const indexb = b.name.toLowerCase().indexOf(searchTerm.toLowerCase())
      
      if(indexa < indexb ) return -1;
      if(indexb > indexa ) return 1;
      
      return a.name.localeCompare(b.name);
    });
  }

export default function CharadesGame({ onBack }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("") //for the serching feature
  const [currentDeck, setCurrentDeck] = useState(null) //for using a deck
  const [selectedDeck, setSelectedDeck] = useState(null) //for highlighting card
  const [deckMaker, setDeckMaker] = useState(false)
  const [cardDecks, setCardDecks] = useState([]) //for an array of all decks
  const [loading, setLoading] = useState(true)
  const filteredDecks = searchbyName(searchTerm, cardDecks);

  const { user , logout } = useAuth();

  useEffect(() => { //takes away login screen when logged in
    if (user) {
      setShowLoginModal(false);
    }
  }, [user]);
   
  const playDeck = (deck) =>{
    setCurrentDeck(deck);
  }
 
  useEffect(() => { //fecthing the decks from db and cardDecks
    async function loadDecks() {
      const decks = await getAllCardDecks();
      setCardDecks(decks);
      setLoading(false);
    }
    loadDecks();
  }, []);


  if(deckMaker){//for going to make your own decks
    return(
      <CharadesDeckMaker onBack={() => setDeckMaker(false)}/>
    );
  }

  if (currentDeck) { //for playing the current deck
    return (
      <CharadesPlay
        deck={currentDeck}
        onBack={() => setCurrentDeck(null)} // Back to deck selection
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
           
            Pick a <span className="text-gradient">Deck </span>For Charades 
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={"Seach for Charades Decks to use"}/>
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
                playDeck={() => playDeck(deck)}
              />
            ))}
            <Adddeck
             onClick={() => {
              setSelectedDeck("deckMaker");
             }}
             isSelected={"deckMaker" === selectedDeck}
             button={() => setDeckMaker(true)}
             
            />
          </ul>
          
        </section> 
          
      </div>
      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </main>

  );
}
