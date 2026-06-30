import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { CompanySelector } from "@/components/dashboard/CompanySelector";
import {
  LayoutDashboard, MapPin, Map, Users, Target, Activity,
  TrendingUp, Building2, Moon, Sun, Sparkles, FileText,
  Truck, BarChart3, Settings, Search, Command, Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "AI Analysis", href: "/analysis", icon: Sparkles },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Expansion Markets", href: "/markets", icon: Map },
      { label: "Locations", href: "/locations", icon: MapPin },
      { label: "Competitors", href: "/competitors", icon: Users },
      { label: "Demand", href: "/demand", icon: BarChart3 },
    ],
  },
  {
    label: "Strategy",
    items: [
      { label: "Financials", href: "/financial", icon: TrendingUp },
      { label: "Logistics", href: "/logistics", icon: Truck },
      { label: "Scoring Engine", href: "/scoring", icon: Target },
    ],
  },
  {
    label: "Output",
    items: [
      { label: "Reports", href: "/reports", icon: FileText },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleDark = () => {
    setDark(d => {
      document.documentElement.classList.toggle("dark", !d);
      return !d;
    });
  };

  // Find current page label
  const currentPage = NAV_GROUPS.flatMap(g => g.items).find(
    n => n.href === location || (n.href !== "/" && location.startsWith(n.href))
  );

  return (
    <div className={`flex h-screen w-full overflow-hidden bg-background text-foreground ${dark ? "dark" : ""}`}>
      {/* ═══════ SIDEBAR ═══════ */}
      <aside className="w-[260px] border-r border-border bg-card flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-md">
              <Zap className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground tracking-tight">ARIP</div>
              <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Retail Intelligence</div>
            </div>
          </div>
        </div>

        {/* Company Selector */}
        <div className="px-3 py-3 border-b border-border">
          <CompanySelector />
        </div>

        {/* Grouped Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="px-3 mb-1.5">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  {group.label}
                </span>
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                  return (
                    <Link key={item.href} href={item.href}>
                      <motion.div
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-4 py-4 border-t border-border space-y-2">
          <button
            onClick={toggleDark}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{dark ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <div className="flex items-center gap-2 px-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs text-muted-foreground">9 Agents Ready</span>
          </div>
        </div>
      </aside>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-border bg-card/60 backdrop-blur-xl flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground font-semibold">{currentPage?.label ?? "Dashboard"}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-muted/60 hover:bg-muted rounded-xl text-xs text-muted-foreground transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-background border border-border rounded-md text-[10px] font-mono text-muted-foreground">
                ⌘K
              </kbd>
            </button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span>{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* ═══════ COMMAND PALETTE (⌘K) ═══════ */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]"
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search pages, companies, locations..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
              />
              <kbd className="px-1.5 py-0.5 bg-muted rounded-md text-[10px] font-mono text-muted-foreground">ESC</kbd>
            </div>
            <div className="py-2 px-2 max-h-72 overflow-y-auto">
              {NAV_GROUPS.flatMap(g => g.items).map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <button
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
