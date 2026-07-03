import React from "react";
import StudioLayout from "@/platform/layout/StudioLayout";
import { useLocation } from "wouter";
import { mockStudios, mockKPIs } from "@/shared/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard, Activity, Calculator, GitBranch, Target, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExecutiveDashboard() {
  const [, setLocation] = useLocation();
  const studio = mockStudios.find((s) => s.id === "executive")!;

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case "Activity":
        return Activity;
      case "Calculator":
        return Calculator;
      case "GitBranch":
        return GitBranch;
      case "Target":
        return Target;
      case "FileText":
        return FileText;
      default:
        return LayoutDashboard;
    }
  };

  return (
    <StudioLayout
      title={studio.name}
      description={studio.description}
      studioColor={studio.color}
      studioId={studio.id}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI Summary Cards */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-card border border-border/80 shadow-sm rounded-2xl">
              <CardContent className="p-4 flex flex-col justify-between h-28">
                <span className="text-xs font-semibold text-muted-foreground">ROI Projection</span>
                <div className="text-xl font-bold text-foreground">18 Months</div>
                <span className="text-[10px] text-emerald-500 font-bold">14.2% Growth YoY</span>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border/80 shadow-sm rounded-2xl">
              <CardContent className="p-4 flex flex-col justify-between h-28">
                <span className="text-xs font-semibold text-muted-foreground">Gross Margin Target</span>
                <div className="text-xl font-bold text-foreground">34.2%</div>
                <span className="text-[10px] text-primary font-semibold">Target 36.0%</span>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border/80 shadow-sm rounded-2xl">
              <CardContent className="p-4 flex flex-col justify-between h-28">
                <span className="text-xs font-semibold text-muted-foreground">Scenario Outcomes</span>
                <div className="text-xl font-bold text-foreground">Optimistic</div>
                <span className="text-[10px] text-emerald-500 font-semibold">₹120Cr Investment</span>
              </CardContent>
            </Card>
          </div>

          {/* Module Grid List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Strategic Modules</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {studio.modules.map((mod) => {
                const Icon = getModuleIcon(mod.icon);
                return (
                  <Card
                    key={mod.id}
                    onClick={() => {
                      if (mod.status === "active") setLocation(mod.route);
                    }}
                    className={`bg-card hover:bg-muted/20 border border-border/80 rounded-2xl shadow-sm cursor-pointer transition-colors group ${
                      mod.status !== "active" ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    <CardContent className="p-4 flex gap-3.5 items-center">
                      <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                            {mod.name}
                          </h4>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            mod.status === "active"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : mod.status === "beta"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {mod.status === "active" ? "Active" : mod.status === "beta" ? "Beta" : "Planned"}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal truncate">
                          {mod.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Company KPIs List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Strategic Metrics</h3>
          <Card className="bg-card border border-border/80 rounded-3xl shadow-sm p-4 space-y-3">
            {mockKPIs.slice(0, 4).map((kpi) => (
              <div key={kpi.id} className="flex justify-between items-center p-2.5 border border-border/80 rounded-xl bg-muted/10">
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-foreground truncate">{kpi.name}</div>
                  <div className="text-[9px] text-muted-foreground mt-0.5">{kpi.period}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-foreground">
                    {kpi.unit === "₹" ? "₹" : ""}{kpi.value.toLocaleString()}{kpi.unit === "%" ? "%" : ""}
                  </div>
                  <div className="text-[8px] text-emerald-500 font-bold">{kpi.trendValue}</div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/app/executive/kpis")}
              className="w-full rounded-xl text-xs cursor-pointer mt-2"
            >
              Analyze Financial Performance
            </Button>
          </Card>
        </div>
      </div>
    </StudioLayout>
  );
}
