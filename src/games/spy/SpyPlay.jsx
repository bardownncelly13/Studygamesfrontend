import { useEffect, useState } from "react";
import supabase from "../../databaseClient";
import { useAuth } from "../../context/Authcontext";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const MIN_PLAYERS = 1;

const defaultDeck = [
  { id: 1, prompt: "Beach Resort" },
  { id: 2, prompt: "Casino" },
  { id: 3, prompt: "Cruise Ship" },
  { id: 4, prompt: "Movie Studio" },
  { id: 5, prompt: "Pirate Ship" },
  { id: 6, prompt: "Polar Station" },
  { id: 7, prompt: "School" },
  { id: 8, prompt: "Restaurant" },
  { id: 9, prompt: "Space Station" },
  { id: 10, prompt: "Submarine" },
  { id: 11, prompt: "Supermarket" },
  { id: 12, prompt: "Theater" },
  { id: 13, prompt: "Train" },
  { id: 14, prompt: "Airplane" },
  { id: 15, prompt: "Hospital" },
  { id: 16, prompt: "Hotel" },
  { id: 17, prompt: "Jail" },
  { id: 18, prompt: "Bank" },
  { id: 19, prompt: "Amusement Park" },
  { id: 20, prompt: "Military Base" },
  { id: 21, prompt: "Museum" },
  { id: 22, prompt: "Library" },
  { id: 23, prompt: "Factory" },
  { id: 24, prompt: "Nightclub" },
  { id: 25, prompt: "Police Station" },
];

const socket = io("https://studygames-backend-80244932095.us-central1.run.app");

const SpyPlay = () => {
  function logToScreen(...args) {
  const msg = args.map(a => {
    try {
      return typeof a === "object" ? JSON.stringify(a) : String(a);
    } catch {
      return String(a);
    }
  }).join(" ");

  // Floating debug panel
  let debugPanel = document.getElementById("debug-panel");
  if (!debugPanel) {
    debugPanel = document.createElement("div");
    debugPanel.id = "debug-panel";
    debugPanel.style.position = "fixed";
    debugPanel.style.top = "10px";
    debugPanel.style.right = "10px";
    debugPanel.style.maxHeight = "40vh";
    debugPanel.style.width = "90%";
    debugPanel.style.overflowY = "auto";
    debugPanel.style.backgroundColor = "white";
    debugPanel.style.color = "black";
    debugPanel.style.padding = "8px";
    debugPanel.style.fontSize = "12px";
    debugPanel.style.border = "1px solid black";
    debugPanel.style.zIndex = 9999;
    debugPanel.style.fontFamily = "monospace";
    document.body.appendChild(debugPanel);
  }

  const el = document.createElement("div");
  el.textContent = msg;
  debugPanel.appendChild(el);
  debugPanel.scrollTop = debugPanel.scrollHeight;

  console.log(...args);
}

  const { lobbyCode, deckId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lobbyCode: paramCode } = useParams();
  const [gameStarted, setGameStarted] = useState(false);
  const [location, setLocation] = useState(null);
  const [roles, setRoles] = useState({});
  const [crossedPlayers, setCrossedPlayers] = useState([]);
  const [crossedLocations, setCrossedLocations] = useState([]);
  useEffect(() => {
  if (paramCode) setLobbyCode(paramCode);
}, [paramCode]);
  useEffect(() => {
    if (!lobbyCode) return;
  logToScreen("✅ SpyPlay mounted with code:", lobbyCode);
}, [lobbyCode]);

  const toggleCrossedLocation = (id) => { //for crossing out locations
      setCrossedLocations((prev) =>
        prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
      );
    };
  const toggleCrossedPlayer = (id) => { //for crossing out players 
    setCrossedPlayers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };
const getPersistedUser = () => {
  // If a user is logged in, always use them
  if (user?.id && user?.email) {
    const loggedInUser = { id: user.id, name: user.email };
    localStorage.setItem("savedUser", JSON.stringify(loggedInUser));
    return loggedInUser;
  }

  // Otherwise, just return the saved user from localStorage (entered name)
  const saved = localStorage.getItem("savedUser");
  if (saved) return JSON.parse(saved);

  // If nothing is saved, return null (no user yet)
  return null;
};


  const [currentUser, setCurrentUser] = useState(getPersistedUser());
  useEffect(() => {
    const handleLobbyDeck = ({ deck: serverDeck }) => {
      console.log("Received deck from server:", serverDeck);
      setDeck(serverDeck);
    };

    socket.on("lobbyDeck", handleLobbyDeck);

    return () => {
      socket.off("lobbyDeck", handleLobbyDeck);
    };
  }, []);
  useEffect(() => {
    if (gameStarted) {
      localStorage.setItem(
        `spyGame_${lobbyCode}`,
        JSON.stringify({
          location,
          roles,
          gameStarted,
          crossedPlayers,
          crossedLocations,
        })
      );
    }
  }, [gameStarted, location, roles, crossedPlayers, crossedLocations, lobbyCode]);

  // Socket listeners
  useEffect(() => {
  const handleGameStarted = ({ location, roles, deck: serverDeck }) => {
    console.log("Game started!", { location, roles, serverDeck });
    setDeck(serverDeck); // ✅ set it from the server
    setGameStarted(true);
    setLocation(location);
    setRoles(roles);
  };

    const handleGameEnded = () => {
      console.log("Game ended!");
      setGameStarted(false);
      setLocation(null);
      setRoles({});
      setCrossedPlayers([]);
      setCrossedLocations([]);
      localStorage.removeItem(`spyGame_${lobbyCode}`);
    };

    socket.on("gameStarted", handleGameStarted);
    socket.on("gameEnded", handleGameEnded);

    return () => {
      socket.off("gameStarted", handleGameStarted);
      socket.off("gameEnded", handleGameEnded);
    };
  }, [lobbyCode]);

  // Join lobby & update players
  useEffect(() => {
    if (!lobbyCode) return;

    const saved = localStorage.getItem(`spyGame_${lobbyCode}`);
    if (saved) {
      const { location, roles, gameStarted, crossedPlayers, crossedLocations } =
        JSON.parse(saved);
      setLocation(location);
      setRoles(roles);
      setGameStarted(gameStarted);
      setCrossedPlayers(crossedPlayers || []);
      setCrossedLocations(crossedLocations || []);
    }

    const currentPlayer = { id: currentUser.id, name: currentUser.name };
    socket.emit("joinLobby", { code: lobbyCode, player: currentPlayer });

  const handleUpdatePlayers = (updatedPlayers) => {
      console.log("Players updated:", updatedPlayers);
      setPlayers(updatedPlayers);
      setLoading(false);
    };

    socket.on("updatePlayers", handleUpdatePlayers);
    socket.on("error", console.error);

    return () => {
      socket.off("updatePlayers", handleUpdatePlayers);
      socket.off("error", console.error);
    };
  }, [lobbyCode, currentUser.id]);

  const startGame = () => {
    if (players.length < MIN_PLAYERS) return;
    if (!deck || deck.length === 0) {
      socket.emit("requestLobbyDeck", { code: lobbyCode });
      return; // wait for serverDeck event to arrive
    }
    console.log(deck)
    const chosenLocation = deck[Math.floor(Math.random() * deck.length)];
    const spyIndex = Math.floor(Math.random() * players.length);
    console.log(chosenLocation)
    const newRoles = {};
    players.forEach((player, idx) => {
      newRoles[player.id] = idx === spyIndex ? "Spy" : "Not the Spy";
    });

    console.log("Starting game:", { chosenLocation, newRoles });
    console.log(deck)
    socket.emit("startGameSpy", {
      lobbyCode,
      location: chosenLocation.prompt,
      roles: newRoles,
    });

    setGameStarted(true);
    setLocation(chosenLocation.prompt);
    setRoles(newRoles);
    setCrossedPlayers([]);
    setCrossedLocations([]);

    localStorage.setItem(
      `spyGame_${lobbyCode}`,
      JSON.stringify({ location: chosenLocation.prompt, roles: newRoles, gameStarted: true })
    );
  };


const handleEndGame = () => {
    console.log("Ending game for lobby:", lobbyCode);
    socket.emit("endGameSpy", { code: lobbyCode });

    setGameStarted(false);
    setLocation(null);
    setRoles({});
    setCrossedPlayers([]);
    setCrossedLocations([]);

    localStorage.removeItem(`spyGame_${lobbyCode}`);
  };

  if (loading) return <h3 className="text-white">Loading lobby...</h3>;
const handleLeaveLobby = () => {
  if (socket && lobbyCode && currentUser?.id) {
    socket.emit("leaveLobby", { code: lobbyCode, playerId: currentUser.id });
    setPlayers((prev) => prev.filter((p) => p.id !== currentUser.id));
  }
  navigate("/"); 
};
  return (
  <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-6 text-white">
    
    {/* Back Button */}
    <button
      className="absolute top-4 left-4 z-[999] px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/50"
      onClick={handleLeaveLobby}
    >
      Back
    </button>

    {/* Lobby Panel */}
    <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-gray-700 z-10">
      <h2 className="text-3xl font-bold text-yellow-400 text-center mb-4 drop-shadow-lg">
        Lobby Code: {lobbyCode}
      </h2>

      <h3 className="text-xl font-semibold mb-2">Players ({players.length}):</h3>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {players.map((p) => (
          <li
            key={p.id}
            onClick={() => toggleCrossedPlayer(p.id)}
            className={`cursor-pointer px-4 py-2 rounded-lg text-center border ${
              crossedPlayers.includes(p.id)
                ? "line-through bg-red-700/50 border-red-500"
                : "bg-gray-800/60 border-gray-600 hover:bg-gray-700/70"
            } transition-all duration-200`}
          >
            {p.name}
          </li>
        ))}
      </ul>

      {gameStarted ? (
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">Your Role:</h3>
          <p className="text-lg">
            {roles[currentUser.id] === "Spy"
              ? "You are the Spy! Location unknown."
              : `NOT the Spy: Location: ${location}`}
          </p>
        </div>
      ) : (
        <div className="flex justify-center mb-6">
          <button
            className="px-6 py-3 rounded-full text-lg font-semibold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/50"
            onClick={startGame}
          >
            Start Game
          </button>
        </div>
      )}

      {gameStarted &&(
        <div className="flex justify-center mb-6">
          <button
            className="px-6 py-3 rounded-full text-lg font-semibold bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/50"
            onClick={handleEndGame}
          >
            End Game
          </button>
        </div>
      )}

      {gameStarted && (
        <>
          <h3 className="text-xl font-semibold mb-2">Available Locations:</h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {deck.map((card) => (
              <li
                key={card.id}
                onClick={() => toggleCrossedLocation(card.id)}
                className={`cursor-pointer px-4 py-2 rounded-lg text-center border ${
                  crossedLocations.includes(card.id)
                    ? "line-through bg-red-700/50 border-red-500"
                    : "bg-gray-800/60 border-gray-600 hover:bg-gray-700/70"
                } transition-all duration-200`}
              >
                {card.prompt}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  </div>
);

};

export default SpyPlay;
