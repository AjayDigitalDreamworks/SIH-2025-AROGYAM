
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { handleChat } = require("./ai");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/api/chat", async (req,res)=>{
  try{
    const { message } = req.body;
    const result = await handleChat(message);
    res.json(result);
  }catch(err){
    res.status(500).json({error:"Server error", detail:err.message});
  }
});

app.get("/",(req,res)=>{
  res.send("AI Support Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log("Server running on",PORT));
