import React, { useEffect, useState } from "react";
import api from "@/config/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface User {
  _id: string;
  role: "student" | "volunteer";
}

export default function Community() {
  const [communities, setCommunities] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ================= USER ================= */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/current_user");
        setUser(res.data?.user || null);
      } catch (error) {
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

  /* ================= COMMUNITIES ================= */
  const fetchCommunities = async () => {
    try {
      const res = await api.get("/api/community");
      setCommunities(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
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

  /* ================= ACTIONS ================= */
  const joinCommunity = async (id: string) => {
    try {
      await api.post(`/api/community/${id}/join`, {});
      navigate(`/community/${id}`);
    } catch (error) {
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


  /* ================= UI ================= */
  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold">Communities</h1>

        {/* ONLY VOLUNTEER */}
        {isVolunteer && (
          <Button onClick={() => setOpen(true)}>
            Create Community
          </Button>
        )}
      </div>

      {/* COMMUNITY LIST */}
      {loading ? (
        <div className="text-sm text-muted-foreground py-6">Loading communities...</div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {communities.map((c: any) => (
          <Card key={c._id} className="p-4 sm:p-6">
            <h2 className="font-semibold text-lg">{c.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {c.description || "No description available."}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              {(c.members?.length ?? 0)} members
            </p>

            <Button size="sm" onClick={() => joinCommunity(c._id)}>
              Open / Join
            </Button>
          </Card>
        ))}
      </div>
      )}

      {!loading && communities.length === 0 && (
        <Card className="p-6 text-sm text-muted-foreground">
          No communities found. {isVolunteer ? "Create one to get started." : "Please check back later."}
        </Card>
      )}

      {/* CREATE COMMUNITY MODAL */}
      {isVolunteer && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogTitle>Create Community</DialogTitle>

            <Input
              placeholder="Community Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <Button onClick={createCommunity} disabled={isSubmitting || !form.name.trim()}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
