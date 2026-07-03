import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Target, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";

export default function GoalTracking() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/app/executive")} className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Goal Tracking</h2>
            <p className="text-xs text-muted-foreground">Strategic brand expansion objectives trackers and milestone completions.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl flex gap-1 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Progress
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Milestone Progress Tracker</h3>
          <div className="space-y-4 border border-border rounded-2xl p-4 bg-card shadow-sm">
            {[
              { name: "Jaipur Central Mall Site Lease Signed", progress: 100, status: "Completed" },
              { name: "Mumbai Warehouse Tech Stack Integration", progress: 65, status: "In Progress" },
              { name: "Target 200 Store Outlets Reached", progress: 72, status: "In Progress" }
            ].map((milestone, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground truncate max-w-[250px]">{milestone.name}</span>
                  <span className="text-primary font-semibold">{milestone.status} ({milestone.progress}%)</span>
                </div>
                <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Objectives highlights</h3>
          <Card className="bg-card border border-border/80 rounded-3xl shadow-sm p-4 space-y-3">
            {[
              "🎯 Reach ₹350Cr Annualised Revenue runrate",
              "🎯 Standardise outlet capex limits under ₹30 Lakhs",
              "🎯 Optimise cold chains and reduce spoilage under 2%"
            ].map((obj, idx) => (
              <div key={idx} className="flex gap-2 items-start text-xs text-muted-foreground">
                <span className="text-primary mt-0.5">•</span>
                <span>{obj}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
