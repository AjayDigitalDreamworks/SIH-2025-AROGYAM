import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/config/api";

function SummaryCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ background: `${color}22` }}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {sub ? <p className="text-xs text-purple-500 font-medium mt-0.5">{sub}</p> : null}
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 className="text-lg font-semibold text-gray-800 mb-4">{children}</h2>;
}

const initialSummary = {
  totalEarnedPoints: 0,
  availablePoints: 0,
  thisWeekPoints: 0,
  currentStreakDays: 0,
  achievementsUnlocked: 0,
  achievementsTotal: 0,
  activitiesCompleted: 0,
};

export default function ArogyamRewardPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(initialSummary);
  const [achievements, setAchievements] = useState([]);
  const [store, setStore] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [redeemingId, setRedeemingId] = useState("");

  const applyPayload = (payload) => {
    const nextSummary = payload?.summary || {};
    setSummary({
      totalEarnedPoints: Number(nextSummary.totalEarnedPoints) || 0,
      availablePoints: Number(nextSummary.availablePoints ?? nextSummary.totalPoints) || 0,
      thisWeekPoints: Number(nextSummary.thisWeekPoints) || 0,
      currentStreakDays: Number(nextSummary.currentStreakDays) || 0,
      achievementsUnlocked: Number(nextSummary.achievementsUnlocked) || 0,
      achievementsTotal: Number(nextSummary.achievementsTotal) || 0,
      activitiesCompleted: Number(nextSummary.activitiesCompleted) || 0,
    });
    setAchievements(Array.isArray(payload?.achievements) ? payload.achievements : []);
    setStore(Array.isArray(payload?.store) ? payload.store : []);
  };

  const loadRewards = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/api/rewards");
      applyPayload(data);
    } catch (fetchError) {
      if (fetchError?.response?.status === 401 || fetchError?.response?.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      setError(fetchError?.response?.data?.message || "Failed to load rewards.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    loadRewards();
  }, []);

  const handleRedeem = async (rewardId) => {
    if (!rewardId) return;
    try {
      setInfo("");
      setRedeemingId(rewardId);
      const { data } = await api.post("/api/rewards/redeem", { rewardId });
      applyPayload(data);
      setInfo(data?.message || "Reward redeemed successfully.");
    } catch (redeemError) {
      if (redeemError?.response?.status === 401 || redeemError?.response?.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      setInfo(redeemError?.response?.data?.message || "Could not redeem reward.");
    } finally {
      setRedeemingId("");
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-gray-600">
          Loading rewards...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div
            className="rounded-2xl p-6 text-white"
            style={{ background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" }}
          >
            <h1 className="text-2xl font-bold mb-1">🏆 My Rewards</h1>
            <p className="text-purple-200 text-sm">
              Track your points, redeem items, and unlock achievements from real activity.
            </p>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
              {error}
              <button
                onClick={loadRewards}
                className="ml-3 font-semibold underline underline-offset-2"
              >
                Retry
              </button>
            </div>
          ) : null}

          {info ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-3 text-sm">
              {info}
            </div>
          ) : null}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              icon="⭐"
              label="Available Reward Points"
              value={summary.availablePoints}
              sub={`+${summary.thisWeekPoints} this week`}
              color="#F59E0B"
            />
            <SummaryCard
              icon="🔥"
              label="Current Streak"
              value={`${summary.currentStreakDays} Days`}
              sub={`${summary.totalEarnedPoints} total earned`}
              color="#EF4444"
            />
            <SummaryCard
              icon="🏅"
              label="Achievements Unlocked"
              value={`${summary.achievementsUnlocked} / ${summary.achievementsTotal}`}
              sub="Keep going to unlock more"
              color="#7C3AED"
            />
            <SummaryCard
              icon="📊"
              label="Activities Completed"
              value={summary.activitiesCompleted}
              sub="Mood + Sleep + Quiz"
              color="#10B981"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <SectionTitle>🏅 Achievements</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {achievements.map((item) => (
                <div
                  key={item.id || item.title}
                  className={`rounded-xl p-4 text-center border transition-all ${
                    item.unlocked
                      ? "bg-purple-50 border-purple-100 hover:shadow-md"
                      : "bg-gray-50 border-gray-100 opacity-50 grayscale"
                  }`}
                >
                  <div className="text-3xl mb-2">{item.icon || "🏅"}</div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">{item.title}</p>
                  <p className="text-xs text-gray-400 leading-tight">{item.desc}</p>
                  {item.unlocked ? (
                    <span className="inline-block mt-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                      Unlocked
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <SectionTitle>🛒 Reward Store</SectionTitle>
              <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                ⭐ {summary.availablePoints} pts available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {store.map((item) => {
                const isRedeeming = redeemingId === item.id;
                const cannotAfford = summary.availablePoints < item.cost;
                const isDisabled = Boolean(item.redeemed) || cannotAfford || Boolean(redeemingId);
                return (
                  <div
                    key={item.id || item.title}
                    className="border border-gray-100 rounded-xl p-5 flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
                  >
                    <div className="text-4xl">{item.icon || "🎁"}</div>
                    <p className="font-semibold text-gray-700 text-sm text-center">{item.title}</p>
                    <span className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-semibold">
                      ⭐ {item.cost} points
                    </span>
                    <button
                      onClick={() => handleRedeem(item.id)}
                      disabled={isDisabled}
                      className={`mt-1 w-full py-2 rounded-xl text-sm font-semibold transition-all ${
                        item.redeemed
                          ? "bg-green-100 text-green-600 cursor-default"
                          : isDisabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
                      }`}
                    >
                      {item.redeemed ? "Redeemed" : isRedeeming ? "Redeeming..." : "Redeem"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 text-white"
            style={{ background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)" }}
          >
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">🚀 Keep Earning Daily</h3>
              <p className="text-purple-200 text-sm">
                Log mood, track sleep, and complete quizzes to earn more points and unlock rewards.
              </p>
            </div>
            <button
              onClick={() => navigate("/games")}
              className="bg-white text-purple-700 font-semibold px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors shrink-0 text-sm"
            >
              Go to Activities →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
