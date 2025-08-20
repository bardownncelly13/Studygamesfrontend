import { useState, useEffect } from "react";
import { useAuth } from "../../context/Authcontext";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../databaseClient";

const SpyLobby = ({ deck, onBack }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { deckId } = useParams();
  const [lobbyCode, setLobbyCode] = useState("");
  const [playerName, setPlayerName] = useState(user?.email || "");
  const [cards, setCards] = useState(deck || []);
  const [loading, setLoading] = useState(false);
  const [isHost, setIsHost] = useState(false);

  // Generate or get a guest ID for non-auth users
  const getGuestId = () => {
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem("guestId", guestId);
    }
    return guestId;
  };
  const userId = user?.id || getGuestId();

  // Fetch deck from Supabase if deckId exists
  useEffect(() => {
    if (deckId) {
      supabase
        .from("card_decks")
        .select("cards")
        .eq("id", deckId)
        .single()
        .then(({ data, error }) => {
          if (!error && data?.cards) setCards(data.cards);
          else setCards(deck || []);
        });
    } else {
      setCards(deck || []);
    }
  }, [deckId, deck]);

  // Subscribe to lobby updates
  useEffect(() => {
    if (!lobbyCode) return;

    const subscription = supabase
      .from(`lobbies:id=eq.${lobbyCode}`)
      .on("UPDATE", (payload) => {
        const lobby = payload.new;
        setCards(lobby.deck || []);
        // Update game state, players, etc., as needed
        console.log("Lobby update:", lobby);
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

  const generateLobbyCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  // Create lobby (host)
  const handleCreateLobby = async () => {
    if (!playerName.trim()) return;

    const code = generateLobbyCode();
    setLoading(true);
    setIsHost(true);

    const { error } = await supabase.from("lobbies").insert({
      id: code,
      host: { id: userId, name: playerName },
      players: [{ id: userId, name: playerName, connected: true }],
      deck: cards,
      gameInProgress: false,
      gameState: null,
    });

    if (error) {
      alert("Error creating lobby: " + error.message);
      setLoading(false);
      return;
    }

    setLobbyCode(code);
    setLoading(false);
    navigate(`/lobby/${code}`);
  };

  // Join an existing lobby
  const handleJoinLobby = async () => {
    if (!playerName.trim() || !lobbyCode) {
      alert("Please enter a name and lobby code.");
      return;
    }

    setLoading(true);
    const player = { id: userId, name: playerName, connected: true };
    localStorage.setItem("savedUser", JSON.stringify(player));

    const { data: lobby, error } = await supabase
      .from("lobbies")
      .select("players")
      .eq("id", lobbyCode)
      .single();

    if (error || !lobby) {
      alert("Lobby not found.");
      setLoading(false);
      return;
    }

    const players = lobby.players || [];
    if (!players.find((p) => p.id === player.id)) players.push(player);

    const { error: updateError } = await supabase
      .from("lobbies")
      .update({ players })
      .eq("id", lobbyCode);

    if (updateError) {
      alert("Error joining lobby: " + updateError.message);
      setLoading(false);
      return;
    }

    setLobbyCode(lobbyCode);
    setLoading(false);
    navigate(`/lobby/${lobbyCode}`);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-white px-4"
      style={{
        backgroundImage: "url('/spylobby.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.85)_0%,_rgba(0,0,0,0.45)_50%,_transparent_100%)]"></div>

      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 px-4 py-2 bg-gray-700/30 backdrop-blur-sm rounded-lg hover:bg-gray-700/50 transition-colors text-white font-semibold"
      >
        ← Back to Decks
      </button>

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-center text-yellow-400 drop-shadow-lg">
          Spy Game Lobby
        </h1>
        <p className="mt-2 text-gray-300 text-center max-w-md">
          Enter your name and create or join a lobby.
        </p>

        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value.slice(0, 20))}
          maxLength={20}
          className="mt-6 px-4 py-2 rounded-lg text-black font-medium bg-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 w-64 text-center"
        />

        <div className="mt-10 flex flex-col md:flex-row gap-8 items-center w-full max-w-3xl justify-center">
          <button
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/50 rounded-full text-lg font-semibold transition-all transform hover:scale-105 hover:shadow-xl"
            onClick={handleCreateLobby}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Lobby"}
          </button>

          <div className="flex flex-col items-center gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Enter lobby code"
              value={lobbyCode}
              onChange={(e) => setLobbyCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="px-4 py-2 rounded-lg text-black font-medium bg-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 w-64"
            />
            <button
              className="px-8 py-4 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/50 rounded-full text-lg font-semibold transition-all transform hover:scale-105 hover:shadow-xl"
              onClick={handleJoinLobby}
              disabled={loading}
            >
              {loading ? "Joining..." : "Join Lobby"}
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm text-center z-20">
        Spyfall Inspired • Online Multiplayer
      </div>
    </div>
  );
};

export default SpyLobby;
