import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Route, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";

export default function RouteOptimization() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/app/operations")} className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Route Optimization</h2>
            <p className="text-xs text-muted-foreground">AI optimized transit maps, distribution schedules and route times.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl flex gap-1 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" /> Optimize Routes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 rounded-3xl bg-card border border-border/80 p-5 space-y-4 shadow-sm min-h-[300px] flex flex-col justify-center items-center text-center">
          <Route className="h-12 w-12 text-primary/40 mb-3 animate-bounce" />
          <h3 className="text-sm font-bold text-foreground">Transit Route Map Overview</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            AI is scanning Google Maps api routes. Route alignment coordinates will load here in Phase 2.
          </p>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Optimized Paths</h3>
          <div className="space-y-3">
            {[
              { name: "Mumbai Central - Bandra Store", time: "42 mins", saving: "-15%" },
              { name: "Pune DC - Koramangala Store", time: "180 mins", saving: "-8%" },
              { name: "Ahmedabad Cold - GIDC Outlet", time: "25 mins", saving: "-22%" }
            ].map((route) => (
              <div key={route.name} className="p-3 border border-border/80 rounded-2xl bg-muted/10 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground truncate max-w-[150px]">{route.name}</span>
                  <span className="font-bold text-emerald-500">{route.saving}</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-semibold">Duration: {route.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
