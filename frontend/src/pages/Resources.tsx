import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Clock,
  Download,
  Headphones,
  Play,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import api from "@/config/api";

const cloudinaryBase = "https://res.cloudinary.com/dlpyvzfis/video/upload/";

interface HubResource {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  duration?: string;
  rating?: number;
  thumbnailUrl?: string;
  videoUrl?: string;
  tags?: string[];
  icon?: string;
  readTime?: string;
  difficulty?: string;
}

const normalizeText = (value?: string) => (value || "").toLowerCase();

const matchesSearch = (item: HubResource, query: string) => {
  if (!query) return true;
  const haystack = [
    item.title,
    item.description,
    item.category,
    ...(item.tags || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
};

const keyFor = (item: HubResource) => item._id || item.id || item.title || Math.random().toString(36);

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [resources, setResources] = useState<{
    videos: HubResource[];
    guides: HubResource[];
    exercises: HubResource[];
  }>({
    videos: [],
    guides: [],
    exercises: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<HubResource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await api.get("/hub");
        const data = response.data || {};

        setResources({
          videos: Array.isArray(data.videos) ? data.videos : [],
          guides: Array.isArray(data.guides) ? data.guides : [],
          exercises: Array.isArray(data.exercises) ? data.exercises : [],
        });
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const query = normalizeText(searchTerm.trim());

  const filtered = useMemo(() => {
    return {
      videos: resources.videos.filter((item) => matchesSearch(item, query)),
      guides: resources.guides.filter((item) => matchesSearch(item, query)),
      exercises: resources.exercises.filter((item) => matchesSearch(item, query)),
    };
  }, [resources, query]);

  const totalCount =
    filtered.videos.length + filtered.guides.length + filtered.exercises.length;

  const topTags = useMemo(() => {
    const all = [...filtered.videos, ...filtered.guides, ...filtered.exercises];
    const counts = new Map<string, number>();
    all.forEach((item) => {
      (item.tags || []).forEach((tag) => {
        const normalized = tag.trim();
        if (!normalized) return;
        counts.set(normalized, (counts.get(normalized) || 0) + 1);
      });
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag]) => tag);
  }, [filtered]);

  const openResourceModal = (item: HubResource) => {
    setSelectedResource(item);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Card className="rounded-3xl border border-slate-200/80 p-10 text-center text-slate-500">
          Loading resource hub...
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Card className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
          {error}
        </Card>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute -top-16 left-6 h-40 w-40 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-24 h-48 w-48 rounded-full bg-emerald-200/40 blur-3xl" />

      <section className="relative overflow-hidden rounded-3xl border border-teal-200/60 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 p-6 text-white shadow-xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Curated wellness library
          </div>
          <h1 className="text-2xl font-bold sm:text-4xl">Resource Hub</h1>
          <p className="mt-2 max-w-2xl text-sm text-cyan-50 sm:text-base">
            Explore videos, reading guides, and practical exercises designed for daily mental wellbeing.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card className="border-white/30 bg-white/15 p-3 text-white shadow-none backdrop-blur">
              <p className="text-2xl font-semibold">{filtered.videos.length}</p>
              <p className="text-xs text-cyan-50">Videos</p>
            </Card>
            <Card className="border-white/30 bg-white/15 p-3 text-white shadow-none backdrop-blur">
              <p className="text-2xl font-semibold">{filtered.guides.length}</p>
              <p className="text-xs text-cyan-50">Guides</p>
            </Card>
            <Card className="border-white/30 bg-white/15 p-3 text-white shadow-none backdrop-blur">
              <p className="text-2xl font-semibold">{filtered.exercises.length}</p>
              <p className="text-xs text-cyan-50">Exercises</p>
            </Card>
            <Card className="border-white/30 bg-white/15 p-3 text-white shadow-none backdrop-blur">
              <p className="text-2xl font-semibold">{totalCount}</p>
              <p className="text-xs text-cyan-50">Total Matches</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by title, tag, category, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-xl border-slate-200 pl-10"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Popular tags:</span>
          {topTags.length ? (
            topTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
              >
                {tag}
              </button>
            ))
          ) : (
            <span className="text-xs text-slate-400">No tags in current results</span>
          )}
        </div>
      </section>

      <Tabs defaultValue="videos" className="mt-6 space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-3 gap-2 bg-slate-100 p-1.5">
          <TabsTrigger
            value="videos"
            className="flex items-center gap-2 rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow"
          >
            <Play className="h-4 w-4" />
            Videos ({filtered.videos.length})
          </TabsTrigger>
          <TabsTrigger
            value="guides"
            className="flex items-center gap-2 rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow"
          >
            <BookOpen className="h-4 w-4" />
            Guides ({filtered.guides.length})
          </TabsTrigger>
          <TabsTrigger
            value="exercises"
            className="flex items-center gap-2 rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow"
          >
            <Headphones className="h-4 w-4" />
            Exercises ({filtered.exercises.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-6">
          {filtered.videos.length === 0 ? (
            <Card className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              No videos match your search.
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.videos.map((video) => (
                <Card
                  key={keyFor(video)}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-cyan-100 to-teal-100">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title || "Video thumbnail"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Play className="h-12 w-12 text-teal-700/80" />
                      </div>
                    )}
                    <div className="absolute left-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
                      Video
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {video.category ? (
                        <Badge variant="secondary" className="bg-teal-50 text-teal-700 hover:bg-teal-100">
                          {video.category}
                        </Badge>
                      ) : null}
                      {video.duration ? (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          {video.duration}
                        </span>
                      ) : null}
                      {typeof video.rating === "number" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {video.rating}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="line-clamp-1 text-base font-semibold text-slate-900">
                      {video.title || "Untitled video"}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                      {video.description || "No description available."}
                    </p>

                    {video.tags?.length ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {video.tags.slice(0, 4).map((tag) => (
                          <Badge key={`${keyFor(video)}-${tag}`} variant="outline" className="text-[11px]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    <Button
                      className="mt-4 w-full bg-teal-600 hover:bg-teal-700"
                      onClick={() => openResourceModal(video)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Watch Video
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          {filtered.guides.length === 0 ? (
            <Card className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              No guides match your search.
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.guides.map((guide) => (
                <Card
                  key={keyFor(guide)}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-cyan-100 text-xl">
                    {guide.icon || "📘"}
                  </div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {guide.category ? (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                        {guide.category}
                      </Badge>
                    ) : null}
                    {guide.readTime ? (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {guide.readTime}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="line-clamp-1 text-base font-semibold text-slate-900">
                    {guide.title || "Untitled guide"}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                    {guide.description || "No description available."}
                  </p>

                  {guide.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {guide.tags.slice(0, 4).map((tag) => (
                        <Badge key={`${keyFor(guide)}-${tag}`} variant="outline" className="text-[11px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-5 flex gap-2">
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => openResourceModal(guide)}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Open Guide
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => openResourceModal(guide)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          {filtered.exercises.length === 0 ? (
            <Card className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              No exercises match your search.
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.exercises.map((exercise) => (
                <Card
                  key={keyFor(exercise)}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 text-xl">
                    {exercise.icon || "🎧"}
                  </div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {exercise.category ? (
                      <Badge variant="secondary" className="bg-sky-50 text-sky-700 hover:bg-sky-100">
                        {exercise.category}
                      </Badge>
                    ) : null}
                    {exercise.difficulty ? (
                      <Badge variant="outline">{exercise.difficulty}</Badge>
                    ) : null}
                  </div>
                  <h3 className="line-clamp-1 text-base font-semibold text-slate-900">
                    {exercise.title || "Untitled exercise"}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                    {exercise.description || "No description available."}
                  </p>
                  {exercise.duration ? (
                    <div className="mt-3 inline-flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {exercise.duration}
                    </div>
                  ) : null}
                  <Button className="mt-5 w-full bg-sky-600 hover:bg-sky-700" onClick={() => openResourceModal(exercise)}>
                    <Headphones className="mr-2 h-4 w-4" />
                    Start Exercise
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] rounded-2xl border border-slate-200 sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedResource?.title || "Resource"}</DialogTitle>
          </DialogHeader>
          {selectedResource ? (
            <div className="space-y-4">
              {selectedResource.videoUrl ? (
                <div className="w-full overflow-hidden rounded-xl border border-slate-200">
                  <video
                    controls
                    className="h-auto max-h-[70vh] w-full"
                    poster={selectedResource.thumbnailUrl}
                    preload="metadata"
                    playsInline
                  >
                    <source
                      src={
                        selectedResource.videoUrl.startsWith("http")
                          ? selectedResource.videoUrl
                          : cloudinaryBase + selectedResource.videoUrl
                      }
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <Card className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
                  No direct media is attached. Read the description and apply this resource in your routine.
                </Card>
              )}

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                {selectedResource.duration ? (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedResource.duration}
                  </span>
                ) : null}
                {selectedResource.readTime ? (
                  <span className="inline-flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {selectedResource.readTime}
                  </span>
                ) : null}
                {typeof selectedResource.rating === "number" ? (
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {selectedResource.rating}
                  </span>
                ) : null}
                {selectedResource.category ? (
                  <Badge variant="secondary">{selectedResource.category}</Badge>
                ) : null}
                {selectedResource.difficulty ? (
                  <Badge variant="outline">{selectedResource.difficulty}</Badge>
                ) : null}
              </div>

              <p className="text-sm leading-relaxed text-slate-700">
                {selectedResource.description || "No description available."}
              </p>

              {selectedResource.tags?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedResource.tags.map((tag) => (
                    <Badge
                      key={`${keyFor(selectedResource)}-${tag}-modal`}
                      variant="outline"
                      className="text-[11px]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
