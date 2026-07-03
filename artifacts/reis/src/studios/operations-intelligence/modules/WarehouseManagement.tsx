import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Warehouse, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { mockWarehouses } from "@/shared/lib/mockData";

export default function WarehouseManagement() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/app/operations")} className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Warehouse Management</h2>
            <p className="text-xs text-muted-foreground">Capacity trackers, storage temperatures and regional hub indices.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl flex gap-1 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" /> Recalculate Capacity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Active Warehouse Hubs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockWarehouses.map((wh) => (
              <Card key={wh.id} className="bg-card border border-border/80 rounded-2xl shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{wh.name}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{wh.address}</p>
                    </div>
                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full">
                      {wh.type}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Storage Capacity Utilization</span>
                      <span className="font-semibold">{wh.utilization}%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${wh.utilization}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Hub Alerts</h3>
          <Card className="bg-card border border-border/80 rounded-3xl shadow-sm p-4 space-y-3">
            {[
              "🚨 Mumbai Central: cold store temperature spike detected",
              "📦 Ahmedabad DC: utilization threshold exceeded 80%",
              "✅ Pune Hub: all safety standards certified"
            ].map((alert, idx) => (
              <div key={idx} className="flex gap-2 items-start text-xs text-muted-foreground">
                <span className="text-primary mt-0.5">•</span>
                <span>{alert}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
