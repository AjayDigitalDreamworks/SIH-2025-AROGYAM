import { useEffect, useRef, useState } from "react";
import { Bot, Mic, MicOff, Send, Sparkles, Trash2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import api from "@/config/api";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
  time: string;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
  }
}

const storageKey = "calmMindChat";

const defaultMessage: ChatMessage = {
  sender: "bot",
  text: "Hi, I am CalmMind AI. I am here to listen. How are you feeling today?",
  time: new Date().toLocaleTimeString(),
};

const quickPrompts = [
  "I am feeling happy today",
  "I am okay but a little tired",
  "I feel low and stressed",
  "I cannot focus on studies",
];

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return [defaultMessage];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [defaultMessage];
    } catch {
      return [defaultMessage];
    }
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (!window.webkitSpeechRecognition) return;
    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event?.results?.[0]?.[0]?.transcript || "";
      setInput(transcript);
    };
    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      return;
    }
    alert("Voice recognition is not supported in this browser.");
  };

  const clearConversation = () => {
    const next = [defaultMessage];
    setMessages(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const sendMessage = async () => {
    const userText = input.trim();
    if (!userText) return;

    const userMessage: ChatMessage = {
      sender: "user",
      text: userText,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const sessionId = localStorage.getItem("sessionId") || crypto.randomUUID();
      localStorage.setItem("sessionId", sessionId);

      const response = await api.post("/api/chat", { message: userText, sessionId });
      const botReply: ChatMessage = {
        sender: "bot",
        text: response?.data?.reply || "I am here with you. Tell me more.",
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botReply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Something went wrong. Please try again in a moment.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <section className="relative mb-5 overflow-hidden rounded-3xl border border-teal-200/70 bg-gradient-to-br from-teal-700 via-cyan-700 to-sky-700 p-6 text-white shadow-xl sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_45%)]" />
        <div className="relative">
          <Badge className="mb-3 border-white/25 bg-white/10 text-white hover:bg-white/20">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            AI emotional support
          </Badge>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">CalmMind Chatbot</h1>
              <p className="mt-1 text-sm text-cyan-100 sm:text-base">
                A safe space to talk, reflect, and get supportive guidance.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={clearConversation}
              className="w-fit border-0 bg-white text-teal-800 hover:bg-cyan-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Chat
            </Button>
          </div>
        </div>
      </section>

      <Card className="flex h-[68vh] flex-col overflow-hidden rounded-2xl border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            AI support active
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/60 px-4 py-4 sm:px-5">
          <div className="space-y-4">
            {messages.map((msg, idx) => {
              const isUser = msg.sender === "user";
              return (
                <div key={`${msg.time}-${idx}`} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`flex max-w-[90%] items-end gap-2 sm:max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isUser ? "bg-teal-700 text-white" : "bg-white text-teal-700 border border-slate-200"}`}>
                      {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${isUser ? "rounded-br-md bg-teal-700 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-700"}`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      <p className={`mt-1 text-[10px] ${isUser ? "text-teal-100" : "text-slate-400"}`}>{msg.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping ? (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                  CalmMind is typing...
                </div>
              </div>
            ) : null}
          </div>
          <div ref={chatEndRef} />
        </div>

        <div className="border-t border-slate-200 bg-white px-4 py-3 sm:px-5">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              rows={2}
              placeholder="Type your thoughts here..."
              className="min-h-[54px] resize-none border-slate-300"
            />
            <button
              onClick={startListening}
              className={`relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition ${
                isListening ? "bg-rose-600 text-white shadow-lg shadow-rose-300/50" : "border border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            <button
              onClick={sendMessage}
              className="inline-flex h-12 shrink-0 items-center gap-1 rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
              >
                {prompt}
              </button>
            ))}
          </div>

          <p className="mt-3 text-center text-[11px] text-slate-400">
            If you feel unsafe or at risk, contact a trusted person or emergency support immediately.
          </p>
        </div>
      </Card>
    </div>
  );
}
