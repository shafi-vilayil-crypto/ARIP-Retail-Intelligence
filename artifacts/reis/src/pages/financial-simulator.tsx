import { useState } from "react";
import {
  useListLocations, useGetLocationFinancial, useUpdateLocationFinancial,
  getGetLocationFinancialQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { IndianRupee, Calculator, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

function fmt(n: number | null | undefined, prefix = "₹") {
  if (n == null) return "—";
  if (n >= 10000000) return `${prefix}${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `${prefix}${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `${prefix}${(n / 1000).toFixed(1)}K`;
  return `${prefix}${n.toFixed(0)}`;
}

export default function FinancialSimulator() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: locationsRaw } = useListLocations();
  const locations = Array.isArray(locationsRaw) ? locationsRaw : [];
  const { data: financial, isLoading: loadingFin } = useGetLocationFinancial(selectedId ?? 0, {
    query: { enabled: !!selectedId, queryKey: getGetLocationFinancialQueryKey(selectedId ?? 0) }
  });

  const updateMut = useUpdateLocationFinancial({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetLocationFinancialQueryKey(selectedId ?? 0) });
        toast({ title: "Updated", description: "Financial simulation recalculated." });
      }
    }
  });

  const [inputs, setInputs] = useState<Record<string, string>>({});

  function handleUpdate() {
    if (!selectedId) return;
    const data: Record<string, number> = {};
    Object.entries(inputs).forEach(([k, v]) => {
      const n = parseFloat(v);
      if (!isNaN(n)) data[k] = n;
    });
    updateMut.mutate({ id: selectedId, data });
  }

  const revenueData = financial ? [
    { year: "Year 1", revenue: financial.year1Revenue },
    { year: "Year 3", revenue: financial.year3Revenue },
    { year: "Year 5", revenue: financial.year5Revenue },
  ].filter(d => d.revenue != null) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight">FINANCIAL SIMULATOR</h1>
          <p className="text-muted-foreground text-sm font-mono mt-1">Model CAPEX, OPEX, ROI, and revenue projections per location</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Select
            value={selectedId?.toString() ?? ""}
            onValueChange={v => { setSelectedId(parseInt(v, 10)); setInputs({}); }}
          >
            <SelectTrigger data-testid="select-location" className="max-w-[400px]">
              <SelectValue placeholder="Select a location to simulate..." />
            </SelectTrigger>
            <SelectContent>
              {locations?.map(l => (
                <SelectItem key={l.id} value={l.id.toString()}>
                  {l.name} — {l.city}, {l.state} ({l.overallScore.toFixed(1)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedId && loadingFin && <Skeleton className="h-64 w-full" />}

      {selectedId && financial && !loadingFin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <Card>
            <CardHeader><CardTitle className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Input Assumptions</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "capex", label: "CAPEX (₹)", placeholder: financial.capex?.toString() },
                { key: "monthlyRent", label: "Monthly Rent (₹)", placeholder: financial.monthlyRent?.toString() },
                { key: "monthlyStaffCost", label: "Staff Cost/mo (₹)", placeholder: financial.monthlyStaffCost?.toString() },
                { key: "monthlyUtilities", label: "Utilities/mo (₹)", placeholder: financial.monthlyUtilities?.toString() },
                { key: "monthlyInventory", label: "Inventory/mo (₹)", placeholder: financial.monthlyInventory?.toString() },
                { key: "monthlyMarketing", label: "Marketing/mo (₹)", placeholder: financial.monthlyMarketing?.toString() },
                { key: "estimatedDailyRevenue", label: "Est. Daily Revenue (₹)", placeholder: financial.monthlyRevenue ? (financial.monthlyRevenue / 30).toFixed(0) : "" },
                { key: "grossMarginPct", label: "Gross Margin (%)", placeholder: financial.grossMarginPct?.toString() },
                { key: "deliveryCommissionPct", label: "Delivery Commission (%)", placeholder: financial.deliveryCommissionPct?.toString() },
              ].map(item => (
                <div key={item.key} className="flex items-center gap-3">
                  <Label className="w-44 text-xs font-mono text-muted-foreground shrink-0">{item.label}</Label>
                  <Input
                    data-testid={`input-fin-${item.key}`}
                    type="number"
                    placeholder={item.placeholder ?? ""}
                    value={inputs[item.key] ?? ""}
                    onChange={e => setInputs(p => ({ ...p, [item.key]: e.target.value }))}
                    className="h-8"
                  />
                </div>
              ))}
              <Button
                data-testid="button-recalculate"
                onClick={handleUpdate}
                disabled={updateMut.isPending || Object.keys(inputs).length === 0}
                className="w-full gap-2"
              >
                <Calculator className="h-4 w-4" />
                {updateMut.isPending ? "Calculating..." : "Recalculate"}
              </Button>
            </CardContent>
          </Card>

          {/* Outputs */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Monthly Revenue", val: fmt(financial.monthlyRevenue), positive: true },
                { label: "Monthly OPEX", val: fmt(financial.monthlyOpex), positive: false },
                { label: "EBITDA / mo", val: fmt(financial.ebitda), positive: (financial.ebitda ?? 0) > 0 },
                { label: "Gross Margin", val: financial.grossMarginPct != null ? `${financial.grossMarginPct}%` : "—", positive: true },
                { label: "ROI", val: financial.roiPct != null ? `${financial.roiPct}%` : "—", positive: (financial.roiPct ?? 0) > 0 },
                { label: "IRR", val: financial.irrPct != null ? `${financial.irrPct?.toFixed(1)}%` : "—", positive: true },
                { label: "Break-even", val: financial.breakEvenMonths != null ? `${financial.breakEvenMonths} mo` : "—", positive: false },
                { label: "Payback Period", val: financial.paybackPeriodMonths != null ? `${financial.paybackPeriodMonths} mo` : "—", positive: false },
              ].map(item => (
                <div key={item.label} className="p-3 rounded border border-border bg-card text-center">
                  <div className={`text-lg font-bold font-mono ${item.positive ? "text-green-400" : "text-foreground"}`} data-testid={`text-fin-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    {item.val}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono uppercase">{item.label}</div>
                </div>
              ))}
            </div>

            {revenueData.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Revenue Projection</CardTitle></CardHeader>
                <CardContent className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <XAxis dataKey="year" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                        formatter={(v: number) => [fmt(v), "Revenue"]}
                      />
                      <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                        {revenueData.map((_, i) => (
                          <Cell key={i} fill={["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"][i]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {!selectedId && (
        <Card>
          <CardContent className="py-16 text-center">
            <IndianRupee className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-mono">Select a location above to run a financial simulation</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
