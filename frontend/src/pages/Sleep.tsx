import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Moon, Clock, TrendingUp, Calendar, Star, Plus } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <main className="container mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-wellness-blue flex items-center justify-center">
              <Moon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Sleep Tracker</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Monitor your sleep patterns and improve your rest quality
          </p>
        </div>

        <Card className="mb-6 sm:mb-8 gradient-subtle border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Last Night's Sleep
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {lastSleep ? `${lastSleep.hours}h` : "--"}
                </div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= (lastSleep?.quality || 0) ? "text-wellness-yellow fill-current" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">Quality Rating</div>
              </div>

              <div className="text-center">
                <Badge variant="secondary" className="text-sm">
                  {sleepStatus}
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">Based on duration and quality</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 sm:mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Weekly Sleep Pattern
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentWeek.length === 0 ? (
                <div className="text-sm text-muted-foreground">No sleep entries yet. Log your first night to see trends.</div>
              ) : (
                <div className="space-y-4">
                  {recentWeek.map((day, index) => (
                    <div key={`${day.date}-${index}`} className="flex items-center justify-between gap-3">
                      <div className="w-12 text-sm font-medium">{formatDay(day.date)}</div>
                      <div className="flex-1">
                        <Progress value={Math.min((day.hours / 10) * 100, 100)} className="h-2" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{day.hours}h</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= day.quality ? "text-wellness-yellow fill-current" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personalized Sleep Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sleepTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {index + 1}
                    </div>
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Sleep Goals and Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-4 rounded-lg bg-wellness-green/10">
                <div className="text-2xl font-bold text-wellness-green mb-1">8h</div>
                <div className="text-sm text-muted-foreground">Recommended</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <div className="text-2xl font-bold text-primary mb-1">{weeklyAvgNum.toFixed(1)}h</div>
                <div className="text-sm text-muted-foreground">Weekly Average</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-wellness-orange/10">
                <div className="text-2xl font-bold text-wellness-orange mb-1">
                  {recentWeek.length ? `${Math.min(Math.round((weeklyAvgNum / 8) * 100), 100)}%` : "0%"}
                </div>
                <div className="text-sm text-muted-foreground">Goal Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button className="gradient-primary text-white px-8 py-3" onClick={() => setShowLogModal(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Log Last Night's Sleep
          </Button>
        </div>

        <Dialog open={showLogModal} onOpenChange={setShowLogModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Last Night's Sleep</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Hours Slept</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.1"
                  value={logHours}
                  onChange={(e) => setLogHours(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Sleep Quality</label>
                <select
                  value={logQuality}
                  onChange={(e) => setLogQuality(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                >
                  {[1, 2, 3, 4, 5].map((quality) => (
                    <option key={quality} value={quality}>
                      {quality} Star{quality > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full">
                Save
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {loading && (
          <div className="mt-4 text-center text-sm text-muted-foreground">Refreshing sleep data...</div>
        )}
      </main>
    </div>
  );
}
