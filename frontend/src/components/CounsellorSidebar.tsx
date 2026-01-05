import { useState } from "react";
import { Home, Users, BookOpen, BarChart2, Calendar } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const counsellorItems = [
  { title: "Home", url: "/counsellor", icon: Home },
  { title: "Volunteer", url: "/counsellor/volunteer", icon: Users },
  { title: "Resources", url: "/counsellor/resources", icon: BookOpen },
  { title: "Student Progress", url: "/counsellor/student-progress", icon: BarChart2 },
  { title: "Appointments", url: "/appointments", icon: Calendar },
];

export function CounsellorSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) =>
    currentPath === path || (path !== "/" && currentPath.startsWith(path));

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium"
      : "text-muted-foreground hover:bg-primary/5 hover:text-primary";

  return (
    <Sidebar className={`${isCollapsed ? "w-20" : "w-64"} border-r border-border bg-card`} collapsible="icon">
      <SidebarContent className="p-4 flex flex-col">
        <div className="p-2">
          <div className={`flex ${isCollapsed ? "justify-center" : "items-center gap-3"}`}>
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-primary">Arogyam</h1>
                <p className="text-xs text-muted-foreground">Counsellor Portal</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{!isCollapsed ? "MAIN" : ""}</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className={`${isCollapsed ? "flex items-center" : "space-y-2"}`}>
              {counsellorItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/counsellor"}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                        ${getNavCls({ isActive })}
                      `}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
