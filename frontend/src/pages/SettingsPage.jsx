import { useState } from "react";
import {
  LayoutDashboard, Bot, CalendarDays, BookOpen, Users, Gamepad2,
  Heart, Moon, Dumbbell, Phone, Settings, Bell, ShieldCheck,
  Palette, User, LogOut, Search, ChevronDown, Camera, Save,
  Menu, CheckCircle2, Sparkles, MessageSquare, Mail, Smartphone,
  Activity, Calendar, Star, Lock, Eye, EyeOff, Key, Laptop,
  Globe, LogIn, Trash2, Download, Sun, Monitor, Type, Sliders,
  Contrast, LayoutGrid, BellOff, BellRing, Volume2, VolumeX,
  AlertCircle, RefreshCw, Shield, Fingerprint, Clock
} from "lucide-react";

const sidebarLinks = [
  { section: "MAIN MENU", items: [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "AI Chatbot", icon: Bot },
    { label: "Book Appointment", icon: CalendarDays },
    { label: "Resource Hub", icon: BookOpen },
    { label: "Community Forum", icon: Users },
  ]},
  { section: "WELLNESS TOOLS", items: [
    { label: "Quizzes & Games", icon: Gamepad2 },
    { label: "Mood Tracker", icon: Heart },
    { label: "Sleep Tracker", icon: Moon },
    { label: "Exercise Plans", icon: Dumbbell },
  ]},
  { section: "SUPPORT", items: [
    { label: "Crisis Helpline", icon: Phone },
    { label: "Settings", icon: Settings, active: true },
  ]},
];

const settingsTabs = [
  { label: "Profile", icon: User },
  { label: "Notifications", icon: Bell },
  { label: "Privacy & Security", icon: ShieldCheck },
  { label: "Appearance", icon: Palette },
];

const departments = ["Student Welfare", "Mental Health", "Academic Support", "Health Services"];
const roles = ["Head Counsellor", "Counsellor", "Admin", "Supervisor"];
const campuses = ["Main Campus, Bangalore", "North Campus, Delhi", "East Campus, Mumbai", "South Campus, Chennai"];

function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div style={{
        position: "absolute", top: "-80px", right: "-80px",
        width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", left: "15%",
        width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
      }} />
      <div style={{
        position: "absolute", top: "40%", right: "10%",
        width: "200px", height: "200px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)",
      }} />
      {/* Leaf decorations */}
      <svg style={{ position: "absolute", bottom: "5%", right: "5%", opacity: 0.04 }} width="180" height="180" viewBox="0 0 180 180">
        <ellipse cx="90" cy="90" rx="80" ry="40" fill="#7c3aed" transform="rotate(-30 90 90)" />
        <ellipse cx="90" cy="90" rx="80" ry="40" fill="#7c3aed" transform="rotate(30 90 90)" />
      </svg>
      <svg style={{ position: "absolute", top: "15%", left: "20%", opacity: 0.035 }} width="120" height="120" viewBox="0 0 120 120">
        <ellipse cx="60" cy="60" rx="55" ry="25" fill="#8b5cf6" transform="rotate(-45 60 60)" />
        <ellipse cx="60" cy="60" rx="55" ry="25" fill="#8b5cf6" transform="rotate(45 60 60)" />
      </svg>
    </div>
  );
}

function Sidebar({ mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside style={{
        width: "220px", minWidth: "220px",
        background: "#fff",
        borderRight: "1px solid #f0eeff",
        display: "flex", flexDirection: "column",
        padding: "0",
        zIndex: 30,
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        transform: mobileOpen ? "translateX(0)" : undefined,
        transition: "transform 0.3s ease",
        boxShadow: "2px 0 16px rgba(124,58,237,0.06)"
      }}
      className={`${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid #f3f0ff", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Heart size={18} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "15px", color: "#2d1b69", letterSpacing: "-0.3px" }}>Arogyam</div>
            <div style={{ fontSize: "11px", color: "#9b8ec4" }}>Student Wellness</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "12px 12px" }}>
          {sidebarLinks.map(group => (
            <div key={group.section} style={{ marginBottom: "8px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#b0a3d4", letterSpacing: "0.8px", padding: "8px 8px 4px", textTransform: "uppercase" }}>
                {group.section}
              </div>
              {group.items.map(item => (
                <button key={item.label} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  width: "100%", padding: "9px 10px", borderRadius: "9px",
                  border: "none", cursor: "pointer", textAlign: "left",
                  background: item.active ? "linear-gradient(135deg, #7c3aed15, #a78bfa15)" : "transparent",
                  color: item.active ? "#7c3aed" : "#6b7280",
                  fontWeight: item.active ? 600 : 500,
                  fontSize: "13.5px",
                  transition: "all 0.15s",
                  marginBottom: "1px",
                  borderLeft: item.active ? "3px solid #7c3aed" : "3px solid transparent"
                }}>
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #f3f0ff" }}>
          <button style={{
            display: "flex", alignItems: "center", gap: "8px",
            color: "#ef4444", fontSize: "13.5px", fontWeight: 500,
            background: "none", border: "none", cursor: "pointer"
          }}>
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}



function SettingsSidebar({ activeTab, setActiveTab }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: "16px",
      padding: "8px",
      boxShadow: "0 2px 16px rgba(124,58,237,0.07)",
      border: "1px solid #f0eeff",
      minWidth: "200px",
      height: "fit-content"
    }}>
      <div style={{ padding: "12px 14px 8px", borderBottom: "1px solid #f3f0ff", marginBottom: "6px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#b0a3d4", letterSpacing: "0.8px", textTransform: "uppercase" }}>
          Preferences
        </div>
      </div>
      {settingsTabs.map(tab => (
        <button
          key={tab.label}
          onClick={() => setActiveTab(tab.label)}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            width: "100%", padding: "11px 14px", borderRadius: "10px",
            border: "none", cursor: "pointer", textAlign: "left",
            background: activeTab === tab.label ? "linear-gradient(135deg, #7c3aed, #8b5cf6)" : "transparent",
            color: activeTab === tab.label ? "#fff" : "#6b7280",
            fontWeight: activeTab === tab.label ? 600 : 500,
            fontSize: "13.5px",
            transition: "all 0.2s",
            marginBottom: "2px",
            boxShadow: activeTab === tab.label ? "0 4px 12px rgba(124,58,237,0.25)" : "none"
          }}
        >
          <tab.icon size={16} />
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function InputField({ label, value, onChange, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#6b5ea8" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding: "10px 14px",
          borderRadius: "10px",
          border: `1.5px solid ${focused ? "#7c3aed" : "#e9e4ff"}`,
          background: focused ? "#faf8ff" : "#f8f6ff",
          fontSize: "13.5px",
          color: "#2d1b69",
          outline: "none",
          transition: "all 0.2s",
          boxShadow: focused ? "0 0 0 3px rgba(124,58,237,0.08)" : "none"
        }}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#6b5ea8" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: "10px 36px 10px 14px",
            borderRadius: "10px",
            border: `1.5px solid ${focused ? "#7c3aed" : "#e9e4ff"}`,
            background: focused ? "#faf8ff" : "#f8f6ff",
            fontSize: "13.5px",
            color: "#2d1b69",
            outline: "none",
            appearance: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: focused ? "0 0 0 3px rgba(124,58,237,0.08)" : "none"
          }}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={15} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#9b8ec4", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

function ProfileSettingsCard() {
  const [form, setForm] = useState({
    name: "Dr. Meera Iyer",
    email: "meera.iyer@university.edu",
    phone: "+91 98765 43210",
    department: "Student Welfare",
    role: "Head Counsellor",
    campus: "Main Campus, Bangalore",
  });
  const [saved, setSaved] = useState(false);

  const set = key => val => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    console.log("Updated profile:", form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: "18px",
      boxShadow: "0 4px 24px rgba(124,58,237,0.09)",
      border: "1px solid #f0eeff",
      overflow: "hidden",
      flex: 1
    }}>
      {/* Card Header */}
      <div style={{
        padding: "22px 28px 18px",
        borderBottom: "1px solid #f3f0ff",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div>
          <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#2d1b69", margin: 0 }}>Profile Settings</h2>
          <p style={{ fontSize: "13px", color: "#9b8ec4", margin: "3px 0 0" }}>Update your personal and professional information</p>
        </div>
        <div style={{
          padding: "6px 12px", borderRadius: "8px",
          background: "#f3f0ff", display: "flex", alignItems: "center", gap: "6px"
        }}>
          <Sparkles size={13} color="#7c3aed" />
          <span style={{ fontSize: "12px", color: "#7c3aed", fontWeight: 600 }}>Admin</span>
        </div>
      </div>

      {/* Avatar Row */}
      <div style={{
        padding: "24px 28px",
        borderBottom: "1px solid #f8f5ff",
        display: "flex", alignItems: "center", gap: "20px"
      }}>
        <div style={{ position: "relative" }}>
          <div style={{
            width: "76px", height: "76px", borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "26px", fontWeight: 700, color: "#fff",
            boxShadow: "0 4px 16px rgba(124,58,237,0.3)"
          }}>
            MI
          </div>
          <button style={{
            position: "absolute", bottom: "0", right: "0",
            width: "26px", height: "26px", borderRadius: "50%",
            background: "#7c3aed", border: "2px solid #fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer"
          }}>
            <Camera size={12} color="#fff" />
          </button>
        </div>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#2d1b69" }}>{form.name}</div>
          <div style={{ fontSize: "13px", color: "#9b8ec4", marginTop: "3px" }}>Head Counsellor – Arogyam Admin</div>
          <button style={{
            marginTop: "6px", fontSize: "12.5px", fontWeight: 600,
            color: "#7c3aed", background: "none", border: "none",
            cursor: "pointer", padding: 0, textDecoration: "underline",
            textUnderlineOffset: "2px"
          }}>
            Change Photo
          </button>
        </div>
      </div>

      {/* Form */}
      <div style={{ padding: "24px 28px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px"
        }}>
          <InputField label="Full Name" value={form.name} onChange={set("name")} />
          <InputField label="Email" value={form.email} onChange={set("email")} type="email" />
          <InputField label="Phone" value={form.phone} onChange={set("phone")} />
          <SelectField label="Role" value={form.role} onChange={set("role")} options={roles} />
          <SelectField label="Department" value={form.department} onChange={set("department")} options={departments} />
          <SelectField label="Campus" value={form.campus} onChange={set("campus")} options={campuses} />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "16px 28px 22px",
        display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px"
      }}>
        {saved && (
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            color: "#10b981", fontSize: "13px", fontWeight: 600,
            animation: "fadeIn 0.3s ease"
          }}>
            <CheckCircle2 size={16} />
            Changes saved!
          </div>
        )}
        <button
          onClick={handleSave}
          style={{
            padding: "11px 26px",
            borderRadius: "11px",
            background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
            color: "#fff", border: "none", cursor: "pointer",
            fontSize: "13.5px", fontWeight: 700,
            display: "flex", alignItems: "center", gap: "8px",
            boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
            transition: "all 0.2s",
            letterSpacing: "0.2px"
          }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 20px rgba(124,58,237,0.45)"; }}
          onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 16px rgba(124,58,237,0.35)"; }}
        >
          <Save size={15} />
          Save Changes
        </button>
      </div>
    </div>
  );
}

/* ─── Reusable UI Pieces ─── */
function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ padding: "22px 28px 18px", borderBottom: "1px solid #f3f0ff" }}>
      <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#2d1b69", margin: 0 }}>{title}</h2>
      <p style={{ fontSize: "13px", color: "#9b8ec4", margin: "3px 0 0" }}>{subtitle}</p>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: "44px", height: "24px", borderRadius: "12px",
        background: checked ? "linear-gradient(135deg, #7c3aed, #8b5cf6)" : "#e5e7eb",
        border: "none", cursor: "pointer", position: "relative",
        transition: "background 0.25s", flexShrink: 0,
        boxShadow: checked ? "0 2px 8px rgba(124,58,237,0.3)" : "none"
      }}
    >
      <span style={{
        position: "absolute", top: "3px",
        left: checked ? "23px" : "3px",
        width: "18px", height: "18px", borderRadius: "50%",
        background: "#fff", transition: "left 0.25s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.18)"
      }} />
    </button>
  );
}

function ToggleRow({ icon: Icon, iconBg, label, description, checked, onChange }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 0", borderBottom: "1px solid #f8f5ff", gap: "16px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1 }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "10px",
          background: iconBg || "#f3f0ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <Icon size={17} color="#7c3aed" />
        </div>
        <div>
          <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#2d1b69" }}>{label}</div>
          <div style={{ fontSize: "12px", color: "#9b8ec4", marginTop: "1px" }}>{description}</div>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function SaveBar({ onSave, saved }) {
  return (
    <div style={{ padding: "16px 28px 22px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px" }}>
      {saved && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#10b981", fontSize: "13px", fontWeight: 600, animation: "fadeIn 0.3s ease" }}>
          <CheckCircle2 size={16} /> Saved!
        </div>
      )}
      <button onClick={onSave} style={{
        padding: "11px 26px", borderRadius: "11px",
        background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
        color: "#fff", border: "none", cursor: "pointer",
        fontSize: "13.5px", fontWeight: 700,
        display: "flex", alignItems: "center", gap: "8px",
        boxShadow: "0 4px 16px rgba(124,58,237,0.35)", transition: "all 0.2s"
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,58,237,0.45)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.35)"; }}
      >
        <Save size={15} /> Save Changes
      </button>
    </div>
  );
}

/* ─── NOTIFICATIONS CARD ─── */
function NotificationsCard() {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    emailAppt: true, emailCounselling: true, emailWeekly: false,
    pushMood: true, pushReminders: true, pushCrisis: true, pushUpdates: false,
    smsAppt: false, smsSession: true,
    inAppChat: true, inAppAchievements: true, inAppForum: false,
    doNotDisturb: false, quietHours: true,
  });
  const set = key => val => setPrefs(p => ({ ...p, [key]: val }));
  const handleSave = () => { console.log(prefs); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div style={{ background: "#fff", borderRadius: "18px", boxShadow: "0 4px 24px rgba(124,58,237,0.09)", border: "1px solid #f0eeff", flex: 1 }}>
      <SectionHeader title="Notification Preferences" subtitle="Control how and when Arogyam notifies you" />

      <div style={{ padding: "8px 28px" }}>
        {/* Email */}
        <div style={{ marginTop: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Mail size={15} color="#7c3aed" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.7px" }}>Email Notifications</span>
          </div>
          <ToggleRow icon={Calendar} iconBg="#f0fdf4" label="Appointment Confirmations" description="Receive email when a session is booked or cancelled" checked={prefs.emailAppt} onChange={set("emailAppt")} />
          <ToggleRow icon={MessageSquare} iconBg="#faf5ff" label="Counselling Reminders" description="Email reminders 24 hrs before your session" checked={prefs.emailCounselling} onChange={set("emailCounselling")} />
          <ToggleRow icon={Activity} iconBg="#fff7ed" label="Weekly Wellness Report" description="Get a summary of your mood, sleep & stress trends" checked={prefs.emailWeekly} onChange={set("emailWeekly")} />
        </div>

        {/* Push */}
        <div style={{ marginTop: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <BellRing size={15} color="#7c3aed" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.7px" }}>Push Notifications</span>
          </div>
          <ToggleRow icon={Heart} iconBg="#fff1f2" label="Daily Mood Check-in" description="Gentle nudge to log your mood every morning" checked={prefs.pushMood} onChange={set("pushMood")} />
          <ToggleRow icon={Clock} iconBg="#f0f9ff" label="Exercise & Sleep Reminders" description="Wellness habit reminders based on your schedule" checked={prefs.pushReminders} onChange={set("pushReminders")} />
          <ToggleRow icon={AlertCircle} iconBg="#fff1f2" label="Crisis Alert Broadcasts" description="Important alerts from the crisis helpline team" checked={prefs.pushCrisis} onChange={set("pushCrisis")} />
          <ToggleRow icon={RefreshCw} iconBg="#f5f3ff" label="Platform Updates" description="New features, resources and announcements" checked={prefs.pushUpdates} onChange={set("pushUpdates")} />
        </div>

        {/* SMS */}
        <div style={{ marginTop: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Smartphone size={15} color="#7c3aed" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.7px" }}>SMS Notifications</span>
          </div>
          <ToggleRow icon={Calendar} iconBg="#f0fdf4" label="Appointment SMS" description="Text message confirmation for booked appointments" checked={prefs.smsAppt} onChange={set("smsAppt")} />
          <ToggleRow icon={Bell} iconBg="#faf5ff" label="Session Start Alert" description="SMS 30 mins before your counselling session" checked={prefs.smsSession} onChange={set("smsSession")} />
        </div>

        {/* In-App */}
        <div style={{ marginTop: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Monitor size={15} color="#7c3aed" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.7px" }}>In-App Notifications</span>
          </div>
          <ToggleRow icon={MessageSquare} iconBg="#f0f9ff" label="AI Chat Responses" description="Notify when AI assistant replies to your message" checked={prefs.inAppChat} onChange={set("inAppChat")} />
          <ToggleRow icon={Star} iconBg="#fffbeb" label="Streak & Achievements" description="Celebrate milestones and wellness streaks" checked={prefs.inAppAchievements} onChange={set("inAppAchievements")} />
          <ToggleRow icon={Users} iconBg="#f0fdf4" label="Community Forum Replies" description="Notifications for replies on your forum posts" checked={prefs.inAppForum} onChange={set("inAppForum")} />
        </div>

        {/* Quiet Hours */}
        <div style={{ marginTop: "22px", padding: "16px", borderRadius: "12px", background: "linear-gradient(135deg, #faf8ff, #f3f0ff)", border: "1px solid #e9e4ff", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <BellOff size={16} color="#7c3aed" />
              <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#2d1b69" }}>Do Not Disturb</span>
            </div>
            <Toggle checked={prefs.doNotDisturb} onChange={set("doNotDisturb")} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#4b3f8c" }}>Quiet Hours</div>
              <div style={{ fontSize: "12px", color: "#9b8ec4" }}>Silence all notifications between 10 PM – 7 AM</div>
            </div>
            <Toggle checked={prefs.quietHours} onChange={set("quietHours")} />
          </div>
        </div>
      </div>

      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}

/* ─── PRIVACY & SECURITY CARD ─── */
function PrivacySecurityCard() {
  const [saved, setSaved] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pass, setPass] = useState({ current: "", newPass: "", confirm: "" });
  const [privacy, setPrivacy] = useState({
    twoFactor: true, sessionAlerts: true,
    profileVisible: true, shareProgress: false, anonymousMode: false,
    dataCollection: true, crashReports: true,
  });
  const setP = key => val => setPrivacy(p => ({ ...p, [key]: val }));
  const handleSave = () => { console.log({ pass, privacy }); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const sessions = [
    { device: "Chrome on Windows", location: "Bangalore, IN", time: "Active now", current: true },
    { device: "Safari on iPhone", location: "Bangalore, IN", time: "2 hours ago", current: false },
    { device: "Firefox on MacOS", location: "Mumbai, IN", time: "Yesterday, 11:30 PM", current: false },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: "18px", boxShadow: "0 4px 24px rgba(124,58,237,0.09)", border: "1px solid #f0eeff", flex: 1 }}>
      <SectionHeader title="Privacy & Security" subtitle="Manage your account security and data privacy settings" />

      <div style={{ padding: "8px 28px" }}>

        {/* Change Password */}
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <Key size={15} color="#7c3aed" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.7px" }}>Change Password</span>
          </div>
          <div style={{ display: "grid", gap: "14px" }}>
            {[
              { label: "Current Password", key: "current", show: showPass, toggle: () => setShowPass(v => !v) },
              { label: "New Password", key: "newPass", show: showNew, toggle: () => setShowNew(v => !v) },
              { label: "Confirm New Password", key: "confirm", show: showNew, toggle: () => setShowNew(v => !v) },
            ].map(({ label, key, show, toggle }) => (
              <div key={key}>
                <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#6b5ea8", display: "block", marginBottom: "6px" }}>{label}</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={show ? "text" : "password"}
                    value={pass[key]}
                    onChange={e => setPass(p => ({ ...p, [key]: e.target.value }))}
                    placeholder="••••••••"
                    style={{
                      width: "100%", padding: "10px 42px 10px 14px", borderRadius: "10px",
                      border: "1.5px solid #e9e4ff", background: "#f8f6ff",
                      fontSize: "13.5px", color: "#2d1b69", outline: "none"
                    }}
                    onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.08)"; }}
                    onBlur={e => { e.target.style.borderColor = "#e9e4ff"; e.target.style.boxShadow = "none"; }}
                  />
                  <button onClick={toggle} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9b8ec4" }}>
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2FA & Sessions */}
        <div style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Shield size={15} color="#7c3aed" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.7px" }}>Authentication</span>
          </div>
          <ToggleRow icon={Fingerprint} iconBg="#f3f0ff" label="Two-Factor Authentication" description="Add an extra layer of security via OTP or authenticator app" checked={privacy.twoFactor} onChange={setP("twoFactor")} />
          <ToggleRow icon={LogIn} iconBg="#fff7ed" label="Login Activity Alerts" description="Get notified of any new sign-in to your account" checked={privacy.sessionAlerts} onChange={setP("sessionAlerts")} />
        </div>

        {/* Active Sessions */}
        <div style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Laptop size={15} color="#7c3aed" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.7px" }}>Active Sessions</span>
          </div>
          {sessions.map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 14px", borderRadius: "12px", marginBottom: "8px",
              background: s.current ? "linear-gradient(135deg, #faf8ff, #f3f0ff)" : "#fafafa",
              border: `1px solid ${s.current ? "#e9e4ff" : "#f0f0f0"}`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: s.current ? "#ede9fe" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Laptop size={16} color={s.current ? "#7c3aed" : "#9ca3af"} />
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#2d1b69" }}>{s.device}</div>
                  <div style={{ fontSize: "11.5px", color: "#9b8ec4" }}>{s.location} · {s.time}</div>
                </div>
              </div>
              {s.current
                ? <span style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", background: "#d1fae5", padding: "3px 10px", borderRadius: "20px" }}>Current</span>
                : <button style={{ fontSize: "12px", color: "#ef4444", fontWeight: 600, background: "#fff1f2", border: "none", borderRadius: "7px", padding: "5px 12px", cursor: "pointer" }}>Revoke</button>
              }
            </div>
          ))}
        </div>

        {/* Privacy Controls */}
        <div style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Globe size={15} color="#7c3aed" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.7px" }}>Privacy Controls</span>
          </div>
          <ToggleRow icon={User} iconBg="#f0f9ff" label="Public Profile Visibility" description="Allow other students to view your profile in the community" checked={privacy.profileVisible} onChange={setP("profileVisible")} />
          <ToggleRow icon={Activity} iconBg="#f0fdf4" label="Share Wellness Progress" description="Share anonymised progress with your counsellor dashboard" checked={privacy.shareProgress} onChange={setP("shareProgress")} />
          <ToggleRow icon={ShieldCheck} iconBg="#faf5ff" label="Anonymous Mode" description="Hide your identity in Community Forum posts" checked={privacy.anonymousMode} onChange={setP("anonymousMode")} />
        </div>

        {/* Data */}
        <div style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Download size={15} color="#7c3aed" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.7px" }}>Data Management</span>
          </div>
          <ToggleRow icon={Activity} iconBg="#fff7ed" label="Usage Data Collection" description="Help improve Arogyam by sharing anonymised usage analytics" checked={privacy.dataCollection} onChange={setP("dataCollection")} />
          <ToggleRow icon={AlertCircle} iconBg="#fef2f2" label="Crash & Error Reports" description="Automatically send crash reports to help fix bugs faster" checked={privacy.crashReports} onChange={setP("crashReports")} />
          <div style={{ display: "flex", gap: "10px", marginTop: "14px", marginBottom: "4px" }}>
            <button style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1.5px solid #e9e4ff", background: "#faf8ff", color: "#7c3aed", fontWeight: 600, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
              <Download size={14} /> Export My Data
            </button>
            <button style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1.5px solid #fee2e2", background: "#fff5f5", color: "#ef4444", fontWeight: 600, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
              <Trash2 size={14} /> Delete Account
            </button>
          </div>
        </div>
      </div>

      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}

/* ─── APPEARANCE CARD ─── */
function AppearanceCard() {
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState("light");
  const [accent, setAccent] = useState("#7c3aed");
  const [fontSize, setFontSize] = useState("medium");
  const [density, setDensity] = useState("comfortable");
  const [sidebarStyle, setSidebarStyle] = useState("expanded");
  const [animations, setAnimations] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState("English");

  const handleSave = () => {
    console.log({ theme, accent, fontSize, density, sidebarStyle, animations, highContrast, language });
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const accents = ["#7c3aed", "#2563eb", "#059669", "#d97706", "#db2777", "#0891b2"];
  const accentNames = { "#7c3aed": "Arogyam Purple", "#2563eb": "Ocean Blue", "#059669": "Forest Green", "#d97706": "Warm Amber", "#db2777": "Rose Pink", "#0891b2": "Teal" };

  return (
    <div style={{ background: "#fff", borderRadius: "18px", boxShadow: "0 4px 24px rgba(124,58,237,0.09)", border: "1px solid #f0eeff", flex: 1 }}>
      <SectionHeader title="Appearance" subtitle="Personalise the look and feel of your Arogyam dashboard" />

      <div style={{ padding: "8px 28px" }}>

        {/* Theme */}
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <Sun size={15} color="#7c3aed" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.7px" }}>Theme Mode</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {[
              { id: "light", label: "Light", icon: Sun, preview: ["#ffffff", "#f7f5ff", "#7c3aed"] },
              { id: "dark", label: "Dark", icon: Moon, preview: ["#1e1b4b", "#312e81", "#a78bfa"] },
              { id: "system", label: "System", icon: Monitor, preview: ["#ffffff", "#1e1b4b", "#7c3aed"] },
            ].map(t => (
              <button key={t.id} onClick={() => setTheme(t.id)} style={{
                padding: "14px 10px", borderRadius: "12px",
                border: `2px solid ${theme === t.id ? "#7c3aed" : "#e9e4ff"}`,
                background: theme === t.id ? "linear-gradient(135deg, #faf8ff, #f3f0ff)" : "#fafafa",
                cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                boxShadow: theme === t.id ? "0 2px 12px rgba(124,58,237,0.15)" : "none",
                transition: "all 0.2s"
              }}>
                <div style={{ display: "flex", gap: "3px" }}>
                  {t.preview.map((c, i) => <div key={i} style={{ width: "12px", height: "12px", borderRadius: "3px", background: c }} />)}
                </div>
                <t.icon size={16} color={theme === t.id ? "#7c3aed" : "#9b8ec4"} />
                <span style={{ fontSize: "12.5px", fontWeight: theme === t.id ? 700 : 500, color: theme === t.id ? "#7c3aed" : "#6b7280" }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accent Colour */}
        <div style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <Palette size={15} color="#7c3aed" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.7px" }}>Accent Colour</span>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            {accents.map(c => (
              <button key={c} onClick={() => setAccent(c)} title={accentNames[c]} style={{
                width: "34px", height: "34px", borderRadius: "50%", background: c,
                border: `3px solid ${accent === c ? "#fff" : "transparent"}`,
                boxShadow: accent === c ? `0 0 0 2px ${c}, 0 2px 8px ${c}55` : "0 1px 4px rgba(0,0,0,0.12)",
                cursor: "pointer", transition: "all 0.2s"
              }} />
            ))}
          </div>
          <div style={{ marginTop: "8px", fontSize: "12.5px", color: "#9b8ec4" }}>
            Selected: <span style={{ color: accent, fontWeight: 700 }}>{accentNames[accent]}</span>
          </div>
        </div>

        {/* Font Size */}
        <div style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <Type size={15} color="#7c3aed" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.7px" }}>Font Size</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {["small", "medium", "large"].map(s => (
              <button key={s} onClick={() => setFontSize(s)} style={{
                flex: 1, padding: "10px", borderRadius: "10px",
                border: `2px solid ${fontSize === s ? "#7c3aed" : "#e9e4ff"}`,
                background: fontSize === s ? "#f3f0ff" : "#fafafa",
                color: fontSize === s ? "#7c3aed" : "#6b7280",
                fontWeight: fontSize === s ? 700 : 500,
                fontSize: s === "small" ? "12px" : s === "medium" ? "13.5px" : "15px",
                cursor: "pointer", transition: "all 0.2s",
                textTransform: "capitalize"
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Layout Density */}
        <div style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <LayoutGrid size={15} color="#7c3aed" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.7px" }}>Layout Density</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { id: "compact", label: "Compact", desc: "Denser UI" },
              { id: "comfortable", label: "Comfortable", desc: "Balanced" },
              { id: "spacious", label: "Spacious", desc: "Airy layout" },
            ].map(d => (
              <button key={d.id} onClick={() => setDensity(d.id)} style={{
                flex: 1, padding: "10px 6px", borderRadius: "10px",
                border: `2px solid ${density === d.id ? "#7c3aed" : "#e9e4ff"}`,
                background: density === d.id ? "#f3f0ff" : "#fafafa",
                color: density === d.id ? "#7c3aed" : "#6b7280",
                fontWeight: density === d.id ? 700 : 500,
                fontSize: "12.5px", cursor: "pointer", transition: "all 0.2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "2px"
              }}>
                <span>{d.label}</span>
                <span style={{ fontSize: "11px", opacity: 0.7 }}>{d.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar style */}
        <div style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <Sliders size={15} color="#7c3aed" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.7px" }}>Sidebar Style</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {["expanded", "collapsed", "floating"].map(s => (
              <button key={s} onClick={() => setSidebarStyle(s)} style={{
                flex: 1, padding: "10px", borderRadius: "10px",
                border: `2px solid ${sidebarStyle === s ? "#7c3aed" : "#e9e4ff"}`,
                background: sidebarStyle === s ? "#f3f0ff" : "#fafafa",
                color: sidebarStyle === s ? "#7c3aed" : "#6b7280",
                fontWeight: sidebarStyle === s ? 700 : 500, fontSize: "12.5px",
                cursor: "pointer", transition: "all 0.2s", textTransform: "capitalize"
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Accessibility */}
        <div style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Contrast size={15} color="#7c3aed" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.7px" }}>Accessibility</span>
          </div>
          <ToggleRow icon={Sparkles} iconBg="#faf5ff" label="UI Animations & Transitions" description="Enable smooth animations throughout the dashboard" checked={animations} onChange={setAnimations} />
          <ToggleRow icon={Contrast} iconBg="#f5f3ff" label="High Contrast Mode" description="Increase contrast for better readability" checked={highContrast} onChange={setHighContrast} />
        </div>

        {/* Language */}
        <div style={{ marginTop: "24px", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <Globe size={15} color="#7c3aed" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.7px" }}>Language & Region</span>
          </div>
          <div style={{ position: "relative" }}>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={{
              width: "100%", padding: "10px 36px 10px 14px", borderRadius: "10px",
              border: "1.5px solid #e9e4ff", background: "#f8f6ff",
              fontSize: "13.5px", color: "#2d1b69", outline: "none", appearance: "none", cursor: "pointer"
            }}
              onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.08)"; }}
              onBlur={e => { e.target.style.borderColor = "#e9e4ff"; e.target.style.boxShadow = "none"; }}
            >
              {["English", "Hindi", "Kannada", "Tamil", "Telugu", "Marathi", "Bengali"].map(l => <option key={l}>{l}</option>)}
            </select>
            <ChevronDown size={15} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#9b8ec4", pointerEvents: "none" }} />
          </div>
        </div>
      </div>

      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f5ff", fontFamily: "'DM Sans', 'Nunito', sans-serif", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .lg\\:hidden { display: flex !important; }
        .lg\\:translate-x-0 { transform: translateX(0) !important; }
        @media (min-width: 1024px) {
          .lg\\:hidden { display: none !important; }
          .lg\\:translate-x-0 { transform: translateX(0) !important; }
        }
        select option { background: white; color: #2d1b69; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #d4c9ff; border-radius: 4px; }
      `}</style>

      <BackgroundBlobs />
      {/* <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} /> */}

      {/* Main area */}
      <div style={{ flex: 1, marginLeft: "220px", display: "flex", flexDirection: "column", position: "relative", zIndex: 1, minHeight: "100vh" }}
        className="main-area"
      >
        <style>{`
          @media (max-width: 1023px) { .main-area { margin-left: 0 !important; } }
        `}</style>

        {/* <Header setMobileOpen={setMobileOpen} /> */}

        <main style={{ flex: 1, padding: "28px 28px 40px", maxWidth: "1100px", width: "100%" }}>
          {/* Page Title */}
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#2d1b69", letterSpacing: "-0.5px" }}>Settings</h1>
            <p style={{ fontSize: "13.5px", color: "#9b8ec4", marginTop: "4px" }}>Manage your account and application preferences</p>
          </div>

          {/* Content */}
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === "Profile" && <ProfileSettingsCard />}
            {activeTab === "Notifications" && <NotificationsCard />}
            {activeTab === "Privacy & Security" && <PrivacySecurityCard />}
            {activeTab === "Appearance" && <AppearanceCard />}
          </div>
        </main>
      </div>
    </div>
  );
}
