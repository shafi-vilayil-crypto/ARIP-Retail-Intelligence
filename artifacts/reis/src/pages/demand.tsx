import React from "react";
import { useCompany } from "@/context/CompanyContext";
import { motion } from "framer-motion";
import { BarChart3, Users, GraduationCap, Briefcase, Plane, Moon as MoonIcon, Home, ShoppingBag, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, RadialBarChart, RadialBar } from "recharts";

const SEGMENT_ICONS: Record<string, React.ComponentType<{ className?: string; color?: string }>> = {
  students: GraduationCap,
  office: Briefcase,
  tourists: Plane,
  nightlife: MoonIcon,
  residential: Home,
  delivery: ShoppingBag,
};

const SEGMENT_COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899"];

export default function Demand() {
  const { activeCompany, dashboardData } = useCompany();
  const demandData = dashboardData?.agentResults?.find(r => r.resultType === "demand")?.data as Record<string, unknown> | undefined;

  if (!activeCompany || !demandData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
          <BarChart3 className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">No Demand Data</h2>
          <p className="text-sm text-muted-foreground mt-1">Complete an AI analysis to view demand intelligence.</p>
        </div>
      </div>
    );
  }

  const driversRaw = demandData.demandDrivers;
  const drivers = Array.isArray(driversRaw) ? (driversRaw as Array<{ driver: string; weight: number; description: string }>) : [];
  
  const cityDemandRaw = demandData.cityDemand;
  const cityDemand = Array.isArray(cityDemandRaw) ? (cityDemandRaw as Array<{ city: string; state: string; dailyPotential: number; deliveryShare: number; peakHours: string; topSegment: string; demandScore: number }>) : [];
  
  const keyInsightsRaw = demandData.keyInsights;
  const keyInsights = Array.isArray(keyInsightsRaw) ? (keyInsightsRaw as string[]) : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Demand Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Consumption potential analysis for <span className="text-primary font-semibold">{activeCompany.name}</span>
        </p>
      </div>

      {/* Demand Drivers */}
      {drivers.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-card-border rounded-[20px] p-5 card-float">
          <h3 className="text-base font-semibold text-foreground mb-4">Demand Drivers</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {drivers.map((d, i) => {
              const Icon = SEGMENT_ICONS[d.driver.toLowerCase()] ?? BarChart3;
              return (
                <motion.div key={d.driver} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border border-border rounded-2xl p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-xl flex items-center justify-center"
                      style={{ background: `${SEGMENT_COLORS[i % SEGMENT_COLORS.length]}20` }}>
                      <Icon className="h-4 w-4" color={SEGMENT_COLORS[i % SEGMENT_COLORS.length]} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground capitalize">{d.driver}</div>
                      <div className="text-[10px] text-muted-foreground">Weight: {d.weight}%</div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.weight}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{d.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* City Demand Table */}
      {cityDemand.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-card-border rounded-[20px] p-5 card-float">
          <h3 className="text-base font-semibold text-foreground mb-4">City Demand Analysis</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Bar chart */}
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cityDemand.slice(0, 8)} barSize={24}>
                <XAxis dataKey="city" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="demandScore" radius={[6, 6, 0, 0]}>
                  {cityDemand.slice(0, 8).map((_, i) => (
                    <Cell key={i} fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* City cards */}
            <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
              {cityDemand.map((c, i) => (
                <div key={c.city} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/40 transition-colors">
                  <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{c.city}</div>
                    <div className="text-[10px] text-muted-foreground">{c.state} · Peak: {c.peakHours} · {c.topSegment}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-foreground">{c.demandScore}</div>
                    <div className="text-[10px] text-muted-foreground">{c.deliveryShare}% delivery</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Key Insights */}
      {keyInsights.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-card-border rounded-[20px] p-5 card-float">
          <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Key Demand Insights
          </h3>
          <div className="space-y-2">
            {keyInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
