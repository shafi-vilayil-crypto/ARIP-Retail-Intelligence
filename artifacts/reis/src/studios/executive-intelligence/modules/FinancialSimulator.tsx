import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";

export default function FinancialSimulator() {
  const [, setLocation] = useLocation();
  const [storeCount, setStoreCount] = useState(10);
  const [capexPerStore, setCapexPerStore] = useState(30); // in Lakhs
  const [revPerStore, setRevPerStore] = useState(5); // in Lakhs/mo

  const totalCapex = storeCount * capexPerStore;
  const estimatedAnnualRev = storeCount * revPerStore * 12;
  const payBackMonths = (totalCapex / (estimatedAnnualRev * 0.15)) * 12; // assuming 15% net margin

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/app/executive")} className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Financial Simulator</h2>
            <p className="text-xs text-muted-foreground">What-if simulation modeling tool for planned store investments and payback times.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl flex gap-1 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" /> Reset Variables
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Simulator Variables</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Number of Planned Stores</Label>
              <Input
                type="number"
                value={storeCount}
                onChange={(e) => setStoreCount(parseInt(e.target.value) || 0)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Capex per Store (₹ Lakhs)</Label>
              <Input
                type="number"
                value={capexPerStore}
                onChange={(e) => setCapexPerStore(parseInt(e.target.value) || 0)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Estimated Revenue / Store / Mo (₹ Lakhs)</Label>
              <Input
                type="number"
                value={revPerStore}
                onChange={(e) => setRevPerStore(parseFloat(e.target.value) || 0)}
                className="rounded-xl"
              />
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2 bg-card border border-border/80 rounded-3xl p-5 shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Simulation Outputs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-2xl bg-muted/10 space-y-1">
                <span className="text-[10px] text-muted-foreground font-semibold">Total Invested Capex</span>
                <div className="text-lg font-bold text-foreground">₹ {totalCapex} Lakhs</div>
              </div>
              <div className="p-4 border border-border rounded-2xl bg-muted/10 space-y-1">
                <span className="text-[10px] text-muted-foreground font-semibold">Est. Annual Revenue</span>
                <div className="text-lg font-bold text-foreground">₹ {estimatedAnnualRev} Lakhs</div>
              </div>
              <div className="p-4 border border-border rounded-2xl bg-muted/10 space-y-1">
                <span className="text-[10px] text-muted-foreground font-semibold">Projected Payback</span>
                <div className="text-lg font-bold text-emerald-500">
                  {payBackMonths > 0 ? payBackMonths.toFixed(1) : "—"} Months
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground italic border-t border-border pt-4 mt-4 flex items-center gap-2">
            <Calculator className="h-4 w-4 text-primary shrink-0" />
            <span>Payback matches Net Margin assumption: 15% net profits on monthly revenue.</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
