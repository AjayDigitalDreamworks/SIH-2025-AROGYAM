import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../componentsAdmin/DashboardLayout";
import { PageHeader } from "../componentsAdmin/PageHeader";
import { TipBanner } from "../componentsAdmin/TipBanner";
import {
  Settings,
  Plus,
  Video,
  Headphones,
  FileText,
  BookOpen,
  ThumbsUp,
} from "lucide-react";
import api from "@/config/api";
import axios from "axios";

type ResourceItem = {
  _id?: string;
  title?: string;
  description?: string;
  category?: string;
  createdAt?: string;
  likes?: number;
  views?: number;
};

const resourceTypes = ["Video", "Audio", "PDF", "Article"];

const normalizeCategory = (value?: string) => (value || "Video").toLowerCase();

const displayCategory = (value?: string) => {
  const normalized = normalizeCategory(value);
  if (normalized === "pdf") return "PDF";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const typeIcon = (type: string) => {
  switch (normalizeCategory(type)) {
    case "audio":
      return <Headphones className="w-5 h-5 text-arogyam-purple" />;
    case "pdf":
      return <FileText className="w-5 h-5 text-arogyam-coral" />;
    case "article":
      return <BookOpen className="w-5 h-5 text-primary" />;
    default:
      return <Video className="w-5 h-5 text-primary" />;
  }
};

const Resources = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedType, setSelectedType] = useState("Video");
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/videos/videos");
      const payload = Array.isArray(res.data?.videos) ? res.data.videos : res.data;
      setResources(Array.isArray(payload) ? payload : []);
    } catch (fetchError) {
      console.log(fetchError);
      setError("Unable to load resources.");
    } finally {
      setLoading(false);
    }
  };

  const uploadResource = async () => {
    if (!title.trim() || !description.trim()) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", selectedType);
      formData.append("tags", "mental,wellness");

      if (selectedType === "Video" && file) {
        formData.append("video", file);
      } else if (file) {
        formData.append("thumbnail", file);
      }

      await api.post("/videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTitle("");
      setDescription("");
      setFile(null);
      await fetchResources();
    } catch (uploadError) {
      console.log(uploadError);
      setError("Upload failed. Please retry.");
    } finally {
      setIsUploading(false);
    }
  };

  const tabOptions = useMemo(() => {
    const categories = Array.from(
      new Set(resources.map((resource) => displayCategory(resource.category))),
    );
    return ["All", ...categories];
  }, [resources]);

  const filteredResources = useMemo(() => {
    if (activeTab === "All") return resources;
    return resources.filter((resource) => displayCategory(resource.category) === activeTab);
  }, [resources, activeTab]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Resources"
        subtitle="Upload and manage wellbeing resources for student support."
        searchPlaceholder="Search resources..."
      />

      <TipBanner message="Upload fresh resources regularly so students always see useful, current support material." />

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="glass-card-strong rounded-2xl p-4 sm:p-6 mb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Upload New Resource</h3>
          <button className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-4 py-2 rounded-full font-medium w-fit">
            <Settings className="w-3 h-3" /> Manage Resource
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
          <span className="text-sm font-medium text-foreground">Resource Type</span>
          {resourceTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedType === type
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {type === "Video" && <Video className="w-3 h-3" />}
              {type === "Audio" && <Headphones className="w-3 h-3" />}
              {type === "PDF" && <FileText className="w-3 h-3" />}
              {type === "Article" && <BookOpen className="w-3 h-3" />}
              {type}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter resource title..."
              className="w-full bg-white/70 border border-white/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter a brief description of the resource..."
              rows={3}
              className="w-full bg-white/70 border border-white/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <div>
            <input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4 text-arogyam-coral" />
              <span>Upload resource file</span>
            </div>

            <button
              onClick={uploadResource}
              disabled={isUploading || !title.trim() || !description.trim()}
              className="bg-primary text-primary-foreground rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Upload Resource"}
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Resource Library</h3>

          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full">
              <Plus className="w-3 h-3" /> Add New Resource
            </button>

            {tabOptions.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-sm">
            <thead>
              <tr className="text-muted-foreground text-xs border-b border-border">
                <th className="text-left py-2 font-medium">Type</th>
                <th className="text-left py-2 font-medium">Title</th>
                <th className="text-left py-2 font-medium">Date Added</th>
                <th className="text-left py-2 font-medium">Status</th>
                <th className="text-left py-2 font-medium">Views & Engagement</th>
                <th className="text-left py-2 font-medium"></th>
              </tr>
            </thead>

            <tbody>
              {filteredResources.map((resource, index) => (
                <tr key={resource._id || `${resource.title}-${index}`} className="border-b border-border/50 hover:bg-white/30">
                  <td className="py-3">{typeIcon(resource.category || "video")}</td>

                  <td className="font-medium text-foreground">{resource.title || "Untitled"}</td>

                  <td className="text-muted-foreground">
                    {resource.createdAt ? new Date(resource.createdAt).toLocaleDateString() : "-"}
                  </td>

                  <td>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      Published
                    </span>
                  </td>

                  <td className="text-muted-foreground">
                    <span>{resource.views || 0} Views</span>
                    <span className="ml-2 inline-flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" /> {resource.likes || 0}
                    </span>
                  </td>

                  <td>
                    <button className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full">
                      <Settings className="w-3 h-3" /> Manage
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filteredResources.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-muted-foreground">
                    No resources found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end mt-3 text-xs text-muted-foreground">
          <span>Showing {filteredResources.length} resources</span>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Resources;
