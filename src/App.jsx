import { Suspense, useState, useEffect } from "react" //imports
import React from "react"
import Search from "./components/search"
import GameCard from "./components/GameCard"
import { gamelist } from "./data/games"
import { AuthProvider, useAuth } from "./context/Authcontext"
import LoginModal from './components/LoginModal'
import LoginButton from "./components/loginbutton"
import { Routes, Route } from "react-router-dom"
import SpyPlay from "./games/spy/SpyPlay.jsx";
import { motion, AnimatePresence } from "framer-motion";

function searchbytitle(searchTerm){ //seaching functionality 
    return gamelist
    .filter(game => game.title.toLowerCase().includes(searchTerm.toLowerCase())) //filter for if the letter is included 
    .sort((a , b) => { 
      const indexa = a.title.toLowerCase().indexOf(searchTerm.toLowerCase())  
      const indexb = b.title.toLowerCase().indexOf(searchTerm.toLowerCase())
      
      if(indexa < indexb ) return -1;
      if(indexb > indexa ) return 1;
      
      return a.title.localeCompare(b.title);
    });
  }

const gameModules = import.meta.glob("./games/*/*Game.jsx"); //for loading the games from games folder dynamically 
const gameComponents = {};
for (const path in gameModules) {
  const gameId = path.split("/")[2].toLowerCase(); // Folder name = ID
  gameComponents[gameId] = React.lazy(gameModules[path]);
}

const AppContent = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("") //for the serching feature
  const filteredGames = searchbytitle(searchTerm);

  const [currentGame, setCurrentGame] = useState("selectGame") //selecting the game
  
  const { user , logout } = useAuth();

  useEffect(() => { //takes away login screen when logged in
    if (user) {
      setShowLoginModal(false);
    }
  }, [user]);

if (currentGame !== "selectGame") {
  const GameComponent = gameComponents[currentGame];

  if (!GameComponent) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="not-found"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="text-white"
        >
          <button onClick={() => setCurrentGame("selectGame")}>← Back</button>
          <p>Game not found.</p>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentGame}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="h-full w-full"
      >
        <Suspense fallback={<p>Loading game...</p>}>
          <GameComponent onBack={() => setCurrentGame("selectGame")} />
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

return (
  <AnimatePresence mode="wait">
    <motion.main
      key="menu"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="pattern" />
      <div className="flex justify-end p-6 relative z-1">
        <LoginButton onLoginClick={() => setShowLoginModal(true)} />
      </div>
      <div className="wrapper">
        <header>
          <h1>
            Find <span className="text-gradient">Games </span>You'll Enjoy
          </h1>
          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder={"Search for Games to Play"}
          />
        </header>

        <section className="all-games">
          <h2>All Games</h2>
          <ul>
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onClick={() => setCurrentGame(game.id)}
                />
              ))
            ) : (
              <p>No games found.</p>
            )}
          </ul>
        </section>
      </div>
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </motion.main>
  </AnimatePresence>
);
};
const App = () => (
  <AuthProvider>
    <Routes>
        <Route path="/" element={<AppContent />} /> 
        <Route path="/lobby/:lobbyCode" element={<SpyPlay />} />
    </Routes>
  </AuthProvider>
);

export default App;