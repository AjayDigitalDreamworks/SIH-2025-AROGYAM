import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import api from "@/config/api";
import {
  CalendarDays,
  Download,
  Filter,
  Flame,
  LineChart,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type MoodOption = {
  label: string;
  value: number;
  color: string;
  symbol: string;
  gradient: string;
};

type MoodEntry = {
  date: string;
  mood: number;
  note?: string;
};

type WeeklyMood = {
  date: string;
  mood: number | null;
};

type MoodSummary = {
  averageMood: number | null;
  totalEntries: number;
  streak: number;
};

const moodOptions: MoodOption[] = [
  {
    symbol: ":'(",
    label: "Very Sad",
    value: 1,
    color: "bg-rose-500",
    gradient: "from-rose-500 to-red-500",
  },
  {
    symbol: ":(",
    label: "Sad",
    value: 2,
    color: "bg-orange-500",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    symbol: ":|",
    label: "Neutral",
    value: 3,
    color: "bg-yellow-500",
    gradient: "from-yellow-500 to-amber-400",
  },
  {
    symbol: ":)",
    label: "Good",
    value: 4,
    color: "bg-lime-500",
    gradient: "from-lime-500 to-green-500",
  },
  {
    symbol: ":D",
    label: "Great",
    value: 5,
    color: "bg-emerald-500",
    gradient: "from-emerald-500 to-teal-500",
  },
];

const getMoodOption = (value?: number) => moodOptions.find((item) => item.value === value);

const getWeekdayName = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", { weekday: "long" });

const getMonthDayLabel = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export default function Mood() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [weekly, setWeekly] = useState<WeeklyMood[]>([]);
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [summary, setSummary] = useState<MoodSummary>({
    averageMood: null,
    totalEntries: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMoodData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/mood");
      setHistory(Array.isArray(response.data?.moodHistory) ? response.data.moodHistory : []);
      setWeekly(Array.isArray(response.data?.weekly) ? response.data.weekly : []);
      setSummary(
        response.data?.summary || {
          averageMood: null,
          totalEntries: 0,
          streak: 0,
        }
      );
    } catch (err) {
      console.error("Failed to fetch mood data", err);
      toast({
        title: "Unable to load mood data",
        description: "Please refresh and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoodData();
  }, []);

  const handleMoodSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling today.",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.post("/api/mood", { mood: selectedMood, note: moodNote });
      toast({ title: "Mood recorded", description: "Your mood entry was saved." });
      setSelectedMood(null);
      setMoodNote("");
      fetchMoodData();
    } catch (err) {
      console.error("Save mood failed", err);
      toast({
        title: "Error",
        description: "Could not save your mood. Please try again.",
        variant: "destructive",
      });
    }
  };

  const weeklyData = useMemo(
    () =>
      weekly.map((item) => ({
        day: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
        mood: item.mood || 0,
        color: getMoodOption(item.mood || undefined)?.color || "bg-slate-300",
      })),
    [weekly]
  );

  const trend = useMemo(() => {
    const sorted = [...history]
      .filter((item) => !Number.isNaN(new Date(item.date).getTime()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (sorted.length < 2) return null;

    const last7 = sorted.slice(0, 7);
    const prev7 = sorted.slice(7, 14);
    if (prev7.length === 0) return null;

    const avg = (items: MoodEntry[]) => items.reduce((sum, item) => sum + item.mood, 0) / items.length;
    const delta = avg(last7) - avg(prev7);
    return Number(delta.toFixed(1));
  }, [history]);

  const monthlyInsights = useMemo(() => {
    const last30 = history.filter((entry) => {
      const date = new Date(entry.date).getTime();
      return Date.now() - date <= 30 * 24 * 60 * 60 * 1000;
    });

    const moodCounts = last30.reduce<Record<number, number>>((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});
    const mostCommonValue = Object.entries(moodCounts).sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0];
    const mostCommonMood = mostCommonValue ? getMoodOption(Number(mostCommonValue)) : null;

    const consistency = Math.round((Math.min(last30.length, 30) / 30) * 100);
    const bestDay =
      weeklyData.length > 0
        ? weeklyData.reduce((best, item) => (item.mood > best.mood ? item : best), weeklyData[0]).day
        : "-";

    return {
      averageMood: summary.averageMood ? Number(summary.averageMood.toFixed(1)) : "-",
      bestDay,
      improvementTrend:
        trend === null ? "-" : `${trend > 0 ? "+" : ""}${trend.toFixed(1)} vs prev week`,
      totalEntries: summary.totalEntries || 0,
      mostCommonMood: mostCommonMood ? `${mostCommonMood.symbol} ${mostCommonMood.label}` : "-",
      consistency,
    };
  }, [history, summary, trend, weeklyData]);

  const moodPatterns = useMemo(() => {
    if (history.length === 0) {
      return {
        bestTime: "No entries yet",
        challengingDay: "No entries yet",
        moodBooster: "Add notes with each mood check-in for better insights.",
      };
    }

    const weekdayBuckets = history.reduce<Record<string, number[]>>((acc, entry) => {
      const day = getWeekdayName(entry.date);
      if (!acc[day]) acc[day] = [];
      acc[day].push(entry.mood);
      return acc;
    }, {});

    const weekdayAverages = Object.entries(weekdayBuckets).map(([day, moods]) => ({
      day,
      avg: moods.reduce((sum, mood) => sum + mood, 0) / moods.length,
    }));

    const bestDay =
      [...weekdayAverages].sort((a, b) => b.avg - a.avg)[0]?.day || "No data";
    const lowDay =
      [...weekdayAverages].sort((a, b) => a.avg - b.avg)[0]?.day || "No data";

    const notes = history
      .map((entry) => (entry.note || "").toLowerCase())
      .filter(Boolean)
      .join(" ");

    const boosterByKeyword = [
      { key: "exercise", label: "Movement and exercise" },
      { key: "friend", label: "Time with friends" },
      { key: "sleep", label: "Consistent sleep routine" },
      { key: "music", label: "Music and breaks" },
      { key: "walk", label: "Short outdoor walks" },
    ].find((item) => notes.includes(item.key))?.label;

    return {
      bestTime: `Strongest day: ${bestDay}`,
      challengingDay: `Most difficult day: ${lowDay}`,
      moodBooster: boosterByKeyword || "Track short notes to uncover your strongest mood boosters.",
    };
  }, [history]);

  return (
    <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute -top-14 left-8 h-36 w-36 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="pointer-events-none absolute right-6 top-20 h-44 w-44 rounded-full bg-blue-200/40 blur-3xl" />

      <section className="relative overflow-hidden rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-6 text-white shadow-xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_45%)]" />
        <div className="relative">
          <Badge className="mb-3 border-white/30 bg-white/15 text-white hover:bg-white/20">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Daily emotional check-in
          </Badge>
          <h1 className="text-2xl font-bold sm:text-4xl">Mood Tracker</h1>
          <p className="mt-2 max-w-2xl text-sm text-blue-50 sm:text-base">
            Track your emotional wellness daily and discover what patterns improve your mood over time.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card className="border-white/30 bg-white/15 p-3 text-white shadow-none backdrop-blur">
              <p className="text-2xl font-semibold">{summary.streak || 0}</p>
              <p className="text-xs text-blue-50">Streak Days</p>
            </Card>
            <Card className="border-white/30 bg-white/15 p-3 text-white shadow-none backdrop-blur">
              <p className="text-2xl font-semibold">
                {summary.averageMood ? Number(summary.averageMood.toFixed(1)) : "-"}
              </p>
              <p className="text-xs text-blue-50">Average Mood</p>
            </Card>
            <Card className="border-white/30 bg-white/15 p-3 text-white shadow-none backdrop-blur">
              <p className="text-2xl font-semibold">{summary.totalEntries || 0}</p>
              <p className="text-xs text-blue-50">Total Entries</p>
            </Card>
            <Card className="border-white/30 bg-white/15 p-3 text-white shadow-none backdrop-blur">
              <p className="text-2xl font-semibold">
                {trend === null ? "-" : `${trend > 0 ? "+" : ""}${trend}`}
              </p>
              <p className="text-xs text-blue-50">Week Trend</p>
            </Card>
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-2xl border-slate-200 bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-slate-900">How are you feeling today?</h3>
              <Badge variant="outline" className="text-xs">
                1 entry per day recommended
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`group relative overflow-hidden rounded-xl border p-3 text-left transition ${
                    selectedMood === mood.value
                      ? "border-indigo-400 ring-2 ring-indigo-200"
                      : "border-slate-200 hover:border-indigo-200"
                  }`}
                >
                  <div
                    className={`mb-2 h-1 w-full rounded-full bg-gradient-to-r ${mood.gradient}`}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{mood.symbol}</span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${mood.color} ${
                        selectedMood === mood.value ? "opacity-100" : "opacity-60"
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-700">{mood.label}</p>
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  What is influencing your mood? (Optional)
                </label>
                <Textarea
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="Share a short note..."
                  rows={3}
                  className="border-slate-200"
                />
              </div>

              <Button onClick={handleMoodSubmit} className="w-full bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" />
                Record Today's Mood
              </Button>
            </div>
          </Card>

          <Tabs defaultValue="weekly" className="space-y-6">
            <TabsList className="grid h-auto w-full grid-cols-3 gap-2 bg-slate-100 p-1.5">
              <TabsTrigger
                value="weekly"
                className="rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow"
              >
                This Week
              </TabsTrigger>
              <TabsTrigger
                value="monthly"
                className="rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow"
              >
                This Month
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow"
              >
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weekly" className="space-y-6">
              <Card className="rounded-2xl border-slate-200 bg-white p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">Weekly Mood Trend</h3>
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {trend === null
                      ? "Insufficient data"
                      : trend >= 0
                      ? `${trend.toFixed(1)} improving`
                      : `${Math.abs(trend).toFixed(1)} declining`}
                  </Badge>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-40 items-end gap-2">
                    {weeklyData.map((item, index) => (
                      <div key={`${item.day}-${index}`} className="flex flex-1 flex-col items-center">
                        <div className="relative mb-2 h-28 w-full rounded-md bg-slate-200/70">
                          <div
                            className={`absolute bottom-0 left-0 right-0 ${item.color} rounded-md transition-all`}
                            style={{ height: `${Math.max((item.mood / 5) * 100, 4)}%` }}
                          />
                        </div>
                        <p className="text-xs font-medium text-slate-700">{item.day}</p>
                        <p className="text-xs text-slate-500">{getMoodOption(item.mood)?.symbol || ":|"}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 md:grid-cols-4">
                  <div className="rounded-xl bg-indigo-50 p-3 text-center">
                    <div className="text-lg font-semibold text-indigo-700">{monthlyInsights.averageMood}</div>
                    <div className="text-xs text-slate-500">Avg Mood</div>
                  </div>
                  <div className="rounded-xl bg-cyan-50 p-3 text-center">
                    <div className="text-lg font-semibold text-cyan-700">{monthlyInsights.bestDay}</div>
                    <div className="text-xs text-slate-500">Best Day</div>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-3 text-center">
                    <div className="text-lg font-semibold text-emerald-700">{monthlyInsights.totalEntries}</div>
                    <div className="text-xs text-slate-500">Tracked Days</div>
                  </div>
                  <div className="rounded-xl bg-violet-50 p-3 text-center">
                    <div className="text-sm font-semibold text-violet-700">{monthlyInsights.improvementTrend}</div>
                    <div className="text-xs text-slate-500">Trend</div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-6">
              <Card className="rounded-2xl border-slate-200 bg-white p-5 sm:p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Monthly Insights</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-700">{monthlyInsights.averageMood}</div>
                    <div className="text-sm text-slate-600">Average Mood</div>
                  </div>
                  <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-center">
                    <div className="text-2xl font-bold text-cyan-700">{monthlyInsights.bestDay}</div>
                    <div className="text-sm text-slate-600">Best Day</div>
                  </div>
                  <div className="rounded-xl border border-violet-100 bg-violet-50 p-4 text-center">
                    <div className="text-lg font-bold text-violet-700">{monthlyInsights.improvementTrend}</div>
                    <div className="text-sm text-slate-600">Change</div>
                  </div>
                  <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-center">
                    <div className="text-lg font-semibold text-amber-700">{monthlyInsights.mostCommonMood}</div>
                    <div className="text-sm text-slate-600">Most Common</div>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-700">{monthlyInsights.totalEntries}</div>
                    <div className="text-sm text-slate-600">Entries</div>
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-center">
                    <div className="text-2xl font-bold text-blue-700">{monthlyInsights.consistency}%</div>
                    <div className="text-sm text-slate-600">30-day Consistency</div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="rounded-2xl border-slate-200 bg-white p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">Mood History</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={fetchMoodData}>
                      <Filter className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const content = history
                          .map((entry) => `${entry.date}, mood=${entry.mood}, note=${entry.note || ""}`)
                          .join("\n");
                        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = "mood-history.txt";
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {history.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                      No mood entries yet. Record today's mood to get started.
                    </div>
                  ) : (
                    history.map((entry, index) => (
                      <div
                        key={`${entry.date}-${index}`}
                        className="flex items-start gap-4 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50"
                      >
                        <div className="flex w-14 flex-col items-center rounded-lg bg-slate-100 p-2">
                          <div className="text-lg">{getMoodOption(entry.mood)?.symbol || ":|"}</div>
                          <div className="text-[11px] text-slate-500">{getMonthDayLabel(entry.date)}</div>
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {getMoodOption(entry.mood)?.label || "Unknown"}
                            </Badge>
                            <span className="text-xs text-slate-500">{getWeekdayName(entry.date)}</span>
                          </div>
                          <p className="text-sm text-slate-600">{entry.note || "No note added."}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-200 bg-white p-5 sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Flame className="h-5 w-5 text-orange-500" />
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-sm text-slate-600">Current Streak</span>
                <span className="font-semibold text-slate-900">{summary.streak || 0} days</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-sm text-slate-600">Entries</span>
                <span className="font-semibold text-slate-900">{summary.totalEntries || 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-sm text-slate-600">Avg Rating</span>
                <span className="font-semibold text-slate-900">
                  {summary.averageMood ? Number(summary.averageMood.toFixed(1)) : "-"}
                  /5
                </span>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-200 bg-white p-5 sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <LineChart className="h-5 w-5 text-indigo-600" />
              Patterns
            </h3>
            <div className="space-y-4 text-sm">
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="mb-1 font-medium text-slate-800">High Mood Day</div>
                <div className="text-slate-600">{moodPatterns.bestTime}</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="mb-1 font-medium text-slate-800">Challenging Day</div>
                <div className="text-slate-600">{moodPatterns.challengingDay}</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="mb-1 font-medium text-slate-800">Likely Booster</div>
                <div className="text-slate-600">{moodPatterns.moodBooster}</div>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-200 bg-gradient-to-br from-indigo-50 to-cyan-50 p-5 sm:p-6">
            <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-900">
              <CalendarDays className="h-4 w-4 text-indigo-600" />
              Consistency Hint
            </h3>
            <p className="text-sm text-slate-600">
              Logging at the same time every day improves pattern quality. Morning and evening entries are easiest to compare.
            </p>
          </Card>

          {loading ? (
            <Card className="rounded-2xl border-slate-200 p-5 text-sm text-slate-500">
              Refreshing mood data...
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
