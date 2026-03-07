import React, { useState, useEffect } from "react";
import { Heart, Moon, GraduationCap, Flame } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { WellnessCard } from "@/components/WellnessCard";
import QuickActions from "@/components/QuickActions";
import { CommunityHighlights } from "@/components/CommunityHighlights";
import { WellnessJourney } from "@/components/WellnessJourney";
import { WellnessTip } from "@/components/WellnessTip";
import { EmergencySupport } from "@/components/EmergencySupport";
import { UpcomingAppointments } from "@/components/UpcomingAppointments";
import { LatestResources } from "@/components/LatestResources";
import { Button } from "@/components/ui/button";
import api from "@/config/api";

export default function Dashboard() {

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [wellnessData, setWellnessData] = useState([]);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [resourcesData, setResourcesData] = useState({
    videos: [],
    guides: [],
    exercises: []
  });
  const [communitiesData, setCommunitiesData] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login again");
      window.location.href = "/login";
      return;
    }

    const fetchAllData = async () => {

      try {

        const [dashboardRes, resourcesRes, communityRes] = await Promise.all([
          api.get("/users/dashboard"),
          api.get("/hub"),
          api.get("/api/community")
        ]);

        const dashboard = dashboardRes.data;
        const userData = dashboard.user;

        setUser(userData);
        setAppointmentsData(dashboard.upcomingAppointments || []);

        setResourcesData({
          videos: resourcesRes.data.videos || [],
          guides: resourcesRes.data.guides || [],
          exercises: resourcesRes.data.exercises || []
        });

        setCommunitiesData(communityRes.data?.communities || []);

        /* ---------------- WELLNESS CARDS ---------------- */

        const latestMood = dashboard.latestMood;
        const latestSleep = dashboard.latestSleep;
        const quizScores = dashboard.quizScores;

        const moodProgress = latestMood
          ? Math.round((latestMood.mood / 5) * 100)
          : 0;

        const sleepProgress = latestSleep
          ? Math.round(Math.min(100, (latestSleep.hours / 8) * 100))
          : 0;

        const studyStress =
          quizScores && quizScores.length
            ? Math.round(Math.min(100, quizScores[0].score || 50))
            : 50;

        /* ---------------- STREAK CALCULATION ---------------- */

        let streak = 0;

        if (userData?.moodHistory?.length) {

          const sorted = [...userData.moodHistory].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          const today = new Date();
          today.setHours(0,0,0,0);

          for (let i = 0; i < sorted.length; i++) {
            const entryDate = new Date(sorted[i].date);
            entryDate.setHours(0,0,0,0);
            const diffDays =
              (today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays === i && sorted[i].mood >= 3) {
              streak++;
            } else {
              break;
            }
          }
        }

        setWellnessData([
          {
            title: "Mood Today",
            subtitle: latestMood ? `Mood ${latestMood.mood}` : "No data",
            icon: Heart,
            iconBgColor: "bg-wellness-green",
            progress: moodProgress,
            progressColor: "green",
            emoji: "💚"
          },
          {
            title: "Sleep Quality",
            subtitle: latestSleep ? `${latestSleep.hours} hrs` : "No data",
            icon: Moon,
            iconBgColor: "bg-wellness-blue",
            progress: sleepProgress,
            progressColor: "blue",
            emoji: "🌙"
          },
          {
            title: "Study Stress",
            subtitle: `${studyStress}%`,
            icon: GraduationCap,
            iconBgColor: "bg-wellness-orange",
            progress: studyStress,
            progressColor: "orange",
            emoji: "🎓"
          },
          {
            title: "Streak",
            subtitle: `${streak} days`,
            icon: Flame,
            iconBgColor: "bg-wellness-yellow",
            progress: Math.min(100, streak),
            progressColor: "yellow",
            emoji: "🔥"
          }
        ]);

        setLoading(false);

      } catch (err) {

        console.error(err);

        setError("Failed to load dashboard");

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }

        setLoading(false);
      }
    };

    fetchAllData();

  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-lg">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-6 py-8 max-w-7xl">

        <HeroSection userName={user?.username || "User"} />

        {/* WELLBEING + MOOD TRACKER */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* WELLBEING OVERVIEW */}

          <div className="rounded-xl bg-white shadow p-6 flex flex-col items-center">

            <h2 className="text-xl font-semibold mb-4">
              Your Wellbeing Overview
            </h2>

            <div className="flex items-center gap-6">

              <div className="relative">

                <svg width="100" height="100">

                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />

                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="8"
                    strokeDasharray="282"
                    strokeDashoffset={
                      282 -
                      Math.round(
                        (user?.wellbeingScore ?? 78) / 100 * 282
                      )
                    }
                  />

                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">

                  <span className="text-3xl font-bold">
                    {user?.wellbeingScore ?? 78}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    /100
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* MOOD TRACKER */}

          <div className="rounded-xl bg-white shadow p-6 flex flex-col items-center">

            <h2 className="text-xl font-semibold mb-4">
              Mood Tracker
            </h2>

            <div className="flex gap-2 mb-4">

              {(user?.moodHistory ?? [])
                .slice(-7)
                .map((entry, idx) => (

                  <span key={idx} className="text-2xl">

                    {["😢","😞","😐","😊","😍"][entry.mood - 1]}

                  </span>

                ))}

            </div>

            <Button
              className="w-full"
              onClick={() => window.location.href = "/mood"}
            >
              Log Mood
            </Button>

          </div>

        </div>

        {/* WELLNESS CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {wellnessData.map((data) => (

            <WellnessCard
              key={data.title}
              title={data.title}
              subtitle={data.subtitle}
              icon={data.icon}
              iconBgColor={data.iconBgColor}
              progress={data.progress}
              progressColor={data.progressColor}
              emoji={data.emoji}
            />

          ))}

        </div>

        <UpcomingAppointments appointments={appointmentsData} />

        <QuickActions />

        <LatestResources
          resources={[
            ...resourcesData.videos,
            ...resourcesData.guides,
            ...resourcesData.exercises
          ]}
        />

        <CommunityHighlights communities={communitiesData} />

        <WellnessTip />

        <WellnessJourney />

        <EmergencySupport />

      </main>

    </div>
  );
}