import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldAlert,
  Stethoscope,
  BarChart3,
  Users,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";
import lotusLogo from "@/assets/lotus-logo.png";
import plantDecor from "@/assets/plant-decor.png";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Risk Detection", url: "/admin/emergency", icon: ShieldAlert },
  { title: "Counselling Center", url: "/admin/register-counsellor", icon: Stethoscope },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Peer Support", url: "/admin/peer-support", icon: Users },
  { title: "Resources", url: "/admin/resources", icon: BookOpen },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-52 min-h-screen flex flex-col glass-card-strong relative overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 pt-6 pb-4">
        <img src={lotusLogo} alt="Arogyam" className="w-10 h-10" />
        <span className="text-xl font-bold text-foreground">Arogyam</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 mt-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <Link
              key={item.title}
              to={item.url}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Plant decoration */}
      <div className="absolute bottom-12 left-0 w-32 opacity-60 pointer-events-none">
        <img src={plantDecor} alt="" className="w-full" />
      </div>

      {/* Logout */}
      <div className="px-3 pb-6 relative z-10">
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent w-full transition-all">
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
