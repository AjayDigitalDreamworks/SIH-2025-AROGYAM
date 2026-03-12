import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BookOpenText,
  CalendarClock,
  Flame,
  GraduationCap,
  Heart,
  Lightbulb,
  MessageCircle,
  Moon,
  Stethoscope,
  Users,
} from "lucide-react";
import api from "@/config/api";
import "./StudentDashboardTheme.css";

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

type AppointmentItem = {
  _id: string;
  date?: string;
  time?: string;
  type?: string;
  mode?: string;
  status?: string;
};

type ResourceItem = {
  _id?: string;
  title?: string;
  description?: string;
  category?: string;
  createdAt?: string;
  tags?: string[];
};

type CommunityItem = {
  _id?: string;
  name?: string;
  description?: string;
  category?: string;
  members?: string[];
  nextSessionAt?: string;
};

type DashboardUser = {
  fullName?: string;
  username?: string;
  wellbeingScore?: number;
  moodHistory?: MoodEntry[];
  sleepHistory?: SleepEntry[];
  quizScores?: QuizEntry[];
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const formatDateLabel = (value?: string) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatSessionLabel = (value?: string) => {
  if (!value) return "To be scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "To be scheduled";
  const now = new Date();
  const sameDay =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  if (sameDay) return `Today, ${time}`;
  const day = date.toLocaleDateString("en-US", { weekday: "short" });
  return `${day}, ${time}`;
};

const calculateStreak = (moodHistory: MoodEntry[] = []) => {
  if (!moodHistory.length) return 0;

  const sorted = [...moodHistory]
    .map((entry) => ({ ...entry, dateObj: new Date(entry.date) }))
    .filter((entry) => !Number.isNaN(entry.dateObj.getTime()))
    .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

  if (!sorted.length) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;

  for (let i = 0; i < sorted.length; i += 1) {
    const entryDate = new Date(sorted[i].dateObj);
    entryDate.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === i && sorted[i].mood >= 3) streak += 1;
    else break;
  }

  return streak;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [resources, setResources] = useState<{
    videos: ResourceItem[];
    guides: ResourceItem[];
    exercises: ResourceItem[];
  }>({
    videos: [],
    guides: [],
    exercises: [],
  });
  const [communities, setCommunities] = useState<CommunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login again.");
      window.location.href = "/login";
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, resourcesRes, communityRes] = await Promise.all([
          api.get("/users/dashboard"),
          api.get("/hub"),
          api.get("/api/community"),
        ]);

        const dashboard = dashboardRes.data || {};
        setUser(dashboard.user || null);
        setAppointments(dashboard.upcomingAppointments || []);
        setResources({
          videos: resourcesRes.data?.videos || [],
          guides: resourcesRes.data?.guides || [],
          exercises: resourcesRes.data?.exercises || [],
        });

        const communityPayload = communityRes.data;
        if (Array.isArray(communityPayload)) {
          setCommunities(communityPayload);
        } else if (Array.isArray(communityPayload?.communities)) {
          setCommunities(communityPayload.communities);
        } else {
          setCommunities([]);
        }
      } catch (fetchError: any) {
        setError("Failed to load dashboard.");
        if (fetchError?.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const latestMood = useMemo(() => {
    const history = user?.moodHistory || [];
    if (!history.length) return null;
    return [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [user]);

  const latestSleep = useMemo(() => {
    const history = user?.sleepHistory || [];
    if (!history.length) return null;
    return [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [user]);

  const latestQuiz = useMemo(() => {
    const scores = user?.quizScores || [];
    if (!scores.length) return null;
    return [...scores].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [user]);

  const wellbeingScore = useMemo(() => {
    if (typeof user?.wellbeingScore === "number") {
      return clamp(Math.round(user.wellbeingScore), 0, 100);
    }
    const base = (latestMood ? latestMood.mood * 20 : 0) * 0.35;
    const sleep = (latestSleep ? clamp((latestSleep.hours / 8) * 100, 0, 100) : 0) * 0.25;
    const quiz = (latestQuiz?.score || 0) * 0.4;
    return Math.round(base + sleep + quiz);
  }, [user, latestMood, latestSleep, latestQuiz]);

  const streak = useMemo(() => calculateStreak(user?.moodHistory || []), [user]);

  const overviewBars = useMemo(() => {
    const academic = clamp(Math.round(latestQuiz?.score || 0), 0, 100);
    const sleep = clamp(Math.round(((latestSleep?.hours || 0) / 8) * 100), 0, 100);
    const averageMood = user?.moodHistory?.length
      ? user.moodHistory.reduce((sum, entry) => sum + entry.mood, 0) / user.moodHistory.length
      : 0;
    const social = clamp(Math.round((averageMood / 5) * 100), 0, 100);
    return [
      { label: "Academic Focus", value: academic, className: "student-theme-bar-academic" },
      { label: "Sleep Quality", value: sleep, className: "student-theme-bar-sleep" },
      { label: "Emotional Stability", value: social, className: "student-theme-bar-social" },
    ];
  }, [latestQuiz, latestSleep, user]);

  const sevenDayMood = useMemo(() => {
    const history = user?.moodHistory || [];
    const map = new Map<string, number>();
    history.forEach((entry) => {
      const date = new Date(entry.date);
      if (Number.isNaN(date.getTime())) return;
      const key = date.toISOString().split("T")[0];
      map.set(key, entry.mood);
    });

    const items: { day: string; mood: number }[] = [];
    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      items.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        mood: map.get(key) || 0,
      });
    }
    return items;
  }, [user]);

  const allResources = useMemo(() => {
    return [...resources.videos, ...resources.guides, ...resources.exercises].sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bDate - aDate;
    });
  }, [resources]);

  const featuredResource = allResources[0];
  const upcomingAppointment = appointments[0];
  const topCommunities = communities.slice(0, 2);
  const displayName = user?.fullName || user?.username || "Student";
  const nextSessionLabel = upcomingAppointment
    ? `${formatDateLabel(upcomingAppointment.date)} · ${upcomingAppointment.time || "Time TBD"}`
    : "No session scheduled";

  const dynamicTip = useMemo(() => {
    if (!latestMood) return "Start with today's mood check-in to unlock your daily insight.";
    if (latestMood.mood <= 2) return "Your mood dipped recently. Consider booking a counsellor follow-up.";
    if ((latestSleep?.hours || 0) < 6) return "Sleep dropped below 6 hours. Try a wind-down routine tonight.";
    return "Your wellbeing trend is stable. Keep your check-ins consistent this week.";
  }, [latestMood, latestSleep]);

  if (loading) {
    return (
      <div className="student-theme-loading">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-theme-error">
        {error}
      </div>
    );
  }

  return (
    <div className="student-theme-root">
      <section className="student-theme-hero">
        <div className="student-theme-hero-copy">
          <p>Welcome back, {displayName}</p>
          <h1>Student Wellness Home</h1>
          <span>{dynamicTip}</span>
        </div>
        <div className="student-theme-hero-stats">
          <article>
            <small>Wellbeing</small>
            <strong>{wellbeingScore}/100</strong>
          </article>
          <article>
            <small>Current Streak</small>
            <strong>{streak} days</strong>
          </article>
          <article>
            <small>Next Session</small>
            <strong>{nextSessionLabel}</strong>
          </article>
        </div>
      </section>

      <div className="student-theme-tip">
        <Lightbulb size={16} />
        <span>{dynamicTip}</span>
      </div>

      <div className="student-theme-grid-2">
        <section className="student-theme-card">
          <header className="student-theme-card-head">
            <h2>Your Wellbeing Overview</h2>
            <button onClick={() => navigate("/quizzes")}>View Details</button>
          </header>

          <div className="student-theme-overview-content">
            <div className="student-theme-gauge-wrap">
              <svg viewBox="0 0 120 80" className="student-theme-gauge">
                <path
                  d="M18 62 A42 42 0 0 1 102 62"
                  className="student-theme-gauge-track"
                />
                <path
                  d="M18 62 A42 42 0 0 1 102 62"
                  className="student-theme-gauge-value"
                  style={{ strokeDashoffset: 132 - (wellbeingScore / 100) * 132 }}
                />
                <text x="60" y="52" textAnchor="middle" className="student-theme-gauge-score">
                  {wellbeingScore}
                </text>
                <text x="60" y="66" textAnchor="middle" className="student-theme-gauge-sub">
                  /100
                </text>
              </svg>
              <p>{user?.fullName || user?.username || "Student"}</p>
            </div>

            <div className="student-theme-bars">
              {overviewBars.map((item) => (
                <div key={item.label} className="student-theme-bar-row">
                  <div className="student-theme-bar-head">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="student-theme-bar-track">
                    <div
                      className={`student-theme-bar-fill ${item.className}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="student-theme-card">
          <header className="student-theme-card-head">
            <h2>Mood Tracker</h2>
            <button onClick={() => navigate("/mood")}>Open Tracker</button>
          </header>

          <div className="student-theme-mood-summary">
            <span className="student-theme-mood-score">{Math.round((latestMood?.mood || 0) * 20)}%</span>
            <span>{latestMood ? `Latest mood: ${latestMood.mood}/5` : "No mood entry yet"}</span>
          </div>

          <div className="student-theme-mood-bars">
            {sevenDayMood.map((item) => (
              <div key={item.day} className="student-theme-mood-day">
                <div className="student-theme-mood-bar-track">
                  <div
                    className="student-theme-mood-bar-fill"
                    style={{ height: `${(item.mood / 5) * 100}%` }}
                  />
                </div>
                <span>{item.day[0]}</span>
              </div>
            ))}
          </div>

          <button className="student-theme-primary-btn" onClick={() => navigate("/mood")}>
            Log Mood
          </button>
        </section>
      </div>

      <div className="student-theme-metrics">
        <article className="student-theme-metric-card">
          <div><Heart size={16} /> Mood Today</div>
          <strong>{latestMood ? `${latestMood.mood}/5` : "No data"}</strong>
        </article>
        <article className="student-theme-metric-card">
          <div><Moon size={16} /> Sleep</div>
          <strong>{latestSleep ? `${latestSleep.hours} hrs` : "No data"}</strong>
        </article>
        <article className="student-theme-metric-card">
          <div><GraduationCap size={16} /> Latest Quiz</div>
          <strong>{latestQuiz ? `${latestQuiz.score}%` : "No data"}</strong>
        </article>
        <article className="student-theme-metric-card">
          <div><Flame size={16} /> Streak</div>
          <strong>{streak} days</strong>
        </article>
      </div>

      <div className="student-theme-grid-2">
        <section className="student-theme-card">
          <header className="student-theme-card-head">
            <h2>Upcoming Appointment</h2>
            <button onClick={() => navigate("/appointments")}>View Calendar</button>
          </header>
          {upcomingAppointment ? (
            <div className="student-theme-detail-card">
              <div className="student-theme-detail-icon">
                <CalendarClock size={20} />
              </div>
              <div>
                <h3>{upcomingAppointment.type || "Counselling Session"}</h3>
                <p>{formatDateLabel(upcomingAppointment.date)} - {upcomingAppointment.time || "Time TBD"}</p>
                <span>Status: {upcomingAppointment.status || "Pending"}</span>
              </div>
            </div>
          ) : (
            <p className="student-theme-empty">No appointments scheduled yet.</p>
          )}
        </section>

        <section className="student-theme-card">
          <header className="student-theme-card-head">
            <h2>Support Resources</h2>
            <button onClick={() => navigate("/resources")}>Go to Resources</button>
          </header>
          {featuredResource ? (
            <div className="student-theme-resource-card">
              <div className="student-theme-resource-icon">
                <BookOpenText size={22} />
              </div>
              <div>
                <h3>{featuredResource.title || "Untitled resource"}</h3>
                <p>{featuredResource.description || "Explore curated wellbeing support content."}</p>
                <span>{featuredResource.category || "General"} - {allResources.length} resources available</span>
              </div>
            </div>
          ) : (
            <p className="student-theme-empty">No resources available yet.</p>
          )}
        </section>
      </div>

      <div className="student-theme-grid-2">
        <section className="student-theme-card student-theme-cta-card">
          <div className="student-theme-cta-icon">
            <Users size={20} />
          </div>
          <div className="student-theme-cta-content">
            <h3>Peer Community</h3>
            <p>Join active communities and stay connected with students facing similar challenges.</p>
            {topCommunities.length > 0 ? (
              <ul>
                {topCommunities.map((community) => (
                  <li key={community._id || community.name}>
                    {community.name || "Community"} - {(community.members?.length || 0)} members
                  </li>
                ))}
              </ul>
            ) : (
              <p className="student-theme-empty-inline">No communities available yet.</p>
            )}
            <button className="student-theme-secondary-btn" onClick={() => navigate("/community")}>
              Join Discussions <ArrowRight size={14} />
            </button>
          </div>
        </section>

        <section className="student-theme-card student-theme-cta-card">
          <div className="student-theme-cta-icon">
            <Stethoscope size={20} />
          </div>
          <div className="student-theme-cta-content">
            <h3>Need to Talk?</h3>
            <p>Book a private counselling session or chat with support when you need immediate help.</p>
            <div className="student-theme-quick-actions">
              <button className="student-theme-secondary-btn" onClick={() => navigate("/appointments")}>
                Schedule Session <ArrowRight size={14} />
              </button>
              <button className="student-theme-tertiary-btn" onClick={() => navigate("/chat")}>
                <MessageCircle size={14} /> Open Chat
              </button>
            </div>
          </div>
        </section>
      </div>

      <footer className="student-theme-footer">
        <Activity size={14} />
        <span>
          Live data - {communities.length} communities - {allResources.length} resources - next session {formatSessionLabel(communities[0]?.nextSessionAt)}
        </span>
      </footer>
    </div>
  );
};

export default Dashboard;
