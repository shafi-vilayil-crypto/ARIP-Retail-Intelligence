import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";

export default function InventoryDashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/app/operations")} className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Inventory Dashboard</h2>
            <p className="text-xs text-muted-foreground">Real-time store stock health, turnover rates and reorder levels.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl flex gap-1 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" /> Recalculate Stock
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 rounded-3xl bg-card border border-border/80 p-5 space-y-4 shadow-sm min-h-[300px] flex flex-col justify-center items-center text-center">
          <Package className="h-12 w-12 text-primary/40 mb-3 animate-pulse" />
          <h3 className="text-sm font-bold text-foreground">SKU Warehouse Distribution Grid</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            AI is analyzing replenishment levels. Stock movement trends and logs will render here in Phase 2.
          </p>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Top Low Stock SKUs</h3>
          <div className="space-y-3">
            {[
              { name: "Fresh Milk 1L", count: 42, target: 200 },
              { name: "Wheat Bread 400g", count: 18, target: 100 },
              { name: "Premium Butter 200g", count: 12, target: 80 }
            ].map((sku) => (
              <div key={sku.name} className="p-3 border border-border/80 rounded-2xl bg-muted/10 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground">{sku.name}</span>
                  <span className="font-bold text-destructive">{sku.count} left</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-semibold">Min Target: {sku.target}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
