import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, GitBranch, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";

export default function ScenarioPlanning() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/app/executive")} className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Scenario Planning</h2>
            <p className="text-xs text-muted-foreground">Compare optimistic, base and pessimistic business growth scenarios.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl flex gap-1 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" /> Compute Scenarios
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 rounded-3xl bg-card border border-border/80 p-5 space-y-4 shadow-sm min-h-[300px] flex flex-col justify-center items-center text-center">
          <GitBranch className="h-12 w-12 text-primary/40 mb-3 animate-pulse" />
          <h3 className="text-sm font-bold text-foreground">Multi-Scenario Outcome Comparison Chart</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            AI is projecting cashflows. Multi-scenario growth projections charts will render here in Phase 2.
          </p>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Growth Scenarios</h3>
          <div className="space-y-3">
            {[
              { name: "Optimistic", revenue: "₹34.8Cr", roi: "12m payback" },
              { name: "Base Case", revenue: "₹24.8Cr", roi: "18m payback" },
              { name: "Pessimistic", revenue: "₹18.2Cr", roi: "24m payback" }
            ].map((scenario) => (
              <div key={scenario.name} className="p-3 border border-border/80 rounded-2xl bg-muted/10 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground">{scenario.name}</span>
                  <span className="font-bold text-primary">{scenario.revenue}</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-semibold">Payback Timeline: {scenario.roi}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
