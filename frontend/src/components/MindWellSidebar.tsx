import {
  Home,
  MessageCircle,
  Calendar,
  BookOpen,
  Users,
  GamepadIcon,
  Heart,
  Moon,
  Dumbbell,
  Phone,
  Star,
  Settings,
  Award,
  Sparkles,
  BrainCircuit
} from "lucide-react";
import { NavLink } from "react-router-dom";
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

const mainMenuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "AI Chatbot", url: "/chat", icon: MessageCircle },
  { title: "AI Support Model", url: "/ai-support-model", icon: Sparkles },
  { title: "ML Prediction", url: "/mental-health-prediction", icon: BrainCircuit },
  { title: "Book Appointment", url: "/appointments", icon: Calendar },
  { title: "Resource Hub", url: "/resources", icon: BookOpen },
  { title: "Community Forum", url: "/community", icon: Users },
];

const wellnessToolsItems = [
  { title: "Quizzes & Games", url: "/quizzes", icon: GamepadIcon },
  
  { title: "Mood Tracker", url: "/mood", icon: Heart },
  { title: "Sleep Tracker", url: "/sleep", icon: Moon },
  { title: "Exercise Plans", url: "/exercise", icon: Dumbbell },
  { title: "Rewards & redeem", url: "/rewards", icon: Award },
];

const supportItems = [
  { title: "Crisis Helpline", url: "/crisis", icon: Phone },

  { title: "Settings", url: "/setting", icon: Settings }
  
];

export function MindWellSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-[linear-gradient(135deg,_rgba(15,118,110,0.18),_rgba(14,165,233,0.22))] text-[#0e3a4d] border border-[#0ea5e9]/30 font-semibold shadow-[0_10px_22px_rgba(14,165,233,0.18)] ring-1 ring-[#0ea5e9]/25 before:scale-y-100 dark:bg-[linear-gradient(135deg,_rgba(14,165,233,0.24),_rgba(15,118,110,0.2))] dark:text-[#e0f7ff] dark:border-[#38bdf8]/40 dark:ring-[#38bdf8]/30 dark:shadow-[0_10px_22px_rgba(56,189,248,0.22)]"
      : "text-[#4f6d7f] hover:bg-[#0ea5e9]/10 hover:text-[#0f766e] before:scale-y-0 hover:before:scale-y-75 dark:text-[#9fb7c7] dark:hover:bg-[#38bdf8]/12 dark:hover:text-[#e0f7ff]";

  const getIconWrapCls = (active: boolean) =>
    active
      ? "bg-[linear-gradient(135deg,_#0f766e,_#0891b2)] text-white shadow-[0_8px_18px_rgba(14,165,233,0.35)]"
      : "bg-white/75 text-[#0f766e] ring-1 ring-[#0ea5e9]/18 group-hover:bg-[#0ea5e9]/15 group-hover:text-[#0f766e] dark:bg-white/10 dark:text-[#e0f7ff] dark:ring-white/10 dark:group-hover:bg-[#38bdf8]/20 dark:group-hover:text-white";

  const iconWrapSize = isCollapsed ? "h-11 w-11" : "h-10 w-10";
  const iconSizeClass = isCollapsed ? "h-6 w-6" : "h-5 w-5";
  const navLinkBaseCls = `group relative flex items-center gap-3 rounded-xl transition-all duration-200 before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:rounded-full before:bg-[#0f766e] before:transition-transform before:duration-200 before:origin-center ${
    isCollapsed ? "justify-center px-2 py-2 min-h-[48px]" : "px-3 py-2.5 min-h-[44px]"
  }`;

  return (
    <Sidebar
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } border-r border-[#0e7490]/20 bg-[linear-gradient(168deg,_#f0f9ff_0%,_#e8fbf6_48%,_#ecf6ff_100%)] shadow-[0_16px_30px_rgba(15,76,96,0.08)] dark:border-white/10 dark:bg-[linear-gradient(168deg,_#061a20_0%,_#07242c_48%,_#082232_100%)]`}
      collapsible="icon"
    >
      <SidebarContent className="p-4 flex flex-col">
        {/* Logo Section */}
        <div className="p-2">
          <div
            className={`flex ${
              isCollapsed ? "justify-center" : "items-center gap-3"
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-[linear-gradient(135deg,_#0f766e,_#0891b2,_#0ea5e9)] shadow-[0_8px_18px_rgba(14,165,233,0.3)] flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-[#0f766e]">Arogyam</h1>
                <p className="text-xs text-muted-foreground">
                  Student Wellness
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Menu */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {!isCollapsed ? "MAIN MENU" : ""}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu
              className={`${isCollapsed ? "flex flex-col items-center gap-2" : "space-y-2"}`}
            >
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) => `${navLinkBaseCls} ${getNavCls({ isActive })}`}
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`grid ${iconWrapSize} place-items-center rounded-xl transition-all duration-200 ${getIconWrapCls(isActive)}`}
                          >
                            <item.icon className={iconSizeClass} />
                          </span>
                          {!isCollapsed && (
                            <span className="font-medium">{item.title}</span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Wellness Tools */}
        <SidebarGroup className="">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {!isCollapsed ? "WELLNESS TOOLS" : ""}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu
              className={`${isCollapsed ? "flex flex-col items-center gap-2" : "space-y-2"}`}
            >
              {wellnessToolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => `${navLinkBaseCls} ${getNavCls({ isActive })}`}
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`grid ${iconWrapSize} place-items-center rounded-xl transition-all duration-200 ${getIconWrapCls(isActive)}`}
                          >
                            <item.icon className={iconSizeClass} />
                          </span>
                          {!isCollapsed && (
                            <span className="font-medium">{item.title}</span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support */}
        <SidebarGroup className="">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {!isCollapsed ? "SUPPORT" : ""}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu
              className={`${isCollapsed ? "flex flex-col items-center gap-2" : "space-y-2"}`}
            >
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => `${navLinkBaseCls} ${getNavCls({ isActive })}`}
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`grid ${iconWrapSize} place-items-center rounded-xl transition-all duration-200 ${getIconWrapCls(isActive)}`}
                          >
                            <item.icon className={iconSizeClass} />
                          </span>
                          {!isCollapsed && (
                            <span className="font-medium">{item.title}</span>
                          )}
                        </>
                      )}
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
