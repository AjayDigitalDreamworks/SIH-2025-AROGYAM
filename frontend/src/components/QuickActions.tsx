import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Wind, Brain, Sun, Heart, Users } from "lucide-react";

const quickActions = [
  {
    title: "AI Chat Support",
    description: "Get instant support from our AI assistant available 24/7",
    icon: MessageCircle,
    iconBg: "bg-wellness-blue",
    buttonText: "Start Chatting",
    buttonVariant: "default" as const,
    modal: "chat"
  },
  {
    title: "Breathing Exercise",
    description: "Take a moment to relax with guided breathing exercises",
    icon: Wind,
    iconBg: "bg-wellness-green",
    buttonText: "Start Exercise",
    buttonVariant: "outline" as const,
    modal: "breathing"
  },
  {
    title: "Mental Health Quiz",
    description: "Quick assessment to check your current mental state",
    icon: Brain,
    iconBg: "bg-primary",
    buttonText: "Take Quiz",
    buttonVariant: "outline" as const,
    modal: "quiz"
  },
  {
    title: "Daily Affirmations",
    description: "Start your day with positive affirmations",
    icon: Sun,
    iconBg: "bg-wellness-yellow",
    buttonText: "View Today's",
    buttonVariant: "outline" as const,
    modal: "affirmation"
  },
  {
    title: "Self-Care Tips",
    description: "Personalized self-care recommendations",
    icon: Heart,
    iconBg: "bg-wellness-pink",
    buttonText: "Explore Tips",
    buttonVariant: "outline" as const,
    modal: "selfcare"
  },
  {
    title: "Peer Support",
    description: "Connect with fellow students in community forum",
    icon: Users,
    iconBg: "bg-wellness-blue",
    buttonText: "Join Discussion",
    buttonVariant: "outline" as const,
    modal: "peer"
  }
];

export function QuickActions() {

  const [modal, setModal] = useState<string | null>(null);

  const ModalWrapper = ({ title, children }: any) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
         onClick={() => setModal(null)}>
      <div
        className="bg-white p-6 rounded-xl w-[400px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        {children}
        <Button className="mt-4 w-full" onClick={() => setModal(null)}>
          Close
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-semibold">Quick Actions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {quickActions.map((action, index) => (
          <Card
            key={action.title}
            className="wellness-card p-6 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="space-y-4">

              <div className={`w-12 h-12 rounded-xl ${action.iconBg} flex items-center justify-center`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>

              <div>
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </div>

              <Button
                variant={action.buttonVariant}
                className="w-full"
                onClick={() => setModal(action.modal)}
              >
                {action.buttonText}
              </Button>

            </div>
          </Card>
        ))}

      </div>

      {/* Modals */}

      {modal === "chat" && (
        <ModalWrapper title="AI Chat Support">
          <p>Chat with our AI assistant here.</p>
        </ModalWrapper>
      )}

      {modal === "breathing" && (
        <ModalWrapper title="Breathing Exercise">
          <p>Follow guided breathing exercises.</p>
        </ModalWrapper>
      )}

      {modal === "quiz" && (
        <ModalWrapper title="Mental Health Quiz">
          <p>Take a quick mental health quiz.</p>
        </ModalWrapper>
      )}

      {modal === "affirmation" && (
        <ModalWrapper title="Daily Affirmation">
          <p>"You are capable and strong!"</p>
        </ModalWrapper>
      )}

      {modal === "selfcare" && (
        <ModalWrapper title="Self Care Tips">
          <p>Drink water, take breaks, and practice mindfulness.</p>
        </ModalWrapper>
      )}

      {modal === "peer" && (
        <ModalWrapper title="Peer Support">
          <p>Join the community forum.</p>
        </ModalWrapper>
      )}

    </div>
  );
}

export default QuickActions;