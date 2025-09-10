import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const resourcesData = [
  {
    id: 1,
    type: "Article",
    title: "Managing Academic Stress",
    description: "Learn effective techniques to handle academic pressure and maintain balance.",
    duration: "5 min read",
    image: "🎓",
    action: "Read More",
    bgGradient: "from-blue-100 to-blue-50"
  },
  {
    id: 2,
    type: "Video", 
    title: "Guided Meditation for Students",
    description: "A 10 minute meditation session designed specifically for busy students.",
    duration: "10 min watch",
    image: "🧘‍♀️",
    action: "Watch Now",
    bgGradient: "from-green-100 to-green-50"
  },
  {
    id: 3,
    type: "Guide",
    title: "Better Sleep Habits",
    description: "Improve your sleep quality with these evidence-based strategies.",
    duration: "7 min read", 
    image: "😴",
    action: "Read Guide",
    bgGradient: "from-purple-100 to-purple-50"
  }
];

const typeColors = {
  Article: "bg-primary text-primary-foreground",
  Video: "bg-secondary text-secondary-foreground", 
  Guide: "bg-accent text-accent-foreground"
};

export function LatestResources() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Latest Resources</h2>
        <Link to="/resources">
          <Button variant="ghost" className="text-primary hover:text-primary/80">
            View All Resources
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resourcesData.map((resource) => (
          <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            {/* Image Section */}
            <div className={`h-48 bg-gradient-to-br ${resource.bgGradient} flex items-center justify-center text-6xl`}>
              {resource.image}
            </div>
            
            {/* Content Section */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={typeColors[resource.type as keyof typeof typeColors]}>
                  {resource.type}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {resource.duration}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {resource.description}
                </p>
              </div>
              
              <Button className="w-full group-hover:shadow-md transition-all">
                {resource.action}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}