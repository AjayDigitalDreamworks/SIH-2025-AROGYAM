import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  GamepadIcon, 
  Trophy, 
  Clock, 
  Play, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Star,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const quizzes = [
  {
    id: '1',
    title: 'Stress Level Assessment',
    description: 'Evaluate your current stress levels and get personalized recommendations',
    duration: '5-7 minutes',
    questions: 15,
    category: 'Assessment',
    difficulty: 'Beginner',
    icon: '🧠',
    color: 'bg-blue-500',
    completed: false
  },
  {
    id: '2',
    title: 'Sleep Quality Analyzer',
    description: 'Understand your sleep patterns and discover improvement strategies',
    duration: '3-5 minutes',
    questions: 12,
    category: 'Wellness',
    difficulty: 'Beginner',
    icon: '😴',
    color: 'bg-purple-500',
    completed: true
  },
  {
    id: '3',
    title: 'Anxiety Awareness Check',
    description: 'Recognize anxiety symptoms and learn coping techniques',
    duration: '8-10 minutes',
    questions: 20,
    category: 'Mental Health',
    difficulty: 'Intermediate',
    icon: '💚',
    color: 'bg-green-500',
    completed: false
  },
  {
    id: '4',
    title: 'Study Habits Evaluation',
    description: 'Optimize your study techniques for better academic performance',
    duration: '6-8 minutes',
    questions: 18,
    category: 'Academic',
    difficulty: 'Beginner',
    icon: '📚',
    color: 'bg-orange-500',
    completed: false
  }
];

const games = [
  {
    id: '1',
    title: 'Mindful Breathing',
    description: 'Interactive breathing exercise game to reduce stress',
    duration: '2-5 minutes',
    type: 'Relaxation Game',
    icon: '🫁',
    color: 'bg-cyan-500',
    highScore: null
  },
  {
    id: '2',
    title: 'Gratitude Garden',
    description: 'Plant virtual flowers by reflecting on positive moments',
    duration: '5-10 minutes',
    type: 'Mindfulness Game',
    icon: '🌻',
    color: 'bg-yellow-500',
    highScore: 89
  },
  {
    id: '3',
    title: 'Emotion Color Match',
    description: 'Match colors to emotions to build emotional awareness',
    duration: '3-7 minutes',
    type: 'Educational Game',
    icon: '🎨',
    color: 'bg-pink-500',
    highScore: 156
  },
  {
    id: '4',
    title: 'Stress Ball Squeeze',
    description: 'Digital stress relief through interactive squeezing motions',
    duration: '1-3 minutes',
    type: 'Quick Relief',
    icon: '⚡',
    color: 'bg-red-500',
    highScore: null
  }
];

const sampleQuiz = {
  title: 'Stress Level Assessment',
  currentQuestion: 1,
  totalQuestions: 15,
  questions: [
    {
      id: 1,
      question: 'How often do you feel overwhelmed by your responsibilities?',
      options: [
        'Never',
        'Rarely',
        'Sometimes',
        'Often',
        'Always'
      ]
    }
  ]
};

export default function Quizzes() {
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [quizProgress, setQuizProgress] = useState(0);
  const { toast } = useToast();

  const startQuiz = (quiz: any) => {
    setActiveQuiz(quiz);
    setQuizProgress(0);
    setSelectedAnswer('');
  };

  const nextQuestion = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        description: "Choose an option before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    const newProgress = ((sampleQuiz.currentQuestion) / sampleQuiz.totalQuestions) * 100;
    setQuizProgress(newProgress);
    setSelectedAnswer('');
    
    if (sampleQuiz.currentQuestion >= sampleQuiz.totalQuestions) {
      toast({
        title: "Quiz Completed!",
        description: "Check your results and recommendations.",
      });
      setActiveQuiz(null);
    }
  };

  const startGame = (game: any) => {
    toast({
      title: `Starting ${game.title}`,
      description: "Game is loading... Have fun!",
    });
  };

  if (activeQuiz) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{sampleQuiz.title}</h1>
            <Button variant="outline" onClick={() => setActiveQuiz(null)}>
              Exit Quiz
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {sampleQuiz.currentQuestion} of {sampleQuiz.totalQuestions}</span>
              <span>{Math.round(quizProgress)}% Complete</span>
            </div>
            <Progress value={quizProgress} className="h-2" />
          </div>
        </div>

        <Card className="wellness-card p-8">
          <h2 className="text-xl font-semibold mb-6">
            {sampleQuiz.questions[0].question}
          </h2>
          
          <div className="space-y-3 mb-8">
            {sampleQuiz.questions[0].options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === option
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button onClick={nextQuestion}>
              Next Question
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Quizzes & Games</h1>
        <p className="text-muted-foreground">
          Fun self-assessments and stress relief activities to support your mental wellness journey
        </p>
      </div>

      <Tabs defaultValue="quizzes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Self-Assessments
          </TabsTrigger>
          <TabsTrigger value="games" className="flex items-center gap-2">
            <GamepadIcon className="w-4 h-4" />
            Wellness Games
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="wellness-card p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full ${quiz.color} flex items-center justify-center text-2xl`}>
                    {quiz.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {quiz.category}
                      </Badge>
                      {quiz.completed && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                <h3 className="font-semibold mb-2">{quiz.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {quiz.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {quiz.duration}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Target className="w-3 h-3" />
                    {quiz.questions} questions
                  </div>
                  <Badge variant={quiz.difficulty === 'Beginner' ? 'default' : 'outline'} className="text-xs">
                    {quiz.difficulty}
                  </Badge>
                </div>
                
                <Button 
                  onClick={() => startQuiz(quiz)}
                  className="w-full"
                  variant={quiz.completed ? 'outline' : 'default'}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {quiz.completed ? 'Retake Quiz' : 'Start Quiz'}
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="games" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card key={game.id} className="wellness-card p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full ${game.color} flex items-center justify-center text-2xl`}>
                    {game.icon}
                  </div>
                  <div className="flex-1">
                    <Badge variant="secondary" className="text-xs">
                      {game.type}
                    </Badge>
                  </div>
                </div>
                
                <h3 className="font-semibold mb-2">{game.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {game.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {game.duration}
                  </div>
                  {game.highScore && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Trophy className="w-3 h-3" />
                      High Score: {game.highScore}
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => startGame(game)}
                  className="w-full"
                >
                  <GamepadIcon className="w-4 h-4 mr-2" />
                  Play Game
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="wellness-card p-6 text-center">
          <div className="text-2xl font-bold text-primary mb-2">12</div>
          <div className="text-sm text-muted-foreground">Quizzes Completed</div>
        </Card>
        <Card className="wellness-card p-6 text-center">
          <div className="text-2xl font-bold text-primary mb-2">45</div>
          <div className="text-sm text-muted-foreground">Games Played</div>
        </Card>
        <Card className="wellness-card p-6 text-center">
          <div className="text-2xl font-bold text-primary mb-2">7</div>
          <div className="text-sm text-muted-foreground">Day Streak</div>
        </Card>
      </div>
    </div>
  );
}