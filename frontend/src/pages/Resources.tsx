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
  Play,
  BookOpen,
  Headphones,
  Download,
  Clock,
  Star,
  Search,
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
  const [selectedVideo, setSelectedVideo] = useState<HubResource | null>(null);
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

  if (loading) return <div className="p-6 sm:p-8 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-6 sm:p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl mb-2">Resource Hub</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Access videos, guides, and exercises for mental wellness
        </p>
      </div>

      <div className="mb-6 sm:mb-8 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Showing {totalCount} matching resource{totalCount === 1 ? "" : "s"}
        </p>
      </div>

      <Tabs defaultValue="videos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">Videos</span>
            <span className="sm:hidden">Video</span>
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Guides
          </TabsTrigger>
          <TabsTrigger value="exercises" className="flex items-center gap-2">
            <Headphones className="w-4 h-4" />
            Exercises
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-6">
          {filtered.videos.length === 0 ? (
            <Card className="p-6 text-sm text-muted-foreground">
              No videos match your search.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filtered.videos.map((video) => (
                <Card
                  key={video._id || video.id || video.title}
                  className="overflow-hidden group hover:shadow-lg transition-all"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-4xl">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title || "Video thumbnail"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Play className="w-12 h-12 text-primary" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {video.category && (
                        <Badge variant="secondary" className="text-xs">
                          {video.category}
                        </Badge>
                      )}
                      {video.duration && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {video.duration}
                        </div>
                      )}
                      {typeof video.rating === "number" && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {video.rating}
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{video.title || "Untitled video"}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {video.description || "No description available."}
                    </p>
                    {video.tags?.length ? (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {video.tags.map((tag) => (
                          <Badge key={`${video._id || video.id}-${tag}`} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedVideo(video);
                        setIsModalOpen(true);
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
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
            <Card className="p-6 text-sm text-muted-foreground">
              No guides available right now.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filtered.guides.map((guide) => (
                <Card key={guide._id || guide.id || guide.title} className="p-5 sm:p-6 hover:shadow-lg transition-all">
                  <div className="text-2xl sm:text-3xl mb-4">{guide.icon || "📘"}</div>
                  {guide.category && (
                    <Badge variant="secondary" className="mb-3">
                      {guide.category}
                    </Badge>
                  )}
                  <h3 className="font-semibold mb-2">{guide.title || "Untitled guide"}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {guide.description || "No description available."}
                  </p>
                  {guide.readTime && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                      <Clock className="w-3 h-3" />
                      {guide.readTime}
                    </div>
                  )}
                  {guide.tags?.length ? (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {guide.tags.map((tag) => (
                        <Badge key={`${guide._id || guide.id}-${tag}`} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Read Guide
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          {filtered.exercises.length === 0 ? (
            <Card className="p-6 text-sm text-muted-foreground">
              No exercises available right now.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filtered.exercises.map((exercise) => (
                <Card key={exercise._id || exercise.id || exercise.title} className="p-5 sm:p-6 hover:shadow-lg transition-all">
                  <div className="text-2xl sm:text-3xl mb-4">{exercise.icon || "🎧"}</div>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {exercise.category && <Badge variant="secondary">{exercise.category}</Badge>}
                    {exercise.difficulty && (
                      <Badge variant={exercise.difficulty === "Beginner" ? "default" : "outline"}>
                        {exercise.difficulty}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{exercise.title || "Untitled exercise"}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {exercise.description || "No description available."}
                  </p>
                  {exercise.duration && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                      <Clock className="w-3 h-3" />
                      {exercise.duration}
                    </div>
                  )}
                  <Button className="w-full">
                    <Headphones className="w-4 h-4 mr-2" />
                    Start Exercise
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title || "Video"}</DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <div className="space-y-4">
              <div className="w-full flex justify-center">
                <video
                  controls
                  className="w-full max-w-3xl h-auto max-h-[70vh] rounded-lg"
                  poster={selectedVideo.thumbnailUrl}
                  preload="metadata"
                  playsInline
                >
                  {selectedVideo.videoUrl ? (
                    <source
                      src={
                        selectedVideo.videoUrl.startsWith("http")
                          ? selectedVideo.videoUrl
                          : cloudinaryBase + selectedVideo.videoUrl
                      }
                      type="video/mp4"
                    />
                  ) : null}
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="flex items-center flex-wrap gap-3 text-sm text-muted-foreground">
                {selectedVideo.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedVideo.duration}
                  </div>
                )}
                {typeof selectedVideo.rating === "number" && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {selectedVideo.rating}
                  </div>
                )}
                {selectedVideo.category && <Badge variant="secondary">{selectedVideo.category}</Badge>}
              </div>

              <p className="text-sm">{selectedVideo.description || "No description available."}</p>

              {selectedVideo.tags?.length ? (
                <div className="flex flex-wrap gap-1">
                  {selectedVideo.tags.map((tag) => (
                    <Badge key={`${selectedVideo._id || selectedVideo.id}-${tag}-modal`} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
