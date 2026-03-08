// import { DashboardLayout } from "../componentsAdmin/DashboardLayout";
// import { PageHeader } from "../componentsAdmin/PageHeader";
// import { TipBanner } from "../componentsAdmin/TipBanner";
// import { ChevronRight, ChevronLeft, Download } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";

// const riskSummary = { low: 580, moderate: 352, high: 208, total: 1140 };

// const students = [
//   { id: "STU-1574", level: "High", date: "30-Sept", dept: "CSE" },
//   { id: "STU-1345", level: "High", date: "25-Sept", dept: "CSE" },
//   { id: "STU-8321", level: "Moderate", date: "23-Sept", dept: "ME" },
//   { id: "STU-6245", level: "Low", date: "22-Sept", dept: "ECE" },
//   { id: "STU-2189", level: "Moderate", date: "19-Sept", dept: "BBA" },
//   { id: "STU-8912", level: "Low", date: "16-Sept", dept: "ME" },
//   { id: "STU-7641", level: "High", date: "14-Sept", dept: "CSE" },
// ];

// const riskBreakdown = [
//   { name: "Academic", value: 385 },
//   { name: "Sleep", value: 605 },
// ];

// const RiskDetection = () => {
//   return (
//     <DashboardLayout>
//       <PageHeader
//         title="Risk Detection"
//         subtitle="Identifying and monitoring students at risk."
//       />

//       <TipBanner message="High-risk students should be prioritized for appropriate intervention or counseling." />

//       {/* Filters */}
//       <div className="glass-card rounded-2xl p-4 mb-4">
//         <div className="flex flex-wrap items-center gap-3">
//           <select className="bg-white/70 border border-white/50 rounded-full px-4 py-2 text-sm">
//             <option>Filter by Risk Level</option>
//           </select>
//           <select className="bg-white/70 border border-white/50 rounded-full px-4 py-2 text-sm">
//             <option>Issue Type</option>
//           </select>
//           <select className="bg-white/70 border border-white/50 rounded-full px-4 py-2 text-sm">
//             <option>Department</option>
//           </select>
//           <input
//             placeholder="Or Set Risk Level Threshold"
//             className="bg-white/70 border border-white/50 rounded-full px-4 py-2 text-sm flex-1"
//           />
//           <button className="bg-primary text-primary-foreground rounded-full px-6 py-2 text-sm font-semibold">
//             Apply Filters
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-12 gap-4">
//         {/* Early Risk Detection Summary */}
//         <div className="col-span-8">
//           <div className="glass-card rounded-2xl p-4 mb-4">
//             <h3 className="text-lg font-bold text-foreground mb-4">Early Risk Detection</h3>
//             <div className="grid grid-cols-4 gap-3">
//               <div className="bg-green-50 rounded-xl p-3 text-center">
//                 <p className="text-2xl font-bold text-arogyam-green">{riskSummary.low}</p>
//                 <p className="text-xs text-muted-foreground">Low Risk</p>
//               </div>
//               <div className="bg-orange-50 rounded-xl p-3 text-center">
//                 <p className="text-2xl font-bold text-arogyam-orange">{riskSummary.moderate}</p>
//                 <p className="text-xs text-muted-foreground">Moderate</p>
//               </div>
//               <div className="bg-red-50 rounded-xl p-3 text-center">
//                 <p className="text-2xl font-bold text-arogyam-red">{riskSummary.high}</p>
//                 <p className="text-xs text-muted-foreground">High Risk</p>
//               </div>
//               <div className="bg-blue-50 rounded-xl p-3 text-center">
//                 <p className="text-2xl font-bold text-primary">{riskSummary.total}</p>
//                 <p className="text-xs text-muted-foreground">Total Risk</p>
//               </div>
//             </div>
//           </div>

//           {/* Student Table */}
//           <div className="glass-card rounded-2xl p-4">
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-lg font-bold text-foreground">Early Risk Detection</h3>
//               <button className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full">
//                 <Download className="w-3 h-3" /> Export
//               </button>
//             </div>

//             {/* Tabs */}
//             <div className="flex items-center gap-4 mb-4 text-sm">
//               <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full font-semibold">All</span>
//               <span className="text-muted-foreground cursor-pointer hover:text-foreground">High Risk (208)</span>
//               <span className="text-muted-foreground cursor-pointer hover:text-foreground">Moderate Risk (352)</span>
//               <span className="text-muted-foreground cursor-pointer hover:text-foreground">Low Risk (580)</span>
//             </div>

//             {/* Table */}
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-muted-foreground text-xs border-b border-border">
//                   <th className="text-left py-2 font-medium">Student ID</th>
//                   <th className="text-left py-2 font-medium">Risk Level</th>
//                   <th className="text-left py-2 font-medium">Last Check</th>
//                   <th className="text-left py-2 font-medium">Department</th>
//                   <th className="text-left py-2 font-medium"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {students.map((s) => (
//                   <tr key={s.id} className="border-b border-border/50 hover:bg-white/30">
//                     <td className="py-3 flex items-center gap-2">
//                       <img
//                         src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.id}`}
//                         alt={s.id}
//                         className="w-7 h-7 rounded-full bg-accent"
//                       />
//                       {s.id}
//                     </td>
//                     <td>
//                       <span
//                         className={
//                           s.level === "High"
//                             ? "risk-badge-high"
//                             : s.level === "Moderate"
//                             ? "risk-badge-moderate"
//                             : "risk-badge-low"
//                         }
//                       >
//                         {s.level}
//                       </span>
//                     </td>
//                     <td className="text-muted-foreground">{s.date}</td>
//                     <td className="text-muted-foreground">{s.dept}</td>
//                     <td>
//                       <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full cursor-pointer">
//                         CCAL
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
//               <div className="flex items-center gap-2">
//                 <ChevronLeft className="w-4 h-4" />
//                 <ChevronRight className="w-4 h-4" />
//               </div>
//               <span>1-7 of 1,149 students</span>
//             </div>
//           </div>
//         </div>

//         {/* Student Risk Summary */}
//         <div className="col-span-4">
//           <div className="glass-card-strong rounded-2xl p-4 mb-4">
//             <h3 className="text-sm font-bold text-foreground mb-2">Student Risk Summary</h3>
//             <p className="text-xs text-muted-foreground mb-1">Profile: STU-1345 (Anonymized)</p>
//             <p className="text-xs text-muted-foreground mb-3">Last Check: 25-Sept</p>
//             <p className="text-xs text-muted-foreground mb-1">Recent Issue Type:</p>
//             <div className="flex gap-2 mb-4">
//               <span className="risk-badge-high">High Stress</span>
//               <span className="risk-badge-moderate">Sleep Problems</span>
//             </div>
//           </div>

//           <div className="glass-card-strong rounded-2xl p-4 mb-4">
//             <h3 className="text-sm font-bold text-foreground mb-3">Wellbeing Risk Breakdown</h3>
//             <div className="space-y-3">
//               <div>
//                 <div className="flex justify-between text-xs mb-1">
//                   <span className="text-muted-foreground">Academic Stress</span>
//                   <span className="font-semibold text-foreground">385%</span>
//                 </div>
//                 <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
//                   <div className="h-full bg-arogyam-red rounded-full" style={{ width: "65%" }} />
//                 </div>
//               </div>
//               <div>
//                 <div className="flex justify-between text-xs mb-1">
//                   <span className="text-muted-foreground">Sleep Problems</span>
//                   <span className="font-semibold text-foreground">605%</span>
//                 </div>
//                 <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
//                   <div className="h-full bg-arogyam-orange rounded-full" style={{ width: "85%" }} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <button className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:bg-primary/90 transition-colors">
//             Suggest Counselling
//           </button>

//           <div className="text-right mt-4">
//             <button className="text-sm text-muted-foreground hover:text-foreground font-medium">
//               See All Reports <ChevronRight className="inline w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default RiskDetection;


import { DashboardLayout } from "../componentsAdmin/DashboardLayout";
import { PageHeader } from "../componentsAdmin/PageHeader";
import { TipBanner } from "../componentsAdmin/TipBanner";
import { ChevronRight, ChevronLeft, Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { useEffect, useState } from "react";
import axios from "axios";

const RiskDetection = () => {

const [riskSummary,setRiskSummary] = useState<any>({
low:0,
moderate:0,
high:0,
total:0
})

const [students,setStudents] = useState<any[]>([])
const [riskBreakdown,setRiskBreakdown] = useState<any[]>([])

useEffect(()=>{
fetchData()
},[])

const fetchData = async ()=>{
try{

const res = await axios.get("http://localhost:3000/api/admin/risk")

setRiskSummary(res.data.riskSummary)
setStudents(res.data.students)
setRiskBreakdown(res.data.riskBreakdown)

}catch(err){
console.log(err)
}
}

  return (
    <DashboardLayout>
      <PageHeader
        title="Risk Detection"
        subtitle="Identifying and monitoring students at risk."
      />

      <TipBanner message="High-risk students should be prioritized for appropriate intervention or counseling." />

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <select className="bg-white/70 border border-white/50 rounded-full px-4 py-2 text-sm">
            <option>Filter by Risk Level</option>
          </select>
          <select className="bg-white/70 border border-white/50 rounded-full px-4 py-2 text-sm">
            <option>Issue Type</option>
          </select>
          <select className="bg-white/70 border border-white/50 rounded-full px-4 py-2 text-sm">
            <option>Department</option>
          </select>
          <input
            placeholder="Or Set Risk Level Threshold"
            className="bg-white/70 border border-white/50 rounded-full px-4 py-2 text-sm flex-1"
          />
          <button className="bg-primary text-primary-foreground rounded-full px-6 py-2 text-sm font-semibold">
            Apply Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">

        {/* LEFT SECTION */}

        <div className="col-span-8">

          {/* Summary */}
          <div className="glass-card rounded-2xl p-4 mb-4">
            <h3 className="text-lg font-bold text-foreground mb-4">Early Risk Detection</h3>

            <div className="grid grid-cols-4 gap-3">

              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-arogyam-green">{riskSummary.low}</p>
                <p className="text-xs text-muted-foreground">Low Risk</p>
              </div>

              <div className="bg-orange-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-arogyam-orange">{riskSummary.moderate}</p>
                <p className="text-xs text-muted-foreground">Moderate</p>
              </div>

              <div className="bg-red-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-arogyam-red">{riskSummary.high}</p>
                <p className="text-xs text-muted-foreground">High Risk</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-primary">{riskSummary.total}</p>
                <p className="text-xs text-muted-foreground">Total Risk</p>
              </div>

            </div>
          </div>

          {/* Table */}

          <div className="glass-card rounded-2xl p-4">

            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-foreground">Early Risk Detection</h3>

              <button className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full">
                <Download className="w-3 h-3" /> Export
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm">
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full font-semibold">All</span>
              <span className="text-muted-foreground cursor-pointer hover:text-foreground">High Risk ({riskSummary.high})</span>
              <span className="text-muted-foreground cursor-pointer hover:text-foreground">Moderate Risk ({riskSummary.moderate})</span>
              <span className="text-muted-foreground cursor-pointer hover:text-foreground">Low Risk ({riskSummary.low})</span>
            </div>

            <table className="w-full text-sm">

              <thead>
                <tr className="text-muted-foreground text-xs border-b border-border">
                  <th className="text-left py-2 font-medium">Student ID</th>
                  <th className="text-left py-2 font-medium">Risk Level</th>
                  <th className="text-left py-2 font-medium">Last Check</th>
                  <th className="text-left py-2 font-medium">Department</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>

                {students.map((s:any)=>(
                  <tr key={s.id} className="border-b border-border/50 hover:bg-white/30">

                    <td className="py-3 flex items-center gap-2">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.id}`}
                        alt={s.id}
                        className="w-7 h-7 rounded-full bg-accent"
                      />
                      {s.id}
                    </td>

                    <td>
                      <span className={
                        s.level==="High"
                        ? "risk-badge-high"
                        : s.level==="Moderate"
                        ? "risk-badge-moderate"
                        : "risk-badge-low"
                      }>
                        {s.level}
                      </span>
                    </td>

                    <td className="text-muted-foreground">{s.date}</td>
                    <td className="text-muted-foreground">{s.dept}</td>

                    <td>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full cursor-pointer">
                        CCAL
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4"/>
                <ChevronRight className="w-4 h-4"/>
              </div>
              <span>1-{students.length} of 1,149 students</span>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="col-span-4">

          <div className="glass-card-strong rounded-2xl p-4 mb-4">

            <h3 className="text-sm font-bold text-foreground mb-2">
              Student Risk Summary
            </h3>

            <p className="text-xs text-muted-foreground mb-1">
              Profile: STU-1345 (Anonymized)
            </p>

            <p className="text-xs text-muted-foreground mb-3">
              Last Check: 25-Sept
            </p>

            <p className="text-xs text-muted-foreground mb-1">
              Recent Issue Type:
            </p>

            <div className="flex gap-2 mb-4">
              <span className="risk-badge-high">High Stress</span>
              <span className="risk-badge-moderate">Sleep Problems</span>
            </div>

          </div>

          {/* Risk Breakdown */}

          <div className="glass-card-strong rounded-2xl p-4 mb-4">

            <h3 className="text-sm font-bold text-foreground mb-3">
              Wellbeing Risk Breakdown
            </h3>

            <div className="space-y-3">

              {riskBreakdown.map((r:any)=>(
                <div key={r.name}>

                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{r.name}</span>
                    <span className="font-semibold text-foreground">{r.value}%</span>
                  </div>

                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-arogyam-orange rounded-full"
                      style={{ width: `${r.percent}%` }}
                    />
                  </div>

                </div>
              ))}

            </div>

          </div>

          <button className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:bg-primary/90 transition-colors">
            Suggest Counselling
          </button>

          <div className="text-right mt-4">
            <button className="text-sm text-muted-foreground hover:text-foreground font-medium">
              See All Reports <ChevronRight className="inline w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default RiskDetection;