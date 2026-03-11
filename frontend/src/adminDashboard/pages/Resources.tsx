// import { DashboardLayout } from "../componentsAdmin/DashboardLayout";
// import { PageHeader } from "../componentsAdmin/PageHeader";
// import { TipBanner } from "../componentsAdmin/TipBanner";
// import { ChevronLeft, ChevronRight, Settings, Plus, Video, Headphones, FileText, BookOpen, ThumbsUp } from "lucide-react";
// import { useState } from "react";

// const resourceTypes = ["Video", "Audio", "PDF", "Article"];
// const filterTabs = ["All", "Video", "Audio", "Articles", "PDFs"];

// const resources = [
//   { type: "audio", title: "Mindfulness Medi...", date: "09-Sept-2023", status: "Published", views: "5k Listens", likes: "5k" },
//   { type: "pdf", title: "Dealing with Acad...", date: "23-Aug-2023", status: "Published", views: "2.6k downloads", likes: "2.6k" },
//   { type: "pdf", title: "Healthy Sleep Hab...", date: "14-Jul-2023", status: "Published", views: "1.9k downloads", likes: "1.9k" },
//   { type: "article", title: "Time Management...", date: "30-Jun-2023", status: "Published", views: "758 likes", likes: "7513" },
// ];

// const typeIcon = (type: string) => {
//   switch (type) {
//     case "audio": return <Headphones className="w-5 h-5 text-arogyam-purple" />;
//     case "pdf": return <FileText className="w-5 h-5 text-arogyam-coral" />;
//     case "article": return <BookOpen className="w-5 h-5 text-primary" />;
//     default: return <Video className="w-5 h-5 text-primary" />;
//   }
// };

// const tags = ["Exam Stress", "Mindfulness", "Mindfulness"];

// const Resources = () => {
//   const [activeTab, setActiveTab] = useState("All");
//   const [selectedType, setSelectedType] = useState("Video");

//   return (
//     <DashboardLayout>
//       <PageHeader
//         title="Resources"
//         subtitle="Upload and manage wellbeing resources for student support."
//         searchPlaceholder="Search resources..."
//       />

//       <TipBanner message="Create and update resources regularly for effective student support." />

//       <div className="grid grid-cols-12 gap-4">
//         <div className="col-span-12">
//           {/* Upload New Resource */}
//           <div className="glass-card-strong rounded-2xl p-6 mb-4">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-bold text-foreground">Upload New Resource</h3>
//               <button className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-4 py-2 rounded-full font-medium">
//                 <Settings className="w-3 h-3" /> Manage Resource
//               </button>
//             </div>

//             {/* Resource Type */}
//             <div className="flex items-center gap-4 mb-4">
//               <span className="text-sm font-medium text-foreground">Resource Type</span>
//               {resourceTypes.map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => setSelectedType(t)}
//                   className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
//                     selectedType === t
//                       ? "bg-primary/10 text-primary"
//                       : "text-muted-foreground hover:bg-accent"
//                   }`}
//                 >
//                   {t === "Video" && <Video className="w-3 h-3" />}
//                   {t === "Audio" && <Headphones className="w-3 h-3" />}
//                   {t === "PDF" && <FileText className="w-3 h-3" />}
//                   {t === "Article" && <BookOpen className="w-3 h-3" />}
//                   {t}
//                 </button>
//               ))}
//             </div>

//             {/* Form */}
//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-foreground mb-1 block">Title:</label>
//                 <input
//                   placeholder="Enter resource title..."
//                   className="w-full bg-white/70 border border-white/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
//                 <textarea
//                   placeholder="Enter a brief description of the resource..."
//                   rows={3}
//                   className="w-full bg-white/70 border border-white/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-foreground mb-1 block">Tags:</label>
//                 <div className="flex items-center gap-2">
//                   {tags.map((tag, i) => (
//                     <span
//                       key={i}
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         i === 0
//                           ? "bg-red-100 text-red-600"
//                           : i === 1
//                           ? "bg-orange-100 text-orange-600"
//                           : "bg-blue-100 text-blue-600"
//                       }`}
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                   <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
//                     <Plus className="w-3 h-3" /> Add Tag
//                   </button>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                   <FileText className="w-4 h-4 text-arogyam-coral" />
//                   <span>Arogyam-guide.pdf</span>
//                   <button className="text-xs text-arogyam-coral hover:underline">Remove File:</button>
//                 </div>
//                 <button className="bg-primary text-primary-foreground rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
//                   Upload Resource
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Resource Library */}
//           <div className="glass-card rounded-2xl p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-bold text-foreground">Resource Library</h3>
//               <div className="flex items-center gap-2">
//                 <button className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full">
//                   <Plus className="w-3 h-3" /> Add New Resource
//                 </button>
//                 {filterTabs.map((tab) => (
//                   <button
//                     key={tab}
//                     onClick={() => setActiveTab(tab)}
//                     className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
//                       activeTab === tab
//                         ? "bg-primary text-primary-foreground"
//                         : "text-muted-foreground hover:bg-accent"
//                     }`}
//                   >
//                     {tab}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-muted-foreground text-xs border-b border-border">
//                   <th className="text-left py-2 font-medium">Type</th>
//                   <th className="text-left py-2 font-medium">Title</th>
//                   <th className="text-left py-2 font-medium">Date Added</th>
//                   <th className="text-left py-2 font-medium">Status</th>
//                   <th className="text-left py-2 font-medium">Views & Engagement</th>
//                   <th className="text-left py-2 font-medium"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {resources.map((r, i) => (
//                   <tr key={i} className="border-b border-border/50 hover:bg-white/30">
//                     <td className="py-3">{typeIcon(r.type)}</td>
//                     <td className="font-medium text-foreground">{r.title}</td>
//                     <td className="text-muted-foreground">{r.date}</td>
//                     <td>
//                       <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
//                         {r.status}
//                       </span>
//                     </td>
//                     <td className="text-muted-foreground">
//                       <span>{r.views}</span>
//                       <span className="ml-2 inline-flex items-center gap-1">
//                         <ThumbsUp className="w-3 h-3" /> {r.likes}
//                       </span>
//                     </td>
//                     <td>
//                       <button className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full">
//                         <Settings className="w-3 h-3" /> Manage
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
//               <div className="flex items-center gap-1">
//                 <ChevronLeft className="w-4 h-4 cursor-pointer" />
//                 {[1, 2, 3, 5].map((n) => (
//                   <span
//                     key={n}
//                     className={`w-6 h-6 flex items-center justify-center rounded ${
//                       n === 1 ? "bg-primary text-primary-foreground" : "hover:bg-accent cursor-pointer"
//                     }`}
//                   >
//                     {n}
//                   </span>
//                 ))}
//                 <ChevronRight className="w-4 h-4 cursor-pointer" />
//               </div>
//               <span>Showing 1-4 of 67 resources</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="mt-6 text-center text-xs text-muted-foreground">
//         2024 Arogyam • Mental Health Resources • All data is encrypted and protected &nbsp; Last updated: Today, 10:33 AM
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Resources;


import { DashboardLayout } from "../componentsAdmin/DashboardLayout";
import { PageHeader } from "../componentsAdmin/PageHeader";
import { TipBanner } from "../componentsAdmin/TipBanner";
import { ChevronLeft, ChevronRight, Settings, Plus, Video, Headphones, FileText, BookOpen, ThumbsUp } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/config/api";
import axios from "axios";

const resourceTypes = ["Video", "Audio", "PDF", "Article"];
const filterTabs = ["All", "Video", "Audio", "Articles", "PDFs"];

const typeIcon = (type: string) => {
  switch (type) {
    case "audio": return <Headphones className="w-5 h-5 text-arogyam-purple" />;
    case "pdf": return <FileText className="w-5 h-5 text-arogyam-coral" />;
    case "article": return <BookOpen className="w-5 h-5 text-primary" />;
    default: return <Video className="w-5 h-5 text-primary" />;
  }
};

const tags = ["Exam Stress", "Mindfulness", "Mindfulness"];

const Resources = () => {

  const [activeTab, setActiveTab] = useState("All");
  const [selectedType, setSelectedType] = useState("Video");

  const [resources,setResources] = useState<any[]>([])

  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const [file,setFile] = useState<any>(null)

  useEffect(()=>{
    fetchResources()
  },[])

  const fetchResources = async ()=>{
    try{

      const res = await api.get("/videos/videos")

      setResources(res.data.videos || res.data)

    }catch(err){
      console.log(err)
    }
  }

  const uploadResource = async ()=>{

    try{

      const formData = new FormData()

      formData.append("title",title)
      formData.append("description",description)
      formData.append("category",selectedType)
      formData.append("tags","mental,wellness")

      if(selectedType === "Video"){
        formData.append("video",file)
      }else{
        formData.append("thumbnail",file)
      }

      const token = localStorage.getItem("token")

      await axios.post(
        "https://arogyam-9rll.onrender.com/videos/upload",
        formData,
        {
          headers:{
            "Content-Type":"multipart/form-data"
          }
        }
      )

      fetchResources()

    }catch(err){
      console.log(err)
    }

  }

  return (
    <DashboardLayout>

      <PageHeader
        title="Resources"
        subtitle="Upload and manage wellbeing resources for student support."
        searchPlaceholder="Search resources..."
      />

      <TipBanner message="Create and update resources regularly for effective student support." />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">

          <div className="glass-card-strong rounded-2xl p-6 mb-4">

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Upload New Resource</h3>
              <button className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-4 py-2 rounded-full font-medium">
                <Settings className="w-3 h-3" /> Manage Resource
              </button>
            </div>

            {/* Resource Type */}

            <div className="flex items-center gap-4 mb-4">

              <span className="text-sm font-medium text-foreground">Resource Type</span>

              {resourceTypes.map((t)=>(
                <button
                  key={t}
                  onClick={()=>setSelectedType(t)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedType===t
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {t === "Video" && <Video className="w-3 h-3" />}
                  {t === "Audio" && <Headphones className="w-3 h-3" />}
                  {t === "PDF" && <FileText className="w-3 h-3" />}
                  {t === "Article" && <BookOpen className="w-3 h-3" />}
                  {t}
                </button>
              ))}

            </div>

            {/* FORM */}

            <div className="space-y-4">

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Title:</label>
                <input
                  value={title}
                  onChange={(e)=>setTitle(e.target.value)}
                  placeholder="Enter resource title..."
                  className="w-full bg-white/70 border border-white/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e)=>setDescription(e.target.value)}
                  placeholder="Enter a brief description of the resource..."
                  rows={3}
                  className="w-full bg-white/70 border border-white/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>

              <div>
                <input
                  type="file"
                  onChange={(e)=>setFile(e.target.files?.[0])}
                />
              </div>

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4 text-arogyam-coral" />
                  <span>Upload Resource File</span>
                </div>

                <button
                  onClick={uploadResource}
                  className="bg-primary text-primary-foreground rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Upload Resource
                </button>

              </div>

            </div>

          </div>

          {/* RESOURCE LIBRARY */}

          <div className="glass-card rounded-2xl p-4">

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Resource Library</h3>

              <div className="flex items-center gap-2">

                <button className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full">
                  <Plus className="w-3 h-3" /> Add New Resource
                </button>

                {filterTabs.map((tab)=>(
                  <button
                    key={tab}
                    onClick={()=>setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      activeTab===tab
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {tab}
                  </button>
                ))}

              </div>

            </div>

            <table className="w-full text-sm">

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

                {resources.map((r:any,i)=>(
                  <tr key={i} className="border-b border-border/50 hover:bg-white/30">

                    <td className="py-3">{typeIcon(r.category)}</td>

                    <td className="font-medium text-foreground">
                      {r.title}
                    </td>

                    <td className="text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>

                    <td>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        Published
                      </span>
                    </td>

                    <td className="text-muted-foreground">
                      <span>0 Views</span>
                      <span className="ml-2 inline-flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" /> 0
                      </span>
                    </td>

                    <td>
                      <button className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full">
                        <Settings className="w-3 h-3" /> Manage
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">

              <div className="flex items-center gap-1">
                <ChevronLeft className="w-4 h-4 cursor-pointer" />
                <ChevronRight className="w-4 h-4 cursor-pointer" />
              </div>

              <span>Showing {resources.length} resources</span>

            </div>

          </div>

        </div>
      </div>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        2024 Arogyam • Mental Health Resources • All data is encrypted and protected
      </div>

    </DashboardLayout>
  );
};

export default Resources;
