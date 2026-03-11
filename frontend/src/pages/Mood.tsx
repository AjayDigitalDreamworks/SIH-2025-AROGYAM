import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/config/api";
import { TrendingUp, Plus, Filter, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type MoodOption = {
  label: string;
  value: number;
  color: string;
  symbol: string;
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
  { symbol: ":'(", label: "Very Sad", value: 1, color: "bg-red-500" },
  { symbol: ":(", label: "Sad", value: 2, color: "bg-orange-500" },
  { symbol: ":|", label: "Neutral", value: 3, color: "bg-yellow-500" },
  { symbol: ":)", label: "Good", value: 4, color: "bg-green-500" },
  { symbol: ":D", label: "Great", value: 5, color: "bg-emerald-600" },
];

const getMoodOption = (value?: number) =>
  moodOptions.find((item) => item.value === value);

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
        color: getMoodOption(item.mood || undefined)?.color || "bg-gray-300",
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

    const bestDay = weekdayAverages.sort((a, b) => b.avg - a.avg)[0]?.day || "No data";
    const lowDay = weekdayAverages.sort((a, b) => a.avg - b.avg)[0]?.day || "No data";

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
    <div className="container mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl mb-2">Mood Tracker</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track your emotional wellness journey and discover patterns in your mental health
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="wellness-card p-5 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">How are you feeling today?</h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-6">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`mood-selector flex flex-col items-center rounded-lg border-2 p-3 transition-all ${
                    selectedMood === mood.value
                      ? "border-primary bg-primary/10 scale-[1.02]"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-xl sm:text-2xl mb-1">{mood.symbol}</span>
                  <span className="text-xs font-medium text-center leading-tight">{mood.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  What is influencing your mood? (Optional)
                </label>
                <Textarea
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="Share a quick note..."
                  rows={3}
                />
              </div>

              <Button onClick={handleMoodSubmit} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Record Today's Mood
              </Button>
            </div>
          </Card>

          <Tabs defaultValue="weekly" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weekly">This Week</TabsTrigger>
              <TabsTrigger value="monthly">This Month</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="weekly" className="space-y-6">
              <Card className="wellness-card p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h3 className="text-lg font-semibold">Weekly Mood Trend</h3>
                  <Badge variant="secondary">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {trend === null
                      ? "Insufficient data"
                      : trend >= 0
                      ? `${trend.toFixed(1)} improving`
                      : `${Math.abs(trend).toFixed(1)} declining`}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end gap-2 h-32">
                    {weeklyData.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-muted rounded-sm relative mb-2" style={{ height: "100px" }}>
                          <div
                            className={`absolute bottom-0 left-0 right-0 ${item.color} rounded-sm transition-all`}
                            style={{ height: `${(item.mood / 5) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs font-medium">{item.day}</div>
                        <div className="text-sm">{getMoodOption(item.mood)?.symbol || ":|"}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{monthlyInsights.averageMood}</div>
                      <div className="text-xs text-muted-foreground">Avg Mood</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{monthlyInsights.bestDay}</div>
                      <div className="text-xs text-muted-foreground">Best Day</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{monthlyInsights.totalEntries}</div>
                      <div className="text-xs text-muted-foreground">Days Tracked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {monthlyInsights.improvementTrend}
                      </div>
                      <div className="text-xs text-muted-foreground">Trend</div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-6">
              <Card className="wellness-card p-5 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">Monthly Insights</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">{monthlyInsights.averageMood}</div>
                    <div className="text-sm text-muted-foreground">Average Mood</div>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">{monthlyInsights.bestDay}</div>
                    <div className="text-sm text-muted-foreground">Best Day</div>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-primary mb-1">{monthlyInsights.improvementTrend}</div>
                    <div className="text-sm text-muted-foreground">Change</div>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold mb-1">{monthlyInsights.mostCommonMood}</div>
                    <div className="text-sm text-muted-foreground">Most Common</div>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">{monthlyInsights.totalEntries}</div>
                    <div className="text-sm text-muted-foreground">Entries</div>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">{monthlyInsights.consistency}%</div>
                    <div className="text-sm text-muted-foreground">30-day Consistency</div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="wellness-card p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h3 className="text-lg font-semibold">Mood History</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={fetchMoodData}>
                      <Filter className="w-4 h-4 mr-2" />
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
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {history.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No mood entries yet. Record today's mood to get started.
                    </div>
                  ) : (
                    history.map((entry, index) => (
                      <div key={`${entry.date}-${index}`} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50">
                        <div className="flex flex-col items-center">
                          <div className="text-xl mb-1">{getMoodOption(entry.mood)?.symbol || ":|"}</div>
                          <div className="text-xs text-muted-foreground">{getMonthDayLabel(entry.date)}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {getMoodOption(entry.mood)?.label || "Unknown"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{getWeekdayName(entry.date)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{entry.note || "No note added."}</p>
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
          <Card className="wellness-card p-5 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Current Streak</span>
                <span className="font-semibold">{summary.streak || 0} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Entries</span>
                <span className="font-semibold">{summary.totalEntries || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg Rating</span>
                <span className="font-semibold">
                  {summary.averageMood ? Number(summary.averageMood.toFixed(1)) : "-"}
                  /5
                </span>
              </div>
            </div>
          </Card>

          <Card className="wellness-card p-5 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Patterns</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium mb-1">High Mood Day</div>
                <div className="text-xs text-muted-foreground">{moodPatterns.bestTime}</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Challenging Day</div>
                <div className="text-xs text-muted-foreground">{moodPatterns.challengingDay}</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Likely Booster</div>
                <div className="text-xs text-muted-foreground">{moodPatterns.moodBooster}</div>
              </div>
            </div>
          </Card>

          {loading && (
            <Card className="wellness-card p-5 sm:p-6 text-sm text-muted-foreground">
              Refreshing mood data...
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
