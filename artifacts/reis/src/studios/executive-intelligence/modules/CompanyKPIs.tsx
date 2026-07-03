import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Activity, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { mockKPIs } from "@/shared/lib/mockData";

export default function CompanyKPIs() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/app/executive")} className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Company KPIs</h2>
            <p className="text-xs text-muted-foreground">Strategic objectives trackers, monthly growth ratios and performance indicators.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl flex gap-1 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" /> Recalculate Ratios
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Company KPIs Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockKPIs.map((kpi) => (
              <Card key={kpi.id} className="bg-card border border-border/80 rounded-2xl shadow-sm">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-semibold">{kpi.name}</span>
                    <span className="text-[10px] text-emerald-500 font-bold">{kpi.trendValue}</span>
                  </div>
                  <div className="text-lg font-black text-foreground">
                    {kpi.unit === "₹" ? "₹" : ""}{kpi.value.toLocaleString()}{kpi.unit === "%" ? "%" : ""}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Period: {kpi.period}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Strategic Recommendations</h3>
          <Card className="bg-card border border-border/80 rounded-3xl shadow-sm p-4 space-y-3">
            {[
              "📈 Expansion: accelerate store openings in Jaipur",
              "💸 Financials: optimize gross margin to meet 36% target",
              "📦 Inventory: turnover score is slightly low, adjust replenishment"
            ].map((rec, idx) => (
              <div key={idx} className="flex gap-2 items-start text-xs text-muted-foreground">
                <span className="text-primary mt-0.5">•</span>
                <span>{rec}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
