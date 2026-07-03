import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Database, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";

export default function DataSources() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/app/ai-research")} className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Data Sources</h2>
            <p className="text-xs text-muted-foreground">Connected external census maps, government files and GIS database integrations.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl flex gap-1 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" /> Reconnect APIs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 rounded-3xl bg-card border border-border/80 p-5 space-y-4 shadow-sm min-h-[300px] flex flex-col justify-center items-center text-center">
          <Database className="h-12 w-12 text-primary/40 mb-3 animate-pulse" />
          <h3 className="text-sm font-bold text-foreground">Connected GIS and API feeds</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            AI is connected to Google Maps and OpenStreetMap GIS APIs. Custom data integration panels will render here in Phase 2.
          </p>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Connected APIs</h3>
          <div className="space-y-3">
            {[
              { name: "Google Maps API", type: "Active" },
              { name: "OpenStreetMap GIS Feed", type: "Active" },
              { name: "Census demography DB", type: "Active" }
            ].map((api) => (
              <div key={api.name} className="flex justify-between items-center p-3 border border-border/80 rounded-2xl bg-muted/10">
                <span className="text-xs font-bold text-foreground">{api.name}</span>
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {api.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
