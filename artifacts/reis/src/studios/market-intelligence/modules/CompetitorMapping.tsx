import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { mockCompetitors } from "@/shared/lib/mockData";

export default function CompetitorMapping() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/app/market-intelligence")} className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Competitor Mapping</h2>
            <p className="text-xs text-muted-foreground">Catchment density overlap maps and share distributions of competitors.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl flex gap-1 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" /> Rescan Rivals
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 rounded-3xl bg-card border border-border/80 p-5 space-y-4 shadow-sm min-h-[300px] flex flex-col justify-center items-center text-center">
          <Users className="h-12 w-12 text-primary/40 mb-3 animate-pulse" />
          <h3 className="text-sm font-bold text-foreground">Rival Density Heatmaps</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            AI is checking Zomato/Blinkit density streams. Catchment mapping overlaps will render here in Phase 2.
          </p>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Monitored Brand Shares</h3>
          <div className="space-y-3">
            {mockCompetitors.slice(0, 4).map((comp) => (
              <div key={comp.id} className="p-3 border border-border/80 rounded-2xl bg-muted/10 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground">{comp.name}</span>
                  <span className="font-bold text-primary">{comp.marketShare}% share</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-semibold uppercase">{comp.scope} scope</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
