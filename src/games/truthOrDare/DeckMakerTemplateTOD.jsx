import { useState, useEffect } from "react";
import DeckEditorCard from "../../components/DeckEditorCard";
import PdfReader from "../../components/pdfReader";
import callAzureOpenAI from "../../AzureAI/azureAiCall";
import { useAuth } from "../../context/Authcontext";
import supabase from "../../databaseClient";

const DeckMakerTemplate = ({ onBack, game }) => {
  
  const [extractedText, setExtractedText] = useState("");
  const [aiPromptInput, setAiPromptInput] = useState("");
  const [newCardInput, setNewCardInput] = useState("");
  const [truthInput, setTruthInput] = useState("");
  const [dareInput, setDareInput] = useState("");
  const [cards, setCards] = useState([]);
  const [reply, setReply] = useState(null);
  const [aicontext, setAicontext] = useState("");
  const [loading, setLoading] = useState(false);
  const [removepdf, setRemovepdf] = useState(false);
  const [skipPdfConfirm, setSkipPdfConfirm] = useState(false);
  const [name, setName] = useState("");
  const [promptSource, setPromptSource] = useState(null); // "user" or "file"
  const { user } = useAuth();

  useEffect(() => {
    if (!reply) return;

    let parsedReply = reply;
    if (typeof reply === "string") {
      try {
        parsedReply = JSON.parse(reply);
      } catch (err) {
        console.error("Failed to parse AI reply:", err, reply);
        return;
      }
    }

    if (Array.isArray(parsedReply)) {
      setCards(parsedReply.map((item, idx) => ({ id: idx + 1, ...item })));
      return;
    }

    if (typeof parsedReply === "object") {
      const arrayKey = Object.keys(parsedReply).find(k => Array.isArray(parsedReply[k]));
      if (arrayKey) {
        setCards(parsedReply[arrayKey].map((item, idx) => ({ id: idx + 1, ...item })));
        return;
      }
    }
  }, [reply]);

  const handleContextChange = (value) => {
  if (extractedText !== "") {
    const confirmed = window.confirm(
      "Entering a prompt will override your uploaded file, are you sure you want to do this?"
    );
    if (!confirmed) return;

    setSkipPdfConfirm(true);
    setExtractedText("");
    setRemovepdf(true);

    setTimeout(() => {
      setRemovepdf(false);
      setSkipPdfConfirm(false);
    }, 100);
  }

  setAiPromptInput(value);
  setPromptSource("user");

  // use game directly
  const userPrompt = game.systemPromptUser.replace("{{INPUT}}", value);
  setAicontext(userPrompt);
};

const handleExtractedText = (text) => {
  if (skipPdfConfirm) {
    setExtractedText(text);
    return;
  }

  if (aiPromptInput.trim() !== "") {
    const confirmed = window.confirm(
      "Uploading a PDF will override your typed prompt. Are you sure?"
    );
    if (!confirmed) {
      setSkipPdfConfirm(true);
      setRemovepdf(true);
      setTimeout(() => {
        setRemovepdf(false);
        setSkipPdfConfirm(false);
      }, 100);
      return;
    }
  }

  setExtractedText(text);
  setAiPromptInput("");
  setPromptSource("file");

  setAicontext(game.systemPromptFile);
};
  const handlePrompt = async () => {
    const messages = [
      { role: "system", content: aicontext },
      { role: "user", content: promptSource === "file" ? extractedText : aiPromptInput },
    ];

    try {
      setLoading(true);
      const result = await callAzureOpenAI(messages);
      const parsed = typeof result === "string" ? JSON.parse(result) : result;
      setReply(parsed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addCard = () => {
     if (!truthInput.trim() || !dareInput.trim()) {
    alert("Please enter both a Truth and a Dare.");
    return;
  }
    const newCard = {
        id: cards.length + 1,
        truth: truthInput.trim(),
        dare: dareInput.trim(),
    };
    setCards([...cards, newCard]);
    setDareInput("");
    setTruthInput("");
  };

  const deleteCard = (id) => setCards(cards.filter(card => card.id !== id));

  const handleEditCard = (id, key, newValue) => {
    setCards(prev => prev.map(card => card.id === id ? { ...card, [key]: newValue } : card));
  };

  const saveDeck = async () => {
    if (!name.trim()) return alert("Please enter a deck name");
    if (cards.length <= 0) return alert("Make some cards before saving")
    if (!window.confirm("Do you want to save the deck?")) return;

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return alert("You must be logged in to save a deck.");

    const { error } = await supabase.from("card_decks").insert([{
      user_id: user.id,
      deck_id: crypto.randomUUID(),
      game_name: game.name,
      deck_name: name,
      cards,
      updated_at: new Date().toISOString(),
    }]);
    if (error) alert("Failed to save deck"); else alert("Deck saved!");
  };

  return (
    <main>
      <div className="p-4">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-light-100/10 text-white hover:bg-light-100/20 transition-colors"
        >
          ← Back to Decks
        </button>
      </div>

      <div className="wrapper p-6">
        <h1 className="text-2xl font-bold text-white mb-2">🛠️ {game.name} Deck Maker</h1>
        <p className="text-white/80 mb-6">This is where you'll build your custom decks!</p>

        <div className="flex flex-col-reverse lg:flex-row gap-6">
          {/* Manual Card Input */}
          <div className="flex-1 space-y-4 bg-dark-200 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-white">📝 Add Cards</h2>
            <div>
              <label className="block text-white/80 mb-1">Deck Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter deck name"
                className="w-full p-2 rounded bg-dark-100 text-white placeholder-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-light-100/30"
              />
            </div>

            <div>
              <label className="block text-white/80 mb-1">Make a New Card</label>
              <input
                type="text"
                value={truthInput}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCard(); } }}
                onChange={(e) => setTruthInput(e.target.value)}
                placeholder="Enter a Truth"
                className="w-full p-2 rounded bg-dark-100 text-white placeholder-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-light-100/30"
              />
            </div>

             <div>
              <label className="block text-white/80 mb-1"></label>
              <input
                type="text"
                value={dareInput}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCard(); } }}
                onChange={(e) => setDareInput(e.target.value)}
                placeholder="Enter a Dare"
                className="w-full p-2 rounded bg-dark-100 text-white placeholder-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-light-100/30"
              />
            </div>

            <button
              onClick={addCard}
              className="bg-light-100/20 hover:bg-light-100/30 text-white px-4 py-2 rounded transition"
            >
              ➕ Add Prompt
            </button>

            <button
              onClick={saveDeck}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              💾 Save Deck
            </button>
          </div>

          {/* AI Deck Maker */}
          <div className="p-4 flex-1 bg-dark-100 rounded-xl shadow-md flex flex-col gap-4">
            <p className="text-xl font-bold text-white">AI DeckMaker ⚡</p>
            <PdfReader onExtract={handleExtractedText} Remove={removepdf} />
            <p className="text-center text-white/70 font-medium">OR</p>

            <input
              type="text"
              value={aiPromptInput}
              onChange={(e) => handleContextChange(e.target.value)}
              placeholder="Enter a prompt to make a deck"
              className="w-full p-3 rounded-2xl bg-dark-100 text-white placeholder-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-light-100/30"
            />

            <button
              onClick={() => {
                if (!extractedText.trim() && !aiPromptInput.trim()) {
                  alert("Please upload a file or enter a prompt\nIf there are no valid words in the file, it will also not work.");
                  return;
                }
                handlePrompt();
              }}
              disabled={loading}
              className={`px-6 py-3 rounded-2xl transition-all text-white cursor-pointer duration-200 shadow-md flex items-center justify-center gap-2 ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-light-100/20 hover:bg-light-100/30 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Generating Deck...</span>
                </>
              ) : (
                "Create AI Deck"
              )}
            </button>
          </div>
        </div>

        <div>
          <p className="text-white font-bold">Cards: (click to edit)</p>
          <div className="flex flex-wrap gap-4">
            {cards.map(c => (
              <DeckEditorCard
                key={c.id}
                card={c}
                onDelete={deleteCard}
                onEdit={handleEditCard}
                excludeKeys={game.excludeKeys}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DeckMakerTemplate;
