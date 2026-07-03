import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useNotificationStore } from "@/shared/stores/notificationStore";
import { useAuthStore } from "@/shared/stores/authStore";
import { useCompanyStore } from "@/shared/stores/companyStore";
import {
  Menu, Search, Bell, Activity, Calendar, Shield, User, Settings,
  Zap, Keyboard, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface PlatformTopBarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export default function PlatformTopBar({ isCollapsed, setIsCollapsed }: PlatformTopBarProps) {
  const [location, setLocation] = useLocation();
  const { notifications, unreadCount, loadNotifications, markAsRead } = useNotificationStore();
  const { user } = useAuthStore();
  const { activeCompany } = useCompanyStore();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const getBreadcrumbs = () => {
    const parts = location.split("/").filter(Boolean);
    return parts.map((part, index) => {
      const href = "/" + parts.slice(0, index + 1).join("/");
      const label = part
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      return (
        <React.Fragment key={href}>
          <span className="text-muted-foreground mx-1.5">/</span>
          <Link href={href}>
            <span className="hover:text-foreground transition-colors cursor-pointer capitalize text-xs font-semibold">
              {label}
            </span>
          </Link>
        </React.Fragment>
      );
    });
  };

  return (
    <header className="h-14 border-b border-border bg-card/60 backdrop-blur-xl flex items-center px-6 justify-between shrink-0 z-40 relative">
      <div className="flex items-center gap-3">
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
        )}
        <div className="flex items-center text-xs font-bold text-foreground">
          <Link href="/app">
            <span className="hover:text-primary transition-colors cursor-pointer">RetailIQ</span>
          </Link>
          {getBreadcrumbs()}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Command Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-xl text-[11px] text-muted-foreground transition-colors border border-border/80 cursor-pointer"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search modules, datasets...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-background border border-border rounded-md text-[9px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Popover */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors outline-none cursor-pointer">
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[320px] rounded-2xl border-border bg-card shadow-lg p-2 space-y-1.5">
            <div className="flex justify-between items-center px-2 py-1.5 border-b border-border/60">
              <span className="text-xs font-bold text-foreground">Notifications</span>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                {unreadCount} Unread
              </span>
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markAsRead(n.id);
                    if (n.actionUrl) setLocation(n.actionUrl);
                  }}
                  className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                    n.read ? "hover:bg-muted/40" : "bg-primary/5 hover:bg-primary/10"
                  }`}
                >
                  <div className="flex justify-between items-start gap-1.5">
                    <span className="text-xs font-semibold text-foreground leading-normal">{n.title}</span>
                    {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-normal">{n.message}</p>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active user status info / details */}
        <div className="flex items-center gap-2 border-l border-border pl-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-foreground leading-none">{user?.name || "Shafi Vilayil"}</span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">
              {user?.role || "Administrator"}
            </span>
          </div>
          <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shadow-inner">
            {user?.name ? user.name.charAt(0) : "S"}
          </div>
        </div>
      </div>

      {/* Global Search Command Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]"
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-card border border-border/80 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/80 bg-muted/20">
              <Search className="h-4.5 w-4.5 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder="Search studios, metrics, configurations..."
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
              />
              <kbd className="px-1.5 py-0.5 bg-muted rounded-md text-[9px] font-mono text-muted-foreground">ESC</kbd>
            </div>
            <div className="py-2.5 px-2 max-h-72 overflow-y-auto custom-scrollbar space-y-1">
              {[
                { label: "Market Intelligence", desc: "Launch MI Studio", route: "/app/market-intelligence" },
                { label: "Site Selection Model", desc: "Map potential store outlets", route: "/app/market-intelligence/site-selection" },
                { label: "Inventory Dashboard", desc: "Monitor warehouse logistics", route: "/app/operations/inventory" },
                { label: "Financial Simulator", desc: "Run what-if projections", route: "/app/executive/financial" },
                { label: "AI Agent Manager", desc: "Configure autonomous agents", route: "/app/ai-research/agents" },
                { label: "Reports Output", desc: "Download board materials", route: "/app/reports" },
                { label: "Platform Settings", desc: "Edit brand configuration", route: "/app/settings" }
              ].map((item) => (
                <div
                  key={item.route}
                  onClick={() => {
                    setSearchOpen(false);
                    setLocation(item.route);
                  }}
                  className="flex justify-between items-center p-2.5 rounded-xl hover:bg-muted/60 cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-semibold text-foreground">{item.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                  <span className="text-[10px] text-primary font-bold">Go</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </header>
  );
}
