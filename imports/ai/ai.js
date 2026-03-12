
const axios = require("axios");

const OPENROUTER_API = process.env.OPENROUTER_API || "";
const HF_API = process.env.HF_API || "";

async function openRouterCall(message){
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model:"openai/gpt-3.5-turbo",
      messages:[{role:"user",content:message}]
    },
    {headers:{Authorization:`Bearer ${OPENROUTER_API}`}}
  );

  return res.data.choices[0].message.content;
}

async function huggingFaceCall(message){
  const res = await axios.post(
    "https://api-inference.huggingface.co/models/google/flan-t5-large",
    {inputs:message},
    {headers:{Authorization:`Bearer ${HF_API}`}}
  );

  if(Array.isArray(res.data)){
    return res.data[0].generated_text;
  }
  return "I understand. Tell me more.";
}

function simpleClassifier(text){
  text=text.toLowerCase();
  if(text.includes("suicide")||text.includes("kill myself")) return "high";
  if(text.includes("stress")||text.includes("anxiety")) return "medium";
  return "low";
}

async function handleChat(message){

  const risk = simpleClassifier(message);

  let reply;

  try{
    reply = await openRouterCall(message);
  }catch(e){
    reply = await huggingFaceCall(message);
  }

  return {
    reply,
    risk,
    category:"student_support",
    structuredSupport:{
      suggestion:"Take a short break, breathe slowly, and talk to someone you trust."
    }
  };
}

module.exports = { handleChat };
