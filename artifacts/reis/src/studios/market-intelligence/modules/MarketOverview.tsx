import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe, BarChart3, ArrowLeft, RefreshCw, Layers } from "lucide-react";
import { useLocation } from "wouter";

export default function MarketOverview() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/app/market-intelligence")} className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Market Overview</h2>
            <p className="text-xs text-muted-foreground">Regional market expansion potential index & consumer index maps.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl flex gap-1 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" /> Sync Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 rounded-3xl bg-card border border-border/80 p-5 space-y-4 shadow-sm min-h-[300px] flex flex-col justify-center items-center text-center">
          <Layers className="h-12 w-12 text-primary/40 mb-3 animate-pulse" />
          <h3 className="text-sm font-bold text-foreground">Interactive Geographical Coverage Map</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            AI is drawing district-level density maps based on census data. (Interactive map visualization is preparing for Phase 2 deep release.)
          </p>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Top Priority States</h3>
          <div className="space-y-3">
            {[
              { name: "Maharashtra", outlets: 48, growth: "+12%" },
              { name: "Karnataka", outlets: 32, growth: "+8%" },
              { name: "Gujarat", outlets: 24, growth: "+15%" }
            ].map((state) => (
              <div key={state.name} className="flex justify-between items-center p-3 border border-border/80 rounded-2xl bg-muted/10">
                <span className="text-xs font-bold text-foreground">{state.name}</span>
                <div className="text-right">
                  <span className="text-xs font-bold text-foreground block">{state.outlets} stores</span>
                  <span className="text-[9px] text-emerald-500 font-bold">{state.growth} YoY</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
