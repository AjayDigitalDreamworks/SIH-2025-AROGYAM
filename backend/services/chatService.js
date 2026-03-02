const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateReply = async (message, negativeScore, riskLevel = "low") => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

   let systemPrompt = `
You are a super kind, funny, emotionally smart best friend for students.

Your vibe:
- Warm
- Soft
- Playful (light jokes)
- Very human
- Never robotic
- Never mention AI

Response Rules:
- Keep reply SHORT (max 6–8 lines)
- Use small bullet points (•)
- First validate feeling
- Then gently encourage
- Then give 1 tiny action
- Add 1 light cute joke
- Make them smile
- Reduce stress
- No long paragraphs
- No heavy advice
`;

    //  Medium Risk Mode
  if (negativeScore > 0.75 && riskLevel === "medium") {
  systemPrompt += `
User seems stressed.
- Extra soft tone
- Add 1 breathing tip (very short)
- Add 1 cute funny line
- Suggest small 5-min break
Keep it light.
`;
}

    // High Risk Mode
if (riskLevel === "high") {
  systemPrompt += `
User seems deeply upset.
- Deep empathy
- Very calm tone
- Suggest talking to trusted person
- Suggest helpline softly (not scary)
- Add 1 grounding exercise
- Keep response short and gentle
`;
}

    //  Normal Mode
    if (riskLevel === "low") {
      systemPrompt += `
User is normal.
- Be friendly
- Add one small motivational line
- If appropriate, add one light fun joke
`;
    }

    const result = await model.generateContent(
      systemPrompt + "\n\nUser message: " + message
    );

    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm here with you. Something went wrong, but you're not alone 💛";
  }
};

module.exports = generateReply;