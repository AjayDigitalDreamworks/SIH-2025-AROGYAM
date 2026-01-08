import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function CommunityHighlights({ communities = [] }:{ communities?: any[] }) {
  return (
    <Card className="bg-white/70 rounded-xl shadow px-7 py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">Community Highlights</h3>
        <Button variant="ghost" size="sm" className="text-primary underline decoration-primary decoration-2 font-medium px-0">
          Visit Forum
        </Button>
      </div>

      <div className="space-y-5">
        {communities.length === 0 ? (
          <div className="text-sm text-muted-foreground">No communities yet</div>
        ) : (
          communities.slice(0,3).map((c:any, index:number) => (
            <div
              key={c._id || index}
              className={`border-l-4 border-l-indigo-400 pl-5 py-3 bg-white/90 rounded-lg`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-3">
                <Avatar className={`w-8 h-8 bg-indigo-100 shadow`}>
                  <AvatarFallback className="text-xs text-gray-600 font-semibold">
                    {c.name.split(' ').map((n:any) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 mb-1">
                    <span className="font-semibold text-gray-700">{c.name}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-primary">{(c.members && c.members.length) || 0} members</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 leading-snug">
                    Community space for {c.name} members.
                  </p>
                  <div className="flex items-center gap-6 text-xs text-muted-foreground mt-1">
                    <span>{new Date(c.createdAt || Date.now()).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1 text-primary">
                      <Heart className="w-3 h-3" />
                      <span className="">{(c.members && c.members.length) || 0} likes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
