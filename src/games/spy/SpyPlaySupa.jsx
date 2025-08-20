import { useEffect, useState } from "react";
import { useAuth } from "../../context/Authcontext";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../databaseClient";

const MIN_PLAYERS = 1;

const SpyPlay = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { lobbyCode: paramCode } = useParams();

  const [lobbyCode, setLobbyCode] = useState(paramCode || null);
  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [location, setLocation] = useState(null);
  const [roles, setRoles] = useState({});
  const [crossedPlayers, setCrossedPlayers] = useState([]);
  const [crossedLocations, setCrossedLocations] = useState([]);

  const getPersistedUser = () => {
    if (user?.id && user?.email) {
      const loggedInUser = { id: user.id, name: user.email };
      localStorage.setItem("savedUser", JSON.stringify(loggedInUser));
      return loggedInUser;
    }
    const saved = localStorage.getItem("savedUser");
    if (saved) return JSON.parse(saved);
    return null;
  };

  const [currentUser, setCurrentUser] = useState(getPersistedUser());

  // Load persisted game
  useEffect(() => {
    if (!lobbyCode) return;
    const saved = localStorage.getItem(`spyGame_${lobbyCode}`);
    if (saved) {
      const { location, roles, gameStarted, crossedPlayers, crossedLocations } = JSON.parse(saved);
      setLocation(location);
      setRoles(roles);
      setGameStarted(gameStarted);
      setCrossedPlayers(crossedPlayers || []);
      setCrossedLocations(crossedLocations || []);
    }
  }, [lobbyCode]);

  // Save game state
  useEffect(() => {
    if (!lobbyCode || !gameStarted) return;
    localStorage.setItem(
      `spyGame_${lobbyCode}`,
      JSON.stringify({ location, roles, gameStarted, crossedPlayers, crossedLocations })
    );
  }, [gameStarted, location, roles, crossedPlayers, crossedLocations, lobbyCode]);

  // Load lobby from Supabase
  useEffect(() => {
    if (!lobbyCode) return;

    const loadLobby = async () => {
      const { data: lobby, error } = await supabase
        .from("lobbies")
        .select("*")
        .eq("id", lobbyCode)
        .single();

      if (error || !lobby) {
        alert("Lobby not found.");
        navigate("/");
        return;
      }

      setDeck(lobby.deck || []);
      setPlayers(lobby.players || []);
      setGameStarted(lobby.gameInProgress);
      setLocation(lobby.gameState?.location || null);
      setRoles(lobby.gameState?.roles || {});
      setLoading(false);

      // Persist current user if not already
      if (!currentUser && lobby.host) {
        setCurrentUser(lobby.host);
        localStorage.setItem("savedUser", JSON.stringify(lobby.host));
      }
    };

    loadLobby();
  }, [lobbyCode, navigate, currentUser]);

  // Realtime subscription to lobby changes
  useEffect(() => {
    if (!lobbyCode) return;

    const subscription = supabase
      .from(`lobbies:id=eq.${lobbyCode}`)
      .on("UPDATE", (payload) => {
        const lobby = payload.new;
        setPlayers(lobby.players || []);
        setDeck(lobby.deck || []);
        setGameStarted(lobby.gameInProgress);
        setLocation(lobby.gameState?.location || null);
        setRoles(lobby.gameState?.roles || {});
      })
      .on("DELETE", () => {
        alert("Lobby closed.");
        navigate("/");
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [lobbyCode, navigate]);

  // Toggle functions
  const toggleCrossedLocation = (id) =>
    setCrossedLocations((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  const toggleCrossedPlayer = (id) =>
    setCrossedPlayers((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  // Start game
  const startGame = async () => {
    if (players.length < MIN_PLAYERS) return;
    if (!deck || deck.length === 0) return;

    const chosenLocation = deck[Math.floor(Math.random() * deck.length)];
    const spyIndex = Math.floor(Math.random() * players.length);
    const newRoles = {};
    players.forEach((player, idx) => {
      newRoles[player.id] = idx === spyIndex ? "Spy" : "Not the Spy";
    });

    setGameStarted(true);
    setLocation(chosenLocation.prompt);
    setRoles(newRoles);
    setCrossedPlayers([]);
    setCrossedLocations([]);

    // Update lobby in Supabase
    await supabase
      .from("lobbies")
      .update({
        gameInProgress: true,
        gameState: { location: chosenLocation.prompt, roles: newRoles, startedAt: Date.now() },
      })
      .eq("id", lobbyCode);
  };

  const handleEndGame = async () => {
    setGameStarted(false);
    setLocation(null);
    setRoles({});
    setCrossedPlayers([]);
    setCrossedLocations([]);

    await supabase.from("lobbies").update({ gameInProgress: false, gameState: null }).eq("id", lobbyCode);
    localStorage.removeItem(`spyGame_${lobbyCode}`);
  };

  const handleLeaveLobby = async () => {
    if (!lobbyCode || !currentUser) return;

    const updatedPlayers = players.filter((p) => p.id !== currentUser.id);
    setPlayers(updatedPlayers);

    await supabase.from("lobbies").update({ players: updatedPlayers }).eq("id", lobbyCode);
    navigate("/");
  };

  if (!lobbyCode) return <p className="text-white">Joining lobby…</p>;
  if (loading) return <h3 className="text-white">Loading lobby...</h3>;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-6 text-white">
      <button
        className="absolute top-4 left-4 z-[999] px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/50"
        onClick={handleLeaveLobby}
      >
        Back
      </button>

      <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-gray-700 z-10">
        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-4 drop-shadow-lg">Lobby Code: {lobbyCode}</h2>
        <h3 className="text-xl font-semibold mb-2">Players ({players.length}):</h3>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {players.map((p) => (
            <li
              key={p.id}
              onClick={() => toggleCrossedPlayer(p.id)}
              className={`cursor-pointer px-4 py-2 rounded-lg text-center border break-words ${
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

        {gameStarted && (
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
