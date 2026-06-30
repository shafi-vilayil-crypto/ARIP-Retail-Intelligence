import React from "react";
import { useCompany } from "@/context/CompanyContext";
import { SupplyChainFlow } from "@/components/dashboard/SupplyChainFlow";
import { motion } from "framer-motion";
import { Truck, Route, Warehouse, Thermometer, DollarSign, Sparkles, MapPin } from "lucide-react";

export default function Logistics() {
  const { activeCompany, dashboardData } = useCompany();
  const logisticsData = dashboardData?.agentResults?.find(r => r.resultType === "logistics")?.data as Record<string, unknown> | undefined;

  if (!activeCompany || !logisticsData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
          <Truck className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">No Logistics Data</h2>
          <p className="text-sm text-muted-foreground mt-1">Complete an AI analysis to view logistics intelligence.</p>
        </div>
      </div>
    );
  }

  const supplyChainRaw = logisticsData.supplyChain;
  const supplyChain = Array.isArray(supplyChainRaw) ? (supplyChainRaw as Array<{ node: string; location: string; capacity: string; cost: string }>) : [];
  
  const routesRaw = logisticsData.routes;
  const routes = Array.isArray(routesRaw) ? (routesRaw as Array<{ from: string; to: string; distance: string; cost: string; time: string }>) : [];
  
  const warehousesRaw = logisticsData.warehouses;
  const warehouses = Array.isArray(warehousesRaw) ? (warehousesRaw as Array<{ name: string; location: string; capacity: string; type: string }>) : [];
  const summary = logisticsData.summary as string ?? "";
  const keyMetrics = logisticsData.keyMetrics as Record<string, string> | undefined;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Logistics Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Supply chain optimization for <span className="text-primary font-semibold">{activeCompany.name}</span>
        </p>
      </div>

      {/* Supply Chain Flow */}
      <SupplyChainFlow
        optimizations={{
          routeEfficiency: keyMetrics?.routeEfficiency ?? logisticsData.routeEfficiency as string,
          costSaving: keyMetrics?.costSaving ?? logisticsData.costSaving as string,
          spoilageReduction: keyMetrics?.spoilageReduction ?? logisticsData.spoilageReduction as string,
          warehouseSuggestion: keyMetrics?.warehouseSuggestion ?? logisticsData.warehouseSuggestion as string,
        }}
      />

      {/* Key Metrics */}
      {keyMetrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(keyMetrics).slice(0, 4).map(([key, value], i) => (
            <motion.div key={key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card border border-card-border rounded-[20px] p-4 card-float">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              <div className="text-lg font-bold text-foreground mt-1">{value}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Warehouse Recommendations */}
      {warehouses.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-card-border rounded-[20px] p-5 card-float">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Warehouse className="h-4 w-4 text-primary" />
            Warehouse Recommendations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {warehouses.map((w, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className="border border-border rounded-2xl p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div className="text-sm font-semibold text-foreground">{w.name}</div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Location: <span className="text-foreground font-medium">{w.location}</span></div>
                  <div>Capacity: <span className="text-foreground font-medium">{w.capacity}</span></div>
                  <div>Type: <span className="text-foreground font-medium">{w.type}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Route Optimization */}
      {routes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-card-border rounded-[20px] p-5 card-float">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Route className="h-4 w-4 text-primary" />
            Optimized Routes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground py-2 px-2">From</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-2 px-2">To</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-2 px-2">Distance</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-2 px-2">Cost</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-2 px-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((r, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-2 font-medium text-foreground">{r.from}</td>
                    <td className="py-2.5 px-2 text-foreground">{r.to}</td>
                    <td className="py-2.5 px-2 text-muted-foreground">{r.distance}</td>
                    <td className="py-2.5 px-2 text-muted-foreground">{r.cost}</td>
                    <td className="py-2.5 px-2 text-muted-foreground">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Summary */}
      {summary && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-card-border rounded-[20px] p-5 card-float">
          <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Logistics Summary
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        </motion.div>
      )}
    </div>
  );
}
