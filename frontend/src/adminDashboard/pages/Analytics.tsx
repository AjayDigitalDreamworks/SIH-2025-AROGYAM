// import { DashboardLayout } from "../componentsAdmin/DashboardLayout";
// import { PageHeader } from "../componentsAdmin/PageHeader";
// import { TipBanner } from "../componentsAdmin/TipBanner";
// import { ChevronLeft, ChevronRight, Download, Eye, TrendingUp, TrendingDown, AlertTriangle, FileText, Trophy } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   CartesianGrid,
//   Cell,
// } from "recharts";

// const branchData = [
//   { name: "CSE", score: 82, color: "hsl(215, 65%, 55%)" },
//   { name: "ECE", score: 76, color: "hsl(145, 50%, 48%)" },
//   { name: "ME", score: 74, color: "hsl(30, 85%, 58%)" },
//   { name: "BBA", score: 80, color: "hsl(175, 45%, 50%)" },
//   { name: "BSC", score: 72, color: "hsl(260, 50%, 60%)" },
//   { name: "MBA", score: 79, color: "hsl(0, 72%, 58%)" },
// ];

// const trendData = [
//   { week: "Week 1", score: 72 },
//   { week: "Week 2", score: 74 },
//   { week: "Week 3", score: 76 },
//   { week: "Week 4", score: 78 },
// ];

// const students = [
//   { id: "STU-1574", name: "Rahul Sharma", branch: "CSE", year: "3rd Year", score: 84, progress: "+6 pts", status: "Improving" },
//   { id: "STU-2459", name: "Ananya Patel", branch: "ECE", year: "2nd Year", score: 68, progress: "-4 pts", status: "At Risk" },
//   { id: "STU-3291", name: "Vikram Singh", branch: "ME", year: "4th Year", score: 72, progress: "+2 pts", status: "Stable" },
//   { id: "STU-4422", name: "Sneha Reddy", branch: "BBA", year: "3rd Year", score: 89, progress: "+9 pts", status: "Excellent" },
//   { id: "STU-5188", name: "Omar Farooq", branch: "BSC", year: "1st Year", score: 65, progress: "-6 pts", status: "At Risk" },
// ];

// const topBranches = [
//   { name: "CSE", score: 82, rank: 1 },
//   { name: "BBA", score: 80, rank: 2 },
//   { name: "MBA", score: 79, rank: 3 },
// ];

// const statusColor = (status: string) => {
//   switch (status) {
//     case "Improving": return "bg-green-100 text-green-700";
//     case "At Risk": return "bg-red-100 text-red-700";
//     case "Stable": return "bg-blue-100 text-blue-700";
//     case "Excellent": return "bg-emerald-100 text-emerald-700";
//     default: return "bg-muted text-muted-foreground";
//   }
// };

// const Analytics = () => {
//   return (
//     <DashboardLayout>
//       <PageHeader
//         title="Analytics"
//         subtitle="Monitor branch-wise student progress and wellbeing insights"
//         searchPlaceholder="Search students..."
//       />

//       <TipBanner message="Use filters to view specific student groups and generate detailed progress reports." />

//       {/* Filters */}
//       <div className="glass-card rounded-2xl p-4 mb-4">
//         <div className="flex items-center justify-between mb-3">
//           <h3 className="text-sm font-bold text-foreground">Select Branch & Filters</h3>
//           <button className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-4 py-2 rounded-full font-medium">
//             <Download className="w-3 h-3" /> Export Report
//           </button>
//         </div>
//         <div className="grid grid-cols-6 gap-3 mb-3">
//           <div>
//             <label className="text-xs text-muted-foreground">Department</label>
//             <select className="w-full bg-white/70 border border-white/50 rounded-lg px-3 py-2 text-sm mt-1">
//               <option>All Departments</option>
//             </select>
//           </div>
//           <div>
//             <label className="text-xs text-muted-foreground">Year</label>
//             <select className="w-full bg-white/70 border border-white/50 rounded-lg px-3 py-2 text-sm mt-1">
//               <option>All Years</option>
//             </select>
//           </div>
//           <div>
//             <label className="text-xs text-muted-foreground">Residence</label>
//             <select className="w-full bg-white/70 border border-white/50 rounded-lg px-3 py-2 text-sm mt-1">
//               <option>All</option>
//             </select>
//           </div>
//           <div>
//             <label className="text-xs text-muted-foreground">Time Period</label>
//             <select className="w-full bg-white/70 border border-white/50 rounded-lg px-3 py-2 text-sm mt-1">
//               <option>Last 4 Weeks</option>
//             </select>
//           </div>
//           <div>
//             <label className="text-xs text-muted-foreground">Section</label>
//             <select className="w-full bg-white/70 border border-white/50 rounded-lg px-3 py-2 text-sm mt-1">
//               <option>All Sections</option>
//             </select>
//           </div>
//           <div className="flex items-end gap-2">
//             <button className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-semibold">
//               Apply Filters
//             </button>
//             <button className="bg-white/70 border border-white/50 rounded-lg px-4 py-2 text-sm">
//               Reset
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-4 gap-4 mb-4">
//         <div className="glass-card-strong rounded-2xl p-4 text-center">
//           <p className="text-xs text-muted-foreground mb-2">Average Wellbeing Score</p>
//           <div className="relative w-20 h-20 mx-auto mb-2">
//             <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
//               <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(220, 20%, 90%)" strokeWidth="3" />
//               <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(215, 65%, 55%)" strokeWidth="3" strokeDasharray="78, 100" />
//             </svg>
//             <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-foreground">78</span>
//           </div>
//           <p className="text-xs text-muted-foreground">/100</p>
//           <p className="text-xs text-arogyam-green mt-1">↑ 4 points from last month</p>
//         </div>
//         <div className="glass-card-strong rounded-2xl p-4 text-center">
//           <p className="text-xs text-muted-foreground mb-2">At-Risk Students</p>
//           <div className="relative w-20 h-20 mx-auto mb-2">
//             <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
//               <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(220, 20%, 90%)" strokeWidth="3" />
//               <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(0, 72%, 58%)" strokeWidth="3" strokeDasharray="12, 100" />
//             </svg>
//             <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-foreground">12%</span>
//           </div>
//           <p className="text-xs text-muted-foreground">(138 students)</p>
//           <p className="text-xs text-arogyam-green mt-1">↓ 3% reduction</p>
//         </div>
//         <div className="glass-card-strong rounded-2xl p-4 text-center">
//           <p className="text-xs text-muted-foreground mb-2">Students Improving</p>
//           <div className="relative w-20 h-20 mx-auto mb-2">
//             <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
//               <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(220, 20%, 90%)" strokeWidth="3" />
//               <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(145, 50%, 48%)" strokeWidth="3" strokeDasharray="64, 100" />
//             </svg>
//             <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-foreground">64%</span>
//           </div>
//           <p className="text-xs text-muted-foreground">(734 students)</p>
//           <p className="text-xs text-arogyam-green mt-1">↑ 8% from last month</p>
//         </div>
//         <div className="glass-card-strong rounded-2xl p-4 text-center">
//           <p className="text-xs text-muted-foreground mb-2">Critical Cases</p>
//           <div className="relative w-20 h-20 mx-auto mb-2">
//             <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
//               <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(220, 20%, 90%)" strokeWidth="3" />
//               <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(350, 70%, 70%)" strokeWidth="3" strokeDasharray="5, 100" />
//             </svg>
//             <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-foreground">5</span>
//           </div>
//           <p className="text-xs text-muted-foreground">students</p>
//           <p className="text-xs text-arogyam-red mt-1">
//             <AlertTriangle className="inline w-3 h-3" /> Require Immediate Attention
//           </p>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-12 gap-4 mb-4">
//         <div className="col-span-7 glass-card rounded-2xl p-4">
//           <h3 className="text-sm font-bold text-foreground mb-1">Branch Wellbeing Comparison</h3>
//           <p className="text-xs text-muted-foreground mb-3">Average Wellbeing Score by Branch</p>
//           <div className="h-52">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={branchData}>
//                 <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(220 15% 50%)" />
//                 <YAxis tick={{ fontSize: 12 }} stroke="hsl(220 15% 50%)" domain={[0, 100]} />
//                 <Tooltip />
//                 <Bar dataKey="score" radius={[6, 6, 0, 0]}>
//                   {branchData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//         <div className="col-span-5 glass-card rounded-2xl p-4">
//           <h3 className="text-sm font-bold text-foreground mb-1">Wellbeing Trends Over Time</h3>
//           <p className="text-xs text-muted-foreground mb-3">Campus average wellbeing score</p>
//           <div className="h-52">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={trendData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 90%)" />
//                 <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(220 15% 50%)" />
//                 <YAxis tick={{ fontSize: 11 }} stroke="hsl(220 15% 50%)" domain={[60, 85]} />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="score" stroke="hsl(215 65% 55%)" strokeWidth={3} dot={{ fill: "hsl(215 65% 55%)", r: 5 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Student Progress Reports */}
//       <div className="grid grid-cols-12 gap-4">
//         <div className="col-span-8">
//           <div className="glass-card rounded-2xl p-4">
//             <div className="flex items-center justify-between mb-3">
//               <div>
//                 <h3 className="text-lg font-bold text-foreground">Student Progress Reports</h3>
//                 <p className="text-xs text-muted-foreground">Detailed wellbeing progress of students (Last 4 Weeks)</p>
//               </div>
//               <button className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full">
//                 <FileText className="w-3 h-3" /> View Individual Reports
//               </button>
//             </div>

//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-muted-foreground text-xs border-b border-border">
//                   <th className="text-left py-2 font-medium">Student ID</th>
//                   <th className="text-left py-2 font-medium">Name</th>
//                   <th className="text-left py-2 font-medium">Branch</th>
//                   <th className="text-left py-2 font-medium">Year</th>
//                   <th className="text-left py-2 font-medium">Wellbeing Score</th>
//                   <th className="text-left py-2 font-medium">Progress</th>
//                   <th className="text-left py-2 font-medium">Status</th>
//                   <th className="text-left py-2 font-medium">Report</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {students.map((s) => (
//                   <tr key={s.id} className="border-b border-border/50 hover:bg-white/30">
//                     <td className="py-3 font-medium text-foreground">{s.id}</td>
//                     <td className="text-foreground">{s.name}</td>
//                     <td className="text-muted-foreground">{s.branch}</td>
//                     <td className="text-muted-foreground">{s.year}</td>
//                     <td className="font-semibold text-primary">{s.score}</td>
//                     <td>
//                       <span className={`flex items-center gap-1 text-xs font-medium ${s.progress.startsWith("+") ? "text-arogyam-green" : "text-arogyam-red"}`}>
//                         {s.progress.startsWith("+") ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
//                         {s.progress}
//                       </span>
//                     </td>
//                     <td>
//                       <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(s.status)}`}>
//                         {s.status}
//                       </span>
//                     </td>
//                     <td>
//                       <Eye className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
//               <div className="flex items-center gap-1">
//                 <ChevronLeft className="w-4 h-4 cursor-pointer" />
//                 {[1, 2, 3, 4, 5].map((n) => (
//                   <span
//                     key={n}
//                     className={`w-6 h-6 flex items-center justify-center rounded ${
//                       n === 1 ? "bg-primary text-primary-foreground" : "hover:bg-accent cursor-pointer"
//                     }`}
//                   >
//                     {n}
//                   </span>
//                 ))}
//                 <span>...</span>
//                 <span className="w-6 h-6 flex items-center justify-center rounded hover:bg-accent cursor-pointer">23</span>
//                 <ChevronRight className="w-4 h-4 cursor-pointer" />
//               </div>
//               <span>Showing 1-5 of 1140 students</span>
//             </div>
//           </div>
//         </div>

//         {/* Top Performing + Quick Actions */}
//         <div className="col-span-4 space-y-4">
//           <div className="glass-card-strong rounded-2xl p-4">
//             <h3 className="text-sm font-bold text-foreground mb-3">Top Performing Branches</h3>
//             <div className="space-y-3">
//               {topBranches.map((b) => (
//                 <div key={b.name} className="flex items-center gap-3">
//                   <div className="flex items-center gap-1">
//                     <Trophy className="w-4 h-4 text-arogyam-yellow" />
//                     <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center text-xs font-bold">
//                       {b.rank}
//                     </span>
//                   </div>
//                   <div>
//                     <p className="text-sm font-bold text-foreground">{b.name}</p>
//                     <p className="text-xs text-muted-foreground">{b.score} avg score</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <button className="text-xs text-primary font-medium mt-3 hover:underline">
//               View Full Ranking →
//             </button>
//           </div>

//           <div className="glass-card-strong rounded-2xl p-4">
//             <h3 className="text-sm font-bold text-foreground mb-3">Quick Actions</h3>
//             <div className="space-y-2">
//               <button className="w-full bg-white/70 border border-white/50 rounded-xl py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors flex items-center justify-center gap-2">
//                 <FileText className="w-4 h-4 text-arogyam-coral" /> Generate PDF Report
//               </button>
//               <button className="w-full bg-white/70 border border-white/50 rounded-xl py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors flex items-center justify-center gap-2">
//                 <Download className="w-4 h-4 text-arogyam-green" /> Export to Excel
//               </button>
//               <button className="w-full bg-white/70 border border-white/50 rounded-xl py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors flex items-center justify-center gap-2">
//                 <Eye className="w-4 h-4 text-primary" /> View All Students
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="mt-6 text-center text-xs text-muted-foreground">
//         2024 Arogyam • Mental Health Analytics Dashboard • All data is anonymized and privacy protected &nbsp; Last Updated: Today, 10:30 AM
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Analytics;



import { DashboardLayout } from "../componentsAdmin/DashboardLayout";
import { PageHeader } from "../componentsAdmin/PageHeader";
import { TipBanner } from "../componentsAdmin/TipBanner";
import { ChevronLeft, ChevronRight, Download, Eye, TrendingUp, TrendingDown, AlertTriangle, FileText, Trophy } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
} from "recharts";

import { useEffect, useState } from "react";
import axios from "axios";

const statusColor = (status: string) => {
  switch (status) {
    case "Improving": return "bg-green-100 text-green-700";
    case "At Risk": return "bg-red-100 text-red-700";
    case "Stable": return "bg-blue-100 text-blue-700";
    case "Excellent": return "bg-emerald-100 text-emerald-700";
    default: return "bg-muted text-muted-foreground";
  }
};

const Analytics = () => {

  const [branchData,setBranchData] = useState<any[]>([])
  const [trendData,setTrendData] = useState<any[]>([])
  const [students,setStudents] = useState<any[]>([])
  const [topBranches,setTopBranches] = useState<any[]>([])

  const [summary,setSummary] = useState<any>({
    avgScore:0,
    riskPercent:0,
    improvingPercent:0,
    critical:0
  })

  useEffect(()=>{
    fetchAnalytics()
  },[])

  const fetchAnalytics = async ()=>{
    try{

      const res = await axios.get("http://localhost:3000/api/admin/analytics")

      setBranchData(res.data.branchData)
      setTrendData(res.data.trendData)
      setStudents(res.data.students)
      setTopBranches(res.data.topBranches)
      setSummary(res.data.summary)

    }catch(err){
      console.log(err)
    }
  }

  return (

<DashboardLayout>

<PageHeader
title="Analytics"
subtitle="Monitor branch-wise student progress and wellbeing insights"
searchPlaceholder="Search students..."
/>

<TipBanner message="Use filters to view specific student groups and generate detailed progress reports." />

{/* Filters */}

<div className="glass-card rounded-2xl p-4 mb-4">

<div className="flex items-center justify-between mb-3">

<h3 className="text-sm font-bold text-foreground">Select Branch & Filters</h3>

<button className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-4 py-2 rounded-full font-medium">

<Download className="w-3 h-3" /> Export Report

</button>

</div>

<div className="grid grid-cols-6 gap-3 mb-3">

<div>

<label className="text-xs text-muted-foreground">Department</label>

<select className="w-full bg-white/70 border border-white/50 rounded-lg px-3 py-2 text-sm mt-1">

<option>All Departments</option>

</select>

</div>

<div>

<label className="text-xs text-muted-foreground">Year</label>

<select className="w-full bg-white/70 border border-white/50 rounded-lg px-3 py-2 text-sm mt-1">

<option>All Years</option>

</select>

</div>

<div>

<label className="text-xs text-muted-foreground">Residence</label>

<select className="w-full bg-white/70 border border-white/50 rounded-lg px-3 py-2 text-sm mt-1">

<option>All</option>

</select>

</div>

<div>

<label className="text-xs text-muted-foreground">Time Period</label>

<select className="w-full bg-white/70 border border-white/50 rounded-lg px-3 py-2 text-sm mt-1">

<option>Last 4 Weeks</option>

</select>

</div>

<div>

<label className="text-xs text-muted-foreground">Section</label>

<select className="w-full bg-white/70 border border-white/50 rounded-lg px-3 py-2 text-sm mt-1">

<option>All Sections</option>

</select>

</div>

<div className="flex items-end gap-2">

<button className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-semibold">

Apply Filters

</button>

<button className="bg-white/70 border border-white/50 rounded-lg px-4 py-2 text-sm">

Reset

</button>

</div>

</div>

</div>

{/* Summary Cards */}

<div className="grid grid-cols-4 gap-4 mb-4">

<div className="glass-card-strong rounded-2xl p-4 text-center">

<p className="text-xs text-muted-foreground mb-2">Average Wellbeing Score</p>

<div className="text-3xl font-bold text-primary">{summary.avgScore}</div>

</div>

<div className="glass-card-strong rounded-2xl p-4 text-center">

<p className="text-xs text-muted-foreground mb-2">At-Risk Students</p>

<div className="text-3xl font-bold text-red-500">{summary.riskPercent}%</div>

</div>

<div className="glass-card-strong rounded-2xl p-4 text-center">

<p className="text-xs text-muted-foreground mb-2">Students Improving</p>

<div className="text-3xl font-bold text-green-500">{summary.improvingPercent}%</div>

</div>

<div className="glass-card-strong rounded-2xl p-4 text-center">

<p className="text-xs text-muted-foreground mb-2">Critical Cases</p>

<div className="text-3xl font-bold text-red-600">{summary.critical}</div>

</div>

</div>

{/* Charts */}

<div className="grid grid-cols-12 gap-4 mb-4">

<div className="col-span-7 glass-card rounded-2xl p-4">

<h3 className="text-sm font-bold text-foreground mb-1">Branch Wellbeing Comparison</h3>

<div className="h-52">

<ResponsiveContainer width="100%" height="100%">

<BarChart data={branchData}>

<XAxis dataKey="name"/>

<YAxis domain={[0,100]}/>

<Tooltip/>

<Bar dataKey="score">

{branchData.map((entry,index)=>(
<Cell key={index} fill={entry.color}/>
))}

</Bar>

</BarChart>

</ResponsiveContainer>

</div>

</div>

<div className="col-span-5 glass-card rounded-2xl p-4">

<h3 className="text-sm font-bold text-foreground mb-1">Wellbeing Trends Over Time</h3>

<div className="h-52">

<ResponsiveContainer width="100%" height="100%">

<LineChart data={trendData}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="week"/>

<YAxis domain={[60,85]}/>

<Tooltip/>

<Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3}/>

</LineChart>

</ResponsiveContainer>

</div>

</div>

</div>

{/* Student Table */}

<div className="glass-card rounded-2xl p-4">

<h3 className="text-lg font-bold mb-3">Student Progress Reports</h3>

<table className="w-full text-sm">

<thead>

<tr className="border-b text-xs text-muted-foreground">

<th className="text-left py-2">Student ID</th>

<th>Name</th>

<th>Branch</th>

<th>Year</th>

<th>Score</th>

<th>Progress</th>

<th>Status</th>

<th>Report</th>

</tr>

</thead>

<tbody>

{students.map((s)=>(
<tr key={s.id} className="border-b">

<td>{s.id}</td>
<td>{s.name}</td>
<td>{s.branch}</td>
<td>{s.year}</td>
<td className="font-bold text-primary">{s.score}</td>

<td>

<span className={`flex items-center gap-1 text-xs font-medium ${s.progress.startsWith("+") ? "text-green-500":"text-red-500"}`}>

{s.progress.startsWith("+") ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}

{s.progress}

</span>

</td>

<td>

<span className={`text-xs px-2 py-1 rounded-full ${statusColor(s.status)}`}>
{s.status}
</span>

</td>

<td>
<Eye className="w-4 h-4 cursor-pointer"/>
</td>

</tr>
))}

</tbody>

</table>

</div>

</DashboardLayout>

)
}

export default Analytics