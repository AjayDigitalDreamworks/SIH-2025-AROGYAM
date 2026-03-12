import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Heart,
  Moon,
  Sparkles,
  Trophy
} from "lucide-react";
import api from "@/config/api";

type MoodEntry = {
  date: string;
  mood: number;
  notes?: string;
};

type SleepEntry = {
  date: string;
  hours: number;
  quality: number;
};

type QuizEntry = {
  score: number;
  quiz_type: string;
  date: string;
};

type AttendanceEntry = {
  date: string;
  percent: number;
  notes?: string;
};

type AcademicEntry = {
  date: string;
  score: number;
  term?: string;
};

type AppointmentItem = {
  _id: string;
  date?: string;
  time?: string;
  type?: string;
  status?: string;
};

type DashboardUser = {
  fullName?: string;
  username?: string;
  wellbeingScore?: number;
};

type AnalyticsSummary = {
  wellbeingScore: number;
  averages: {
    avgMood: number;
    avgSleep: number;
    avgQuiz: number;
    avgAttendance: number;
    avgAcademic: number;
  };
  latest: {
    mood?: MoodEntry | null;
    sleep?: SleepEntry | null;
    quiz?: QuizEntry | null;
    attendance?: AttendanceEntry | null;
    academic?: AcademicEntry | null;
  };
  counts: {
    mood: number;
    sleep: number;
    quiz: number;
    attendance: number;
    academic: number;
  };
  updatedAt: string;
};

type ActivityEntry = {
  date: string;
  mood?: number;
  sleep?: number;
  quiz?: number;
  attendance?: number;
  academic?: number;
};

type AnalyticsResponse = {
  user?: DashboardUser;
  summary?: AnalyticsSummary;
  activityTrack?: ActivityEntry[];
  scores?: {
    moodHistory?: MoodEntry[];
    sleepHistory?: SleepEntry[];
    quizScores?: QuizEntry[];
    attendanceHistory?: AttendanceEntry[];
    academicScores?: AcademicEntry[];
  };
  upcomingAppointments?: AppointmentItem[];
};

type DashboardFallbackResponse = {
  user?: DashboardUser & {
    moodHistory?: MoodEntry[];
    sleepHistory?: SleepEntry[];
    quizScores?: QuizEntry[];
  };
  upcomingAppointments?: AppointmentItem[];
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatDateTime = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
};

const getLatestByDate = <T extends { date: string }>(items: T[] = []) => {
  if (!items.length) return null;
  return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
};

const computeAverages = (moodHistory: MoodEntry[], sleepHistory: SleepEntry[], quizScores: QuizEntry[]) => {
  const avgMood = moodHistory.length
    ? moodHistory.reduce((sum, entry) => sum + entry.mood, 0) / moodHistory.length
    : 0;
  const avgSleep = sleepHistory.length
    ? sleepHistory.reduce((sum, entry) => sum + entry.hours, 0) / sleepHistory.length
    : 0;
  const avgQuiz = quizScores.length
    ? quizScores.reduce((sum, entry) => sum + entry.score, 0) / quizScores.length
    : 0;

  return {
    avgMood: Number(avgMood.toFixed(1)),
    avgSleep: Number(avgSleep.toFixed(1)),
    avgQuiz: Math.round(avgQuiz),
    avgAttendance: 0,
    avgAcademic: 0
  };
};

const buildActivityTrack = (moodHistory: MoodEntry[], sleepHistory: SleepEntry[], quizScores: QuizEntry[]) => {
  const byDate = new Map<string, ActivityEntry>();

  const addEntry = (dateValue: string, key: keyof ActivityEntry, value: number) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return;
    const dayKey = date.toISOString().split("T")[0];
    const existing = byDate.get(dayKey) || { date: dayKey };
    byDate.set(dayKey, { ...existing, [key]: value });
  };

  moodHistory.forEach((entry) => addEntry(entry.date, "mood", entry.mood));
  sleepHistory.forEach((entry) => addEntry(entry.date, "sleep", entry.hours));
  quizScores.forEach((entry) => addEntry(entry.date, "quiz", entry.score));

  return Array.from(byDate.values())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);
};

const buildReportFromDashboard = (payload: DashboardFallbackResponse): AnalyticsResponse => {
  const user = payload.user || {};
  const moodHistory = user.moodHistory || [];
  const sleepHistory = user.sleepHistory || [];
  const quizScores = user.quizScores || [];

  const latestMood = getLatestByDate(moodHistory);
  const latestSleep = getLatestByDate(sleepHistory);
  const latestQuiz = getLatestByDate(quizScores);

  const moodScore = latestMood ? latestMood.mood * 20 : 0;
  const sleepScore = latestSleep ? clamp((latestSleep.hours / 8) * 100, 0, 100) : 0;
  const quizScore = latestQuiz?.score || 0;
  const wellbeingScore = typeof user.wellbeingScore === "number"
    ? clamp(Math.round(user.wellbeingScore), 0, 100)
    : Math.round(moodScore * 0.35 + sleepScore * 0.25 + quizScore * 0.4);

  const averages = computeAverages(moodHistory, sleepHistory, quizScores);

  return {
    user: {
      fullName: user.fullName,
      username: user.username,
      wellbeingScore
    },
    summary: {
      wellbeingScore,
      averages,
      latest: { mood: latestMood, sleep: latestSleep, quiz: latestQuiz },
      counts: {
        mood: moodHistory.length,
        sleep: sleepHistory.length,
        quiz: quizScores.length,
        attendance: 0,
        academic: 0
      },
      updatedAt: new Date().toISOString()
    },
    activityTrack: buildActivityTrack(moodHistory, sleepHistory, quizScores),
    scores: {
      moodHistory: [...moodHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      sleepHistory: [...sleepHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      quizScores: [...quizScores].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      attendanceHistory: [],
      academicScores: []
    },
    upcomingAppointments: payload.upcomingAppointments || []
  };
};

export default function StudentAnalyticsReport() {
  const [report, setReport] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/users/analytics-report");
        setReport(res.data || {});
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        if (status === 404) {
          try {
            const fallback = await api.get("/users/dashboard");
            setReport(buildReportFromDashboard(fallback.data || {}));
            return;
          } catch (fallbackErr: any) {
            setError("Unable to load student report.");
          }
        } else {
          setError("Unable to load student report.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const user = report?.user || {};
  const summary = report?.summary;
  const moodHistory = report?.scores?.moodHistory || [];
  const sleepHistory = report?.scores?.sleepHistory || [];
  const quizScores = report?.scores?.quizScores || [];
  const attendanceHistory = report?.scores?.attendanceHistory || [];
  const academicScores = report?.scores?.academicScores || [];
  const activityTrack = report?.activityTrack || [];

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Loading report...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-rose-600">{error}</div>;
  }

  const displayName = user.fullName || user.username || "Student";
  const latestMood = summary?.latest?.mood || null;
  const latestSleep = summary?.latest?.sleep || null;
  const latestQuiz = summary?.latest?.quiz || null;
  const latestAttendance = summary?.latest?.attendance || null;
  const latestAcademic = summary?.latest?.academic || null;
  const wellbeingScore = summary?.wellbeingScore ?? 0;
  const averages = summary?.averages || {
    avgMood: 0,
    avgSleep: 0,
    avgQuiz: 0,
    avgAttendance: 0,
    avgAcademic: 0
  };

  const counts = summary?.counts || { mood: 0, sleep: 0, quiz: 0, attendance: 0, academic: 0 };
  const hasAttendance = counts.attendance > 0;
  const hasAcademic = counts.academic > 0;
  const lastUpdated = summary?.updatedAt ? formatDateTime(summary.updatedAt) : "--";

  const statCards = useMemo(
    () => [
      {
        label: "Wellbeing Score",
        value: `${wellbeingScore}/100`,
        helper: "Combined mood, sleep, quiz",
        icon: Sparkles,
        tone: "bg-emerald-50 text-emerald-700 border-emerald-200"
      },
      {
        label: "Average Mood",
        value: `${averages.avgMood}/5`,
        helper: `Latest: ${latestMood ? `${latestMood.mood}/5` : "--"}`,
        icon: Heart,
        tone: "bg-rose-50 text-rose-700 border-rose-200"
      },
      {
        label: "Average Sleep",
        value: `${averages.avgSleep} hrs`,
        helper: `Latest: ${latestSleep ? `${latestSleep.hours} hrs` : "--"}`,
        icon: Moon,
        tone: "bg-indigo-50 text-indigo-700 border-indigo-200"
      },
      {
        label: "Average Quiz",
        value: `${averages.avgQuiz}%`,
        helper: `Latest: ${latestQuiz ? `${latestQuiz.score}%` : "--"}`,
        icon: Trophy,
        tone: "bg-amber-50 text-amber-700 border-amber-200"
      },
      {
        label: "Attendance",
        value: hasAttendance ? `${averages.avgAttendance}%` : "--",
        helper: `Latest: ${latestAttendance ? `${latestAttendance.percent}%` : "--"}`,
        icon: ClipboardCheck,
        tone: "bg-sky-50 text-sky-700 border-sky-200"
      },
      {
        label: "Academic Score",
        value: hasAcademic ? `${averages.avgAcademic}%` : "--",
        helper: `Latest: ${latestAcademic ? `${latestAcademic.score}%` : "--"}`,
        icon: GraduationCap,
        tone: "bg-violet-50 text-violet-700 border-violet-200"
      }
    ],
    [
      wellbeingScore,
      averages,
      latestMood,
      latestSleep,
      latestQuiz,
      latestAttendance,
      latestAcademic,
      hasAttendance,
      hasAcademic
    ]
  );

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-emerald-100/70 blur-2xl" />
          <div className="absolute bottom-6 left-6 h-24 w-24 rounded-full bg-sky-100/70 blur-2xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                <BarChart3 className="h-3.5 w-3.5" />
                Student Analytics Report
              </div>
              <h1 className="mt-3 text-2xl font-bold text-slate-900">{displayName}'s Overall Report</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                A consolidated view of wellbeing, attendance, academic growth, and recent activity.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              Last updated: {lastUpdated}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {statCards.map((card) => (
              <div
                key={card.label}
                className={`rounded-2xl border p-4 shadow-sm ${card.tone}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase">{card.label}</p>
                  <card.icon className="h-4 w-4" />
                </div>
                <p className="mt-3 text-2xl font-bold">{card.value}</p>
                <p className="mt-1 text-xs opacity-80">{card.helper}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Activity Track (Last 7 Entries)</h2>
            <Activity className="h-4 w-4 text-slate-400" />
          </div>

          {activityTrack.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No activity data yet.</p>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {activityTrack.map((item) => (
                <div key={item.date} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-600">{formatDate(item.date)}</p>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-rose-500" />
                      <span>Mood: {item.mood ? `${item.mood}/5` : "--"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4 text-indigo-500" />
                      <span>Sleep: {item.sleep ? `${item.sleep} hrs` : "--"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      <span>Quiz: {item.quiz ? `${item.quiz}%` : "--"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4 text-sky-500" />
                      <span>Attendance: {item.attendance ? `${item.attendance}%` : "--"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-violet-500" />
                      <span>Academic: {item.academic ? `${item.academic}%` : "--"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Score Library</h3>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full border border-slate-200 px-2 py-1">Mood: {counts.mood}</span>
              <span className="rounded-full border border-slate-200 px-2 py-1">Sleep: {counts.sleep}</span>
              <span className="rounded-full border border-slate-200 px-2 py-1">Quiz: {counts.quiz}</span>
              <span className="rounded-full border border-slate-200 px-2 py-1">Attendance: {counts.attendance}</span>
              <span className="rounded-full border border-slate-200 px-2 py-1">Academic: {counts.academic}</span>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">All Quiz Scores</h3>
              <Trophy className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-4 space-y-3">
              {quizScores.length === 0 ? (
                <p className="text-sm text-slate-500">No quiz scores yet.</p>
              ) : (
                quizScores
                  .map((entry, index) => (
                    <div key={`${entry.quiz_type}-${index}`} className="rounded-xl border border-slate-200 p-3">
                      <p className="text-xs text-slate-500">{formatDate(entry.date)}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {entry.quiz_type || "Quiz"} - {entry.score}%
                      </p>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">All Mood Scores</h3>
              <Heart className="h-4 w-4 text-rose-500" />
            </div>
            <div className="mt-4 space-y-3">
              {moodHistory.length === 0 ? (
                <p className="text-sm text-slate-500">No mood check-ins yet.</p>
              ) : (
                moodHistory
                  .map((entry, index) => (
                    <div key={`mood-${index}`} className="rounded-xl border border-slate-200 p-3">
                      <p className="text-xs text-slate-500">{formatDate(entry.date)}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">Mood score: {entry.mood}/5</p>
                      {entry.notes ? (
                        <p className="mt-1 text-xs text-slate-500">{entry.notes}</p>
                      ) : null}
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">All Sleep Scores</h3>
              <Moon className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-4 space-y-3">
              {sleepHistory.length === 0 ? (
                <p className="text-sm text-slate-500">No sleep logs yet.</p>
              ) : (
                sleepHistory
                  .map((entry, index) => (
                    <div key={`sleep-${index}`} className="rounded-xl border border-slate-200 p-3">
                      <p className="text-xs text-slate-500">{formatDate(entry.date)}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{entry.hours} hrs sleep</p>
                      <p className="mt-1 text-xs text-slate-500">Quality: {entry.quality}/5</p>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">All Attendance Scores</h3>
              <ClipboardCheck className="h-4 w-4 text-sky-500" />
            </div>
            <div className="mt-4 space-y-3">
              {attendanceHistory.length === 0 ? (
                <p className="text-sm text-slate-500">No attendance records yet.</p>
              ) : (
                attendanceHistory.map((entry, index) => (
                  <div key={`attendance-${index}`} className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs text-slate-500">{formatDate(entry.date)}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">Attendance: {entry.percent}%</p>
                    {entry.notes ? (
                      <p className="mt-1 text-xs text-slate-500">{entry.notes}</p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">All Academic Scores</h3>
              <GraduationCap className="h-4 w-4 text-violet-500" />
            </div>
            <div className="mt-4 space-y-3">
              {academicScores.length === 0 ? (
                <p className="text-sm text-slate-500">No academic scores yet.</p>
              ) : (
                academicScores.map((entry, index) => (
                  <div key={`academic-${index}`} className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs text-slate-500">{formatDate(entry.date)}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {entry.term ? `${entry.term} - ` : ""}{entry.score}%
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Upcoming Appointments</h3>
            <CalendarClock className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-4 space-y-3">
            {(report?.upcomingAppointments || []).length === 0 ? (
              <p className="text-sm text-slate-500">No upcoming appointments.</p>
            ) : (
              (report?.upcomingAppointments || []).map((appt) => (
                <div key={appt._id} className="rounded-xl border border-slate-200 p-3">
                  <p className="text-xs text-slate-500">{formatDate(appt.date)}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {appt.type || "Counselling Session"} - {appt.time || "Time TBD"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Status: {appt.status || "Pending"}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
