import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/config/api";

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const [previousFeedback, setPreviousFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/api/feedback").then(res => {
      setPreviousFeedback(res.data.feedback);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const submitFeedback = async () => {
    setSubmitting(true);
    await api.post("/api/feedback", { feedback });
    setFeedback("");
    const res = await api.get("/api/feedback");
    setPreviousFeedback(res.data.feedback);
    setSubmitting(false);
  };

  if (loading) return <Card className="wellness-card p-6">Loading...</Card>;

  return (
    <Card className="wellness-card p-6">
      <h3 className="text-lg font-semibold mb-4">Review & Feedback</h3>
      <textarea
        className="w-full border rounded p-2 mb-4"
        rows={3}
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        placeholder="Share your feedback..."
      />
      <Button onClick={submitFeedback} disabled={submitting || !feedback} className="mb-4">Submit</Button>
      <h4 className="font-medium mb-2">Previous Feedback</h4>
      <ul className="space-y-2">
        {previousFeedback.map((fb, idx) => (
          <li key={idx} className="text-sm text-muted-foreground">{fb}</li>
        ))}
      </ul>
    </Card>
  );
}
