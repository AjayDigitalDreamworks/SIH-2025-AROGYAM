import React, { useState, useEffect } from "react";
import api from "@/config/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const moods = [
  { emoji: "😭", label: "Very Sad", value: 1, color: "bg-red-500" },
  { emoji: "😞", label: "Sad", value: 2, color: "bg-orange-500" },
  { emoji: "😐", label: "Neutral", value: 3, color: "bg-yellow-500" },
  { emoji: "😊", label: "Good", value: 4, color: "bg-green-500" },
  { emoji: "😍", label: "Great", value: 5, color: "bg-green-600" },
];

export default function DailyMoodTracker() {

  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [trend, setTrend] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/api/mood/history")
      .then(res => {
        setTrend(res.data.trend || []);
        setSelectedMood(res.data.todayMood);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const submitMood = async (mood: number) => {
    setSubmitting(true);
    try {
      await api.post("/api/mood", { mood });
      setSelectedMood(mood);

      const res = await api.get("/api/mood/history");
      setTrend(res.data.trend || []);
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <Card className="wellness-card p-6">
        Loading...
      </Card>
    );
  }

  return (
    <Card className="wellness-card p-6">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Daily Mood Tracker</h3>
          <Button variant="ghost" size="sm" className="text-primary">
            View History
          </Button>
        </div>

        {/* Mood Selection */}
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            How are you feeling right now?
          </p>

          <div className="flex justify-between gap-2">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => submitMood(mood.value)}
                disabled={submitting}
                className={`mood-selector flex flex-col items-center p-3 flex-1
                ${selectedMood === mood.value ? 'border-primary bg-primary/10' : ''}`}
              >
                <span className="text-2xl mb-2">{mood.emoji}</span>
                <span className="text-xs font-medium text-center">
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="border-t pt-4" style={{ width: "250px" }}>
          <h4 className="font-medium mb-3">This Week's Mood Trend</h4>

          <div className="flex items-end gap-1 h-16">
            {trend.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-muted rounded-sm relative"
                style={{ height: `${(value / 5) * 100}%` }}
              >
                <div
                  className={`absolute bottom-0 left-0 right-0 ${moods[value - 1]?.color || 'bg-gray-400'} rounded-sm`}
                  style={{ height: "100%" }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

      </div>
    </Card>
  );
}