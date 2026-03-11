import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../componentsAdmin/DashboardLayout";
import { PageHeader } from "../componentsAdmin/PageHeader";
import { TipBanner } from "../componentsAdmin/TipBanner";
import { Settings } from "lucide-react";
import api from "@/config/api";

type AppointmentRow = {
  date?: string;
  time: string;
  id: string;
  counsellor: string;
  mode: string;
  status: string;
};

type CounsellorRow = {
  name: string;
  sessions: number;
  tag: string;
};

type Stats = {
  lowRisk: number;
  moderate: number;
  csce: number;
  counsellorsCount?: number;
  highRisk: number;
};

const emptyStats: Stats = {
  lowRisk: 0,
  moderate: 0,
  csce: 0,
  counsellorsCount: 0,
  highRisk: 0,
};

const formatDateLabel = (value?: string) => {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const CounsellingCenter = () => {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [counsellors, setCounsellors] = useState<CounsellorRow[]>([]);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/admin/counselling");

      setAppointments(Array.isArray(res.data?.appointments) ? res.data.appointments : []);
      setCounsellors(Array.isArray(res.data?.counsellors) ? res.data.counsellors : []);
      setStats(res.data?.stats || emptyStats);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Unable to load counselling center data.");
    } finally {
      setLoading(false);
    }
  };

  const dateOptions = useMemo(() => {
    const set = new Set(
      appointments
        .map((appointment) => appointment.date)
        .filter((value): value is string => Boolean(value)),
    );
    return ["All", ...Array.from(set)];
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      if (selectedDate !== "All" && appointment.date !== selectedDate) return false;
      if (selectedMode !== "All" && appointment.mode !== selectedMode) return false;
      if (selectedStatus !== "All" && appointment.status !== selectedStatus) return false;
      return true;
    });
  }, [appointments, selectedDate, selectedMode, selectedStatus]);

  const statusOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(appointments.map((appointment) => appointment.status).filter(Boolean)))];
  }, [appointments]);

  const modeOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(appointments.map((appointment) => appointment.mode).filter(Boolean)))];
  }, [appointments]);

  const totalCounsellors = stats.counsellorsCount ?? stats.csce;

  return (
    <DashboardLayout>
      <PageHeader
        title="Counselling Center"
        subtitle="Managing counselling appointments and counsellor availability."
      />

      <TipBanner message="Keep counsellor load balanced by tracking mode, status and day-wise appointments." />

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="glass-card rounded-2xl p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <select
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="bg-white/70 border border-white/50 rounded-full px-4 py-2 text-sm"
          >
            {dateOptions.map((dateValue) => (
              <option key={dateValue} value={dateValue}>
                {dateValue === "All" ? "All Days" : formatDateLabel(dateValue)}
              </option>
            ))}
          </select>

          <select
            value={selectedMode}
            onChange={(event) => setSelectedMode(event.target.value)}
            className="bg-white/70 border border-white/50 rounded-full px-4 py-2 text-sm"
          >
            {modeOptions.map((mode) => (
              <option key={mode} value={mode}>
                {mode === "All" ? "All Modes" : mode}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="bg-white/70 border border-white/50 rounded-full px-4 py-2 text-sm"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "All" ? "All Statuses" : status}
              </option>
            ))}
          </select>

          <button className="bg-accent text-accent-foreground rounded-full px-6 py-2 text-sm font-semibold flex items-center justify-center gap-1">
            <Settings className="w-3 h-3" /> Manage Availability
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-8">
          <div className="glass-card rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-foreground">
                Upcoming Appointments
                <span className="text-sm text-muted-foreground font-normal">
                  {" "}({filteredAppointments.length} shown)
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-primary">{stats.lowRisk}</p>
                <p className="text-xs text-muted-foreground">Low Risk</p>
              </div>

              <div className="bg-orange-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-arogyam-orange">{stats.moderate}</p>
                <p className="text-xs text-muted-foreground">Moderate</p>
              </div>

              <div className="bg-accent rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{totalCounsellors}</p>
                <p className="text-xs text-muted-foreground">Counsellors</p>
              </div>

              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-arogyam-green">{stats.highRisk}%</p>
                <p className="text-xs text-muted-foreground">High Risk</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="text-muted-foreground text-xs border-b border-border">
                    <th className="text-left py-2 font-medium">Date</th>
                    <th className="text-left py-2 font-medium">Time</th>
                    <th className="text-left py-2 font-medium">Student ID</th>
                    <th className="text-left py-2 font-medium">Counsellor</th>
                    <th className="text-left py-2 font-medium">Mode</th>
                    <th className="text-left py-2 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr key={`${appointment.id}-${appointment.time}`} className="border-b border-border/50 hover:bg-white/30">
                      <td className="py-3 text-muted-foreground">{formatDateLabel(appointment.date)}</td>
                      <td className="py-3 font-medium text-foreground">{appointment.time}</td>

                      <td className="flex items-center gap-2 py-3">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appointment.id}`}
                          alt={appointment.id}
                          className="w-7 h-7 rounded-full bg-accent"
                        />
                        {appointment.id}
                      </td>

                      <td className="text-muted-foreground">{appointment.counsellor}</td>

                      <td>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            appointment.mode === "Online"
                              ? "bg-green-100 text-green-700"
                              : appointment.mode === "Offline"
                                ? "bg-blue-100 text-blue-700"
                                : "text-muted-foreground"
                          }`}
                        >
                          {appointment.mode}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            appointment.status === "Confirmed"
                              ? "status-confirmed"
                              : appointment.status === "Pending"
                                ? "status-pending"
                                : "status-completed"
                          }
                        >
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!loading && filteredAppointments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-muted-foreground">
                        No appointments match current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-4">
          <div className="glass-card-strong rounded-2xl p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Counsellor Overview</h3>

            <div className="space-y-3">
              {counsellors.map((counsellor) => (
                <div key={counsellor.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${counsellor.name}`}
                      alt={counsellor.name}
                      className="w-8 h-8 rounded-full bg-accent"
                    />

                    <div>
                      <p className="text-sm font-medium text-foreground">{counsellor.name}</p>
                      <p className="text-xs text-muted-foreground">{counsellor.sessions} sessions</p>
                    </div>
                  </div>

                  <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                    {counsellor.tag}
                  </span>
                </div>
              ))}
              {!loading && counsellors.length === 0 && (
                <p className="text-xs text-muted-foreground">No counsellor records available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CounsellingCenter;
