import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Eye, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";

export default function CompetitorIntel() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/app/ai-research")} className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Competitor Intelligence</h2>
            <p className="text-xs text-muted-foreground">Autonomous monitoring streams of rival store locations and social reviews.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl flex gap-1 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" /> Scan Rivals
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 rounded-3xl bg-card border border-border/80 p-5 space-y-4 shadow-sm min-h-[300px] flex flex-col justify-center items-center text-center">
          <Eye className="h-12 w-12 text-primary/40 mb-3 animate-pulse" />
          <h3 className="text-sm font-bold text-foreground">Rival Store Coverage Trackers</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            AI is listening to rival expansion news streams. Automated intelligence tables and logs will render here in Phase 2.
          </p>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Scanned Competitors</h3>
          <div className="space-y-3">
            {[
              { name: "Reliance Fresh", stores: "1,800 scanned", status: "Active Tracker" },
              { name: "DMart Retail", stores: "350 scanned", status: "Active Tracker" },
              { name: "Milma coop", stores: "52 scanned", status: "Active Tracker" }
            ].map((comp) => (
              <div key={comp.name} className="p-3 border border-border/80 rounded-2xl bg-muted/10 space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-foreground">
                  <span>{comp.name}</span>
                  <span className="text-primary">{comp.stores}</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-semibold uppercase">{comp.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
