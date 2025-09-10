import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const predefinedResponses = [
  "I understand you're going through a tough time. It's completely normal to feel overwhelmed sometimes. Can you tell me more about what's bothering you?",
  "That sounds really challenging. Remember that seeking help is a sign of strength, not weakness. Have you considered talking to a counselor?",
  "It's great that you're taking care of your mental health. Small steps like deep breathing, regular sleep, and connecting with friends can make a big difference.",
  "Stress during exam periods is very common among students. Try breaking your study sessions into smaller chunks and take regular breaks.",
  "I'm here to listen and support you. If you're having thoughts of self-harm, please reach out to the crisis helpline immediately at 988.",
  "Building healthy habits takes time. Start with one small change and be patient with yourself. What's one thing you'd like to work on?",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI wellness assistant. I'm here to provide support, resources, and a listening ear 24/7. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: predefinedResponses[Math.floor(Math.random() * predefinedResponses.length)],
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Chat Support</h1>
        <p className="text-muted-foreground">
          Get instant support from our AI assistant available 24/7
        </p>
      </div>

      <Card className="wellness-card-elevated h-[600px] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className={
                  message.sender === 'bot' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary'
                }>
                  {message.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                <div className={`
                  rounded-lg p-3 text-sm
                  ${message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : 'bg-muted'
                  }
                `}>
                  {message.text}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1"
            />
            <Button onClick={sendMessage} className="px-4">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-muted-foreground">
            💡 This is a demo AI. For real crisis support, please contact: <strong>988 Suicide & Crisis Lifeline</strong>
          </div>
        </div>
      </Card>
    </div>
  );
}