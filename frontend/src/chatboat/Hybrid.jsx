import React, { useState, useEffect } from "react";
import axios from "axios";

function Hybrid() {
  const [symptomLevel, setSymptomLevel] = useState("");
  const [message, setMessage] = useState("");
  const [feedbackScore, setFeedbackScore] = useState(3);
  const [currentStep, setCurrentStep] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("https://arogyam-9rll.onrender.com/api/hybrid/history");
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async () => {
    if (!symptomLevel || !message) return;
    try {
      const res = await axios.post("https://arogyam-9rll.onrender.com/api/hybrid/step", {
        symptomLevel,
        message,
        feedbackScore
      });
      setCurrentStep(res.data);
      setSymptomLevel("");
      setMessage("");
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", fontFamily: "Arial, sans-serif", padding: "1rem" }}>
      <h1 style={{ textAlign: "center", color: "#FF5722" }}>Peer + Professional Hybrid Care</h1>

      {/* Input */}
      <div style={{ marginBottom: "1.5rem" }}>
        <select value={symptomLevel} onChange={e => setSymptomLevel(e.target.value)} style={{ width: "48%", padding: "0.5rem", marginRight: "1%" }}>
          <option value="">Select Symptom Level</option>
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </select>
        <input
          type="text"
          placeholder="Describe your feelings"
          value={message}
          onChange={e => setMessage(e.target.value)}
          style={{ width: "48%", padding: "0.5rem" }}
        />
        <br /><br />
        <label>Feedback Score (1-5): </label>
        <input type="number" min="1" max="5" value={feedbackScore} onChange={e => setFeedbackScore(parseInt(e.target.value))} style={{ width: "60px", marginRight: "1rem" }} />
        <button onClick={handleSubmit} style={{ padding: "0.6rem 1.2rem", background: "#FF5722", color: "#fff", border: "none", borderRadius: "5px" }}>Submit</button>
      </div>

      {/* Current Step */}
      {currentStep && (
        <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "10px", marginBottom: "1rem", background: "#fff3e0" }}>
          <h3>Current Step: Step {currentStep.stepInfo.step}</h3>
          <p>Assigned Support: <strong>{currentStep.stepInfo.support}</strong></p>
          <p>Message: {currentStep.message}</p>
          <p>Feedback Score: {currentStep.feedbackScore}</p>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <h3>Step History</h3>
          {history.map((h, idx) => (
            <div key={idx} style={{ border: "1px solid #eee", padding: "0.5rem", marginBottom: "0.5rem", borderRadius: "5px", background: "#fff" }}>
              <p><strong>Step {h.stepInfo.step}</strong> → {h.stepInfo.support}</p>
              <p>Symptom Level: {h.symptomLevel}</p>
              <p>Message: {h.message}</p>
              <p>Feedback Score: {h.feedbackScore}</p>
              <p><small>{new Date(h.timestamp).toLocaleString()}</small></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Hybrid;