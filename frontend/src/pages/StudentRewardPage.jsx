import { useState } from "react";

// const mainMenu = [
//   { label: "Dashboard", icon: "🏠" },
//   { label: "AI Chatbot", icon: "🤖" },
//   { label: "Book Appointment", icon: "📅" },
//   { label: "Resource Hub", icon: "📖" },
//   { label: "Community Forum", icon: "👥" },
// ];
// const wellnessTools = [
//   { label: "Quizzes & Games", icon: "🎮" },
//   { label: "Mood Tracker", icon: "❤️" },
//   { label: "Sleep Tracker", icon: "😴" },
//   { label: "Exercise Plans", icon: "🏃" },
//   { label: "Rewards", icon: "⭐" },
// ];
// const support = [{ label: "Crisis Helpline", icon: "📞" }];

const achievements = [
  { icon: "🏅", title: "First Activity", desc: "Completed your first activity", unlocked: true },
  { icon: "🔥", title: "7 Day Streak", desc: "Maintained streak for 7 days", unlocked: true },
  { icon: "📚", title: "Quiz Master", desc: "Completed 10 quizzes", unlocked: true },
  { icon: "🎮", title: "Activity Explorer", desc: "Played 5 different activities", unlocked: true },
  { icon: "⭐", title: "500 Points", desc: "Earned 500 total points", unlocked: false },
  { icon: "🌟", title: "30 Day Streak", desc: "Maintained streak for 30 days", unlocked: false },
];

const initialStore = [
  { icon: "🧑‍🎨", title: "Premium Avatar", cost: 100, redeemed: false },
  { icon: "🎨", title: "Custom Dashboard Theme", cost: 150, redeemed: false },
  { icon: "🏷️", title: "Profile Badge", cost: 200, redeemed: false },
];

function SummaryCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: color + "22" }}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {sub && <p className="text-xs text-purple-500 font-medium mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 className="text-lg font-semibold text-gray-800 mb-4">{children}</h2>;
}

// function NavSection({ label, items, active, setActive }) {
//   return (
//     <div className="mb-5">
//       <p className="text-xs text-gray-400 font-semibold mb-2 px-1 tracking-wide">{label}</p>
//       <ul className="space-y-0.5">
//         {items.map((item) => (
//           <li key={item.label}>
//             <button
//               onClick={() => setActive(item.label)}
//               className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
//                 active === item.label
//                   ? "bg-purple-600 text-white font-semibold"
//                   : "text-gray-600 hover:bg-gray-100"
//               }`}
//             >
//               <span className="text-base">{item.icon}</span>
//               {item.label}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

export default function ArogyamRewardPage() {
  const [store, setStore] = useState(initialStore);
  const [totalPoints, setTotalPoints] = useState(420);
  const [activeNav, setActiveNav] = useState("Rewards");

  function handleRedeem(idx) {
    const item = store[idx];
    if (item.redeemed || totalPoints < item.cost) return;
    setTotalPoints((p) => p - item.cost);
    setStore((prev) => prev.map((s, i) => (i === idx ? { ...s, redeemed: true } : s)));
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
     
      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Banner */}
          <div className="rounded-2xl p-6 text-white" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" }}>
            <h1 className="text-2xl font-bold mb-1">🏆 My Rewards</h1>
            <p className="text-purple-200 text-sm">Track your global rewards and achievements across all AROGYAM activities.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard icon="⭐" label="Total Reward Points" value={totalPoints} sub="+60 this week" color="#F59E0B" />
            <SummaryCard icon="🔥" label="Current Streak" value="8 Days" sub="Personal best: 12" color="#EF4444" />
            <SummaryCard icon="🏆" label="Achievements Unlocked" value="6 / 12" sub="4 more to go!" color="#7C3AED" />
            <SummaryCard icon="📊" label="Activities Completed" value="54" sub="This month" color="#10B981" />
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <SectionTitle>🏅 Achievements</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {achievements.map((a) => (
                <div
                  key={a.title}
                  className={`rounded-xl p-4 text-center border transition-all ${
                    a.unlocked
                      ? "bg-purple-50 border-purple-100 hover:shadow-md"
                      : "bg-gray-50 border-gray-100 opacity-40 grayscale"
                  }`}
                >
                  <div className="text-3xl mb-2">{a.icon}</div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">{a.title}</p>
                  <p className="text-xs text-gray-400 leading-tight">{a.desc}</p>
                  {a.unlocked && (
                    <span className="inline-block mt-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">Unlocked</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reward Store */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <SectionTitle>🛒 Reward Store</SectionTitle>
              <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                ⭐ {totalPoints} pts available
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {store.map((item, idx) => (
                <div key={item.title} className="border border-gray-100 rounded-xl p-5 flex flex-col items-center gap-2 hover:shadow-md transition-shadow">
                  <div className="text-4xl">{item.icon}</div>
                  <p className="font-semibold text-gray-700 text-sm text-center">{item.title}</p>
                  <span className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-semibold">⭐ {item.cost} points</span>
                  <button
                    onClick={() => handleRedeem(idx)}
                    disabled={item.redeemed || totalPoints < item.cost}
                    className={`mt-1 w-full py-2 rounded-xl text-sm font-semibold transition-all ${
                      item.redeemed
                        ? "bg-green-100 text-green-600 cursor-default"
                        : totalPoints < item.cost
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
                    }`}
                  >
                    {item.redeemed ? "✅ Redeemed" : "Redeem"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Motivation Card */}
          <div className="rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 text-white" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)" }}>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">🚀 Stay Consistent and Earn More Rewards</h3>
              <p className="text-purple-200 text-sm">
                Complete activities and games daily across AROGYAM to maintain your streak, unlock achievements, and earn more reward points.
              </p>
            </div>
            <button className="bg-white text-purple-700 font-semibold px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors shrink-0 text-sm">
              Go to Activities →
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
