import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../componentsAdmin/DashboardLayout";
import { PageHeader } from "../componentsAdmin/PageHeader";
import { TipBanner } from "../componentsAdmin/TipBanner";
import { ChevronRight, Download } from "lucide-react";
import api from "@/config/api";

type RiskSummary = {
  low: number;
  moderate: number;
  high: number;
  total: number;
};

type RiskStudent = {
  id: string;
  level: string;
  date: string;
  dept: string;
};

type RiskBreakdown = {
  name: string;
  value: number;
  percent: number;
};

const emptyRiskSummary: RiskSummary = {
  low: 0,
  moderate: 0,
  high: 0,
  total: 0,
};

const RiskDetection = () => {
  const [riskSummary, setRiskSummary] = useState<RiskSummary>(emptyRiskSummary);
  const [students, setStudents] = useState<RiskStudent[]>([]);
  const [riskBreakdown, setRiskBreakdown] = useState<RiskBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/admin/risk");

      setRiskSummary(res.data?.riskSummary || emptyRiskSummary);
      setStudents(Array.isArray(res.data?.students) ? res.data.students : []);
      setRiskBreakdown(Array.isArray(res.data?.riskBreakdown) ? res.data.riskBreakdown : []);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Unable to load risk data.");
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(students.map((student) => student.dept).filter(Boolean)))];
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      if (selectedLevel !== "All" && student.level !== selectedLevel) return false;
      if (selectedDepartment !== "All" && student.dept !== selectedDepartment) return false;
      return true;
    });
  }, [students, selectedLevel, selectedDepartment]);

  const focusStudent = useMemo(() => {
    const highRisk = filteredStudents.find((student) => student.level === "High");
    return highRisk || filteredStudents[0] || null;
  }, [filteredStudents]);

  const focusIssues = riskBreakdown.slice(0, 2);

  return (
    <DashboardLayout>
      <PageHeader
        title="Risk Detection"
        subtitle="Identifying and monitoring students at risk."
      />

      <TipBanner message="Prioritize high-risk students and track issue patterns from live risk analytics." />

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="glass-card rounded-2xl p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <select
            value={selectedLevel}
            onChange={(event) => setSelectedLevel(event.target.value)}
            className="bg-white/70 border border-white/50 rounded-full px-4 py-2 text-sm"
          >
            <option value="All">All Risk Levels</option>
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={selectedDepartment}
            onChange={(event) => setSelectedDepartment(event.target.value)}
            className="bg-white/70 border border-white/50 rounded-full px-4 py-2 text-sm"
          >
            {departmentOptions.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "All" ? "All Departments" : dept}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSelectedLevel("All");
              setSelectedDepartment("All");
            }}
            className="bg-white/70 border border-white/50 rounded-full px-6 py-2 text-sm font-semibold"
          >
            Reset
          </button>

          <button className="bg-primary text-primary-foreground rounded-full px-6 py-2 text-sm font-semibold flex items-center justify-center gap-1">
            <Download className="w-3 h-3" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-8">
          <div className="glass-card rounded-2xl p-4 mb-4">
            <h3 className="text-lg font-bold text-foreground mb-4">Early Risk Detection</h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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

          <div className="glass-card rounded-2xl p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
              <h3 className="text-lg font-bold text-foreground">Risk Student List</h3>

              <div className="flex items-center gap-2 text-sm">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full font-semibold">All</span>
                <span className="text-muted-foreground">High ({riskSummary.high})</span>
                <span className="text-muted-foreground">Moderate ({riskSummary.moderate})</span>
                <span className="text-muted-foreground">Low ({riskSummary.low})</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="text-muted-foreground text-xs border-b border-border">
                    <th className="text-left py-2 font-medium">Student ID</th>
                    <th className="text-left py-2 font-medium">Risk Level</th>
                    <th className="text-left py-2 font-medium">Last Check</th>
                    <th className="text-left py-2 font-medium">Department</th>
                    <th className="text-left py-2 font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-border/50 hover:bg-white/30">
                      <td className="py-3 flex items-center gap-2">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`}
                          alt={student.id}
                          className="w-7 h-7 rounded-full bg-accent"
                        />
                        {student.id}
                      </td>

                      <td>
                        <span
                          className={
                            student.level === "High"
                              ? "risk-badge-high"
                              : student.level === "Moderate"
                                ? "risk-badge-moderate"
                                : "risk-badge-low"
                          }
                        >
                          {student.level}
                        </span>
                      </td>

                      <td className="text-muted-foreground">{student.date}</td>
                      <td className="text-muted-foreground">{student.dept}</td>

                      <td>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full cursor-pointer">
                          Review
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!loading && filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-muted-foreground">
                        No students match current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end mt-3 text-xs text-muted-foreground">
              <span>Showing {filteredStudents.length} of {riskSummary.total} students</span>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="glass-card-strong rounded-2xl p-4 mb-4">
            <h3 className="text-sm font-bold text-foreground mb-2">Student Risk Summary</h3>
            <p className="text-xs text-muted-foreground mb-1">
              Profile: {focusStudent?.id || "No student selected"}
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Last Check: {focusStudent?.date || "-"}
            </p>
            <p className="text-xs text-muted-foreground mb-1">Recent Issue Types:</p>

            <div className="flex gap-2 flex-wrap mb-2">
              {focusIssues.length > 0 ? (
                focusIssues.map((issue, index) => (
                  <span
                    key={issue.name}
                    className={index === 0 ? "risk-badge-high" : "risk-badge-moderate"}
                  >
                    {issue.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No issue breakdown available.</span>
              )}
            </div>
          </div>

          <div className="glass-card-strong rounded-2xl p-4 mb-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Wellbeing Risk Breakdown</h3>

            <div className="space-y-3">
              {riskBreakdown.map((riskItem) => (
                <div key={riskItem.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{riskItem.name}</span>
                    <span className="font-semibold text-foreground">{riskItem.value}%</span>
                  </div>

                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-arogyam-orange rounded-full"
                      style={{ width: `${riskItem.percent}%` }}
                    />
                  </div>
                </div>
              ))}
              {!loading && riskBreakdown.length === 0 && (
                <p className="text-xs text-muted-foreground">No risk breakdown data available.</p>
              )}
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
