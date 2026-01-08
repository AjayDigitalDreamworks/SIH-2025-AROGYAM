import React from "react";
import { Heart, Moon, GraduationCap, Flame } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { WellnessCard } from "@/components/WellnessCard";
import { MoodTracker } from "@/components/MoodTracker";
import { QuickActions } from "@/components/QuickActions";
import { CommunityHighlights } from "@/components/CommunityHighlights";
import { WellnessJourney } from "@/components/WellnessJourney";
import { WellnessTip } from "@/components/WellnessTip";
import { EmergencySupport } from "@/components/EmergencySupport";
import { UpcomingAppointments } from "@/components/UpcomingAppointments";
import { LatestResources } from "@/components/LatestResources";
import axios from "axios";
import { useState, useEffect } from "react";
import Mood from "./Mood";
import api from "@/config/api";

// Wellness data and related datasets will be stored in component state
export default function Dashboard() {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const [wellnessData, setWellnessData] = useState<any[]>([]);
	const [appointmentsData, setAppointmentsData] = useState<any[]>([]);
	const [resourcesData, setResourcesData] = useState<any[]>([]);
	const [communitiesData, setCommunitiesData] = useState<any[]>([]);

  useEffect(() => {
    // Call dashboard endpoint to fetch user data and related entities
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found, please log in again.");
      window.location.href = "/login";
      return;
    }

    api
      .get('/users/dashboard')
      .then((res) => {
        const { user, latestMood, latestSleep, upcomingAppointments, quizScores } = res.data;
        setUser(user);
        setAppointmentsData(upcomingAppointments || []);

        // Build wellness cards
        const moodProgress = latestMood ? Math.round((latestMood.mood / 5) * 100) : 0;
        const sleepProgress = latestSleep ? Math.round(Math.min(100, (latestSleep.hours / 8) * 100)) : 0;
        const studyStress = quizScores && quizScores.length ? Math.round(Math.min(100, quizScores[0].score || 50)) : 50;

        const streak = (() => {
          // Compute simple streak based on recent mood entries counting consecutive days with mood >=3
          if (!user.moodHistory || !user.moodHistory.length) return 0;
          const sorted = [...user.moodHistory].sort((a:any,b:any)=> new Date(b.date).getTime() - new Date(a.date).getTime());
          let curr = new Date();
          let streakCount = 0;
          for (const entry of sorted) {
            const entryDate = new Date(entry.date);
            const diffDays = Math.floor((curr.setHours(0,0,0,0) - new Date(entryDate).setHours(0,0,0,0)) / (1000*60*60*24));
            if (diffDays === streakCount && entry.mood >= 3) {
              streakCount += 1;
            } else if (diffDays > streakCount) {
              break;
            }
          }
          return streakCount;
        })();

        setWellnessData([
          { title: 'Mood Today', subtitle: latestMood ? `Mood ${latestMood.mood}` : 'No data', icon: Heart, iconBgColor: 'bg-wellness-green', progress: moodProgress, progressColor: 'green', emoji: '💚' },
          { title: 'Sleep Quality', subtitle: latestSleep ? `${latestSleep.hours} hrs` : 'No data', icon: Moon, iconBgColor: 'bg-wellness-blue', progress: sleepProgress, progressColor: 'blue', emoji: '🌙' },
          { title: 'Study Stress', subtitle: `${studyStress}%`, icon: GraduationCap, iconBgColor: 'bg-wellness-orange', progress: studyStress, progressColor: 'orange', emoji: '🎓' },
          { title: 'Streak', subtitle: `${streak} days`, icon: Flame, iconBgColor: 'bg-wellness-yellow', progress: Math.min(100, streak), progressColor: 'yellow', emoji: '🔥' }
        ]);
      })
      .catch((err) => {
        console.error('Error fetching dashboard data', err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          setError('Failed to load dashboard');
        }
      });

    // Fetch latest resources
    api.get('/videos/videos').then(r => setResourcesData((r.data || []).slice(0,3))).catch(()=>{});

    // Fetch communities
    api.get('/api/community').then(r => setCommunitiesData(r.data.communities || [])).catch(()=>{});
  }, []);

	return (
		<div className="min-h-screen bg-background">
			<main className="container mx-auto px-6 py-8 max-w-7xl">
				{/* Hero Section */}
				<HeroSection userName={user?.username || "User"} />

				{/* Wellness Cards Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{wellnessData.map((data, index) => (
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

				{/* Main Content Grid */}
				{/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          Left Column - Mood Tracker
          <div className="lg:col-span-1">
            <MoodTracker />
          </div>
          
          Right Columns - Community & Journey
          <div className="lg:col-span-2 space-y-8">
            <CommunityHighlights />
            <WellnessJourney />
          </div>
        </div> */}

				{/* <div className="mb-8">
          <MoodTracker />
         </div> */}

				{/* Upcoming Appointments */}
				<div className="mb-8">
				<UpcomingAppointments appointments={appointmentsData} />
			</div>

			{/* Quick Actions */}
			<div className="mb-8">
				<QuickActions />
			</div>

			{/* Latest Resources */}
			<div className="mb-8">
				<LatestResources resources={resourcesData} />
			</div>

			{/* Community Highlights */}
			<div className="mb-8">
				<CommunityHighlights communities={communitiesData} />
				{/* Wellness Tip */}
				<div className="mb-8">
					<WellnessTip />
				</div>

				{/* Wellness Journey */}
				<div className="mb-8">
					<WellnessJourney />
				</div>

				{/* Emergency Support */}
				<div>
					<EmergencySupport />
				</div>
			</div>
			</main>
		</div>
	);
}
