const axios = require("axios");
const { normalizeText, getFallbackReply } = require("./studentAiCore");

const OPENROUTER_API =
  process.env.OPENROUTER_API || process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo";
const HF_API = process.env.HF_API || process.env.HUGGINGFACE_API_KEY || "";
const HF_MODEL = process.env.HF_MODEL || "google/flan-t5-large";

const categoryKeywords = {
  exam_pressure: ["exam", "test", "study", "assignment", "marks", "result"],
  anxiety_support: ["anxiety", "panic", "nervous", "overthinking", "stress"],
  burnout_support: ["burnout", "exhausted", "tired", "drained", "overwhelmed"],
  loneliness_support: ["lonely", "alone", "isolated", "friendless"],
  sleep_support: ["sleep", "insomnia", "night", "wake up", "rest"]
};

const highRiskKeywords = [
  "suicide",
  "kill myself",
  "end my life",
  "want to die",
  "hurt myself",
  "no reason to live",
  "self harm"
];

const mediumRiskKeywords = [
  "anxiety",
  "panic",
  "stress",
  "hopeless",
  "burnout",
  "overwhelmed"
];

function detectCategory(text) {
  const lower = text.toLowerCase();

  for (const [category, words] of Object.entries(categoryKeywords)) {
    if (words.some((word) => lower.includes(word))) {
      return category;
    }
  }

  return "student_support";
}

function detectRisk(text) {
  const lower = text.toLowerCase();
  if (highRiskKeywords.some((word) => lower.includes(word))) return "high";
  if (mediumRiskKeywords.some((word) => lower.includes(word))) return "medium";
  return "low";
}

function buildStructuredSupport(risk, category) {
  const supportByRisk = {
    high: {
      steps: [
        "Pause and take 5 slow breaths right now.",
        "Reach out to a trusted person immediately.",
        "Contact emergency or crisis support if you feel unsafe."
      ],
      nextAction:
        "Tell me if you are currently in immediate danger so I can guide urgent steps.",
      disclaimer:
        "This assistant is not an emergency service. If you are in danger, contact local emergency support immediately."
    },
    medium: {
      steps: [
        "Name one specific stressor in one short sentence.",
        "Take a 2-minute pause away from screens.",
        "Pick one small task you can complete in 10 minutes."
      ],
      nextAction: "Share the biggest stress trigger from your day.",
      disclaimer:
        "This assistant offers supportive guidance and is not a replacement for professional care."
    },
    low: {
      steps: [
        "Check in with your energy level from 1 to 10.",
        "Do one grounding activity for 3 minutes.",
        "Plan one healthy action for the next hour."
      ],
      nextAction: "Tell me what support would help you most right now.",
      disclaimer:
        "This assistant offers supportive guidance and is not a replacement for professional care."
    }
  };

  return {
    category,
    ...supportByRisk[risk]
  };
}

function toOpenRouterMessages(history, latestMessage) {
  const normalizedHistory = Array.isArray(history)
    ? history
        .slice(-8)
        .map((item) => ({
          role: item?.role === "assistant" ? "assistant" : "user",
          content: normalizeText(String(item?.text || item?.content || ""))
        }))
        .filter((item) => item.content)
    : [];

  return [
    ...normalizedHistory,
    {
      role: "user",
      content: latestMessage
    }
  ];
}

async function openRouterCall(message, history = []) {
  if (!OPENROUTER_API) {
    throw new Error("OPENROUTER_API is missing");
  }

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: OPENROUTER_MODEL,
      messages: toOpenRouterMessages(history, message),
      temperature: 0.6
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API}`,
        "Content-Type": "application/json"
      },
      timeout: 20000
    }
  );

  const content = response?.data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Empty response from OpenRouter");
  }

  return content;
}

async function huggingFaceCall(message) {
  if (!HF_API) {
    throw new Error("HF_API is missing");
  }

  const response = await axios.post(
    `https://api-inference.huggingface.co/models/${HF_MODEL}`,
    { inputs: message },
    {
      headers: { Authorization: `Bearer ${HF_API}` },
      timeout: 20000
    }
  );

  if (Array.isArray(response.data) && response.data[0]?.generated_text) {
    return response.data[0].generated_text;
  }

  if (response?.data?.generated_text) {
    return response.data.generated_text;
  }

  throw new Error("Unexpected response from Hugging Face");
}

async function handleStudentAiChat({ message, history = [] }) {
  const normalizedMessage = normalizeText(String(message || ""));

  if (!normalizedMessage) {
    const error = new Error("Message is required");
    error.statusCode = 400;
    throw error;
  }

  const risk = detectRisk(normalizedMessage);
  const category = detectCategory(normalizedMessage);
  const structuredSupport = buildStructuredSupport(risk, category);

  let reply = "";
  let source = "fallback";

  try {
    reply = await openRouterCall(normalizedMessage, history);
    source = "openrouter";
  } catch (openRouterError) {
    try {
      reply = await huggingFaceCall(normalizedMessage);
      source = "huggingface";
    } catch (huggingFaceError) {
      reply = getFallbackReply();
    }
  }

  return {
    reply,
    risk,
    category,
    structuredSupport,
    meta: {
      source,
      timestamp: new Date().toISOString()
    }
  };
}

module.exports = {
  handleStudentAiChat
};
