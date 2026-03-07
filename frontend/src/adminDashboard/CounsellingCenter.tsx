import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { TipBanner } from "@/components/TipBanner";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";

const days = ["Mend", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sat"];

const appointments = [
  { time: "10:00AM", id: "STU-1768", counsellor: "Dr. Mehta", mode: "Offline", status: "Confirmed" },
  { time: "11:00AM", id: "STU-2174", counsellor: "Dr. Kumar", mode: "Offline", status: "Confirmed" },
  { time: "12:00PM", id: "STU-8321", counsellor: "Dr. Mehta", mode: "Offline", status: "Pending" },
  { time: "02:00PM", id: "STU-6245", counsellor: "STU-1288", mode: "Online", status: "Completed" },
  { time: "02:00PM", id: "STU-2189", counsellor: "Dr. Mehta", mode: "Online", status: "Pending" },
  { time: "03:00PM", id: "STU-9912", counsellor: "Dr. Mehta", mode: "Online", status: "Completed" },
  { time: "04:00PM", id: "STU-7641", counsellor: "STU-7641", mode: "ME", status: "Completed" },
];

const counsellors = [
  { name: "Dr. Mehta", sessions: 12, tag: "Appointment" },
  { name: "Dr. Kumar", sessions: 10, tag: "Appointment" },
  { name: "Ms. Rao", sessions: 8, tag: "Sreahbloer" },
];

const CounsellingCenter = () => {
  return (
    <DashboardLayout>
      <PageHeader
        title="Counselling Center"
        subtitle="Managing counselling appointments and counsellor availability."
      />

      <TipBanner message="Ensure a balanced counselling load for all counsellors." />

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <select className="bg-white/70 border border-white/50 rounded-full px-4 py-2 text-sm">
            <option>View Counsellors</option>
          </select>
          <select className="bg-white/70 border border-white/50 rounded-full px-4 py-2 text-sm">
            <option>Appointment Type</option>
          </select>
          <select className="bg-white/70 border border-white/50 rounded-full px-4 py-2 text-sm">
            <option>Preferred Time Slot</option>
          </select>
          <button className="bg-accent text-accent-foreground rounded-full px-6 py-2 text-sm font-semibold flex items-center gap-1">
            <Settings className="w-3 h-3" /> Apply Filters
          </button>
          <button className="ml-auto bg-primary text-primary-foreground rounded-full px-6 py-2 text-sm font-semibold">
            Manage Availability
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Appointments */}
        <div className="col-span-8">
          <div className="glass-card rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-foreground">Upcoming Appointments <span className="text-sm text-muted-foreground font-normal">(12 Total)</span></h3>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-primary">580</p>
                <p className="text-xs text-muted-foreground">Low Risk</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-arogyam-orange">352</p>
                <p className="text-xs text-muted-foreground">Moderate</p>
              </div>
              <div className="bg-accent rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-foreground">42</p>
                <p className="text-xs text-muted-foreground">CSCE</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-arogyam-green">92%</p>
                <p className="text-xs text-muted-foreground">High Risk</p>
              </div>
            </div>

            {/* Day tabs */}
            <div className="flex gap-1 mb-4">
              {days.map((d, i) => (
                <span
                  key={`${d}-${i}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    i === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/50 text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Table */}
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs border-b border-border">
                  <th className="text-left py-2 font-medium">Time</th>
                  <th className="text-left py-2 font-medium">Student ID</th>
                  <th className="text-left py-2 font-medium">Counsellor</th>
                  <th className="text-left py-2 font-medium">Mode</th>
                  <th className="text-left py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-white/30">
                    <td className="py-3 font-medium text-foreground">{a.time}</td>
                    <td className="flex items-center gap-2 py-3">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${a.id}`}
                        alt={a.id}
                        className="w-7 h-7 rounded-full bg-accent"
                      />
                      {a.id}
                    </td>
                    <td className="text-muted-foreground">{a.counsellor}</td>
                    <td>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          a.mode === "Online"
                            ? "bg-green-100 text-green-700"
                            : a.mode === "Offline"
                            ? "bg-blue-100 text-blue-700"
                            : "text-muted-foreground"
                        }`}
                      >
                        {a.mode}
                      </span>
                    </td>
                    <td>
                      <span
                        className={
                          a.status === "Confirmed"
                            ? "status-confirmed"
                            : a.status === "Pending"
                            ? "status-pending"
                            : "status-completed"
                        }
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4 cursor-pointer" />
                <span>126</span>
                <ChevronRight className="w-4 h-4 cursor-pointer" />
              </div>
              <span>1-6 of 1,140 students</span>
            </div>
          </div>
        </div>

        {/* Counsellor Overview */}
        <div className="col-span-4 space-y-4">
          <div className="glass-card-strong rounded-2xl p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Counsellor Overview</h3>
            <div className="space-y-3">
              {counsellors.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`}
                      alt={c.name}
                      className="w-8 h-8 rounded-full bg-accent"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.sessions} sessions</p>
                    </div>
                  </div>
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                    {c.tag}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-primary/10 text-primary rounded-xl py-2 text-sm font-semibold hover:bg-primary/20 transition-colors">
              Manage
            </button>
          </div>

          <div className="glass-card-strong rounded-2xl p-4">
            <h3 className="text-sm font-bold text-foreground mb-2">Counsellor Overview</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl font-bold text-arogyam-green">92%</span>
              <span className="text-xs text-muted-foreground">Satisfaction Rate</span>
            </div>
            <p className="text-sm font-semibold text-foreground mb-2">+109 Sessions Booked</p>
            <button className="w-full bg-primary/10 text-primary rounded-xl py-2 text-sm font-semibold hover:bg-primary/20 transition-colors">
              Manage
            </button>
          </div>

          <div className="text-right">
            <button className="text-sm text-muted-foreground hover:text-foreground font-medium">
              See All Appointments <ChevronRight className="inline w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CounsellingCenter;
