import React, { useState } from "react";
import { Dumbbell, Play, Clock, Target, Trophy, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Exercise() {
  const [activeCategory, setActiveCategory] = useState("stress-relief");

  const exerciseCategories = [
    { id: "stress-relief", name: "Stress Relief", color: "bg-wellness-green" },
    { id: "energy-boost", name: "Energy Boost", color: "bg-wellness-orange" },
    { id: "study-break", name: "Study Break", color: "bg-wellness-blue" },
    { id: "sleep-prep", name: "Sleep Prep", color: "bg-wellness-purple" }
  ];

  const exercisePlans = {
    "stress-relief": [
      {
        title: "Quick Desk Stretches",
        duration: "5 mins",
        difficulty: "Easy",
        description: "Perfect for between study sessions",
        exercises: ["Neck rolls", "Shoulder shrugs", "Wrist stretches", "Spinal twists"]
      },
      {
        title: "Breathing & Movement",
        duration: "10 mins",
        difficulty: "Easy",
        description: "Combine deep breathing with gentle movement",
        exercises: ["Deep breathing", "Arm circles", "Hip circles", "Gentle stretches"]
      },
      {
        title: "Stress-Busting Yoga",
        duration: "15 mins",
        difficulty: "Medium",
        description: "Yoga poses to release tension",
        exercises: ["Child's pose", "Cat-cow", "Downward dog", "Pigeon pose"]
      }
    ],
    "energy-boost": [
      {
        title: "Morning Energizer",
        duration: "8 mins",
        difficulty: "Medium",
        description: "Start your day with energy",
        exercises: ["Jumping jacks", "Arm swings", "Leg raises", "Torso twists"]
      },
      {
        title: "Midday Pick-Me-Up",
        duration: "12 mins",
        difficulty: "Medium",
        description: "Combat afternoon fatigue",
        exercises: ["High knees", "Butt kicks", "Push-ups", "Squats"]
      }
    ],
    "study-break": [
      {
        title: "2-Minute Micro Break",
        duration: "2 mins",
        difficulty: "Easy",
        description: "Quick movement between tasks",
        exercises: ["Stand & stretch", "Eye exercises", "Neck stretches", "Deep breaths"]
      },
      {
        title: "Focus Reset",
        duration: "7 mins",
        difficulty: "Easy",
        description: "Refresh your mind and body",
        exercises: ["Walking in place", "Arm stretches", "Spinal twists", "Calf raises"]
      }
    ],
    "sleep-prep": [
      {
        title: "Evening Wind-Down",
        duration: "10 mins",
        difficulty: "Easy",
        description: "Prepare your body for rest",
        exercises: ["Gentle stretches", "Leg elevation", "Progressive relaxation", "Deep breathing"]
      }
    ]
  };

  const weeklyGoals = {
    completed: 12,
    target: 15,
    streak: 5
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-wellness-orange flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Exercise Plans</h1>
          </div>
          <p className="text-muted-foreground">Student-friendly workouts to boost wellness and manage stress</p>
        </div>

        {/* Weekly Progress */}
        <Card className="mb-8 gradient-subtle border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              This Week's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{weeklyGoals.completed}</div>
                <div className="text-sm text-muted-foreground">Workouts Completed</div>
                <Progress value={(weeklyGoals.completed / weeklyGoals.target) * 100} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-wellness-orange mb-1">{weeklyGoals.target}</div>
                <div className="text-sm text-muted-foreground">Weekly Goal</div>
                <Badge variant="secondary" className="mt-2">
                  {Math.round((weeklyGoals.completed / weeklyGoals.target) * 100)}% Complete
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-wellness-green mb-1">{weeklyGoals.streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
                <div className="text-xs text-muted-foreground mt-1">Keep it up! 🔥</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {exerciseCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className="mb-2"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Exercise Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {exercisePlans[activeCategory]?.map((plan, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-1">{plan.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{plan.duration}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {plan.difficulty}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  {plan.exercises.map((exercise, exerciseIndex) => (
                    <div key={exerciseIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      {exercise}
                    </div>
                  ))}
                </div>
                
                <Button className="w-full gradient-primary text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Start Workout
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Exercise Tips for Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-wellness-green/10">
                  <h4 className="font-medium text-wellness-green mb-2">Study Break Movement</h4>
                  <p className="text-sm text-muted-foreground">Take a 2-minute movement break every hour of studying to maintain focus and reduce muscle tension.</p>
                </div>
                <div className="p-4 rounded-lg bg-wellness-blue/10">
                  <h4 className="font-medium text-wellness-blue mb-2">Stress Management</h4>
                  <p className="text-sm text-muted-foreground">Regular exercise reduces cortisol levels and releases endorphins, naturally managing study stress.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-wellness-orange/10">
                  <h4 className="font-medium text-wellness-orange mb-2">Energy Boost</h4>
                  <p className="text-sm text-muted-foreground">Morning exercises increase alertness and energy levels throughout the day, improving academic performance.</p>
                </div>
                <div className="p-4 rounded-lg bg-wellness-purple/10">
                  <h4 className="font-medium text-wellness-purple mb-2">Better Sleep</h4>
                  <p className="text-sm text-muted-foreground">Evening stretches and relaxation exercises prepare your body for quality sleep after a busy day.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}