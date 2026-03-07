import { DashboardLayout } from "../componentsAdmin/DashboardLayout";
import { PageHeader } from "../componentsAdmin/PageHeader";
import { User, Bell, Shield, Palette, Globe, Lock, Mail, Phone, Save, ChevronRight, ToggleRight } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Settings" subtitle="Manage your account and application preferences" />

      <div className="grid grid-cols-4 gap-5">
        {/* Sidebar Tabs */}
        <div className="glass-card p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="col-span-3 glass-card p-6">
          {activeTab === "profile" && (
            <div>
              <h2 className="text-lg font-bold text-foreground mb-5">Profile Settings</h2>
              <div className="flex items-center gap-5 mb-6 p-4 rounded-xl bg-white/50">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="Admin" className="w-16 h-16 rounded-full border-2 border-primary/20" />
                <div>
                  <p className="font-semibold text-foreground">Dr. Meera Iyer</p>
                  <p className="text-sm text-muted-foreground">Head Counsellor · Arogyam Admin</p>
                  <button className="text-xs text-primary font-semibold mt-1">Change Photo</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Full Name", value: "Dr. Meera Iyer", icon: User },
                  { label: "Email", value: "meera.iyer@university.edu", icon: Mail },
                  { label: "Phone", value: "+91 98765 43210", icon: Phone },
                  { label: "Role", value: "Head Counsellor", icon: Shield },
                  { label: "Department", value: "Student Welfare", icon: Globe },
                  { label: "Campus", value: "Main Campus, Bangalore", icon: Globe },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">{field.label}</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/70 border border-border">
                      <field.icon className="w-4 h-4 text-muted-foreground" />
                      <input type="text" defaultValue={field.value} className="bg-transparent text-sm text-foreground w-full outline-none" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h2 className="text-lg font-bold text-foreground mb-5">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { title: "High-Risk Student Alerts", desc: "Get notified when a student is flagged as high risk", enabled: true },
                  { title: "Appointment Reminders", desc: "Receive reminders before counselling sessions", enabled: true },
                  { title: "Weekly Analytics Report", desc: "Summary of campus mental health trends", enabled: false },
                  { title: "Peer Mentor Activity", desc: "Updates on peer support group sessions", enabled: true },
                  { title: "New Resource Uploads", desc: "When new wellness resources are added", enabled: false },
                  { title: "System Maintenance", desc: "Scheduled downtime and updates", enabled: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/50">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <div className={`w-11 h-6 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${item.enabled ? "bg-primary justify-end" : "bg-muted justify-start"}`}>
                      <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div>
              <h2 className="text-lg font-bold text-foreground mb-5">Privacy & Security</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2"><Lock className="w-4 h-4" /> Change Password</p>
                      <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
                    </div>
                    <button className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium">Update</button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/50">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2"><Shield className="w-4 h-4" /> Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground mb-3">Add an extra layer of security to your account</p>
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-[hsl(var(--arogyam-green))] text-white font-medium">Enable 2FA</button>
                </div>
                <div className="p-4 rounded-xl bg-white/50">
                  <p className="text-sm font-semibold text-foreground mb-2">Active Sessions</p>
                  {[
                    { device: "Chrome on MacBook Pro", location: "Bangalore, IN", time: "Current session" },
                    { device: "Safari on iPhone 15", location: "Bangalore, IN", time: "2 hrs ago" },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div>
                        <p className="text-xs font-medium text-foreground">{session.device}</p>
                        <p className="text-xs text-muted-foreground">{session.location} · {session.time}</p>
                      </div>
                      {i > 0 && <button className="text-xs text-destructive font-medium">Revoke</button>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div>
              <h2 className="text-lg font-bold text-foreground mb-5">Appearance</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">Theme</p>
                  <div className="flex gap-3">
                    {[
                      { label: "Light", bg: "bg-white border-primary", active: true },
                      { label: "Dark", bg: "bg-gray-800", active: false },
                      { label: "System", bg: "bg-gradient-to-br from-white to-gray-800", active: false },
                    ].map((theme) => (
                      <div key={theme.label} className={`flex flex-col items-center gap-2 cursor-pointer`}>
                        <div className={`w-16 h-12 rounded-xl border-2 ${theme.active ? "border-primary" : "border-border"} ${theme.bg}`} />
                        <span className={`text-xs font-medium ${theme.active ? "text-primary" : "text-muted-foreground"}`}>{theme.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">Accent Color</p>
                  <div className="flex gap-3">
                    {[
                      { color: "bg-[hsl(var(--primary))]", active: true },
                      { color: "bg-[hsl(var(--arogyam-teal))]", active: false },
                      { color: "bg-[hsl(var(--arogyam-purple))]", active: false },
                      { color: "bg-[hsl(var(--arogyam-coral))]", active: false },
                    ].map((c, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full ${c.color} cursor-pointer ${c.active ? "ring-2 ring-offset-2 ring-primary" : ""}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">Language</p>
                  <select className="px-3 py-2 rounded-xl bg-white/70 border border-border text-sm text-foreground outline-none w-48">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Kannada</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
