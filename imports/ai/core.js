
const normalizeText = (text)=>{
  return text.trim().replace(/\s+/g," ");
};

const fallbackReplies = [
  "I understand. Tell me more about how you feel.",
  "You're not alone. I'm here to listen.",
  "It sounds difficult. What happened?"
];

function getFallback(){
  return fallbackReplies[Math.floor(Math.random()*fallbackReplies.length)];
}

module.exports = {
  normalizeText,
  getFallback
};
