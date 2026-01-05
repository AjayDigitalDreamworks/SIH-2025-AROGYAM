import React from "react";
import { Users, Calendar, ClipboardList, BarChart2 } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { WellnessCard } from "@/components/WellnessCard";
import { UpcomingAppointments } from "@/components/UpcomingAppointments";
import { LatestResources } from "@/components/LatestResources";
import api from "@/config/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const counsellorData = [
  {
    title: "Students Monitored",
    subtitle: "Active cases",
    icon: Users,
    iconBgColor: "bg-wellness-green",
    progress: 75,
    progressColor: "green",
    emoji: "👥",
  },
  {
    title: "Appointments Today",
    subtitle: "Scheduled",
    icon: Calendar,
    iconBgColor: "bg-wellness-blue",
    progress: 45,
    progressColor: "blue",
    emoji: "📅",
  },
  {
    title: "Volunteer Requests",
    subtitle: "Pending",
    icon: ClipboardList,
    iconBgColor: "bg-wellness-orange",
    progress: 30,
    progressColor: "orange",
    emoji: "🤝",
  },
  {
    title: "Avg Student Progress",
    subtitle: "Overall wellness",
    icon: BarChart2,
    iconBgColor: "bg-wellness-yellow",
    progress: 68,
    progressColor: "yellow",
    emoji: "📈",
  },
];

export default function CounsellorDashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await api.post('/api/counsellor/logout');
    } catch (e) {
      console.warn('Counsellor logout request failed', e);
    } finally {
      localStorage.removeItem('token');
      toast({ title: 'Logged out', description: 'You have been logged out.' });
      navigate('/counsellor/login');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found, please log in again.");
      window.location.href = "/login";
      return;
    }

    api
      .get("/protected", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUser(response.data.user))
      .catch((err) => {
        setError("Error fetching user");
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <HeroSection userName={user?.username || "Counsellor"} title="Counsellor Dashboard" />
          </div>
          <div className="ml-4 mt-4">
            <Button variant="ghost" onClick={handleLogout} className="text-red-600">
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {counsellorData.map((data) => (
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

        <div className="mb-8">
          <UpcomingAppointments />
        </div>

        <div className="mb-8">
          <LatestResources />
        </div>
      </main>
    </div>
  );
}