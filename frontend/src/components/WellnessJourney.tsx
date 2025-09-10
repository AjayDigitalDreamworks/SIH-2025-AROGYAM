import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, Trophy, Target } from "lucide-react";

const goals = [
  {
    title: "Daily Mood Check-ins",
    total: 30,
    current: 12,
    color: "bg-purple-400",
    barColor: "bg-purple-400",
  },
  {
    title: "Meditation Sessions",
    total: 20,
    current: 8,
    color: "bg-green-400",
    barColor: "bg-green-400",
  },
  {
    title: "Resource Articles Read",
    total: 25,
    current: 15,
    color: "bg-blue-400",
    barColor: "bg-blue-400",
  },
];

const achievements = [
  {
    title: "First Week Complete",
    description: "Completed 7 consecutive check-ins",
    icon: Trophy,
    bg: "bg-yellow-100",
    iconBg: "bg-yellow-400",
  },
  {
    title: "Mindfulness Explorer",
    description: "Completed 5 meditation sessions",
    icon: Star,
    bg: "bg-green-100",
    iconBg: "bg-green-400",
  },
  {
    title: "Knowledge Seeker",
    description: "Read 10 wellness articles",
    icon: Target,
    bg: "bg-blue-100",
    iconBg: "bg-blue-400",
  },
];

export function WellnessJourney() {
  return (
    <Card className="bg-white/80 rounded-xl shadow px-8 py-7">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Your Wellness Journey</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
        {/* Monthly Goals */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-4">Monthly Goals</h4>
          <div className="space-y-6">
            {goals.map((goal) => {
              const progress = (goal.current / goal.total) * 100;
              return (
                <div key={goal.title}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{goal.title}</span>
                    <span className="text-xs text-gray-600 font-semibold">
                      {goal.current}/{goal.total}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-lg bg-gray-200 overflow-hidden">
                    <div
                      className={`h-2 rounded-lg ${goal.barColor} transition-all`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Achievements */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-4">Achievements</h4>
          <div className="space-y-4">
            {achievements.map((achieve) => (
              <div key={achieve.title} className={`flex items-center gap-4 px-3 py-3 rounded-lg ${achieve.bg}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${achieve.iconBg} mr-1`}>
                  <achieve.icon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900">{achieve.title}</p>
                  <p className="text-xs text-gray-600">{achieve.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
