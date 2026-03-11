import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../componentsAdmin/DashboardLayout";
import { PageHeader } from "../componentsAdmin/PageHeader";
import { TipBanner } from "../componentsAdmin/TipBanner";
import { Download, Eye, TrendingDown, TrendingUp } from "lucide-react";
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
import api from "@/config/api";

type BranchDatum = {
  name: string;
  score: number;
  color: string;
};

type TrendDatum = {
  week: string;
  score: number;
};

type StudentRow = {
  id: string;
  name: string;
  branch: string;
  year: string;
  score: number;
  progress: string;
  status: string;
};

type Summary = {
  avgScore: number;
  riskPercent: number;
  improvingPercent: number;
  critical: number;
};

const emptySummary: Summary = {
  avgScore: 0,
  riskPercent: 0,
  improvingPercent: 0,
  critical: 0,
};

const statusColor = (status: string) => {
  switch (status) {
    case "Improving":
      return "bg-green-100 text-green-700";
    case "At Risk":
      return "bg-red-100 text-red-700";
    case "Stable":
      return "bg-blue-100 text-blue-700";
    case "Excellent":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const Analytics = () => {
  const [branchData, setBranchData] = useState<BranchDatum[]>([]);
  const [trendData, setTrendData] = useState<TrendDatum[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/admin/analytics");

      setBranchData(Array.isArray(res.data?.branchData) ? res.data.branchData : []);
      setTrendData(Array.isArray(res.data?.trendData) ? res.data.trendData : []);
      setStudents(Array.isArray(res.data?.students) ? res.data.students : []);
      setSummary(res.data?.summary || emptySummary);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Unable to load analytics right now.");
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(students.map((student) => student.branch).filter(Boolean)))];
  }, [students]);

  const yearOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(students.map((student) => student.year).filter(Boolean)))];
  }, [students]);

  const statusOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(students.map((student) => student.status).filter(Boolean)))];
  }, [students]);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return students.filter((student) => {
      if (selectedDepartment !== "All" && student.branch !== selectedDepartment) return false;
      if (selectedYear !== "All" && student.year !== selectedYear) return false;
      if (selectedStatus !== "All" && student.status !== selectedStatus) return false;

      if (!normalizedSearch) return true;

      const haystack = `${student.id} ${student.name} ${student.branch}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [students, selectedDepartment, selectedYear, selectedStatus, searchText]);

  const filteredBranchData = useMemo(() => {
    if (selectedDepartment === "All") return branchData;
    return branchData.filter((branch) => branch.name === selectedDepartment);
  }, [branchData, selectedDepartment]);

  const resetFilters = () => {
    setSelectedDepartment("All");
    setSelectedYear("All");
    setSelectedStatus("All");
    setSearchText("");
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Analytics"
        subtitle="Monitor branch-wise student progress and wellbeing insights"
        searchPlaceholder="Search students..."
      />

      <TipBanner message="Use filters to focus on departments, years and risk status from live backend data." />

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="glass-card rounded-2xl p-4 mb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
          <h3 className="text-sm font-bold text-foreground">Select Filters</h3>
          <button className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-4 py-2 rounded-full font-medium w-fit">
            <Download className="w-3 h-3" /> Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Department</label>
            <select
              value={selectedDepartment}
              onChange={(event) => setSelectedDepartment(event.target.value)}
              className="w-full bg-white/70 border border-white/50 rounded-lg px-3 py-2 text-sm mt-1"
            >
              {departmentOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Year</label>
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              className="w-full bg-white/70 border border-white/50 rounded-lg px-3 py-2 text-sm mt-1"
            >
              {yearOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Status</label>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="w-full bg-white/70 border border-white/50 rounded-lg px-3 py-2 text-sm mt-1"
            >
              {statusOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Search</label>
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Student ID or name"
              className="w-full bg-white/70 border border-white/50 rounded-lg px-3 py-2 text-sm mt-1"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full bg-white/70 border border-white/50 rounded-lg px-4 py-2 text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-4">
        <div className="xl:col-span-7 glass-card rounded-2xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-1">Branch Wellbeing Comparison</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredBranchData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score">
                  {filteredBranchData.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="xl:col-span-5 glass-card rounded-2xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-1">Wellbeing Trends Over Time</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[60, 85]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4">
        <h3 className="text-lg font-bold mb-3">Student Progress Reports</h3>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
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
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b">
                  <td className="py-3">{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.branch}</td>
                  <td>{student.year}</td>
                  <td className="font-bold text-primary">{student.score}</td>

                  <td>
                    <span
                      className={`flex items-center gap-1 text-xs font-medium ${
                        student.progress.startsWith("+") ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {student.progress.startsWith("+")
                        ? <TrendingUp className="w-3 h-3" />
                        : <TrendingDown className="w-3 h-3" />}
                      {student.progress}
                    </span>
                  </td>

                  <td>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>

                  <td>
                    <Eye className="w-4 h-4 cursor-pointer" />
                  </td>
                </tr>
              ))}
              {!loading && filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-muted-foreground">
                    No student records match current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
