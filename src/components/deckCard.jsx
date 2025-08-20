const DeckCard = ({ deck, onClick, isSelected, playDeck,onDelete,requireMotion = false }) => {
  if (!deck) return null;
  const [motionDenied, setMotionDenied] = useState(false);
  let borderColorClass;
  switch (isSelected) {
    case true:
      borderColorClass = "border-blue-500";
      break;
    case false:
      borderColorClass = "border-light-100/10"; 
      break;
    default:
      borderColorClass = "border-light-100/10";
  }
    const handlePlay = async (e) => {
    e.stopPropagation();

    // If motion is required, request it on iOS
    if (
      requireMotion &&
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const response = await DeviceOrientationEvent.requestPermission();

        if (response !== "granted") {
          setMotionDenied(true); // remember they said no
          alert("Motion access is required to play this game.");
          return;
        } else {
          setMotionDenied(false); // reset if granted
        }
      } catch (err) {
        console.error("Permission error:", err);
        return;
      }
    }

    // Finally start the deck
    playDeck(deck);
  };

  return (
    <div
      className={`deck-card bg-dark-100 p-6 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer text-center border ${borderColorClass}`}
      onClick={onClick} 
    >
      <h3 className="text-xl font-semibold text-white mb-2">{deck.name}</h3>
      <p className="text-gray-100 text-sm">Contains {deck.cards.length} Cards</p>
      <button
        className="mt-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-semibold px-3 py-1 rounded-full shadow-md hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
        onClick={(e) => {
          e.stopPropagation();   
          handlePlay(e)        
        }}
      >
        ▶ Play
      </button>
      <div className="flex justify-end mt-4">
        <button
          className="text-gray-300 transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(deck);
          }}
          aria-label="Delete deck"
          title="Delete deck"
        >
          [X]
        </button>
      </div>
    </div>
  );
};

export default DeckCard;