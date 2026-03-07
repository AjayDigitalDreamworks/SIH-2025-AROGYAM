const express = require("express");
const router = express.Router();


const { getStep } = require("../services/hybridService");

let history = []; 

const getHybridStep = (req, res) => {
  try {
    const { symptomLevel, message } = req.body;

    const stepInfo = getStep(symptomLevel);

    // Save history
    const record = { symptomLevel, message, stepInfo, timestamp: new Date() };
    history.unshift(record);

    res.json({ ...record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getHistory = (req, res) => {
  res.json(history);
};





router.post("/step", getHybridStep);
router.get("/history", getHistory);

module.exports = router;

// module.exports = { getHybridStep, getHistory };