import React, { useState, useEffect, useRef } from "react";
import {
  Dumbbell, Play, Clock, Target, Trophy, ChevronRight, Zap,
  Moon, Wind, Coffee, Activity, Timer, X, ChevronLeft,
  CheckCircle, Bell, Sparkles, TrendingUp, RotateCcw, SkipForward,
  Pause, Video, ChevronDown, ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ─── Theme ────────────────────────────────────────────────────────────────────
const PURPLE = "#0f766e";
const PURPLE_LIGHT = "#0284c7";
const purpleGrad = { background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_LIGHT})` };

// ─── Weekly Chart Data ────────────────────────────────────────────────────────
const weeklyData = [
  { day: "Mon", minutes: 15 },
  { day: "Tue", minutes: 28 },
  { day: "Wed", minutes: 10 },
  { day: "Thu", minutes: 35 },
  { day: "Fri", minutes: 22 },
  { day: "Sat", minutes: 45 },
  { day: "Sun", minutes: 18 },
];

// ─── Exercise Categories ──────────────────────────────────────────────────────
const exerciseCategories = [
  { id: "stress-relief", name: "Stress Relief", icon: Wind   },
  { id: "energy-boost",  name: "Energy Boost",  icon: Zap    },
  { id: "study-break",   name: "Study Break",   icon: Coffee },
  { id: "sleep-prep",    name: "Sleep Prep",    icon: Moon   },
];

// ─── Exercise Plans with YouTube video IDs per exercise ──────────────────────
// Each exercise has a youtubeId so the modal can embed a real tutorial video.
const exercisePlans = {
  "stress-relief": [
    {
      title: "Quick Desk Stretches", duration: "5 mins", difficulty: "Easy",
      description: "Perfect for between study sessions", calories: 20,
      exercises: [
        { name: "Neck rolls",        youtubeId: "7UIeHlBbGFI", tip: "Slowly roll your head in full circles, 5x each direction." },
        { name: "Shoulder shrugs",   youtubeId: "kDiNHtolBHI", tip: "Lift both shoulders up to your ears, hold 2s, release. 10 reps." },
        { name: "Wrist stretches",   youtubeId: "mSZWSQSSEjE", tip: "Extend arm, pull fingers back gently. Hold 20s each side." },
        { name: "Spinal twists",     youtubeId: "A4lKHqAjFlQ", tip: "Sit tall, twist torso left and right. 5 reps each side." },
      ],
    },
    {
      title: "Breathing & Movement", duration: "10 mins", difficulty: "Easy",
      description: "Combine deep breathing with gentle movement", calories: 35,
      exercises: [
        { name: "Deep breathing",    youtubeId: "tybOi4hjZFQ", tip: "Inhale 4s, hold 4s, exhale 4s. Repeat 5 times." },
        { name: "Arm circles",       youtubeId: "EBpNWsB3uek", tip: "Extend arms, make big circles forward 10x, then backward 10x." },
        { name: "Hip circles",       youtubeId: "7BHVO1DRZJI", tip: "Hands on hips, rotate hips in wide circles. 10 each direction." },
        { name: "Gentle stretches",  youtubeId: "g_tea8ZNk5A", tip: "Full-body gentle stretch flow. Follow along slowly." },
      ],
    },
    {
      title: "Stress-Busting Yoga",  duration: "15 mins", difficulty: "Medium",
      description: "Yoga poses to release tension", calories: 55,
      exercises: [
        { name: "Child's pose",      youtubeId: "2MJGg-dUKh0", tip: "Kneel, sit back on heels, stretch arms forward. Hold 1 min." },
        { name: "Cat-cow",           youtubeId: "kqnua4rHVVA", tip: "On all fours, alternate arching and rounding spine. 10 cycles." },
        { name: "Downward dog",      youtubeId: "ayMEFQmMDdI", tip: "Form an inverted V-shape. Hold 30s, pedal feet gently." },
        { name: "Pigeon pose",       youtubeId: "MvCCNBk3XkY", tip: "Deep hip opener. Hold 1 min each side. Breathe deeply." },
      ],
    },
  ],
  "energy-boost": [
    {
      title: "Morning Energizer", duration: "8 mins", difficulty: "Medium",
      description: "Start your day with energy", calories: 65,
      exercises: [
        { name: "Jumping jacks",     youtubeId: "iSSAk4XCsRA", tip: "Full range of motion, land softly. 30 seconds on, 10 off." },
        { name: "Arm swings",        youtubeId: "EBpNWsB3uek", tip: "Swing arms forward and across your chest. 20 reps." },
        { name: "Leg raises",        youtubeId: "JB2oyawG9KI", tip: "Lying flat, raise straight legs to 90°. 3 sets of 10." },
        { name: "Torso twists",      youtubeId: "FPmHiToWCYQ", tip: "Stand feet shoulder-width, twist torso quickly. 20 reps." },
      ],
    },
    {
      title: "Midday Pick-Me-Up",  duration: "12 mins", difficulty: "Medium",
      description: "Combat afternoon fatigue", calories: 90,
      exercises: [
        { name: "High knees",        youtubeId: "ZZZoCNMU48U", tip: "Drive knees up to hip height alternately. 30s on, 10s off." },
        { name: "Butt kicks",        youtubeId: "wnJTxS2IreQ", tip: "Kick heels up to glutes while jogging in place. 30 seconds." },
        { name: "Push-ups",          youtubeId: "IODxDxX7oi4", tip: "Keep body straight, lower chest to floor. 3 sets of 8–10." },
        { name: "Squats",            youtubeId: "ultWZbUMPL8", tip: "Feet shoulder-width, squat until thighs are parallel. 3×12." },
      ],
    },
  ],
  "study-break": [
    {
      title: "2-Minute Micro Break", duration: "2 mins", difficulty: "Easy",
      description: "Quick movement between tasks", calories: 10,
      exercises: [
        { name: "Stand & stretch",   youtubeId: "g_tea8ZNk5A", tip: "Stand up, reach arms overhead, side-bend left and right." },
        { name: "Eye exercises",     youtubeId: "7bNDNFYMiMM", tip: "Focus far, then near. Roll eyes slowly in circles. 30s." },
        { name: "Neck stretches",    youtubeId: "7UIeHlBbGFI", tip: "Tilt ear to shoulder, hold 15s each side. Breathe slowly." },
        { name: "Deep breaths",      youtubeId: "tybOi4hjZFQ", tip: "Box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s." },
      ],
    },
    {
      title: "Focus Reset",         duration: "7 mins", difficulty: "Easy",
      description: "Refresh your mind and body", calories: 30,
      exercises: [
        { name: "Walking in place",  youtubeId: "Hk5_TaRxiH0", tip: "March briskly in place, pump arms. Do this for 2 minutes." },
        { name: "Arm stretches",     youtubeId: "EBpNWsB3uek", tip: "Cross-body stretch, overhead tricep, wrist flexor. 20s each." },
        { name: "Spinal twists",     youtubeId: "A4lKHqAjFlQ", tip: "Seated or standing, rotate slowly. 5 reps each direction." },
        { name: "Calf raises",       youtubeId: "gwLzBJYoWlI", tip: "Rise on toes, hold 1s, lower slowly. 3 sets of 15." },
      ],
    },
  ],
  "sleep-prep": [
    {
      title: "Evening Wind-Down", duration: "10 mins", difficulty: "Easy",
      description: "Prepare your body for rest", calories: 25,
      exercises: [
        { name: "Gentle stretches",        youtubeId: "g_tea8ZNk5A", tip: "Slow, relaxed full-body stretch. No bouncing, hold each 30s." },
        { name: "Leg elevation",           youtubeId: "Ou6TLZ5BTqg", tip: "Lie on back, legs up wall for 3–5 minutes to reduce tension." },
        { name: "Progressive relaxation",  youtubeId: "1nZEdqcGZzo", tip: "Tense each muscle group 5s, then release. Head to toe." },
        { name: "Deep breathing",          youtubeId: "tybOi4hjZFQ", tip: "4-7-8 breathing: inhale 4s, hold 7s, exhale 8s. 5 cycles." },
      ],
    },
  ],
};

const recommendations = [
  { icon: Wind,  title: "Stress Relief After Study", duration: "5 min",  tipBg: "bg-green-50",  tipText: "text-green-600",  plan: "stress-relief", idx: 0 },
  { icon: Zap,   title: "Quick Energy Boost",         duration: "8 min",  tipBg: "bg-orange-50", tipText: "text-orange-500", plan: "energy-boost",  idx: 0 },
  { icon: Moon,  title: "Before Sleep Stretch",        duration: "10 min", tipBg: "bg-violet-50", tipText: "text-violet-600", plan: "sleep-prep",    idx: 0 },
];

// ─── Workout Modal with Video ─────────────────────────────────────────────────

function WorkoutModal({ plan, onClose }) {
  const [step, setStep]           = useState(0);
  const [seconds, setSeconds]     = useState(60);
  const [running, setRunning]     = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const timerRef                  = useRef(null);

  const total       = plan.exercises.length;
  const currentEx   = plan.exercises[step];
  const progress    = (step / total) * 100;
  const circ        = 2 * Math.PI * 36;

  useEffect(() => { setSeconds(60); setRunning(false); }, [step]);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) { clearInterval(timerRef.current); setRunning(false); return 0; }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const pct  = seconds / 60;

  const goNext = () => { if (step < total - 1) setStep(s => s + 1); };
  const goPrev = () => { if (step > 0) setStep(s => s - 1); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl bg-white flex flex-col"
           style={{ maxHeight: "95vh" }}>

        {/* ── Purple Header ──────────────────────────────────────────────── */}
        <div className="p-4 relative flex items-start justify-between" style={purpleGrad}>
          <div className="flex-1 pr-8">
            <p className="text-white/70 text-xs uppercase tracking-widest font-medium mb-0.5">{plan.title}</p>
            <h2 className="text-white text-xl font-bold leading-tight">{currentEx.name}</h2>
            <p className="text-white/70 text-xs mt-1">{currentEx.tip}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white mt-0.5 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Progress bar ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-4 py-2 bg-violet-50 border-b border-violet-100">
          {plan.exercises.map((ex, i) => (
            <button key={i} onClick={() => setStep(i)}
              className="flex-1 flex flex-col items-center gap-1 group">
              <div className={`h-1.5 w-full rounded-full transition-all ${
                i < step  ? "bg-violet-500" :
                i === step ? "bg-violet-700" :
                             "bg-violet-200"}`} />
              <span className={`text-xs hidden sm:block truncate max-w-full transition-colors ${
                i === step ? "text-violet-700 font-semibold" :
                i < step   ? "text-violet-400" : "text-gray-400"}`}>
                {i + 1}
              </span>
            </button>
          ))}
        </div>

        {/* ── Scrollable body ────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* Video section */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setShowVideo(v => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <span className="flex items-center gap-2">
                <Video className="w-4 h-4" style={{ color: PURPLE }} />
                Video Tutorial — {currentEx.name}
              </span>
              {showVideo ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {showVideo && (
              <div className="relative w-full bg-black" style={{ paddingBottom: "50%" }}>
                <iframe
                  key={`${step}-${currentEx.youtubeId}`}
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${currentEx.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                  title={`${currentEx.name} tutorial`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* Timer + Controls */}
          <div className="px-4 py-4 flex flex-col sm:flex-row items-center gap-4 border-b border-gray-100">
            {/* Circular timer */}
            <div className="relative shrink-0">
              <svg width="88" height="88" className="-rotate-90">
                <circle cx="44" cy="44" r="36" fill="none" stroke="#ede9fe" strokeWidth="6" />
                <circle cx="44" cy="44" r="36" fill="none" stroke={PURPLE} strokeWidth="6"
                  strokeDasharray={circ}
                  strokeDashoffset={circ * (1 - pct)}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s linear" }} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-800 font-mono">
                {mins}:{secs}
              </span>
            </div>

            {/* Timer controls */}
            <div className="flex flex-col gap-2 flex-1 w-full sm:w-auto">
              <div className="flex gap-2 justify-center">
                <button onClick={() => { setSeconds(60); setRunning(false); }}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-6 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={purpleGrad}
                  onClick={() => setRunning(r => !r)}>
                  {running ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" />{seconds === 60 ? "Start Timer" : "Resume"}</>}
                </button>
                <button onClick={goNext} disabled={step === total - 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors disabled:opacity-30">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center text-xs text-gray-400">
                Exercise {step + 1} of {total} · {currentEx.tip.split(".")[0]}
              </p>
            </div>
          </div>

          {/* Exercise checklist */}
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">All Exercises</p>
            <div className="space-y-1.5">
              {plan.exercises.map((ex, i) => (
                <button key={i} onClick={() => setStep(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all
                    ${i === step  ? "bg-violet-50 border border-violet-200"
                    : i < step   ? "bg-gray-50 border border-transparent"
                    :               "hover:bg-gray-50 border border-transparent"}`}>
                  {i < step
                    ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    : i === step
                    ? <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center" style={{ background: PURPLE }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    : <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />}
                  <span className={`flex-1 ${i === step ? "font-semibold text-violet-700" : i < step ? "text-gray-400 line-through" : "text-gray-600"}`}>
                    {ex.name}
                  </span>
                  {i === step && (
                    <span className="text-xs text-violet-400 flex items-center gap-1">
                      <Video className="w-3 h-3" /> Now Playing
                    </span>
                  )}
                  {i !== step && (
                    <Video className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Nav ─────────────────────────────────────────────────── */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50">
          <button onClick={goPrev} disabled={step === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-white transition-colors disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-xs text-gray-400">{step + 1} / {total}</span>
          {step < total - 1 ? (
            <button onClick={goNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
              style={purpleGrad}>
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              style={purpleGrad}>
              <CheckCircle className="w-4 h-4" /> Finish
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Chart Tooltip ─────────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md text-sm">
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="font-semibold" style={{ color: PURPLE }}>{payload[0].value} min</p>
      </div>
    );
  }
  return null;
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ExercisePage() {
  const [activeCategory, setActiveCategory] = useState("stress-relief");
  const [modalPlan, setModalPlan]           = useState(null);

  const weeklyGoals = { completed: 12, target: 15, streak: 5, minutes: 173 };
  const weeklyGoalPct = Math.round((weeklyGoals.completed / weeklyGoals.target) * 100);

  return (
    <div className="relative min-h-screen bg-slate-50/70">
      {modalPlan && <WorkoutModal plan={modalPlan} onClose={() => setModalPlan(null)} />}

      <main className="relative container mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="pointer-events-none absolute -top-14 left-8 h-36 w-36 rounded-full bg-cyan-200/45 blur-3xl" />
        <div className="pointer-events-none absolute right-6 top-16 h-44 w-44 rounded-full bg-emerald-200/45 blur-3xl" />

        <section className="relative mb-8 overflow-hidden rounded-3xl border border-teal-200/60 bg-gradient-to-br from-teal-700 via-cyan-700 to-sky-700 p-6 text-white shadow-xl sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_45%)]" />
          <div className="relative">
            <Badge className="mb-3 border-white/20 bg-white/10 text-white hover:bg-white/20">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Student exercise dashboard
            </Badge>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold sm:text-4xl">Exercise Plans</h1>
                <p className="mt-2 max-w-2xl text-sm text-cyan-100 sm:text-base">
                  Student-friendly workouts to reduce stress, improve focus, and build healthy daily movement.
                </p>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-50"
                onClick={() => setModalPlan(exercisePlans["study-break"][0])}
              >
                <Play className="h-4 w-4" />
                Start Quick Break
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Card className="border-white/20 bg-white/10 p-3 text-white shadow-none backdrop-blur">
                <p className="text-2xl font-semibold">{weeklyGoals.completed}</p>
                <p className="text-xs text-cyan-100">Completed</p>
              </Card>
              <Card className="border-white/20 bg-white/10 p-3 text-white shadow-none backdrop-blur">
                <p className="text-2xl font-semibold">{weeklyGoals.target}</p>
                <p className="text-xs text-cyan-100">Weekly Goal</p>
              </Card>
              <Card className="border-white/20 bg-white/10 p-3 text-white shadow-none backdrop-blur">
                <p className="text-2xl font-semibold">{weeklyGoals.streak}</p>
                <p className="text-xs text-cyan-100">Day Streak</p>
              </Card>
              <Card className="border-white/20 bg-white/10 p-3 text-white shadow-none backdrop-blur">
                <p className="text-2xl font-semibold">{weeklyGoals.minutes}</p>
                <p className="text-xs text-cyan-100">Minutes</p>
              </Card>
            </div>
          </div>
        </section>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="rounded-2xl border-slate-200 lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Activity className="h-5 w-5" />
                  Weekly Movement Activity
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="mr-1 h-3 w-3" /> +18% this week
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PURPLE_LIGHT} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={PURPLE_LIGHT} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="minutes"
                    stroke={PURPLE}
                    strokeWidth={2.5}
                    fill="url(#chartGrad)"
                    dot={{ fill: PURPLE, r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: PURPLE }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Trophy className="h-5 w-5 text-amber-500" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center">
                <div className="text-2xl font-bold text-emerald-700">{weeklyGoals.completed}</div>
                <div className="text-xs text-slate-600">Workouts Completed</div>
              </div>
              <div className="rounded-xl border border-sky-100 bg-sky-50 p-3 text-center">
                <div className="text-2xl font-bold text-sky-700">{weeklyGoalPct}%</div>
                <div className="text-xs text-slate-600">Goal Completion</div>
              </div>
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-3 text-center">
                <div className="text-2xl font-bold text-orange-700">{weeklyGoals.streak} days</div>
                <div className="text-xs text-slate-600">Current Streak</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Timer className="w-5 h-5" /> Activity Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              {[
                { label: "Workouts this week", display: `${weeklyGoals.completed} / ${weeklyGoals.target}`, pct: weeklyGoalPct, color: PURPLE },
                { label: "Minutes exercised", display: `${weeklyGoals.minutes} / 300`, pct: Math.round((weeklyGoals.minutes / 300) * 100), color: PURPLE_LIGHT },
                { label: "Calories burned (est)", display: "480 / 1000", pct: 48, color: "#f97316" },
                { label: "Current streak", display: `${weeklyGoals.streak} / 7 days`, pct: Math.round((weeklyGoals.streak / 7) * 100), color: "#22c55e" },
              ].map(({ label, display, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-bold" style={{ color }}>{display}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {exerciseCategories.map(cat => {
              const Icon   = cat.icon;
              const active = activeCategory === cat.id;
              return (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    active
                      ? "bg-teal-700 text-white border-teal-700"
                      : "bg-white text-gray-700 border-gray-300 hover:border-teal-300 hover:text-teal-700"
                  }`}>
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {exercisePlans[activeCategory]?.map((plan, index) => (
            <Card key={index} className="hover:shadow-xl hover:-translate-y-1 duration-300 transition-all cursor-pointer border border-slate-200 rounded-2xl">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-1">{plan.title}</CardTitle>
                    <p className="text-sm text-slate-600">{plan.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{plan.duration}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{plan.difficulty}</Badge>
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    <Video className="w-3 h-3" /> Video
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {plan.exercises.map((ex, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: PURPLE }} />
                      {ex.name}
                    </div>
                  ))}
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-medium bg-teal-700 hover:bg-teal-800 transition-colors"
                  onClick={() => setModalPlan(plan)}>
                  <Play className="w-4 h-4" />
                  Start Workout
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8 border border-slate-200 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              Recommended For You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec, i) => (
                <div key={i} className={`p-4 rounded-lg ${rec.tipBg}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <rec.icon className={`w-5 h-5 ${rec.tipText}`} />
                    <span className={`font-medium text-sm ${rec.tipText}`}>{rec.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Clock className="w-3 h-3" /> {rec.duration}
                    </div>
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs font-medium bg-teal-700 hover:bg-teal-800 transition-colors"
                      onClick={() => { setActiveCategory(rec.plan); setModalPlan(exercisePlans[rec.plan][rec.idx]); }}>
                      <Play className="w-3 h-3" /> Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 border border-teal-200 bg-teal-50/70 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-800">
              <Bell className="w-5 h-5" />
              Take a Movement Break
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-sm text-muted-foreground flex-1">
              Sitting too long can reduce focus. Take a 2-minute stretch break right now to refresh your mind and body.
            </p>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium shrink-0 bg-teal-700 hover:bg-teal-800 transition-colors"
              onClick={() => setModalPlan(exercisePlans["study-break"][0])}>
              <Play className="w-4 h-4" />
              Start 2-Minute Stretch
            </button>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Exercise Tips for Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50">
                  <h4 className="font-medium text-green-600 mb-2">Study Break Movement</h4>
                  <p className="text-sm text-muted-foreground">Take a 2-minute movement break every hour of studying to maintain focus and reduce muscle tension.</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50">
                  <h4 className="font-medium text-blue-600 mb-2">Stress Management</h4>
                  <p className="text-sm text-muted-foreground">Regular exercise reduces cortisol levels and releases endorphins, naturally managing study stress.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-orange-50">
                  <h4 className="font-medium text-orange-500 mb-2">Energy Boost</h4>
                  <p className="text-sm text-muted-foreground">Morning exercises increase alertness and energy levels throughout the day, improving academic performance.</p>
                </div>
                <div className="p-4 rounded-lg bg-indigo-50">
                  <h4 className="font-medium mb-2 text-indigo-700">Better Sleep</h4>
                  <p className="text-sm text-muted-foreground">Evening stretches and relaxation exercises prepare your body for quality sleep after a busy day.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
