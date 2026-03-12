const express = require("express");
const { handleStudentAiChat } = require("../services/studentAiService");

const router = express.Router();

router.post("/message", async (req, res) => {
  try {
    const { message, history = [] } = req.body || {};

    if (typeof message !== "string") {
      return res.status(400).json({ error: "message must be a string" });
    }

    const result = await handleStudentAiChat({
      message,
      history: Array.isArray(history) ? history : []
    });

    return res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      error: statusCode === 500 ? "Unable to process AI request" : error.message,
      detail: error.message
    });
  }
});

module.exports = router;
