import React from "react";
import { useCompanyStore } from "@/shared/stores/companyStore";
import { useLocation, Link } from "wouter";
import {
  mockDashboardKPIs, mockActivities, mockStudios
} from "@/shared/lib/mockData";
import {
  Globe, Settings, Crown, Sparkles, MapPin, TrendingUp, Target,
  ArrowRight, Activity, Clock, Zap, ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { activeCompany } = useCompanyStore();

  const getKPIIcon = (iconName: string) => {
    switch (iconName) {
      case "MapPin":
        return MapPin;
      case "TrendingUp":
        return TrendingUp;
      case "Target":
        return Target;
      default:
        return Globe;
    }
  };

  const getKPICardColors = (color: string) => {
    switch (color) {
      case "emerald":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "blue":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "violet":
        return "text-violet-500 bg-violet-500/10 border-violet-500/20";
      default:
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    }
  };

  const getStudioIcon = (iconName: string) => {
    switch (iconName) {
      case "Globe":
        return Globe;
      case "Settings":
        return Settings;
      case "Crown":
        return Crown;
      default:
        return Sparkles;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "ai_analysis":
        return Sparkles;
      case "data_upload":
        return Zap;
      default:
        return Activity;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Enterprise Dashboard
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-emerald-500 font-bold">Active Workspace</span>
          </div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Welcome back, {activeCompany?.name || "FreshMart India"}
          </h2>
          <p className="text-xs text-muted-foreground">
            Retail Intelligence Operating System initialized successfully. {activeCompany?.outletCount} active outlets monitored.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation("/app/settings")}
            className="rounded-xl cursor-pointer text-xs"
          >
            Settings
          </Button>
          <Button
            size="sm"
            onClick={() => setLocation("/app/reports")}
            className="bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl cursor-pointer text-xs shadow-sm"
          >
            Export Executive Report
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mockDashboardKPIs.map((kpi) => {
          const Icon = getKPIIcon(kpi.icon);
          const colorClasses = getKPICardColors(kpi.color);
          return (
            <Card key={kpi.label} className="bg-card border border-border/80 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground">{kpi.label}</span>
                  <div className="text-2xl font-black text-foreground leading-none">{kpi.value}</div>
                  {kpi.change && (
                    <span className="text-[10px] font-bold text-emerald-500 mt-1 block">
                      {kpi.change} this month
                    </span>
                  )}
                </div>
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${colorClasses}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Studio Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Studio list card */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Studio Workspaces</h3>
          <div className="grid grid-cols-1 gap-4">
            {mockStudios.map((studio) => {
              const Icon = getStudioIcon(studio.icon);
              return (
                <Card
                  key={studio.id}
                  onClick={() => setLocation(studio.modules[0].route)}
                  className="bg-card hover:bg-muted/30 border border-border/80 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all group overflow-hidden"
                >
                  <CardContent className="p-5 flex gap-4">
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${studio.color}, ${studio.color}dd)`
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {studio.name}
                        </h4>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-normal">{studio.description}</p>
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/60">
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          {studio.modules.filter((m) => m.status === "active").length} Active Modules
                        </span>
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          {studio.modules.filter((m) => m.status === "coming_soon").length} Planned
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent activity & System Audit Logs */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Recent Activity & Audit logs</h3>
          <Card className="bg-card border border-border/80 rounded-3xl shadow-sm p-5 space-y-4">
            <div className="space-y-4 max-h-[360px] overflow-y-auto custom-scrollbar pr-2">
              {mockActivities.map((act) => {
                const Icon = getActivityIcon(act.type);
                return (
                  <div key={act.id} className="flex gap-3 items-start border-b border-border/40 pb-3 last:border-0 last:pb-0">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-foreground">{act.title}</span>
                        <span className="text-[9px] text-muted-foreground flex items-center gap-0.5 font-medium">
                          <Clock className="h-3 w-3" />
                          {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">{act.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
