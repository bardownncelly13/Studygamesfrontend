import DeckMakerTemplate from "../../components/DeckMakerTemplate";
const spyGame = {
  name: "Spyfall",
  cardKey: "prompt", // the key used for your DeckMaker to know where to put the card text
  excludeKeys: [], // keys that shouldn’t be editable directly in the card editor
  systemPromptUser: `Make a Spyfall deck about the following user input "{{INPUT}}". Output a JSON object with a "prompts" array. Each prompt should include a "prompt" (location) and optionally "role" or "hint". 
ALWAYS respond with a JSON object in the EXACT format:
{
  "activity": "Spyfall",
  "prompts": [
    {
      "prompt": "string",
    }
  ]
}
Rules:
- Do not include any other keys or text.
- Do not wrap the JSON in backticks or markdown.
- Use only valid JSON.`,
  systemPromptFile: `You are creating a Spyfall deck from an uploaded file. Extract key locations and optionally roles/hints, then create a JSON object in the following format:
{
  "activity": "Spyfall",
  "prompts": [
    {
      "prompt": "string",
    }
  ]
}
Rules:
- Do not include any other keys or text.
- Do not wrap the JSON in backticks or markdown.
- Use only valid JSON.`
};

const SpyDeckMaker = ({ onBack }) => {
  return <DeckMakerTemplate onBack={onBack} game={spyGame} />;
};
export default SpyDeckMaker;
