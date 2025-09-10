import React, { useState } from "react";
import { Star, MessageSquare, ThumbsUp, Send, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("counselor");

  const feedbackCategories = [
    { id: "counselor", name: "Counseling Sessions", icon: MessageSquare },
    { id: "resources", name: "Resource Hub", icon: Award },
    { id: "chatbot", name: "AI Assistant", icon: MessageSquare },
    { id: "app", name: "Overall App", icon: TrendingUp }
  ];

  const recentFeedback = [
    {
      category: "Counseling",
      rating: 5,
      comment: "Dr. Smith was incredibly helpful and understanding. The session really helped me manage my anxiety.",
      date: "2 days ago",
      response: "Thank you for your feedback! We're glad Dr. Smith could help."
    },
    {
      category: "AI Assistant",
      rating: 4,
      comment: "The chatbot provides good initial support, though sometimes I need more detailed responses.",
      date: "1 week ago",
      response: "We're working on enhancing the AI responses based on your feedback."
    },
    {
      category: "Resources",
      rating: 5,
      comment: "The mindfulness videos were exactly what I needed during finals week!",
      date: "1 week ago",
      response: "So happy to hear the resources helped during your stressful time!"
    }
  ];

  const overallStats = {
    averageRating: 4.6,
    totalReviews: 1247,
    satisfaction: 92,
    responseRate: 98
  };

  const handleSubmitFeedback = () => {
    // Handle feedback submission logic here
    console.log("Feedback submitted:", { category: selectedCategory, rating, feedback });
    setRating(0);
    setFeedback("");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-wellness-yellow flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Review & Feedback</h1>
          </div>
          <p className="text-muted-foreground">Share your experience and help us improve our mental wellness services</p>
        </div>

        {/* Overall Stats */}
        <Card className="mb-8 gradient-subtle border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Community Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(overallStats.averageRating) 
                          ? "text-wellness-yellow fill-current" 
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-2xl font-bold text-primary mb-1">{overallStats.averageRating}</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{overallStats.totalReviews}</div>
                <div className="text-sm text-muted-foreground">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-wellness-green mb-1">{overallStats.satisfaction}%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-wellness-blue mb-1">{overallStats.responseRate}%</div>
                <div className="text-sm text-muted-foreground">Response Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="leave-feedback" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leave-feedback">Leave Feedback</TabsTrigger>
            <TabsTrigger value="view-feedback">Your Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="leave-feedback" className="space-y-8">
            {/* Feedback Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Share Your Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">What would you like to review?</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {feedbackCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category.id)}
                        className="h-auto p-4 flex flex-col items-center gap-2"
                      >
                        <category.icon className="w-5 h-5" />
                        <span className="text-sm">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">How was your experience?</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating ? "text-wellness-yellow fill-current" : "text-muted hover:text-wellness-yellow"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {rating === 5 ? "Excellent!" : 
                       rating === 4 ? "Very Good" :
                       rating === 3 ? "Good" :
                       rating === 2 ? "Fair" : "Needs Improvement"}
                    </div>
                  )}
                </div>

                {/* Feedback Text */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Tell us more about your experience (optional)
                  </label>
                  <Textarea
                    placeholder="Share details about what went well or what could be improved..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleSubmitFeedback}
                  disabled={rating === 0}
                  className="gradient-primary text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="view-feedback" className="space-y-6">
            {/* Your Feedback History */}
            <div className="space-y-4">
              {recentFeedback.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{item.category}</Badge>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= item.rating ? "text-wellness-yellow fill-current" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.date}</span>
                    </div>
                    
                    <p className="text-sm text-foreground mb-3">{item.comment}</p>
                    
                    {item.response && (
                      <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-primary">
                        <div className="flex items-center gap-2 mb-1">
                          <ThumbsUp className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">Team Response</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.response}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Feedback Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">What makes great feedback:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-wellness-green mt-2 flex-shrink-0"></div>
                    Specific examples of your experience
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-wellness-green mt-2 flex-shrink-0"></div>
                    Constructive suggestions for improvement
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-wellness-green mt-2 flex-shrink-0"></div>
                    Honest and respectful communication
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Our commitment:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    We respond to all feedback within 48 hours
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    Your feedback directly improves our services
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    All feedback is kept confidential
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}