import { useEffect, useState } from "react";
import { DashboardLayout } from "../componentsAdmin/DashboardLayout";
import { PageHeader } from "../componentsAdmin/PageHeader";
import { ChevronRight, Clock, Heart, MessageCircle, Star, Users } from "lucide-react";
import api from "@/config/api";

type Stats = {
  mentors: number;
  groups: number;
  sessions: number;
  rating: number;
};

type PeerMentor = {
  name: string;
  branch: string;
  year: string;
  rating: number;
  sessions: number;
  avatar: string;
  specialty: string;
  available: boolean;
};

type SupportGroup = {
  name: string;
  members: number;
  nextSession: string;
  category: string;
  color: string;
};

type RecentChat = {
  from: string;
  message: string;
  time: string;
};

const emptyStats: Stats = {
  mentors: 0,
  groups: 0,
  sessions: 0,
  rating: 0,
};

const PeerSupport = () => {
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [peerMentors, setPeerMentors] = useState<PeerMentor[]>([]);
  const [supportGroups, setSupportGroups] = useState<SupportGroup[]>([]);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/admin/peer-support");

      setStats(res.data?.stats || emptyStats);
      setPeerMentors(Array.isArray(res.data?.peerMentors) ? res.data.peerMentors : []);
      setSupportGroups(Array.isArray(res.data?.supportGroups) ? res.data.supportGroups : []);
      setRecentChats(Array.isArray(res.data?.recentChats) ? res.data.recentChats : []);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Unable to load peer support data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Peer Support Network"
        subtitle="Connect with trained peer mentors and support groups"
        searchPlaceholder="Search mentors..."
      />

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Active Mentors",
            value: stats.mentors,
            icon: Users,
            color: "text-[hsl(var(--arogyam-teal))]",
            bg: "bg-[hsl(var(--arogyam-teal)/0.12)]",
          },
          {
            label: "Support Groups",
            value: stats.groups,
            icon: Heart,
            color: "text-[hsl(var(--arogyam-coral))]",
            bg: "bg-[hsl(var(--arogyam-coral)/0.12)]",
          },
          {
            label: "Sessions This Week",
            value: stats.sessions,
            icon: MessageCircle,
            color: "text-[hsl(var(--primary))]",
            bg: "bg-[hsl(var(--arogyam-sky))]",
          },
          {
            label: "Avg Rating",
            value: stats.rating,
            icon: Star,
            color: "text-[hsl(var(--arogyam-yellow))]",
            bg: "bg-[hsl(var(--arogyam-yellow)/0.12)]",
          },
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Peer Mentors</h2>
            <button className="text-xs text-primary font-semibold flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {peerMentors.map((mentor) => (
              <div
                key={mentor.name}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.avatar}`}
                      alt={mentor.name}
                      className="w-10 h-10 rounded-full"
                    />

                    {mentor.available && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[hsl(var(--arogyam-green))] rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">{mentor.name}</p>
                    <p className="text-xs text-muted-foreground">{mentor.branch} - {mentor.year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--arogyam-lavender))] text-[hsl(var(--arogyam-purple))] font-medium">
                    {mentor.specialty}
                  </span>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 text-[hsl(var(--arogyam-yellow))]" fill="hsl(var(--arogyam-yellow))" />
                    {mentor.rating}
                  </div>

                  <button className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                    {mentor.available ? "Connect" : "Schedule"}
                  </button>
                </div>
              </div>
            ))}
            {!loading && peerMentors.length === 0 && (
              <p className="text-xs text-muted-foreground">No peer mentors available.</p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-card p-5">
            <h2 className="text-lg font-bold text-foreground mb-3">Support Groups</h2>

            <div className="space-y-3">
              {supportGroups.map((group) => (
                <div
                  key={group.name}
                  className={`p-3 rounded-xl ${group.color} cursor-pointer hover:scale-[1.01] transition-transform`}
                >
                  <p className="text-sm font-semibold text-foreground">{group.name}</p>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {group.members} members
                    </span>

                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {group.nextSession}
                    </span>
                  </div>
                </div>
              ))}
              {!loading && supportGroups.length === 0 && (
                <p className="text-xs text-muted-foreground">No support groups found.</p>
              )}
            </div>
          </div>

          <div className="glass-card p-5">
            <h2 className="text-sm font-bold text-foreground mb-3">Recent Messages</h2>

            <div className="space-y-3">
              {recentChats.map((chat, index) => (
                <div key={`${chat.from}-${index}`} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--arogyam-sky))] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </div>

                  <div>
                    <p className="text-xs">
                      <span className="font-semibold text-foreground">{chat.from}</span>
                      <span className="text-muted-foreground"> - {chat.time}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{chat.message}</p>
                  </div>
                </div>
              ))}
              {!loading && recentChats.length === 0 && (
                <p className="text-xs text-muted-foreground">No recent messages yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PeerSupport;
