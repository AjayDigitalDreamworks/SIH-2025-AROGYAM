import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  BookOpen, 
  Headphones, 
  Download, 
  Clock, 
  Star, 
  Search,
  Heart,
  Brain,
  Moon,
  Dumbbell,
  Users
} from "lucide-react";

const resources = {
  videos: [
    {
      id: '1',
      title: '5-Minute Meditation for Students',
      description: 'Quick guided meditation perfect for busy student schedules',
      duration: '5 min',
      rating: 4.8,
      category: 'Meditation',
      thumbnail: '🧘‍♀️',
      tags: ['stress relief', 'meditation', 'quick']
    },
    {
      id: '2',
      title: 'Managing Exam Anxiety',
      description: 'Evidence-based techniques to reduce test anxiety and improve performance',
      duration: '12 min',
      rating: 4.9,
      category: 'Academic',
      thumbnail: '📚',
      tags: ['anxiety', 'exams', 'study tips']
    },
    {
      id: '3',
      title: 'Sleep Hygiene for Better Rest',
      description: 'Learn how to improve your sleep quality for better mental health',
      duration: '8 min',
      rating: 4.7,
      category: 'Sleep',
      thumbnail: '😴',
      tags: ['sleep', 'wellness', 'habits']
    },
    {
      id: '4',
      title: 'Building Healthy Relationships',
      description: 'Communication skills for better friendships and romantic relationships',
      duration: '15 min',
      rating: 4.6,
      category: 'Relationships',
      thumbnail: '💕',
      tags: ['relationships', 'communication', 'social']
    }
  ],
  guides: [
    {
      id: '1',
      title: 'Complete Guide to Managing College Stress',
      description: 'Comprehensive strategies for handling academic and social pressures',
      readTime: '15 min read',
      category: 'Stress Management',
      icon: '📖',
      tags: ['stress', 'college life', 'comprehensive']
    },
    {
      id: '2',
      title: 'Mindfulness for Beginners',
      description: 'Step-by-step introduction to mindfulness practices',
      readTime: '10 min read',
      category: 'Mindfulness',
      icon: '🧠',
      tags: ['mindfulness', 'beginner', 'practice']
    },
    {
      id: '3',
      title: 'Recognizing Depression Signs',
      description: 'Understanding symptoms and when to seek professional help',
      readTime: '8 min read',
      category: 'Mental Health',
      icon: '🏥',
      tags: ['depression', 'awareness', 'help']
    }
  ],
  exercises: [
    {
      id: '1',
      title: '4-7-8 Breathing Exercise',
      description: 'Powerful breathing technique for instant calm',
      duration: '3 min',
      difficulty: 'Beginner',
      icon: '🫁',
      category: 'Breathing'
    },
    {
      id: '2',
      title: 'Progressive Muscle Relaxation',
      description: 'Systematic tension and relaxation of muscle groups',
      duration: '10 min',
      difficulty: 'Intermediate',
      icon: '💪',
      category: 'Relaxation'
    },
    {
      id: '3',
      title: 'Gratitude Journaling',
      description: 'Daily practice to shift focus to positive aspects of life',
      duration: '5 min',
      difficulty: 'Beginner',
      icon: '📝',
      category: 'Mindfulness'
    },
    {
      id: '4',
      title: 'Body Scan Meditation',
      description: 'Mindful awareness of physical sensations and tension',
      duration: '15 min',
      difficulty: 'Intermediate',
      icon: '🧘',
      category: 'Meditation'
    }
  ]
};

const categories = [
  { name: 'All', icon: Heart, count: 11 },
  { name: 'Stress Relief', icon: Brain, count: 4 },
  { name: 'Sleep', icon: Moon, count: 2 },
  { name: 'Exercise', icon: Dumbbell, count: 3 },
  { name: 'Social', icon: Users, count: 2 }
];

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Resource Hub</h1>
        <p className="text-muted-foreground">
          Access videos, guides, and exercises for mental wellness
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.name)}
              className="flex items-center gap-2"
            >
              <category.icon className="w-4 h-4" />
              {category.name}
              <Badge variant="secondary" className="ml-1">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="videos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Guides
          </TabsTrigger>
          <TabsTrigger value="exercises" className="flex items-center gap-2">
            <Headphones className="w-4 h-4" />
            Exercises
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.videos.map((video) => (
              <Card key={video.id} className="wellness-card overflow-hidden group hover:shadow-lg transition-all">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-4xl">
                  {video.thumbnail}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {video.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {video.rating}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {video.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {video.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Video
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.guides.map((guide) => (
              <Card key={guide.id} className="wellness-card p-6 hover:shadow-lg transition-all">
                <div className="text-3xl mb-4">{guide.icon}</div>
                <Badge variant="secondary" className="mb-3">
                  {guide.category}
                </Badge>
                <h3 className="font-semibold mb-2">{guide.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {guide.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                  <Clock className="w-3 h-3" />
                  {guide.readTime}
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {guide.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Guide
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.exercises.map((exercise) => (
              <Card key={exercise.id} className="wellness-card p-6 hover:shadow-lg transition-all">
                <div className="text-3xl mb-4">{exercise.icon}</div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">
                    {exercise.category}
                  </Badge>
                  <Badge variant={exercise.difficulty === 'Beginner' ? 'default' : 'outline'}>
                    {exercise.difficulty}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-2">{exercise.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {exercise.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                  <Clock className="w-3 h-3" />
                  {exercise.duration}
                </div>
                <Button className="w-full">
                  <Headphones className="w-4 h-4 mr-2" />
                  Start Exercise
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}