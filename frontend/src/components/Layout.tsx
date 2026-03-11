import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Search, User } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MindWellSidebar } from "@/components/MindWellSidebar";
import { CounsellorSidebar } from "@/components/CounsellorSidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import api from "@/config/api";

interface LayoutProps {
  children: React.ReactNode;
}

interface NotificationItem {
  _id?: string;
  id?: string;
  title?: string;
  message?: string;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);

  const fetchNotifications = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded: any = jwtDecode(token);
      const userId = decoded?.userId;
      if (!userId) return;

      localStorage.setItem("userName", decoded?.fullname || "User");
      localStorage.setItem("userEmail", decoded?.email || "");

      const res = await api.get(`/notifications/${userId}`);
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleDismissNotification = async (id?: string) => {
    if (!id) return;
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((notification) => (notification._id || notification.id) !== id));
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      // ignore logout API failures
    } finally {
      localStorage.removeItem("token");
      localStorage.clear();
      toast({ title: "Logged out", description: "You have been logged out." });
      navigate("/login");
    }
  };

  const path = location.pathname || "";
  const sidebar = path.startsWith("/counsellor")
    ? <CounsellorSidebar />
    : path.startsWith("/admin")
      ? <AdminSidebar />
      : <MindWellSidebar />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {sidebar}

        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-card border-b border-border px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <SidebarTrigger />
                <div className="hidden md:block">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search resources, articles..."
                      className="pl-10 pr-4 py-2 bg-muted rounded-lg border border-border w-52 lg:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <ThemeToggle />

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => setShowNotifications((current) => !current)}
                    aria-label="Show notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-primary text-[10px] text-white rounded-full flex items-center justify-center">
                        {notifications.length > 9 ? "9+" : notifications.length}
                      </span>
                    )}
                  </Button>

                  {showNotifications && (
                    <div
                      className="absolute right-0 mt-2 w-[92vw] sm:w-80 bg-white border border-gray-200 rounded-lg shadow-lg"
                      style={{ zIndex: 9999 }}
                    >
                      <div className="flex items-center justify-between px-4 py-2 border-b">
                        <span className="font-semibold text-lg">Notifications</span>
                        <button
                          className="text-gray-500 hover:text-gray-700 text-lg font-bold"
                          onClick={() => setShowNotifications(false)}
                          aria-label="Dismiss notifications"
                        >
                          x
                        </button>
                      </div>
                      <ul className="max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <li className="px-4 py-3 text-gray-500">No notifications</li>
                        ) : (
                          notifications.map((notification) => {
                            const id = notification._id || notification.id;
                            return (
                              <li
                                key={id}
                                className="px-4 py-3 border-b last:border-b-0 text-gray-700 flex justify-between items-start gap-3"
                              >
                                <span className="text-sm">{notification.message || notification.title || "Notification"}</span>
                                <button
                                  className="text-gray-400 hover:text-red-500 text-base font-bold"
                                  onClick={() => handleDismissNotification(id)}
                                  aria-label="Dismiss notification"
                                >
                                  x
                                </button>
                              </li>
                            );
                          })
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">
                      {localStorage.getItem("userName") || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {localStorage.getItem("userEmail") || "User"}
                    </p>
                  </div>
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="hidden sm:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
