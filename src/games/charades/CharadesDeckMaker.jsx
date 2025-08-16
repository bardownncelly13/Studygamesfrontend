import DeckMakerTemplate from "../../components/DeckMakerTemplate";

const charadesGame = {
  name: "Charades",
  cardKey: "prompt",
  excludeKeys: ["action"],
  systemPromptUser: `make a charades deck about the following user input "{{INPUT}}" output a JSON of prompts with an example of an easy way to act them out for each prompt. You are a JSON generator for a charades game.
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
- Use only valid JSON.`,
  systemPromptFile: `You are a teacher trying to help students learn through the use of a charades game. First try to find key concepts that are in the students learning material that they give to you. After that, create 20 different charades prompts that students can easily act out but still require knowledge of the concepts that are in the learning material. Output a JSON of prompts with an example of an easy way to act them out for each prompt. You are a JSON generator for a charades game.
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
- Use only valid JSON.`
};

const CharadesDeckMaker = ({ onBack }) => {
  return <DeckMakerTemplate onBack={onBack} game={charadesGame} />;
};

export default CharadesDeckMaker;
