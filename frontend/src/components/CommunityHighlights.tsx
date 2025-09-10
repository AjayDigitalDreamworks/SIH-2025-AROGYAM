import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const highlights = [
  {
    user: "Emily R.",
    role: "Psychology Major",
    message: "The breathing exercises have been a game-changer for my exam anxiety. Thank you for this amazing platform!",
    timeAgo: "2 hours ago",
    likes: 24,
    borderColor: "border-l-purple-400",
    avatarBg: "bg-purple-100",
  },
  {
    user: "Alex M.",
    role: "Computer Science",
    message: "Just completed my first counseling session. Feeling hopeful and supported. It's okay to ask for help!",
    timeAgo: "5 hours ago",
    likes: 18,
    borderColor: "border-l-green-400",
    avatarBg: "bg-green-100",
  },
  {
    user: "Maria S.",
    role: "Pre-Med Student",
    message: "The study-life balance tips from the resource hub helped me manage my overwhelming schedule. Highly recommend!",
    timeAgo: "1 day ago",
    likes: 31,
    borderColor: "border-l-orange-400",
    avatarBg: "bg-orange-100",
  },
];

export function CommunityHighlights() {
  return (
    <Card className="bg-white/70 rounded-xl shadow px-7 py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">Community Highlights</h3>
        <Button variant="ghost" size="sm" className="text-primary underline decoration-primary decoration-2 font-medium px-0">
          Visit Forum
        </Button>
      </div>

      <div className="space-y-5">
        {highlights.map((highlight, index) => (
          <div
            key={index}
            className={`border-l-4 ${highlight.borderColor} pl-5 py-3 bg-white/90 rounded-lg`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start gap-3">
              <Avatar className={`w-8 h-8 ${highlight.avatarBg} shadow`}>
                <AvatarFallback className="text-xs text-gray-600 font-semibold">
                  {highlight.user.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 mb-1">
                  <span className="font-semibold text-gray-700">{highlight.user}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-primary">{highlight.role}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2 leading-snug">
                  "{highlight.message}"
                </p>
                <div className="flex items-center gap-6 text-xs text-muted-foreground mt-1">
                  <span>{highlight.timeAgo}</span>
                  <div className="flex items-center gap-1 text-primary">
                    <Heart className="w-3 h-3" />
                    <span className="">{highlight.likes} likes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
