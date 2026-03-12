const normalizeText = (text = "") => text.trim().replace(/\s+/g, " ");

const fallbackReplies = [
  "I understand. Tell me more about how you feel.",
  "You're not alone. I'm here to listen.",
  "It sounds difficult. What happened?",
  "I hear you. Let's take this one step at a time."
];

function getFallbackReply() {
  return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
}

module.exports = {
  normalizeText,
  getFallbackReply
};
