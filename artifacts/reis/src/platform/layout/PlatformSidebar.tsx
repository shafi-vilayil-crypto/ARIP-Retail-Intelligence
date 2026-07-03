import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCompanyStore } from "@/shared/stores/companyStore";
import { useAuthStore } from "@/shared/stores/authStore";
import {
  Globe, Settings, Crown, Sparkles, LayoutDashboard, FileText,
  Bell, ChevronLeft, ChevronRight, Moon, Sun, LogOut, Building2,
  ChevronDown, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface PlatformSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  dark: boolean;
  toggleDark: () => void;
}

export default function PlatformSidebar({ isCollapsed, setIsCollapsed, dark, toggleDark }: PlatformSidebarProps) {
  const [location, setLocation] = useLocation();
  const { activeCompany, companies, setActiveCompany } = useCompanyStore();
  const { logout, user } = useAuthStore();
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);

  const navigation = [
    { label: "Home Dashboard", href: "/app", icon: LayoutDashboard, color: "text-slate-500" },
    {
      group: "Market Intelligence",
      color: "border-blue-500/20 text-blue-500",
      items: [
        { label: "Studio Dashboard", href: "/app/market-intelligence", icon: Globe, color: "text-blue-500" },
        { label: "Market Overview", href: "/app/market-intelligence/overview", icon: Globe, color: "text-blue-400" },
        { label: "State Explorer", href: "/app/market-intelligence/state-explorer", icon: Globe, color: "text-blue-400" },
        { label: "Site Selection", href: "/app/market-intelligence/site-selection", icon: Globe, color: "text-blue-400" },
        { label: "Competitor Map", href: "/app/market-intelligence/competitor-mapping", icon: Globe, color: "text-blue-400" },
      ]
    },
    {
      group: "Operations Intelligence",
      color: "border-emerald-500/20 text-emerald-500",
      items: [
        { label: "Studio Dashboard", href: "/app/operations", icon: Settings, color: "text-emerald-500" },
        { label: "Inventory", href: "/app/operations/inventory", icon: Settings, color: "text-emerald-400" },
        { label: "Warehouses", href: "/app/operations/warehouses", icon: Settings, color: "text-emerald-400" },
        { label: "Route Optimization", href: "/app/operations/routes", icon: Settings, color: "text-emerald-400" },
        { label: "Supplier Analytics", href: "/app/operations/suppliers", icon: Settings, color: "text-emerald-400" },
      ]
    },
    {
      group: "Executive Intelligence",
      color: "border-amber-500/20 text-amber-500",
      items: [
        { label: "Studio Dashboard", href: "/app/executive", icon: Crown, color: "text-amber-500" },
        { label: "Company KPIs", href: "/app/executive/kpis", icon: Crown, color: "text-amber-400" },
        { label: "Financial Simulator", href: "/app/executive/financial", icon: Crown, color: "text-amber-400" },
        { label: "Scenario Planning", href: "/app/executive/scenarios", icon: Crown, color: "text-amber-400" },
      ]
    },
    {
      group: "AI Research Studio",
      color: "border-violet-500/20 text-violet-500",
      items: [
        { label: "Studio Dashboard", href: "/app/ai-research", icon: Sparkles, color: "text-violet-500" },
        { label: "AI Agent Manager", href: "/app/ai-research/agents", icon: Sparkles, color: "text-violet-400" },
        { label: "Research Queue", href: "/app/ai-research/queue", icon: Sparkles, color: "text-violet-400" },
        { label: "Data Sources", href: "/app/ai-research/sources", icon: Sparkles, color: "text-violet-400" },
      ]
    },
    {
      group: "Output & Setup",
      items: [
        { label: "Reports", href: "/app/reports", icon: FileText, color: "text-slate-400" },
        { label: "Settings", href: "/app/settings", icon: Settings, color: "text-slate-400" }
      ]
    }
  ];

  const isActive = (href: string) => {
    return location === href;
  };

  const handleCompanySwitch = (comp: any) => {
    setActiveCompany(comp);
    setLocation("/app");
  };

  return (
    <aside
      className={`border-r border-border bg-card flex flex-col shrink-0 overflow-hidden relative transition-all duration-300 ${
        isCollapsed ? "w-[72px]" : "w-[280px]"
      }`}
    >
      {/* Brand Header */}
      <div className="px-4 py-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <div className="text-sm font-extrabold text-foreground tracking-tight">RetailIQ OS</div>
              <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Enterprise OS</div>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Company Selector Dropdown */}
      <div className="p-3 border-b border-border">
        {isCollapsed ? (
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-inner cursor-pointer"
            style={{ backgroundColor: activeCompany?.brandColors?.primary || "#3B82F6" }}
            onClick={() => setIsCollapsed(false)}
          >
            {activeCompany?.name.charAt(0) || "C"}
          </div>
        ) : (
          <DropdownMenu open={companyMenuOpen} onOpenChange={setCompanyMenuOpen}>
            <DropdownMenuTrigger className="w-full flex items-center justify-between p-2.5 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 text-left outline-none cursor-pointer">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: activeCompany?.brandColors?.primary || "#3B82F6" }}
                >
                  {activeCompany?.name.charAt(0) || "C"}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-foreground truncate">{activeCompany?.name}</div>
                  <div className="text-[9px] text-muted-foreground font-medium truncate">{activeCompany?.industry}</div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[256px] rounded-xl border-border bg-card shadow-lg p-1.5">
              <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Switch Company
              </div>
              {companies.map((comp) => (
                <DropdownMenuItem
                  key={comp.id}
                  onClick={() => handleCompanySwitch(comp)}
                  className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-muted/60"
                >
                  <div
                    className="h-6 w-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: comp.brandColors?.primary || "#3B82F6" }}
                  >
                    {comp.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-foreground truncate">{comp.name}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => setLocation("/onboarding")}
                className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer text-primary hover:bg-primary/5 mt-1 border-t border-border/60 pt-2"
              >
                <Building2 className="h-4 w-4" />
                <span className="text-xs font-bold">Add Brand Profile</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-4">
        {navigation.map((group, gidx) => (
          <div key={gidx} className="space-y-1">
            {!isCollapsed && group.group && (
              <div className="px-3 py-1 flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {group.group}
                </span>
              </div>
            )}
            <div className="space-y-0.5">
              {(group.items || [group]).map((item: any) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? "text-primary-foreground" : item.color}`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-border space-y-2">
        <button
          onClick={toggleDark}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
        >
          {dark ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-indigo-500" />}
          {!isCollapsed && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
        </button>

        <button
          onClick={() => {
            logout();
            setLocation("/login");
          }}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs text-destructive hover:bg-destructive/5 transition-colors cursor-pointer"
        >
          <LogOut className="h-4.5 w-4.5" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
