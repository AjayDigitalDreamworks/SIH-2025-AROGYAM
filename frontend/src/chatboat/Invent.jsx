// App.js
import React, { useState } from "react";
import axios from "axios";

function chatInvent() {
  const [symptom, setSymptom] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    if (!symptom || !message) return;

    try {
      const res = await axios.post("https://arogyam-9rll.onrender.com/api/intervention", {
        symptom,
        message,
        feedback: rating !== 0 && response ? { module: response.selectedModule.name, rating } : null
      });

      setResponse(res.data);
      setHistory([res.data, ...history]);
      setRating(0);
      setMessage("");
      setSymptom("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleFeedback = async () => {
    if (!response || rating === 0) return;

    try {
      await axios.post("https://arogyam-9rll.onrender.com/api/intervention", {
        symptom: response.symptom,
        message: "Feedback update",
        feedback: { module: response.selectedModule.name, rating }
      });
      setRating(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", fontFamily: "Arial, sans-serif", padding: "1rem" }}>
      <h1 style={{ textAlign: "center", color: "#4CAF50" }}>Adaptive AI Mental First Aid</h1>

      {/* Input Section */}
      <div style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Enter symptom (exam stress, burnout)"
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          style={{ width: "48%", padding: "0.5rem", marginRight: "1%", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Describe your feelings or situation"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "48%", padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <br /><br />
        <button onClick={handleSubmit} style={{ padding: "0.6rem 1.2rem", borderRadius: "5px", background: "#4CAF50", color: "#fff", border: "none", cursor: "pointer" }}>
          Get Intervention
        </button>
      </div>

      {/* Response Section */}
      {response && (
        <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "1rem", marginBottom: "1rem", background: "#f9f9f9" }}>
          <h3>Selected Module: <span style={{ color: "#4CAF50" }}>{response.selectedModule.name}</span></h3>
          <p><strong>AI Guidance:</strong> {response.aiResponse}</p>
          <div style={{ marginTop: "1rem" }}>
            <label>Feedback (-1 to +1): </label>
            <input type="number" step="0.1" min="-1" max="1" value={rating} onChange={e => setRating(parseFloat(e.target.value))} style={{ width: "60px", marginRight: "1rem" }} />
            <button onClick={handleFeedback} style={{ padding: "0.3rem 0.8rem", background: "#2196F3", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>Submit Feedback</button>
          </div>
        </div>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <div>
          <h3>Previous Interventions</h3>
          {history.map((item, idx) => (
            <div key={idx} style={{ border: "1px solid #eee", padding: "0.5rem", marginBottom: "0.5rem", borderRadius: "5px", background: "#fff" }}>
              <p><strong>Symptom:</strong> {item.symptom}</p>
              <p><strong>Module:</strong> {item.selectedModule.name}</p>
              <p><strong>AI Guidance:</strong> {item.aiResponse}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default chatInvent;