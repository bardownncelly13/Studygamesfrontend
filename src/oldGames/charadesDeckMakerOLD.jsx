import { useState , useEffect} from "react";
import { useAuth } from "../context/Authcontext";
import DeckEditorCard from "../components/DeckEditorCard";
import PdfReader from "../components/pdfReader";
import supabase from "../databaseClient";
import callAzureOpenAI from "../AzureAI/azureAiCall"

const CharadesDeckMaker = ({ onBack }) => {
  const [extractedText, setExtractedText] = useState("");
  const [name, setName] = useState("")
  const [cards, setCards] = useState([])
  const [cardData, setCardData] = useState("")
  const [reply, setReply] = useState("");
  const [aicontext, setAicontext] = useState("")
  const [promptInput, setPromptInput] = useState("");
  const [removepdf, setRemovepdf] = useState(false)
  const [skipPdfConfirm, setSkipPdfConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth()

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
    } else {
      console.warn("No array found in AI reply object:", parsedReply);
    }
  } else {
    console.warn("Unexpected AI reply type:", typeof parsedReply, parsedReply);
  }
}, [reply]);

const handlePrompt = async () => {
  const messages = [
    { role: "system", content: aicontext}, 
    { role: "user", content: extractedText }
  ];

  try {
  setLoading(true);
  const result = await callAzureOpenAI(messages);
  //console.log("Azure API Reply:", result);
  const parsed = typeof result === "string" ? JSON.parse(result) : result;
  setReply(parsed); 
} catch (err) {
  console.error(err);
} finally {
   setLoading(false);
}
};

const handleContextChange = (value) => {
  if(extractedText != ""){
    const confirmed = window.confirm("Entering a prompt will overide your uploaded file, are you sure you want to do this?")
    if(confirmed){
      setSkipPdfConfirm(true);
      setExtractedText("");
      setRemovepdf(true);
      setPromptInput(value);  
      setTimeout(() => {
        setRemovepdf(false);
        setSkipPdfConfirm(false); 
      }, 100);
      setAicontext(`make a charades deck about the following user input${value} output a JSON of prompts with an example of an easy way to act them out for each prompt.    You are a JSON generator for a charades game.
ALWAYS respond with a JSON object in the EXACT format:
{
  "activity": "Charades",
  "prompts": [
    {
      "prompt": "string",
      "action": "string"
    }
  ]
}

Rules:
- Do not include any other keys or text.
- Do not wrap the JSON in backticks or markdown.
- Use only valid JSON.`)
    }
    else {
      return;
    }
  } else {
    setPromptInput(value);
      setAicontext(`make a charades deck about the following user input "${value}" output a JSON of prompts with an example of an easy way to act them out for each prompt.    You are a JSON generator for a charades game.
ALWAYS respond with a JSON object in the EXACT format:
{
  "activity": "Charades",
  "prompts": [
    {
      "prompt": "string",
      "action": "string"
    }
  ]
}

Rules:
- Do not include any other keys or text.
- Do not wrap the JSON in backticks or markdown.
- Use only valid JSON.`)
    }
};


const handleExtractedText = (text) => {
   if (skipPdfConfirm) {
    setExtractedText(text);
    return;
  }
  if (promptInput.trim() !== "") {
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
    setPromptInput("");
    setAicontext(`You are a teacher trying to help students learn through the use of a charades game. First try to find key concepts that are in the students learning material that they give to you. After that, create 20 different charades prompts that students can easily act out but still require knowledge of the concepts that are in the learning material. output a JSON of prompts with an example of an easy way to act them out for each prompt.    You are a JSON generator for a charades game.
ALWAYS respond with a JSON object in the EXACT format:
{
  "activity": "Charades",
  "prompts": [
    {
      "prompt": "string",
      "action": "string"
    }
  ]
}

Rules:
- Do not include any other keys or text.
- Do not wrap the JSON in backticks or markdown.
- Use only valid JSON.`)
  };

  const addCard = () => {
  if (!cardData.trim()) {
      alert("Please enter a prompt");
      return;
    }
    const newCard = { id: cards.length + 1, prompt: cardData.trim() };
    setCards([...cards, newCard]);
    setCardData("");
  };

  const deleteCard = (id) => {
    setCards(cards.filter((card) => card.id !== id));
  };
  const saveDeck = async() => {
    if (!name.trim()){
      return alert("please enter a deck name");
    }
    const shouldSave = confirm("Do you want to save the deck?");
      if (!shouldSave) return;

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    alert("You must be logged in to save a deck.");
    return;
  }
    const { data, error } = await supabase.from("card_decks").insert([
      {
        user_id: user.id, 
        deck_id: crypto.randomUUID(),
        game_name: "Charades",
        deck_name: name,
        cards: cards,
        updated_at: new Date().toISOString(),
      },
    ]);
      if (error) {
          console.error("Error saving deck:", error);
          alert("Failed to save deck");
        } else {
          alert("Deck saved!");
        }
  }
  
function handleEditCard(id, key, newValue) {
  setCards((prevCards) =>
    prevCards.map((card) =>
      card.id === id ? { ...card, [key]: newValue } : card
    )
  );
}

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
        <h1 className="text-2xl font-bold text-white mb-2">🛠️ Deck Maker</h1>
        <p className="text-white/80 mb-6">This is where you'll build your custom decks!</p>

        <div className="flex flex-col-reverse lg:flex-row gap-6">

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
              <label className="block text-white/80 mb-1">New Card</label>
              <input
                type="text"
                value={cardData}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();  
                    addCard();          
                  }
                }}
                onChange={(e) => setCardData(e.target.value)}
                placeholder="Enter a prompt"
                className="w-full p-2 rounded bg-dark-100 text-white placeholder-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-light-100/30"
              />
            </div>

            <button 
            onClick={addCard}
            className="bg-light-100/20 hover:bg-light-100/30 text-white px-4 py-2 rounded transition">
              ➕ Add Prompt
            </button>
            <button
              onClick={saveDeck}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              💾 Save Deck
            </button>
          </div>
      
          <div className="p-4 flex-1 bg-dark-100 rounded-xl shadow-md flex flex-col gap-4">
            <p className="text-xl font-bold text-white">AI DeckMaker ⚡</p>
            
            <PdfReader onExtract={handleExtractedText} Remove={removepdf} />
            
            <p className="text-center text-white/70 font-medium">OR</p>
            
            <input
              type="text"
              value={promptInput}
              onChange={(e) => handleContextChange(e.target.value)}
              placeholder="Enter a prompt to make a charades deck from"
              className="w-full p-3 rounded-2xl bg-dark-100 text-white placeholder-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-light-100/30"
            />
            
            <button
              onClick={() => {
                if (!extractedText.trim() && !promptInput.trim()) {
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
                <DeckEditorCard key={c.id} card={c} onDelete={deleteCard} onEdit={handleEditCard} excludeKeys={['action']}  />
              ))}
            </div>
        </div>
      </div>
    </main>
  );
};

export default CharadesDeckMaker;
