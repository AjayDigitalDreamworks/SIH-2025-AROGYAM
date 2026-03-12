import React, { useEffect, useMemo, useState } from "react";
import api from "@/config/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Users, UserRoundPlus } from "lucide-react";

interface User {
  _id: string;
  role: "student" | "volunteer";
}

interface CommunityItem {
  _id: string;
  name?: string;
  description?: string;
  members?: string[];
}

export default function Community() {
  const [communities, setCommunities] = useState<CommunityItem[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/current_user");
        setUser(res.data?.user || null);
      } catch {
        toast({
          title: "Session expired",
          description: "Please login again to continue.",
          variant: "destructive",
        });
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [token, navigate, toast]);

  const isVolunteer = user?.role === "volunteer";

  const fetchCommunities = async () => {
    try {
      const res = await api.get("/api/community");
      setCommunities(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast({
        title: "Unable to load communities",
        description: "Please refresh and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const joinCommunity = async (id: string) => {
    try {
      await api.post(`/api/community/${id}/join`, {});
      navigate(`/community/${id}`);
    } catch {
      toast({
        title: "Unable to join community",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const createCommunity = async () => {
    if (!user || !form.name.trim()) return;
    try {
      setIsSubmitting(true);
      await api.post("/api/community/create", {
        ...form,
        role: user.role,
      });

      toast({
        title: "Community created",
        description: "New community has been added successfully.",
      });

      setOpen(false);
      setForm({ name: "", description: "" });
      fetchCommunities();
    } catch (error: any) {
      toast({
        title: "Failed to create community",
        description: error?.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCommunities = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return communities;
    return communities.filter((c) =>
      [c.name, c.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [communities, search]);

  const totalMembers = communities.reduce((sum, c) => sum + (c.members?.length || 0), 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <section className="relative mb-6 overflow-hidden rounded-3xl border border-teal-200/70 bg-gradient-to-br from-teal-700 via-cyan-700 to-sky-700 p-6 text-white shadow-xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_45%)]" />
        <div className="relative">
          <Badge className="mb-3 border-white/25 bg-white/10 text-white hover:bg-white/20">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Student support communities
          </Badge>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Community Forum</h1>
              <p className="mt-1 text-sm text-cyan-100 sm:text-base">
                Join peer spaces, share experiences, and stay connected.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs sm:text-sm">
              <div className="rounded-xl border border-white/25 bg-white/10 px-3 py-2">
                <div className="text-lg font-bold">{communities.length}</div>
                <div className="text-cyan-100">Communities</div>
              </div>
              <div className="rounded-xl border border-white/25 bg-white/10 px-3 py-2">
                <div className="text-lg font-bold">{totalMembers}</div>
                <div className="text-cyan-100">Members</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Card className="mb-6 rounded-2xl border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              placeholder="Search communities..."
            />
          </div>

          {isVolunteer ? (
            <Button
              onClick={() => setOpen(true)}
              className="w-full bg-teal-700 hover:bg-teal-800 sm:w-auto"
            >
              <UserRoundPlus className="mr-2 h-4 w-4" />
              Create Community
            </Button>
          ) : null}
        </div>
      </Card>

      {loading ? (
        <Card className="rounded-2xl border-slate-200 p-6 text-sm text-slate-500">
          Loading communities...
        </Card>
      ) : filteredCommunities.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {filteredCommunities.map((c) => (
            <Card
              key={c._id}
              className="rounded-2xl border-slate-200 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">{c.name || "Community"}</h2>
              <p className="mt-1 line-clamp-3 text-sm text-slate-600">
                {c.description || "No description available."}
              </p>
              <p className="mt-3 text-xs text-slate-500">{c.members?.length ?? 0} members</p>

              <Button
                size="sm"
                className="mt-4 w-full bg-teal-700 hover:bg-teal-800"
                onClick={() => joinCommunity(c._id)}
              >
                Open / Join
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl border-slate-200 p-6 text-sm text-slate-500">
          {search.trim()
            ? "No communities match your search."
            : `No communities found. ${isVolunteer ? "Create one to get started." : "Please check back later."}`}
        </Card>
      )}

      {isVolunteer ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-slate-200">
            <DialogHeader>
              <DialogTitle>Create Community</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Community name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <Textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
              />

              <Button
                onClick={createCommunity}
                disabled={isSubmitting || !form.name.trim()}
                className="w-full bg-teal-700 hover:bg-teal-800"
              >
                {isSubmitting ? "Creating..." : "Create Community"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
