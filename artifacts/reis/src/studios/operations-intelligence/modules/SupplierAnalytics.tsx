import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Truck, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";

export default function SupplierAnalytics() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/app/operations")} className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Supplier Analytics</h2>
            <p className="text-xs text-muted-foreground">Supplier lead times, fulfillment accuracies and performance scorecards.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl flex gap-1 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" /> Recalculate Performance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 rounded-3xl bg-card border border-border/80 p-5 space-y-4 shadow-sm min-h-[300px] flex flex-col justify-center items-center text-center">
          <Truck className="h-12 w-12 text-primary/40 mb-3 animate-pulse" />
          <h3 className="text-sm font-bold text-foreground">Supplier Performance Metrics</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            AI is tracking supplier transaction tables. Performance charts will render here in Phase 2.
          </p>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Top Suppliers</h3>
          <div className="space-y-3">
            {[
              { name: "Amul Brands", score: "98%", status: "A+ Grade" },
              { name: "Milma Coop", score: "95%", status: "A Grade" },
              { name: "Britannia Foods", score: "91%", status: "B+ Grade" }
            ].map((sup) => (
              <div key={sup.name} className="p-3 border border-border/80 rounded-2xl bg-muted/10 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground">{sup.name}</span>
                  <span className="font-bold text-primary">{sup.score} fulfillment</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-semibold uppercase">{sup.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
