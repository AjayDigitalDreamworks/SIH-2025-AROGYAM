import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, BookmarkPlus } from "lucide-react";

export function WellnessTip() {
  return (
    <Card className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-0 shadow-md rounded-xl px-8 py-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-green-400 flex items-center justify-center shadow">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-base font-bold text-green-900 bg-green-100 px-3 py-1 rounded-lg">Today's Wellness Tip</h3>
      </div>

      <div className="bg-white/60 rounded-lg px-6 py-5 shadow-inner">
        <h4 className="font-semibold text-lg text-green-800 mb-1">The 5-4-3-2-1 Grounding Technique</h4>
        <p className="text-green-700 mb-4">
          When feeling overwhelmed or anxious, try this simple grounding exercise:
        </p>

        <div className="space-y-3 mb-5">
          {[
            { number: 5, text: "Name 5 things you can see around you", color: "bg-purple-100 text-purple-700" },
            { number: 4, text: "Name 4 things you can touch", color: "bg-blue-100 text-blue-700" },
            { number: 3, text: "Name 3 things you can hear", color: "bg-green-100 text-green-700" },
            { number: 2, text: "Name 2 things you can smell", color: "bg-yellow-100 text-yellow-700" },
            { number: 1, text: "Name 1 thing you can taste", color: "bg-red-100 text-red-700" },
          ].map((step) => (
            <div key={step.number} className="flex items-center gap-4">
              <div className={`w-7 h-7 rounded-full ${step.color} flex items-center justify-center font-bold text-base shadow-sm`}>
                {step.number}
              </div>
              <span className="text-sm text-gray-700 font-medium">{step.text}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button size="sm" className="bg-primary hover:bg-primary/90 font-semibold shadow">
            Try It Now
          </Button>
          <Button variant="outline" size="sm" className="flex items-center text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400 font-semibold shadow">
            <BookmarkPlus className="w-4 h-4 mr-2" />
            Save for Later
          </Button>
        </div>
      </div>
    </Card>
  );
}
