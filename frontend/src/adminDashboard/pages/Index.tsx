// import { DashboardLayout } from "../componentsAdmin/DashboardLayout";
// import { PageHeader } from "../componentsAdmin/PageHeader";
// import { TipBanner } from "../componentsAdmin/TipBanner";
// import {
//   Users,
//   AlertTriangle,
//   TrendingUp,
//   Calendar,
//   MessageSquare,
//   Bot,
//   Bell,
//   Phone,
//   ChevronRight,
// } from "lucide-react";
// import studentHero from "../../assets/student-hero.png";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const trendData = [
//   { week: "Week 1", score: 68 },
//   { week: "Week 2", score: 72 },
//   { week: "Week 3", score: 74 },
//   { week: "Week 4", score: 78 },
// ];

// const riskStudents = [
//   { id: "STU-1345", date: "25-Sept", level: "High" },
//   { id: "STU-2189", date: "19-Sept", level: "Moderate" },
//   { id: "STU-7641", date: "14-Sept", level: "High" },
// ];

// const counsellors = [
//   { name: "Dr. Mehta", sessions: 12 },
//   { name: "Dr. Kumar", sessions: 10 },
//   { name: "Ms. Rao", sessions: 8 },
// ];

// const peerTopics = [
//   { topic: "Exam Stress", count: 58 },
//   { topic: "Homesickness", count: 41 },
//   { topic: "Placement Anxiety", count: 33 },
// ];

// const Index = () => {
//   return (
//     <DashboardLayout>
//       <PageHeader
//         title="Welcome Admin"
//         subtitle="Empowering student wellbeing through data insights."
//       />

//       <div className="grid grid-cols-12 gap-4">
//         {/* Campus Wellbeing Overview */}
//         <div className="col-span-8">
//           <h2 className="text-lg font-bold text-foreground mb-3">Campus Wellbeing Overview</h2>
//           <div className="grid grid-cols-3 gap-4 mb-4">
//             {/* Total Students */}
//             <div className="stat-card">
//               <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
//                 <Users className="w-4 h-4 text-primary" />
//                 Total Students
//               </div>
//               <p className="text-3xl font-bold text-foreground">5,200</p>
//             </div>
//             {/* At Risk */}
//             <div className="stat-card">
//               <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
//                 <AlertTriangle className="w-4 h-4 text-arogyam-coral" />
//                 At Risk
//               </div>
//               <p className="text-3xl font-bold text-foreground">1,140</p>
//             </div>
//             {/* Risk Breakdown */}
//             <div className="stat-card">
//               <div className="space-y-1 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Low</span>
//                   <span className="font-semibold text-arogyam-green">68%</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Moderate</span>
//                   <span className="font-semibold text-arogyam-orange">25%</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">High</span>
//                   <span className="font-semibold text-arogyam-red">7%</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Average Wellbeing Score */}
//         <div className="col-span-4">
//           <div className="glass-card-strong rounded-2xl p-4 flex items-center gap-4 h-full">
//             <div className="flex-1">
//               <h3 className="text-sm font-semibold text-muted-foreground mb-1">Average Wellbeing Score</h3>
//               <p className="text-5xl font-bold text-primary">74</p>
//               <span className="inline-block mt-2 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-semibold">
//                 1,140 Students
//               </span>
//             </div>
//             <img src={studentHero} alt="Student"  className="w-28 h-28 object-contain" />
//           </div>
//         </div>

//         {/* Mental Health Trends */}
//         <div className="col-span-8">
//           <h2 className="text-lg font-bold text-foreground mb-3">Mental Health Trends</h2>
//           <div className="glass-card rounded-2xl p-4">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-semibold text-foreground">Average Wellbeing Score</span>
//               <span className="text-xs text-primary font-medium">Last 4 Weeks</span>
//             </div>
//             <div className="h-48">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={trendData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 90%)" />
//                   <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(220 15% 50%)" />
//                   <YAxis tick={{ fontSize: 12 }} stroke="hsl(220 15% 50%)" domain={[60, 85]} />
//                   <Tooltip />
//                   <Line
//                     type="monotone"
//                     dataKey="score"
//                     stroke="hsl(215 65% 55%)"
//                     strokeWidth={3}
//                     dot={{ fill: "hsl(215 65% 55%)", r: 5 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="tip-banner mt-3">
//               <AlertTriangle className="w-4 h-4 text-arogyam-yellow" />
//               <span>Stress spiked during exams this week</span>
//               <ChevronRight className="w-4 h-4" />
//             </div>
//           </div>
//         </div>

//         {/* Counselling Center */}
//         <div className="col-span-4">
//           <div className="glass-card-strong rounded-2xl p-4 mb-4">
//             <h3 className="text-sm font-bold text-foreground mb-3">Counselling Center</h3>
//             <div className="flex items-center gap-2 mb-3">
//               <Calendar className="w-5 h-5 text-primary" />
//               <span className="text-2xl font-bold text-foreground">42</span>
//               <span className="text-xs text-muted-foreground">Appointments Booked</span>
//             </div>
//             <button className="w-full bg-primary text-primary-foreground rounded-xl py-2 text-sm font-semibold mb-4 hover:bg-primary/90 transition-colors">
//               Manage Appointments
//             </button>
//             <div className="space-y-3">
//               {counsellors.map((c) => (
//                 <div key={c.name} className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <img
//                       src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`}
//                       alt={c.name}
//                       className="w-8 h-8 rounded-full bg-accent"
//                     />
//                     <span className="text-sm font-medium text-foreground">{c.name}</span>
//                   </div>
//                   <span className="text-sm text-muted-foreground font-semibold">{c.sessions} Sessions</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Early Risk Detection */}
//         <div className="col-span-8">
//           <div className="glass-card rounded-2xl p-4">
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-lg font-bold text-foreground">Early Risk Detection</h3>
//               <button className="text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full font-medium">
//                 Action
//               </button>
//             </div>
//             <div className="space-y-2">
//               {riskStudents.map((s) => (
//                 <div
//                   key={s.id}
//                   className="flex items-center justify-between bg-white/50 rounded-xl px-4 py-3"
//                 >
//                   <div className="flex items-center gap-3">
//                     <img
//                       src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.id}`}
//                       alt={s.id}
//                       className="w-8 h-8 rounded-full bg-accent"
//                     />
//                     <span className="text-sm font-semibold text-foreground">{s.id}</span>
//                     <span className="text-xs text-muted-foreground">{s.date}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span
//                       className={
//                         s.level === "High" ? "risk-badge-high" : "risk-badge-moderate"
//                       }
//                     >
//                       {s.level}
//                     </span>
//                     <ChevronRight className="w-4 h-4 text-muted-foreground" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Reports */}
//           <h3 className="text-lg font-bold text-foreground mt-4 mb-3">Reports</h3>
//           <div className="grid grid-cols-3 gap-3">
//             <div className="stat-card flex items-center gap-3">
//               <Bot className="w-8 h-8 text-primary" />
//               <div>
//                 <p className="text-xs text-muted-foreground">AI Interactions</p>
//                 <p className="text-lg font-bold text-foreground">2,450 <span className="text-xs text-muted-foreground">Today</span></p>
//               </div>
//             </div>
//             <div className="stat-card flex items-center gap-3">
//               <Bell className="w-8 h-8 text-arogyam-coral" />
//               <div>
//                 <p className="text-xs text-muted-foreground">Crisis Alerts</p>
//                 <p className="text-lg font-bold text-foreground">6 <span className="text-xs text-muted-foreground">Today</span></p>
//               </div>
//             </div>
//             <div className="stat-card flex items-center gap-3">
//               <Phone className="w-8 h-8 text-arogyam-red" />
//               <div>
//                 <p className="text-xs text-muted-foreground">Emergency Cases</p>
//                 <p className="text-lg font-bold text-foreground">4 <span className="text-xs text-muted-foreground">Today</span></p>
//               </div>
//             </div>
//           </div>
//         </div>

        // {/* Peer Support */}
        // <div className="col-span-4">
        //   <div className="glass-card-strong rounded-2xl p-4">
        //     <h3 className="text-sm font-bold text-foreground mb-3">Peer Support</h3>
        //     <div className="flex items-center gap-2 mb-4">
        //       <MessageSquare className="w-5 h-5 text-primary" />
        //       <span className="text-2xl font-bold text-foreground">132</span>
        //       <span className="text-xs text-muted-foreground">Posts Today</span>
        //     </div>
        //     <div className="space-y-2">
        //       {peerTopics.map((t) => (
        //         <div
        //           key={t.topic}
        //           className="flex items-center justify-between bg-white/50 rounded-lg px-3 py-2"
        //         >
        //           <span className="text-sm text-foreground">{t.topic}</span>
        //           <div className="flex items-center gap-1">
        //             <span className="text-sm font-bold text-foreground">{t.count}</span>
        //             <ChevronRight className="w-4 h-4 text-muted-foreground" />
        //           </div>
        //         </div>
        //       ))}
        //     </div>
        //     <button className="w-full mt-4 bg-primary/10 text-primary rounded-xl py-2 text-sm font-semibold hover:bg-primary/20 transition-colors">
        //       View Posts
        //     </button>
        //   </div>
        // </div>

//         {/* Footer link */}
//         <div className="col-span-12 text-right">
//           <button className="text-sm text-muted-foreground hover:text-foreground font-medium">
//             See All Reports <ChevronRight className="inline w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Index;



import { DashboardLayout } from "../componentsAdmin/DashboardLayout";
import { PageHeader } from "../componentsAdmin/PageHeader";
import { TipBanner } from "../componentsAdmin/TipBanner";
import {
  Users,
  AlertTriangle,
  Calendar,
  MessageSquare,
  Bot,
  Bell,
  Phone,
  ChevronRight,
} from "lucide-react";
import studentHero from "../../assets/student-hero.png";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";
import api from "@/config/api";

const Index = () => {

  const [overview, setOverview] = useState({
    totalStudents: 0,
    atRisk: 0,
    low: 0,
    moderate: 0,
    high: 0,
    avgScore: 0
  });

  const [trendData, setTrendData] = useState([]);
  const [riskStudents, setRiskStudents] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [peerTopics, setPeerTopics] = useState([]);

  const [reports, setReports] = useState({
    aiInteractions: 0,
    crisisAlerts: 0,
    emergencyCases: 0
  });

  const peerPostsToday = peerTopics.reduce((sum, topic) => sum + (topic.count || 0), 0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

const fetchDashboardData = async () => {
  try {

    const overviewRes = await api.get("/api/admin/overview");
    console.log("Overview response:", overviewRes);
    const trendRes = await api.get("/api/admin/trends");
    const riskRes = await api.get("/api/admin/risk-students");
    const counsellorRes = await api.get("/api/admin/counsellors");
    const peerRes = await api.get("/api/admin/peer-topics");
    const reportRes = await api.get("/api/admin/reports");

    setOverview(overviewRes.data.data || {});
    setTrendData(trendRes.data.data || []);
    setRiskStudents(riskRes.data.data || []);
    setCounsellors(counsellorRes.data.data || []);
    setPeerTopics(peerRes.data.data || []);
    setReports(reportRes.data.data || {});

  } catch (error) {
    console.error("Dashboard fetch error:", error);
  }
};

  return (
    <DashboardLayout>
      <PageHeader
        title="Welcome Admin"
        subtitle="Empowering student wellbeing through data insights."
      />

      <div className="grid grid-cols-12 gap-4">

        {/* Campus Wellbeing Overview */}
        <div className="col-span-8">
          <h2 className="text-lg font-bold text-foreground mb-3">
            Campus Wellbeing Overview
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-4">

            {/* Total Students */}
            <div className="stat-card">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Users className="w-4 h-4 text-primary" />
                Total Students
              </div>
              <p className="text-3xl font-bold text-foreground">
                {overview.totalStudents}
              </p>
            </div>

            {/* At Risk */}
            <div className="stat-card">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <AlertTriangle className="w-4 h-4 text-arogyam-coral" />
                At Risk
              </div>
              <p className="text-3xl font-bold text-foreground">
                {overview.atRisk}
              </p>
            </div>

            {/* Risk Breakdown */}
            <div className="stat-card">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Low</span>
                  <span className="font-semibold text-arogyam-green">
                    {overview.low}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Moderate</span>
                  <span className="font-semibold text-arogyam-orange">
                    {overview.moderate}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">High</span>
                  <span className="font-semibold text-arogyam-red">
                    {overview.high}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Average Wellbeing Score */}
        <div className="col-span-4">
          <div className="glass-card-strong rounded-2xl p-4 flex items-center gap-4 h-full">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                Average Wellbeing Score
              </h3>
              <p className="text-5xl font-bold text-primary">
                {overview.avgScore}
              </p>
              <span className="inline-block mt-2 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-semibold">
                {overview.atRisk} Students
              </span>
            </div>

            <img
              src={studentHero}
              alt="Student"
              className="w-28 h-28 object-contain"
            />
          </div>
        </div>

        {/* Mental Health Trends */}
        <div className="col-span-8">
          <h2 className="text-lg font-bold text-foreground mb-3">
            Mental Health Trends
          </h2>

          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">
                Average Wellbeing Score
              </span>
              <span className="text-xs text-primary font-medium">
                Last 4 Weeks
              </span>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[60, 85]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(215 65% 55%)"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Counsellors */}
        <div className="col-span-4">
          <div className="glass-card-strong rounded-2xl p-4 mb-4">
            <h3 className="text-sm font-bold text-foreground mb-3">
              Counselling Center
            </h3>

            <div className="space-y-3">
              {counsellors.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`}
                      alt={c.name}
                      className="w-8 h-8 rounded-full bg-accent"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {c.name}
                    </span>
                  </div>

                  <span className="text-sm text-muted-foreground font-semibold">
                    {c.sessions} Sessions
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Early Risk Detection */}
        <div className="col-span-8">
          <div className="glass-card rounded-2xl p-4">
            <h3 className="text-lg font-bold text-foreground mb-3">
              Early Risk Detection
            </h3>

            <div className="space-y-2">
              {riskStudents.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between bg-white/50 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.id}`}
                      alt={s.id}
                      className="w-8 h-8 rounded-full bg-accent"
                    />

                    <span className="text-sm font-semibold text-foreground">
                      {s.id}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {s.date}
                    </span>
                  </div>

                  <span
                    className={
                      s.level === "High"
                        ? "risk-badge-high"
                        : "risk-badge-moderate"
                    }
                  >
                    {s.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

          {/* Peer Support */}
        <div className="col-span-4">
          <div className="glass-card-strong rounded-2xl p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Peer Support</h3>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">{peerPostsToday}</span>
              <span className="text-xs text-muted-foreground">Posts Today</span>
            </div>
            <div className="space-y-2">
              {peerTopics.map((t) => (
                <div
                  key={t.topic}
                  className="flex items-center justify-between bg-white/50 rounded-lg px-3 py-2"
                >
                  <span className="text-sm text-foreground">{t.topic}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-foreground">{t.count}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-primary/10 text-primary rounded-xl py-2 text-sm font-semibold hover:bg-primary/20 transition-colors">
              View Posts
            </button>
          </div>
        </div>

        {/* Reports */}
        <div className="col-span-12">
          <h3 className="text-lg font-bold text-foreground mt-4 mb-3">
            Reports
          </h3>

          <div className="grid grid-cols-3 gap-3">

            <div className="stat-card flex items-center gap-3">
              <Bot className="w-8 h-8 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">
                  AI Interactions
                </p>
                <p className="text-lg font-bold text-foreground">
                  {reports.aiInteractions}
                </p>
              </div>
            </div>

            <div className="stat-card flex items-center gap-3">
              <Bell className="w-8 h-8 text-arogyam-coral" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Crisis Alerts
                </p>
                <p className="text-lg font-bold text-foreground">
                  {reports.crisisAlerts}
                </p>
              </div>
            </div>

            <div className="stat-card flex items-center gap-3">
              <Phone className="w-8 h-8 text-arogyam-red" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Emergency Cases
                </p>
                <p className="text-lg font-bold text-foreground">
                  {reports.emergencyCases}
                </p>
              </div>
            </div>
            

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Index;
