import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  BrainCircuit,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import api from "@/config/api";

type SupportBlock = {
  steps?: string[];
  nextAction?: string;
  disclaimer?: string;
};

type Message = {
  role: "user" | "assistant";
  text: string;
  support?: SupportBlock;
};

type ResponseMeta = {
  source?: string;
  timestamp?: string;
};

type ChatResult = {
  reply: string;
  risk: "low" | "medium" | "high";
  category: string;
  structuredSupport?: SupportBlock;
  meta?: ResponseMeta;
};

const STORAGE_KEY = "studentAiModelMessages";

const starterMessage: Message = {
  role: "assistant",
  text:
    "Hi. I am your Student Support AI model. Share what feels heavy right now, and I will guide you with practical steps."
};

const quickPrompts = [
  "I feel anxious about my exams.",
  "I am feeling lonely in college.",
  "I cannot focus on studies these days.",
  "I feel stressed and mentally tired."
];

const riskClasses: Record<"low" | "medium" | "high", string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-rose-200 bg-rose-50 text-rose-700"
};

export default function StudentAiModel() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [starterMessage];

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return [starterMessage];
      return parsed;
    } catch {
      return [starterMessage];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [risk, setRisk] = useState<"low" | "medium" | "high">("low");
  const [category, setCategory] = useState("student_support");
  const [meta, setMeta] = useState<ResponseMeta>({});

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const history = useMemo(
    () =>
      messages.map((item) => ({
        role: item.role,
        text: item.text
      })),
    [messages]
  );

  const sendMessage = async (value?: string) => {
    const text = (value ?? input).trim();
    if (!text || loading) return;

    setError("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post<ChatResult>("/api/student-ai/message", {
        message: text,
        history: history.slice(-8)
      });

      const payload = response.data;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: payload.reply || "I am here with you. Please share a little more.",
          support: payload.structuredSupport
        }
      ]);
      setRisk(payload.risk || "low");
      setCategory(payload.category || "student_support");
      setMeta(payload.meta || {});
    } catch {
      setError("Unable to connect to AI service right now.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong. Please retry in a moment."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-cyan-50 via-white to-emerald-50 p-4 sm:p-6">
      <div className="mx-auto grid w-full max-w-7xl gap-4 xl:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <section className="rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-700 via-teal-700 to-emerald-700 p-5 text-white shadow-lg">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <Sparkles className="h-3.5 w-3.5" />
              New AI Model
            </div>
            <h1 className="mt-3 text-2xl font-bold leading-tight">Student Support AI</h1>
            <p className="mt-2 text-sm text-cyan-100">
              Dedicated support assistant integrated into your student dashboard.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <BrainCircuit className="h-4 w-4 text-cyan-700" />
              Capabilities
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Stress and anxiety support</li>
              <li>Study pressure guidance</li>
              <li>Risk-aware response suggestions</li>
            </ul>
          </section>

          <section className={`rounded-2xl border p-4 ${riskClasses[risk]}`}>
            <h3 className="text-sm font-semibold">Current Risk Level: {risk.toUpperCase()}</h3>
            <p className="mt-1 text-xs capitalize">
              Category: {category.replace(/_/g, " ")}
            </p>
            <p className="mt-2 text-[11px] opacity-80">
              {risk === "high"
                ? "If you feel unsafe, contact emergency support immediately."
                : "This assistant provides support guidance, not clinical diagnosis."}
            </p>
          </section>
        </aside>

        <section className="flex min-h-[72vh] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 font-medium text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                AI Connected
              </span>
              {meta?.source ? (
                <span className="rounded-full border border-slate-200 px-2 py-1">
                  source: {meta.source}
                </span>
              ) : null}
              {meta?.timestamp ? (
                <span className="rounded-full border border-slate-200 px-2 py-1">
                  {new Date(meta.timestamp).toLocaleString()}
                </span>
              ) : null}
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-4">
            {messages.map((item, index) => {
              const user = item.role === "user";
              return (
                <div key={`${item.role}-${index}`} className={`flex ${user ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      user
                        ? "rounded-br-md bg-cyan-700 text-white"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{item.text}</p>

                    {!user && item.support ? (
                      <div className="mt-3 space-y-2 border-t border-slate-200 pt-3 text-xs text-slate-600">
                        {item.support.steps?.length ? (
                          <div>
                            <p className="font-semibold text-slate-700">Helpful Steps</p>
                            <ul className="mt-1 space-y-1">
                              {item.support.steps.map((step, stepIndex) => (
                                <li key={`${step}-${stepIndex}`}>- {step}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {item.support.nextAction ? (
                          <p>
                            <strong>Next action:</strong> {item.support.nextAction}
                          </p>
                        ) : null}

                        {item.support.disclaimer ? (
                          <p className="text-[11px] text-slate-500">{item.support.disclaimer}</p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}

            {loading ? (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating support response...
                </div>
              </div>
            ) : null}

            <div ref={endRef} />
          </div>

          <footer className="border-t border-slate-200 bg-white p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                rows={3}
                placeholder="Type how you are feeling..."
                className="min-h-[70px] flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-cyan-200 transition focus:ring-2"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-cyan-700 px-4 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send
              </button>
            </div>

            {error ? (
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-rose-600">
                <AlertTriangle className="h-3.5 w-3.5" />
                {error}
              </p>
            ) : null}
          </footer>
        </section>
      </div>
    </div>
  );
}
