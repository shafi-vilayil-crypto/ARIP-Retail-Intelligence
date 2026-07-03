import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Bot, RefreshCw, Play } from "lucide-react";
import { useLocation } from "wouter";
import { mockAgents } from "@/shared/lib/mockData";

export default function AIAgentManager() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/app/ai-research")} className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">AI Agent Manager</h2>
            <p className="text-xs text-muted-foreground">Configure, run and monitor execution logs of the autonomous AI agent fleet.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl flex gap-1 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" /> Ping Agents
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">AI Agent Fleet</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockAgents.map((agent) => (
              <Card key={agent.id} className="bg-card border border-border/80 rounded-2xl shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-foreground truncate">{agent.name}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{agent.description}</p>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full capitalize">
                      {agent.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border/60">
                    <span>Tasks: {agent.completedTasks}/{agent.taskCount}</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6 rounded-lg text-primary hover:bg-primary/10">
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Agent Settings</h3>
          <Card className="bg-card border border-border/80 rounded-3xl shadow-sm p-4 space-y-3">
            {[
              "🤖 LLM Backend: Gemini 2.5 Flash API active",
              "⏱️ Cron schedule interval: Every 24 hours",
              "🛡️ Safety thresholds: High confidence filters enabled (85% min)"
            ].map((setting, idx) => (
              <div key={idx} className="flex gap-2 items-start text-xs text-muted-foreground">
                <span className="text-primary mt-0.5">•</span>
                <span>{setting}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
