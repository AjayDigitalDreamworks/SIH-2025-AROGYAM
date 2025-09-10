import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Wind, 
  Brain, 
  Sun, 
  Heart, 
  Users 
} from "lucide-react";

const quickActions = [
  {
    title: "AI Chat Support",
    description: "Get instant support from our AI assistant available 24/7",
    icon: MessageCircle,
    iconBg: "bg-wellness-blue",
    buttonText: "Start Chatting",
    buttonVariant: "default" as const,
  },
  {
    title: "Breathing Exercise",
    description: "Take a moment to relax with guided breathing exercises",
    icon: Wind,
    iconBg: "bg-wellness-green",
    buttonText: "Start Exercise",
    buttonVariant: "outline" as const,
  },
  {
    title: "Mental Health Quiz",
    description: "Quick assessment to check your current mental state",
    icon: Brain,
    iconBg: "bg-primary",
    buttonText: "Take Quiz",
    buttonVariant: "outline" as const,
  },
  {
    title: "Daily Affirmations",
    description: "Start your day with positive affirmations and motivation",
    icon: Sun,
    iconBg: "bg-wellness-yellow",
    buttonText: "View Today's",
    buttonVariant: "outline" as const,
  },
  {
    title: "Self-Care Tips",
    description: "Personalized self-care recommendations for you",
    icon: Heart,
    iconBg: "bg-wellness-pink",
    buttonText: "Explore Tips",
    buttonVariant: "outline" as const,
  },
  {
    title: "Peer Support",
    description: "Connect with fellow students in our community forum",
    icon: Users,
    iconBg: "bg-wellness-blue",
    buttonText: "Join Discussion",
    buttonVariant: "outline" as const,
  },
];

export function QuickActions() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Card key={action.title} className="wellness-card p-6 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-xl ${action.iconBg} flex items-center justify-center`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {action.description}
                </p>
              </div>
              
              <Button variant={action.buttonVariant} className="w-full">
                {action.buttonText}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}