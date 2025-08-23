import DeckMakerTemplate from "./DeckMakerTemplateTOD";
const TruthOrDareGame = {
  name: "truthordare",
  cardKey: "prompt", // the key used for your DeckMaker to know where to put the card text
  excludeKeys: [], // keys that shouldn’t be editable directly in the card editor
  systemPromptUser: `Make a Truth or dare deck 20 cards about the following user input "{{INPUT}}". Output a JSON object with a "prompts" array. Each prompt should include a "prompt" (location) and optionally "role" or "hint". 
ALWAYS respond with a JSON object in the EXACT format:
{
  "activity": "Spyfall",
  "prompts": [
    {
      "Truth": "string",
      "Dare": "string"
    }
  ]
}
Rules:
- Do not include any other keys or text.
- Do not wrap the JSON in backticks or markdown.
- Use only valid JSON.`,
  systemPromptFile: `You are creating a Truth or Dare deck 20 cards from an uploaded file. Extract key questions and problems to answer (dares), then create a JSON object in the following format:
{
  "activity": "Spyfall",
  "prompts": [
    {
      "Truth": "string",
      "Dare": "string"
    }
  ]
}
Rules:
- Do not include any other keys or text.
- Do not wrap the JSON in backticks or markdown.
- Use only valid JSON.`
};

const TODDeckMaker = ({ onBack }) => {
  return <DeckMakerTemplate onBack={onBack} game={TruthOrDareGame} />;
};
export default TODDeckMaker;
