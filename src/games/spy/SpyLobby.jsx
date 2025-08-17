import { useState, useEffect } from "react";
import { useAuth } from "../../context/Authcontext";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../databaseClient";
import socket from "../../socket"; // Singleton socket instance

const SpyLobby = ({ deck, onBack }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { deckId } = useParams();
  const [lobbyCode, setLobbyCode] = useState("");
  const [playerName, setPlayerName] = useState(user?.email || "");
  const [cards, setCards] = useState(deck || []);
  const [loading, setLoading] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  useEffect(() => {
    function onConnect() {
      console.log("Socket connected with ID:", socket.id);
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);
  const getGuestId = () => {
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem("guestId", guestId);
      console.log("Generated new guest ID:", guestId);
    }
    return guestId;
  };

  const userId = user?.id || getGuestId();
  console.log("User ID:", userId);

  // Fetch deck from Supabase if deckId exists
  useEffect(() => {
    if (deckId) {
      console.log("Fetching deck from Supabase for deckId:", deckId);
      supabase
        .from("card_decks")
        .select("cards")
        .eq("id", deckId)
        .single()
        .then(({ data, error }) => {
          if (!error && data?.cards) {
            console.log("Deck fetched:", data.cards);
            setCards(data.cards);
          } else {
            console.log("Error fetching deck or no cards, fallback to prop deck:", error);
            setCards(deck || []);
          }
        });
    } else {
      setCards(deck || []);
    }
    console.log(deck)
  }, [deckId, deck]);

  // Setup socket event listeners once
  useEffect(() => {
    console.log("Initializing persistent socket connection:", socket.id);

    socket.on("connect", () => {
      console.log("Socket connected with ID:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected. Reason:", reason);
    });

    socket.on("error", (msg) => {
      console.error("Socket error received:", msg);
      alert(msg);
    });

    socket.on("lobbyClosed", ({ reason }) => {
      console.warn("Lobby closed:", reason);
      navigate("/"); // Redirect back to home
    });

    return () => {
      console.log("SpyLobby unmounted. Not disconnecting socket (persistent).");
    };
  }, [navigate]);
  
  const generateLobbyCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  // Create lobby (host)
  const handleCreateLobby = async() => {
    if (!playerName.trim()) return;
     if (!socket.connected) {
    console.log("Waiting for socket to connect...");
    await new Promise(resolve => socket.once("connect", resolve));
   }

    const code = generateLobbyCode();
    setLoading(true);
    setIsHost(true);

    console.log("Creating lobby with code:", code);
    socket.emit("createLobby", { code, host: { id: userId, name: playerName },deck: deck.cards });

    socket.once("lobbyCreated", ({ code: createdCode, players , deck}) => {
      console.log("Lobby successfully created:", createdCode, players, deck);
      setLoading(false);
      setLobbyCode(createdCode);
      navigate(`/lobby/${createdCode}`);
    });
  };

  // Join lobby (non-host)
  const handleJoinLobby = () => {
  
  if (!socket || !lobbyCode || !playerName.trim()) {
    alert("Please enter a lobby code and your name.");
    return;
  }

  setLoading(true);

  const player = { id: userId, name: playerName };
  localStorage.setItem("savedUser", JSON.stringify(player)); // persist name
  
  console.log("Joining lobby with code:", lobbyCode);
  socket.emit("joinLobby", { code: lobbyCode, player });

  // Use once instead of on
  socket.once("updatePlayers", (players) => {
    console.log("Players updated in lobby:", players);
    setLoading(false);
    navigate(`/lobby/${lobbyCode}`);
  });
  socket.once("JoinError", (msg) => {
      console.error("Join error:", msg);
      alert("Invalid Lobby Code")
      setLoading(false);
  });
};

  if (!isConnected) {
  return <div className="h-screen flex items-center justify-center text-white">Connecting...</div>;
  }
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
          onChange={(e) => setPlayerName(e.target.value)}
          className="mt-6 px-4 py-2 rounded-lg text-black font-medium bg-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 w-64 text-center"
        />

        <div className="mt-10 flex flex-col md:flex-row gap-8 items-center w-full max-w-3xl justify-center">
          <button
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/50 rounded-full text-lg font-semibold transition-all transform hover:scale-105 hover:shadow-xl"
            onClick={() => {
              if (!playerName.trim()) {
                alert("Please enter a username before creating a lobby!");
                return;
              }
              handleCreateLobby();
            }}
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
              className="px-4 py-2 rounded-lg text-black font-medium bg-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 w-64"
            />
            <button
              className="px-8 py-4 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/50 rounded-full text-lg font-semibold transition-all transform hover:scale-105 hover:shadow-xl"
              onClick={() => {
                if (!playerName.trim()) {
                  alert("Please enter a username before joining a lobby!");
                  return;
                }
                handleJoinLobby();
              }}
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
