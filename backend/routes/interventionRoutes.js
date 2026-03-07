const express = require("express");
const router = express.Router();
// const { getAdaptiveIntervention } = require("../controllers/interventionController");
const axios = require("axios");
const { selectAdaptiveModule, updateModuleScores } = require("../services/rlService");


// Predefined CBT modules
const CBTModules = [
  { name: "Breathing Exercise", symptom: "exam stress" },
  { name: "Peer Connect", symptom: "social isolation" },
  { name: "Academic Planning Toolkit", symptom: "burnout" },
  { name: "Mindfulness + Grounding", symptom: "anxiety" },
  { name: "Goal Setting + Rewards", symptom: "low motivation" },
];

// Store module scores (simulate RL)
let moduleScores = CBTModules.reduce((acc, mod) => {
  acc[mod.name] = 1;
  return acc;
}, {});

const getAdaptiveIntervention = async (req, res) => {
  try {
    const { symptom, message, feedback } = req.body;

    // Update RL scores if feedback is provided
    if (feedback && CBTModules.some(m => m.name === feedback.module)) {
      updateModuleScores(moduleScores, feedback);
    }

    // Select adaptive module
    const selectedModule = selectAdaptiveModule(symptom, CBTModules, moduleScores);

    // Call OpenRouter API for adaptive conversational guidance
    const aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a mental health assistant. Provide CBT-based guidance." },
          { role: "user", content: `Symptom: ${symptom}. Student message: ${message}. Suggest module: ${selectedModule.name} with personalized advice.` }
        ],
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      symptom,
      selectedModule,
      aiResponse: aiResponse.data.choices[0].message.content
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { getAdaptiveIntervention };


router.post("/", getAdaptiveIntervention);

module.exports = router;