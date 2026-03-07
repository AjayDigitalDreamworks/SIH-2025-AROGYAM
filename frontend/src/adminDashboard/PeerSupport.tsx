import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Users, MessageCircle, Heart, Star, Clock, Video, ChevronRight, Shield } from "lucide-react";

const peerMentors = [
  { name: "Ananya Sharma", branch: "CSE", year: "3rd Year", rating: 4.8, sessions: 42, avatar: "ananya", specialty: "Academic Stress", available: true },
  { name: "Rohan Mehta", branch: "ECE", year: "4th Year", rating: 4.9, sessions: 67, avatar: "rohan", specialty: "Social Anxiety", available: true },
  { name: "Priya Patel", branch: "ME", year: "3rd Year", rating: 4.7, sessions: 35, avatar: "priya", specialty: "Exam Anxiety", available: false },
  { name: "Arjun Nair", branch: "IT", year: "4th Year", rating: 4.6, sessions: 28, avatar: "arjun", specialty: "Career Guidance", available: true },
  { name: "Kavya Reddy", branch: "CSE", year: "2nd Year", rating: 4.5, sessions: 19, avatar: "kavya", specialty: "Peer Conflict", available: false },
];

const supportGroups = [
  { name: "Stress Busters Circle", members: 24, nextSession: "Today, 5:00 PM", category: "Stress Management", color: "bg-[hsl(var(--arogyam-sky))]" },
  { name: "Mindful Mondays", members: 18, nextSession: "Mon, 4:00 PM", category: "Mindfulness", color: "bg-[hsl(var(--arogyam-lavender))]" },
  { name: "Career Compass", members: 31, nextSession: "Wed, 6:00 PM", category: "Career Anxiety", color: "bg-[hsl(var(--arogyam-teal)/0.15)]" },
  { name: "Safe Space Talks", members: 15, nextSession: "Fri, 3:30 PM", category: "Open Discussion", color: "bg-[hsl(var(--arogyam-coral)/0.15)]" },
];

const recentChats = [
  { from: "Ananya S.", message: "Remember, it's okay to take breaks during exams!", time: "2 min ago" },
  { from: "Rohan M.", message: "Great session today. Keep journaling!", time: "1 hr ago" },
  { from: "Arjun N.", message: "Let's schedule a follow-up next week.", time: "3 hrs ago" },
];

export default function PeerSupport() {
  return (
    <DashboardLayout>
      <PageHeader title="Peer Support Network" subtitle="Connect with trained peer mentors and support groups" searchPlaceholder="Search mentors..." />

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Mentors", value: "12", icon: Users, color: "text-[hsl(var(--arogyam-teal))]", bg: "bg-[hsl(var(--arogyam-teal)/0.12)]" },
          { label: "Support Groups", value: "8", icon: Heart, color: "text-[hsl(var(--arogyam-coral))]", bg: "bg-[hsl(var(--arogyam-coral)/0.12)]" },
          { label: "Sessions This Week", value: "34", icon: MessageCircle, color: "text-[hsl(var(--primary))]", bg: "bg-[hsl(var(--arogyam-sky))]" },
          { label: "Avg Rating", value: "4.7", icon: Star, color: "text-[hsl(var(--arogyam-yellow))]", bg: "bg-[hsl(var(--arogyam-yellow)/0.12)]" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Peer Mentors */}
        <div className="col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Peer Mentors</h2>
            <button className="text-xs text-primary font-semibold flex items-center gap-1">View All <ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-3">
            {peerMentors.map((mentor) => (
              <div key={mentor.name} className="flex items-center justify-between p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-all">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.avatar}`} alt={mentor.name} className="w-10 h-10 rounded-full" />
                    {mentor.available && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[hsl(var(--arogyam-green))] rounded-full border-2 border-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{mentor.name}</p>
                    <p className="text-xs text-muted-foreground">{mentor.branch} · {mentor.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--arogyam-lavender))] text-[hsl(var(--arogyam-purple))] font-medium">{mentor.specialty}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 text-[hsl(var(--arogyam-yellow))]" fill="hsl(var(--arogyam-yellow))" /> {mentor.rating}
                  </div>
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                    {mentor.available ? "Connect" : "Schedule"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Support Groups */}
          <div className="glass-card p-5">
            <h2 className="text-lg font-bold text-foreground mb-3">Support Groups</h2>
            <div className="space-y-3">
              {supportGroups.map((group) => (
                <div key={group.name} className={`p-3 rounded-xl ${group.color} cursor-pointer hover:scale-[1.01] transition-transform`}>
                  <p className="text-sm font-semibold text-foreground">{group.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" /> {group.members} members</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {group.nextSession}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="glass-card p-5">
            <h2 className="text-sm font-bold text-foreground mb-3">Recent Messages</h2>
            <div className="space-y-3">
              {recentChats.map((chat, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--arogyam-sky))] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs"><span className="font-semibold text-foreground">{chat.from}</span> <span className="text-muted-foreground">· {chat.time}</span></p>
                    <p className="text-xs text-muted-foreground mt-0.5">{chat.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
