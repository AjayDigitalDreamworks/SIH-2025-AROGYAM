import { useState } from "react";
import {
  Search, Plus, MessageCircle, TrendingUp, Clock, UserCheck,
  X, Hash, Flame, BookMarked, Sparkles, Heart,
  GraduationCap, Brain, Coffee, Moon, ChevronRight,
  ArrowLeft, ThumbsUp, Share2, Pin, Users, Send,
  CheckCircle2, MoreHorizontal, Bookmark
} from "lucide-react";
import "./CommunityForum.css";

// ─── Community Content Data ───────────────────────────────────────────────────
const communityContent = {
  1: {
    about: "Aura is a safe and calming space for students to explore mindfulness, emotional balance, and inner wellness. Whether you're dealing with anxiety, burnout, or just need a peaceful corner — you belong here.",
    guidelines: ["Be kind and respectful", "No judgement — all feelings are valid", "Share resources that helped you", "Keep conversations supportive"],
    pinned: {
      title: "Welcome to Aura 🌸 — Read Before Posting",
      author: "Moderator Riya",
      avatar: "R",
      avatarColor: "bg-violet-500",
      body: "Welcome everyone! This community is dedicated to emotional wellness and mindfulness. Feel free to share your experiences, ask questions, or simply vent. We're all here to support each other. Remember: you are not alone. 💜",
      likes: 128,
      time: "1w ago",
    },
    posts: [
      {
        id: 101,
        title: "5-minute breathing exercise that changed my mornings",
        author: "Ananya S.",
        avatar: "A",
        avatarColor: "bg-pink-400",
        body: "I started doing box breathing every morning before checking my phone. 4 seconds in, hold 4, out 4, hold 4. It sounds simple but after 2 weeks I genuinely feel calmer during lectures. Anyone else tried this?",
        likes: 47,
        comments: 12,
        time: "3h ago",
        tag: "Mindfulness",
        tagColor: "bg-violet-100 text-violet-700",
        replies: [
          { author: "Rohan K.", avatar: "R", avatarColor: "bg-blue-400", text: "Yes! I do this before exams and it really helps calm the nerves.", time: "2h ago" },
          { author: "Meera J.", avatar: "M", avatarColor: "bg-emerald-400", text: "Adding this to my morning routine tomorrow. Thanks for sharing!", time: "1h ago" },
        ],
      },
      {
        id: 102,
        title: "Feeling emotionally drained after back-to-back assignments",
        author: "Kabir D.",
        avatar: "K",
        avatarColor: "bg-orange-400",
        body: "It's been 3 weeks of non-stop deadlines and I feel completely hollow. Like I'm going through the motions but not really present. Has anyone felt this way? How did you get out of it?",
        likes: 89,
        comments: 23,
        time: "6h ago",
        tag: "Burnout",
        tagColor: "bg-orange-100 text-orange-700",
        replies: [
          { author: "Priya M.", avatar: "P", avatarColor: "bg-rose-400", text: "I felt exactly this during semester 3. Taking even 20 mins for yourself daily — no screens, no studying — helped me reconnect.", time: "5h ago" },
          { author: "Arjun T.", avatar: "A", avatarColor: "bg-indigo-400", text: "Journaling really helped me process things. You don't need to write much — even 3 sentences a day helps.", time: "4h ago" },
        ],
      },
      {
        id: 103,
        title: "Gratitude journaling for 30 days — my honest review",
        author: "Siya R.",
        avatar: "S",
        avatarColor: "bg-teal-400",
        body: "I was skeptical at first but I committed to writing 3 things I'm grateful for every night. By day 10, I noticed I was looking for good things throughout the day just so I could write them. It rewires how you see things.",
        likes: 112,
        comments: 31,
        time: "1d ago",
        tag: "Self-Care",
        tagColor: "bg-teal-100 text-teal-700",
        replies: [
          { author: "Neha B.", avatar: "N", avatarColor: "bg-yellow-500", text: "This is so inspiring. Starting today!", time: "20h ago" },
        ],
      },
    ],
  },
  2: {
    about: "Exam Stress is a community for students to openly discuss academic pressure, share coping strategies, and support each other through the toughest exam seasons. No stress is too small to talk about here.",
    guidelines: ["Share strategies that actually work", "Be empathetic — everyone's struggle is real", "No comparison or academic shaming", "Celebrate small wins together"],
    pinned: {
      title: "📌 Exam Season Survival Kit — Community Resources",
      author: "Moderator Dev",
      avatar: "D",
      avatarColor: "bg-blue-600",
      body: "Compiled by the community: Pomodoro Timer tips, best revision techniques (active recall, spaced repetition), and how to handle exam panic. Bookmark this post! New resources added weekly.",
      likes: 214,
      time: "3d ago",
    },
    posts: [
      {
        id: 201,
        title: "How I went from failing to first class — active recall changed everything",
        author: "Vikram N.",
        avatar: "V",
        avatarColor: "bg-blue-400",
        body: "Instead of re-reading notes, I close the book and try to recall everything I just studied. It's painful at first — but that difficulty IS the learning. Combine with spaced repetition and you'll be unstoppable.",
        likes: 156,
        comments: 42,
        time: "1h ago",
        tag: "Study Tips",
        tagColor: "bg-blue-100 text-blue-700",
        replies: [
          { author: "Aisha K.", avatar: "A", avatarColor: "bg-violet-400", text: "Anki flashcards are perfect for this. Changed my whole approach to studying.", time: "45m ago" },
          { author: "Rahul S.", avatar: "R", avatarColor: "bg-green-400", text: "Can you share your exact schedule? How many hours per day?", time: "30m ago" },
          { author: "Vikram N.", avatar: "V", avatarColor: "bg-blue-400", text: "I study in 3 blocks of 90 mins with 20 min breaks. No phone during blocks.", time: "20m ago" },
        ],
      },
      {
        id: 202,
        title: "Exam panic mid-paper — how to reset in 60 seconds",
        author: "Divya P.",
        avatar: "D",
        avatarColor: "bg-rose-400",
        body: "It happened to me last semester. Froze up completely during finals. My professor actually told me this technique: put pen down, breathe out slowly, look away from the paper for 10 seconds. Sounds small but it broke the spiral.",
        likes: 203,
        comments: 58,
        time: "5h ago",
        tag: "Anxiety",
        tagColor: "bg-rose-100 text-rose-700",
        replies: [
          { author: "Tarun M.", avatar: "T", avatarColor: "bg-amber-400", text: "I do the 5-4-3-2-1 grounding technique — name 5 things you can see, 4 you can hear... snaps you back to present.", time: "4h ago" },
          { author: "Zara H.", avatar: "Z", avatarColor: "bg-purple-400", text: "This is so helpful. Saving this for my upcoming exams.", time: "3h ago" },
        ],
      },
      {
        id: 203,
        title: "Is it okay to take a full day off before exams?",
        author: "Aryan B.",
        avatar: "A",
        avatarColor: "bg-emerald-400",
        body: "My friends think I'm crazy but I completely stopped studying the day before my exam. I rest, eat well, and sleep early. Every time I've done this I've performed better than when I crammed the night before. Science backs this — memory consolidates during sleep.",
        likes: 178,
        comments: 47,
        time: "2d ago",
        tag: "Wellbeing",
        tagColor: "bg-emerald-100 text-emerald-700",
        replies: [
          { author: "Priya L.", avatar: "P", avatarColor: "bg-pink-400", text: "100% agree. Sleep is the best revision tool. Your brain sorts everything out overnight.", time: "1d ago" },
          { author: "Harsh V.", avatar: "H", avatarColor: "bg-cyan-400", text: "First time trying this approach for next week's test. Hoping it works!", time: "20h ago" },
        ],
      },
    ],
  },
};

// ─── Static Data ──────────────────────────────────────────────────────────────
const communities = [
  { id: 1, name: "Aura", description: "A space for mindfulness and emotional balance", members: 1240, color: "from-violet-500 to-purple-600", headerColor: "from-violet-500 via-purple-500 to-indigo-600", icon: Sparkles },
  { id: 2, name: "Exam Stress", description: "Discuss study pressure and coping strategies", members: 892, color: "from-blue-500 to-indigo-600", headerColor: "from-blue-500 via-indigo-500 to-violet-600", icon: GraduationCap },
];

const suggestedCommunities = [
  { id: 3, name: "Sleep Support", icon: Moon, color: "bg-indigo-100 text-indigo-600", members: 543 },
  { id: 4, name: "Motivation Circle", icon: Flame, color: "bg-orange-100 text-orange-600", members: 731 },
  { id: 5, name: "Study Focus Group", icon: Brain, color: "bg-emerald-100 text-emerald-600", members: 418 },
  { id: 6, name: "Coffee & Chill", icon: Coffee, color: "bg-amber-100 text-amber-600", members: 267 },
];

const allDiscussions = [
  { id: 1, title: "How do you deal with exam anxiety?", author: "Priya M.", community: "Exam Stress", replies: 34, time: "2h ago", trending: true },
  { id: 2, title: "Best breathing techniques before sleep", author: "Arjun K.", community: "Aura", replies: 21, time: "4h ago", trending: true },
  { id: 3, title: "How I stayed consistent with my study schedule", author: "Neha S.", community: "Study Focus Group", replies: 15, time: "6h ago", trending: false },
  { id: 4, title: "Anyone else struggling with sleep during finals?", author: "Rohan D.", community: "Sleep Support", replies: 47, time: "1d ago", trending: true },
];

const stats = [
  { label: "Communities", value: "12", icon: Hash, color: "text-violet-600 bg-violet-100" },
  { label: "Active Students", value: "4.2k", icon: UserCheck, color: "text-blue-600 bg-blue-100" },
  { label: "Discussions Today", value: "87", icon: MessageCircle, color: "text-emerald-600 bg-emerald-100" },
  { label: "Helpful Posts", value: "320", icon: Heart, color: "text-rose-600 bg-rose-100" },
];

// ─── Post Card Component ──────────────────────────────────────────────────────
function PostCard({ post, liked, onLike, saved, onSave }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [localReplies, setLocalReplies] = useState(post.replies || []);

  const handleReply = () => {
    if (!replyText.trim()) return;
    setLocalReplies(prev => [...prev, {
      author: "You",
      avatar: "Y",
      avatarColor: "bg-violet-500",
      text: replyText.trim(),
      time: "just now",
    }]);
    setReplyText("");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5">
        {/* Author */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full ${post.avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
              {post.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-none">{post.author}</p>
              <p className="text-xs text-gray-400 mt-0.5">{post.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${post.tagColor}`}>{post.tag}</span>
            <button className="text-gray-300 hover:text-gray-500 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2">{post.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{post.body}</p>

        {/* Actions */}
        <div className="flex items-center gap-1 mt-4 pt-3 border-t border-gray-50">
          <button
            onClick={onLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              liked ? "bg-violet-100 text-violet-700" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            {liked ? post.likes + 1 : post.likes}
          </button>
          <button
            onClick={() => setShowReplies(!showReplies)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              showReplies ? "bg-blue-100 text-blue-700" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {localReplies.length} Comments
          </button>
          <button
            onClick={onSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              saved ? "bg-amber-100 text-amber-700" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            {saved ? "Saved" : "Save"}
          </button>
          <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      {/* Replies Section */}
      {showReplies && (
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 space-y-3">
          {localReplies.map((r, i) => (
            <div key={i} className="flex gap-2.5">
              <div className={`w-7 h-7 rounded-full ${r.avatarColor} flex-shrink-0 flex items-center justify-center text-white text-xs font-bold`}>
                {r.avatar}
              </div>
              <div className="flex-1 bg-white rounded-xl px-3 py-2.5 border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-900">{r.author}</p>
                  <p className="text-[10px] text-gray-400">{r.time}</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{r.text}</p>
              </div>
            </div>
          ))}

          {/* Reply Input */}
          <div className="flex gap-2 mt-2">
            <div className="w-7 h-7 rounded-full bg-violet-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">Y</div>
            <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
              <input
                className="flex-1 text-xs outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                placeholder="Write a reply..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleReply()}
              />
              <button onClick={handleReply} className="text-violet-500 hover:text-violet-700 transition-colors">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Community Detail View ────────────────────────────────────────────────────
function CommunityDetail({ community, onBack, joined, onToggleJoin }) {
  const content = communityContent[community.id];
  const Icon = community.icon;
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className={`bg-gradient-to-r ${community.headerColor} px-6 pt-5 pb-16 relative`}>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Communities
        </button>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{community.name}</h1>
              <p className="text-white/75 text-sm mt-0.5">{community.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-white/80 text-xs">
                  <Users className="w-3.5 h-3.5" />
                  {community.members.toLocaleString()} members
                </span>
                <span className="flex items-center gap-1 text-white/80 text-xs">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {content.posts.length} discussions
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onToggleJoin}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${
              joined
                ? "bg-white/20 text-white border border-white/40 hover:bg-white/30"
                : "bg-white text-violet-700 hover:bg-violet-50"
            }`}
          >
            {joined ? <><CheckCircle2 className="w-4 h-4" /> Joined</> : <>Join Community</>}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 flex gap-1">
              {["posts", "about"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab === "posts" ? "Discussions" : "About"}
                </button>
              ))}
            </div>

            {activeTab === "posts" && (
              <>
                {/* Pinned Post */}
                <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Pin className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Pinned Post</span>
                  </div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`w-8 h-8 rounded-full ${content.pinned.avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
                      {content.pinned.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{content.pinned.author}</p>
                      <p className="text-xs text-gray-400">{content.pinned.time}</p>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-2">{content.pinned.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{content.pinned.body}</p>
                  <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-50">
                    <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs text-gray-400">{content.pinned.likes} found this helpful</span>
                  </div>
                </div>

                {/* Posts */}
                {content.posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    liked={liked[post.id]}
                    onLike={() => setLiked(p => ({ ...p, [post.id]: !p[post.id] }))}
                    saved={saved[post.id]}
                    onSave={() => setSaved(p => ({ ...p, [post.id]: !p[post.id] }))}
                  />
                ))}
              </>
            )}

            {activeTab === "about" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">About This Community</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{content.about}</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Community Guidelines</h3>
                  <ul className="space-y-2">
                    {content.guidelines.map((g, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Members", value: community.members.toLocaleString(), icon: Users },
                    { label: "Posts", value: content.posts.length, icon: MessageCircle },
                    { label: "Helpful", value: content.pinned.likes, icon: ThumbsUp },
                  ].map(s => {
                    const SIcon = s.icon;
                    return (
                      <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                        <SIcon className="w-4 h-4 text-violet-500 mx-auto mb-1" />
                        <p className="font-bold text-gray-900 text-base">{s.value}</p>
                        <p className="text-xs text-gray-400">{s.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Create Post CTA */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">Share with the community</p>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 cursor-text hover:border-violet-300 transition-colors">
                <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">Y</div>
                <span className="text-sm text-gray-400">Start a discussion...</span>
              </div>
              <button className={`mt-3 w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${community.color} shadow-md transition-all hover:opacity-90`}>
                + New Discussion
              </button>
            </div>

            {/* Active Members */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Active Members</h3>
              <div className="space-y-2.5">
                {[
                  { name: "Ananya S.", role: "Top Contributor", avatar: "A", color: "bg-pink-400" },
                  { name: "Vikram N.", role: "Most Helpful", avatar: "V", color: "bg-blue-400" },
                  { name: "Siya R.", role: "Regular", avatar: "S", color: "bg-teal-400" },
                  { name: "Kabir D.", role: "New Member", avatar: "K", color: "bg-orange-400" },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${m.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {m.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900 leading-none">{m.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Communities */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Related Communities</h3>
              <div className="space-y-2.5">
                {suggestedCommunities.slice(0, 3).map(c => {
                  const CIcon = c.icon;
                  return (
                    <div key={c.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${c.color}`}>
                          <CIcon className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-xs font-semibold text-gray-700">{c.name}</p>
                      </div>
                      <button className="text-[11px] text-violet-600 font-semibold hover:underline">Join</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CommunityForum() {
  const [communitySearch, setCommunitySearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [joined, setJoined] = useState({});
  const [openCommunity, setOpenCommunity] = useState(null);
  const [postTitle, setPostTitle] = useState("");
  const [postDesc, setPostDesc] = useState("");
  const [postCommunity, setPostCommunity] = useState("");

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(communitySearch.toLowerCase())
  );

  // If a community is open, show detail view
  if (openCommunity) {
    const community = communities.find(c => c.id === openCommunity);
    return (
      <CommunityDetail
        community={community}
        onBack={() => setOpenCommunity(null)}
        joined={!!joined[openCommunity]}
        onToggleJoin={() => setJoined(prev => ({ ...prev, [openCommunity]: !prev[openCommunity] }))}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">

      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Community Forums</h1>
          <p className="text-sm mt-1 text-gray-500">
            Connect with other students and share experiences about wellness and stress.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-violet-200 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Discussion
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center gap-3 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold leading-none text-gray-900">{s.value}</p>
                <p className="text-xs mt-0.5 text-gray-500">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Communities Section */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Communities</h2>
              <span className="text-xs text-gray-400">{filteredCommunities.length} communities</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 mb-4">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
                placeholder="Search communities..."
                value={communitySearch}
                onChange={e => setCommunitySearch(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              {filteredCommunities.map(c => {
                const Icon = c.icon;
                return (
                  <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50 transition-all hover:border-violet-200 hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-sm`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{c.name}</p>
                        <p className="text-xs mt-0.5 text-gray-500">{c.description}</p>
                        <p className="text-xs mt-1 text-gray-400">
                          <span className="font-medium text-violet-600">{c.members.toLocaleString()}</span> members
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setJoined(prev => ({ ...prev, [c.id]: true }));
                        setOpenCommunity(c.id);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        joined[c.id]
                          ? "bg-violet-100 text-violet-700 border border-violet-200"
                          : "bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-200"
                      }`}
                    >
                      {joined[c.id] ? "Open →" : "Open / Join"}
                    </button>
                  </div>
                );
              })}

              {filteredCommunities.length === 0 && (
                <div className="text-center py-8">
                  <Hash className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-400">No communities found</p>
                </div>
              )}
            </div>
          </div>

          {/* Popular Discussions */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              <h2 className="text-base font-bold text-gray-900">Popular Discussions</h2>
            </div>
            <div className="space-y-3">
              {allDiscussions.map(d => (
                <div key={d.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 cursor-pointer transition-all hover:border-violet-200 hover:shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {d.trending && (
                          <span className="text-[10px] font-semibold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Flame className="w-2.5 h-2.5" /> Trending
                          </span>
                        )}
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-600">#{d.community}</span>
                      </div>
                      <p className="font-semibold text-sm mt-1.5 leading-snug text-gray-900">{d.title}</p>
                      <p className="text-xs mt-1 text-gray-400">by {d.author}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 mt-1 flex-shrink-0 text-gray-300" />
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {d.replies} replies</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {d.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BookMarked className="w-4 h-4 text-violet-500" />
              <h2 className="text-base font-bold text-gray-900">Recommended</h2>
            </div>
            <div className="space-y-3">
              {suggestedCommunities.map(c => {
                const Icon = c.icon;
                return (
                  <div key={c.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-none text-gray-900">{c.name}</p>
                        <p className="text-xs mt-0.5 text-gray-400">{c.members} members</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setJoined(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        joined[c.id]
                          ? "text-violet-700 bg-violet-50 border border-violet-200"
                          : "text-violet-600 border border-violet-200 hover:bg-violet-50 hover:border-violet-400"
                      }`}
                    >
                      {joined[c.id] ? "Joined" : "Join"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 p-5 text-white shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-violet-200" />
              <p className="text-xs font-semibold text-violet-200 uppercase tracking-wide">Wellness Tip</p>
            </div>
            <p className="font-bold text-sm leading-snug">"Sharing your struggles with others can cut the weight in half."</p>
            <p className="text-xs text-violet-200 mt-2">Join a community and start a discussion today.</p>
            <button className="mt-3 w-full bg-white text-violet-700 text-xs font-semibold py-2 rounded-xl hover:bg-violet-50 transition-colors">
              Explore Communities
            </button>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h2>
            <div className="space-y-1">
              {[
                { label: "Browse all discussions", icon: MessageCircle },
                { label: "My saved posts", icon: BookMarked },
                { label: "Invite a friend", icon: UserCheck },
              ].map(a => {
                const Icon = a.icon;
                return (
                  <button key={a.label} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-violet-50 hover:text-violet-700 transition-all">
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-violet-500" />
                      {a.label}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Create Discussion Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 bg-white p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Create Discussion</h2>
                <p className="text-xs mt-0.5 text-gray-400">Share your thoughts with the community</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold mb-1.5 block text-gray-600">Post Title</label>
                <input
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-violet-400 transition-colors text-gray-700 placeholder-gray-400"
                  placeholder="What's on your mind?"
                  value={postTitle}
                  onChange={e => setPostTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1.5 block text-gray-600">Description</label>
                <textarea
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-violet-400 transition-colors resize-none text-gray-700 placeholder-gray-400"
                  placeholder="Share more details..."
                  rows={4}
                  value={postDesc}
                  onChange={e => setPostDesc(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1.5 block text-gray-600">Select Community</label>
                <select
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-violet-400 transition-colors text-gray-700"
                  value={postCommunity}
                  onChange={e => setPostCommunity(e.target.value)}
                >
                  <option value="">Choose a community...</option>
                  {[...communities, ...suggestedCommunities].map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold shadow-md shadow-violet-200 transition-all">
                Post Discussion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
