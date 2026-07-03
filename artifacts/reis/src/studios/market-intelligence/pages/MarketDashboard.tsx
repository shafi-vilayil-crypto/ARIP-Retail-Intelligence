import React from "react";
import StudioLayout from "@/platform/layout/StudioLayout";
import { useLocation } from "wouter";
import { mockStudios, mockMarkets } from "@/shared/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, MapPin, Users, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketDashboard() {
  const [, setLocation] = useLocation();
  const studio = mockStudios.find((s) => s.id === "market-intelligence")!;

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case "Map":
        return Globe;
      case "MapPin":
        return MapPin;
      case "Users":
        return Users;
      default:
        return Target;
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
                <span className="text-xs font-semibold text-muted-foreground">Catchment Analysis</span>
                <div className="text-xl font-bold text-foreground">84 / 100</div>
                <span className="text-[10px] text-emerald-500 font-bold">Excellent Potential</span>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border/80 shadow-sm rounded-2xl">
              <CardContent className="p-4 flex flex-col justify-between h-28">
                <span className="text-xs font-semibold text-muted-foreground">Analyzed Sites</span>
                <div className="text-xl font-bold text-foreground">32 Potential</div>
                <span className="text-[10px] text-primary font-semibold">4 Shortlisted</span>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border/80 shadow-sm rounded-2xl">
              <CardContent className="p-4 flex flex-col justify-between h-28">
                <span className="text-xs font-semibold text-muted-foreground">Regional Dominance</span>
                <div className="text-xl font-bold text-foreground">High Density</div>
                <span className="text-[10px] text-amber-500 font-medium">Moderate Competitors</span>
              </CardContent>
            </Card>
          </div>

          {/* Module Grid List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Analysis Modules</h3>
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
                      <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
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

        {/* State Explorer Preview Card */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Regional Scorecard</h3>
          <Card className="bg-card border border-border/80 rounded-3xl shadow-sm p-4 space-y-4">
            <div className="space-y-3">
              {mockMarkets.slice(0, 4).map((state) => (
                <div key={state.id} className="flex justify-between items-center p-3 border border-border/80 rounded-2xl bg-muted/10">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-foreground truncate">{state.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">State Potential</div>
                  </div>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    state.expansionScore >= 80 ? "score-excellent" : "score-good"
                  }`}>
                    {state.expansionScore}
                  </span>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/app/market-intelligence/state-explorer")}
              className="w-full rounded-xl text-xs flex gap-1 cursor-pointer"
            >
              Explore Region Markets <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Card>
        </div>
      </div>
    </StudioLayout>
  );
}
