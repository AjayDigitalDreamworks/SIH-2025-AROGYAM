import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { WellnessCard } from "@/components/WellnessCard";
import { Users, BookOpen, Phone, Home } from "lucide-react";
import { UpcomingAppointments } from "@/components/UpcomingAppointments";
import { LatestResources } from "@/components/LatestResources";

const adminData = [
  { title: "Registered Counsellors", subtitle: "Total", icon: Users, iconBgColor: "bg-wellness-green", progress: 50, progressColor: "green", emoji: "👥" },
  { title: "Resources", subtitle: "Available", icon: BookOpen, iconBgColor: "bg-wellness-blue", progress: 65, progressColor: "blue", emoji: "📚" },
  { title: "Emergency Cases", subtitle: "Active", icon: Phone, iconBgColor: "bg-wellness-orange", progress: 10, progressColor: "orange", emoji: "🚨" },
  { title: "Operational Uptime", subtitle: "Status", icon: Home, iconBgColor: "bg-wellness-yellow", progress: 99, progressColor: "yellow", emoji: "✔️" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <HeroSection userName={"Admin"}  />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminData.map((data) => (
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
