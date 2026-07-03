import React from "react";
import StudioLayout from "@/platform/layout/StudioLayout";
import { useLocation } from "wouter";
import { mockStudios, mockAgents } from "@/shared/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, ListChecks, Database, Eye, Newspaper, History, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIResearchDashboard() {
  const [, setLocation] = useLocation();
  const studio = mockStudios.find((s) => s.id === "ai-research")!;

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case "Bot":
        return Bot;
      case "ListChecks":
        return ListChecks;
      case "Database":
        return Database;
      case "Eye":
        return Eye;
      case "Newspaper":
        return Newspaper;
      case "History":
        return History;
      default:
        return MessageCircle;
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
      case "running":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 animate-pulse";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
      case "scheduled":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
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
                <span className="text-xs font-semibold text-muted-foreground">Active Agents</span>
                <div className="text-xl font-bold text-foreground">9 Agents Active</div>
                <span className="text-[10px] text-emerald-500 font-bold">1 Running Catchment Map</span>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border/80 shadow-sm rounded-2xl">
              <CardContent className="p-4 flex flex-col justify-between h-28">
                <span className="text-xs font-semibold text-muted-foreground">Crawl Queue</span>
                <div className="text-xl font-bold text-foreground">14 Sources</div>
                <span className="text-[10px] text-primary font-semibold">OpenStreetMap, Swiggy</span>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border/80 shadow-sm rounded-2xl">
              <CardContent className="p-4 flex flex-col justify-between h-28">
                <span className="text-xs font-semibold text-muted-foreground">Confidence Threshold</span>
                <div className="text-xl font-bold text-foreground">85% Min</div>
                <span className="text-[10px] text-emerald-500 font-semibold">91% Average Achieved</span>
              </CardContent>
            </Card>
          </div>

          {/* Module Grid List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Research Modules</h3>
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
                      <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
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

        {/* AI Agent Status Tracker Panel */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Agent Fleet Status</h3>
          <Card className="bg-card border border-border/80 rounded-3xl shadow-sm p-4 space-y-3">
            <div className="space-y-3 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
              {mockAgents.map((agent) => (
                <div key={agent.id} className="flex justify-between items-center p-2.5 border border-border/80 rounded-xl bg-muted/10">
                  <div className="min-w-0 flex-1 mr-2">
                    <div className="text-xs font-bold text-foreground truncate">{agent.name}</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5 truncate">{agent.description}</div>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize shrink-0 ${
                    getAgentStatusColor(agent.status)
                  }`}>
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/app/ai-research/agents")}
              className="w-full rounded-xl text-xs cursor-pointer mt-1"
            >
              Orchestrate AI Fleet
            </Button>
          </Card>
        </div>
      </div>
    </StudioLayout>
  );
}
