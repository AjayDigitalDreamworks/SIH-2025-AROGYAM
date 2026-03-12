import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Moon, Clock, TrendingUp, Calendar, Star, Plus, Sparkles, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import api from "@/config/api";
import { useToast } from "@/hooks/use-toast";

interface SleepEntry {
  date: string;
  hours: number;
  quality: number;
}

interface CurrentUser {
  _id?: string;
  userId?: string;
}

const formatDay = (dateString?: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

const formatFullDate = (dateString?: string) => {
  if (!dateString) return "No date";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function Sleep() {
  const [sleepHistory, setSleepHistory] = useState<SleepEntry[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logHours, setLogHours] = useState("");
  const [logQuality, setLogQuality] = useState(3);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSleep = useCallback(async () => {
    try {
      setLoading(true);
      const userResponse = await api.get("/current_user");
      const user = userResponse.data?.user || null;
      setCurrentUser(user);

      const userId = user?._id || user?.userId;
      if (!userId) {
        setSleepHistory([]);
        return;
      }

      const sleepResponse = await api.get(`/api/sleep/${userId}`);
      const entries = Array.isArray(sleepResponse.data) ? sleepResponse.data : [];
      entries.sort((a: SleepEntry, b: SleepEntry) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setSleepHistory(entries);
    } catch (err) {
      console.error("Failed to fetch sleep data", err);
      setSleepHistory([]);
      toast({
        title: "Unable to load sleep data",
        description: "Please refresh and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSleep();
  }, [fetchSleep]);

  const recentWeek = sleepHistory.slice(-7);
  const lastSleep = sleepHistory[sleepHistory.length - 1];

  const weeklyAvgNum = useMemo(() => {
    if (recentWeek.length === 0) return 0;
    return recentWeek.reduce((acc, item) => acc + (item.hours || 0), 0) / recentWeek.length;
  }, [recentWeek]);

  const avgQuality = useMemo(() => {
    if (recentWeek.length === 0) return 0;
    return recentWeek.reduce((acc, item) => acc + (item.quality || 0), 0) / recentWeek.length;
  }, [recentWeek]);

  const sleepStatus = useMemo(() => {
    if (!lastSleep) return "No Data";
    if (lastSleep.hours >= 7 && lastSleep.quality >= 4) return "Great Recovery";
    if (lastSleep.hours >= 6 && lastSleep.quality >= 3) return "Stable Sleep";
    return "Needs Attention";
  }, [lastSleep]);

  const sleepTips = useMemo(() => {
    const tips: string[] = [];

    if (weeklyAvgNum < 6) {
      tips.push("Your recent sleep is below 6 hours. Try setting a fixed bedtime this week.");
    } else if (weeklyAvgNum < 7) {
      tips.push("You are close to the recommended range. Adding 30-45 minutes can improve recovery.");
    } else {
      tips.push("Your duration is in a healthy range. Keep your schedule consistent.");
    }

    if (avgQuality < 3) {
      tips.push("Sleep quality is low. Reduce screen exposure 60 minutes before bed.");
    } else if (avgQuality < 4) {
      tips.push("Quality is moderate. A calm wind-down routine can improve deep sleep.");
    } else {
      tips.push("Sleep quality looks strong. Preserve the same pre-sleep habits.");
    }

    const irregularGap =
      recentWeek.length >= 4
        ? Math.max(...recentWeek.map((item) => item.hours)) - Math.min(...recentWeek.map((item) => item.hours))
        : 0;
    if (irregularGap > 3) {
      tips.push("Sleep duration is fluctuating a lot. Aim for a similar wake-up time daily.");
    }

    if ((lastSleep?.hours || 0) < 5) {
      tips.push("Last night was very short. Avoid caffeine late today and prioritize recovery tonight.");
    }

    if (tips.length < 4) {
      tips.push("Log sleep daily so recommendations become more personalized.");
    }

    return tips.slice(0, 5);
  }, [weeklyAvgNum, avgQuality, recentWeek, lastSleep]);

  const goalProgress = recentWeek.length ? Math.min(Math.round((weeklyAvgNum / 8) * 100), 100) : 0;

  const handleLogSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const hours = Number(logHours);
    const userId = currentUser?._id || currentUser?.userId;

    if (!userId) {
      toast({
        title: "User not found",
        description: "Please log in again.",
        variant: "destructive",
      });
      return;
    }

    if (Number.isNaN(hours) || hours <= 0 || hours > 24) {
      toast({
        title: "Invalid hours",
        description: "Please enter a valid sleep duration.",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.post("/api/sleep", {
        userId,
        hours,
        quality: logQuality,
        date: new Date(),
      });

      toast({
        title: "Sleep recorded",
        description: "Your sleep data has been saved.",
      });
      setShowLogModal(false);
      setLogHours("");
      setLogQuality(3);
      fetchSleep();
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not save your sleep data. Please try again.",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute -top-14 left-8 h-36 w-36 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute right-6 top-20 h-44 w-44 rounded-full bg-cyan-200/40 blur-3xl" />

      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-800 p-6 text-white shadow-xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_45%)]" />
        <div className="relative">
          <Badge className="mb-3 border-white/20 bg-white/10 text-white hover:bg-white/20">
            <Moon className="mr-1.5 h-3.5 w-3.5" />
            Daily sleep check-in
          </Badge>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-4xl">Sleep Tracker</h1>
              <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:text-base">
                Monitor sleep quality, identify recovery patterns, and build a consistent rest routine.
              </p>
            </div>
            <Button className="bg-white text-indigo-800 hover:bg-indigo-50" onClick={() => setShowLogModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Log Last Night
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card className="border-white/20 bg-white/10 p-3 text-white shadow-none backdrop-blur">
              <p className="text-2xl font-semibold">{lastSleep ? `${lastSleep.hours}h` : "--"}</p>
              <p className="text-xs text-blue-100">Last Duration</p>
            </Card>
            <Card className="border-white/20 bg-white/10 p-3 text-white shadow-none backdrop-blur">
              <p className="text-2xl font-semibold">{weeklyAvgNum.toFixed(1)}h</p>
              <p className="text-xs text-blue-100">Weekly Average</p>
            </Card>
            <Card className="border-white/20 bg-white/10 p-3 text-white shadow-none backdrop-blur">
              <p className="text-2xl font-semibold">{avgQuality.toFixed(1)}</p>
              <p className="text-xs text-blue-100">Avg Quality /5</p>
            </Card>
            <Card className="border-white/20 bg-white/10 p-3 text-white shadow-none backdrop-blur">
              <p className="text-2xl font-semibold">{goalProgress}%</p>
              <p className="text-xs text-blue-100">Goal Progress</p>
            </Card>
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-2xl border-slate-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Clock className="h-5 w-5 text-indigo-600" />
                Last Night's Sleep
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-center">
                  <div className="text-3xl font-bold text-indigo-700">{lastSleep ? `${lastSleep.hours}h` : "--"}</div>
                  <div className="text-sm text-slate-600">Duration</div>
                  <div className="mt-1 text-xs text-slate-500">{lastSleep ? formatFullDate(lastSleep.date) : ""}</div>
                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-center">
                  <div className="mb-1 flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= (lastSleep?.quality || 0) ? "fill-amber-400 text-amber-400" : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-slate-600">Quality Rating</div>
                </div>

                <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-center">
                  <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">
                    {sleepStatus}
                  </Badge>
                  <div className="mt-2 text-xs text-slate-500">Based on duration and quality</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                Weekly Sleep Pattern
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentWeek.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                  No sleep entries yet. Log your first night to see trends.
                </div>
              ) : (
                <div className="space-y-4">
                  {recentWeek.map((day, index) => (
                    <div key={`${day.date}-${index}`} className="rounded-xl border border-slate-200 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-800">{formatDay(day.date)}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">{day.hours}h</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3.5 w-3.5 ${
                                  star <= day.quality ? "fill-amber-400 text-amber-400" : "text-slate-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <Progress value={Math.min((day.hours / 10) * 100, 100)} className="h-2.5" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Sleep Goals and Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-700">8h</div>
                  <div className="text-sm text-slate-600">Recommended</div>
                </div>
                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-700">{weeklyAvgNum.toFixed(1)}h</div>
                  <div className="text-sm text-slate-600">Weekly Average</div>
                </div>
                <div className="rounded-xl border border-orange-100 bg-orange-50 p-4 text-center">
                  <div className="text-2xl font-bold text-orange-700">{goalProgress}%</div>
                  <div className="text-sm text-slate-600">Goal Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-200 bg-white p-5 sm:p-6">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              Personalized Sleep Tips
            </h3>
            <div className="space-y-3">
              {sleepTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm text-slate-700">{tip}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-200 bg-gradient-to-br from-indigo-50 to-cyan-50 p-5 sm:p-6">
            <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-900">
              <Target className="h-4 w-4 text-indigo-600" />
              Consistency Target
            </h3>
            <p className="text-sm text-slate-600">
              Keep your sleep and wake times within a 1-hour window. Consistency helps more than occasional long sleep.
            </p>
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                <span>Progress to 8h target</span>
                <span>{goalProgress}%</span>
              </div>
              <Progress value={goalProgress} className="h-2.5" />
            </div>
          </Card>

          {loading ? (
            <Card className="rounded-2xl border-slate-200 p-5 text-sm text-slate-500">
              Refreshing sleep data...
            </Card>
          ) : null}
        </div>
      </div>

      <Dialog open={showLogModal} onOpenChange={setShowLogModal}>
        <DialogContent className="rounded-2xl border-slate-200">
          <DialogHeader>
            <DialogTitle>Log Last Night's Sleep</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Hours Slept</label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.1"
                value={logHours}
                onChange={(e) => setLogHours(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Sleep Quality</label>
              <select
                value={logQuality}
                onChange={(e) => setLogQuality(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                {[1, 2, 3, 4, 5].map((quality) => (
                  <option key={quality} value={quality}>
                    {quality} Star{quality > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
