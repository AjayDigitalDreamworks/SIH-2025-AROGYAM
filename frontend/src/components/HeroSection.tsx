import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar } from "lucide-react";

interface HeroSectionProps {
  userName?: string;
}

export function HeroSection({ userName = "Sarah" }: HeroSectionProps) {
  return (
    <div className="gradient-primary rounded-2xl p-8 text-white mb-8 animate-fade-in">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          Good morning, {userName}! 👋
        </h1>
        <p className="text-white/90 text-lg mb-6 leading-relaxed">
          How are you feeling today? Remember, taking care of your mental health is just as important as your studies.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="secondary" 
            size="lg" 
            className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white backdrop-blur-sm"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat with AI Assistant
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Counseling
          </Button>
        </div>
      </div>
    </div>
  );
}