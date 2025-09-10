import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const moods = [
  { emoji: "😭", label: "Very Sad", value: 1, color: "text-red-500" },
  { emoji: "😞", label: "Sad", value: 2, color: "text-orange-500" },
  { emoji: "😐", label: "Neutral", value: 3, color: "text-yellow-500" },
  { emoji: "😊", label: "Good", value: 4, color: "text-green-500" },
  { emoji: "😍", label: "Great", value: 5, color: "text-green-600" },
];

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(4); // Default to "Good"

  return (
    <Card className="wellness-card p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Daily Mood Tracker</h3>
          <Button variant="ghost" size="sm" className="text-primary">
            View History
          </Button>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            How are you feeling right now?
          </p>
          
          <div className="flex justify-between gap-2">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`
                  mood-selector flex flex-col items-center p-3 min-w-0 flex-1
                  ${selectedMood === mood.value ? 'selected border-primary bg-primary/10' : ''}
                `}
              >
                <span className="text-2xl mb-2">{mood.emoji}</span>
                <span className="text-xs font-medium text-center leading-tight">
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-4"  style={{ width: '250px' }}>
          <h4 className="font-medium mb-3">This Week's Mood Trend</h4>
          <div className="flex items-end gap-1 h-16">
            {[
              { value: 3, color: 'bg-green-500' },
              { value: 2, color: 'bg-orange-500' },
              { value: 4, color: 'bg-green-500' },
              { value: 5, color: 'bg-purple-600' },
              { value: 4, color: 'bg-green-500' },
              { value: 3, color: 'bg-green-500' },
              { value: 4, color: 'bg-green-500' }
            ].map((item, index) => (
              <div
                key={index}
                className="flex-1 bg-muted rounded-sm relative"
                style={{ height: `${(item.value / 5) * 100}%` }}
              >
                <div 
                  className={`absolute bottom-0 left-0 right-0 ${item.color} rounded-sm transition-all`}
                  style={{ height: '100%' }}
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