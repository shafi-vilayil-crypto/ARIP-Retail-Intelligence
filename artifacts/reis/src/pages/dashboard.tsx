import React from "react";
import { useCompany } from "@/context/CompanyContext";
import { KPICard } from "@/components/dashboard/KPICard";
import { AIInsightCard } from "@/components/dashboard/AIInsightCard";
import { IndiaMap } from "@/components/dashboard/IndiaMap";
import { ScoreRadar } from "@/components/dashboard/ScoreRadar";
import { SupplyChainFlow } from "@/components/dashboard/SupplyChainFlow";
import { OnlineCommerceGrid } from "@/components/dashboard/OnlineCommerceGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Area, AreaChart,
} from "recharts";
import {
  MapPin, TrendingUp, Target, DollarSign, Users, Truck,
  Sparkles, ArrowRight, Globe, CheckCircle2, AlertTriangle,
  Building2, Activity, ShieldCheck, Clock,
} from "lucide-react";

export default function Dashboard() {
  const { activeCompany, dashboardData, dashboardLoading } = useCompany();
  const [, setLocation] = useLocation();

  // No company or no data yet
  if (!activeCompany) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center">
          <Building2 className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Welcome to ARIP</h2>
          <p className="text-sm text-muted-foreground mt-1">Create your first company profile to generate AI-powered expansion intelligence.</p>
        </div>
        <button
          onClick={() => setLocation("/analysis")}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-md ai-pulse hover:opacity-90 transition-opacity"
        >
          <Sparkles className="h-4 w-4" />
          Get Started
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (activeCompany.analysisStatus !== "completed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <div className="h-16 w-16 rounded-3xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Activity className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{activeCompany.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {activeCompany.analysisStatus === "running"
              ? "AI agents are analyzing... Dashboard will generate automatically when complete."
              : activeCompany.analysisStatus === "failed"
              ? "Analysis failed. Please retry from the AI Analysis page."
              : "Analysis not started yet. Run the AI agents to generate your dashboard."
            }
          </p>
        </div>
        <button
          onClick={() => setLocation("/analysis")}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-2xl text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {activeCompany.analysisStatus === "running" ? "View Progress" : "Run Analysis"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (dashboardLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-[20px]" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-96 rounded-[20px]" />
          <Skeleton className="h-96 rounded-[20px]" />
        </div>
      </div>
    );
  }

  // Extract data from agent results
  const d = dashboardData;
  const scores = d?.agentResults?.find(r => r.resultType === "scores")?.data as Record<string, unknown> | undefined;
  const financial = d?.agentResults?.find(r => r.resultType === "financial")?.data as Record<string, unknown> | undefined;
  const report = d?.agentResults?.find(r => r.resultType === "report")?.data as Record<string, unknown> | undefined;
  const demand = d?.agentResults?.find(r => r.resultType === "demand")?.data as Record<string, unknown> | undefined;
  const logistics = d?.agentResults?.find(r => r.resultType === "logistics")?.data as Record<string, unknown> | undefined;
  const onlineCommerce = d?.agentResults?.find(r => r.resultType === "online_commerce")?.data as Record<string, unknown> | undefined;
  const marketResult = d?.agentResults?.find(r => r.resultType === "markets")?.data as Record<string, unknown> | undefined;

  const unitEconomics = (financial?.unitEconomics ?? {}) as Record<string, number>;
  const yearlyProjectionRaw = financial?.yearlyProjection;
  const yearlyProjection = Array.isArray(yearlyProjectionRaw) ? (yearlyProjectionRaw as Array<Record<string, number>>) : [];
  
  const opportunitiesRaw = report?.topOpportunities;
  const opportunities = Array.isArray(opportunitiesRaw) ? (opportunitiesRaw as Array<{ title: string; description: string; impact: string }>) : [];
  
  const warningsRaw = report?.warnings;
  const warnings = Array.isArray(warningsRaw) ? (warningsRaw as Array<{ title: string; description: string; severity: string }>) : [];
  
  const stateInsightsRaw = marketResult?.stateInsights;
  const stateInsights = Array.isArray(stateInsightsRaw) ? (stateInsightsRaw as Array<{ state: string; avgScore: number; locationCount: number; topCity: string }>) : [];
  
  const onlinePlatformsRaw = demand?.onlinePlatforms ?? onlineCommerce?.platforms;
  const onlinePlatforms = Array.isArray(onlinePlatformsRaw) ? (onlinePlatformsRaw as Array<Record<string, unknown>>) : [];

  const competitorSummaryRaw = d?.competitorSummary;
  const competitorSummary = Array.isArray(competitorSummaryRaw) ? competitorSummaryRaw : [];

  // Build state scores for India map
  const mapStateScores = stateInsights.map(s => ({
    state: s.state, score: s.avgScore ?? 0, locations: s.locationCount, topCity: s.topCity,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ═══════════════════════════════════════════════════
         HEADER
         ═══════════════════════════════════════════════════ */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            AI-generated intelligence for <span className="text-primary font-semibold">{activeCompany.name}</span>
            {d?.topState && <> · Expanding across {d.topState}</>}
          </p>
        </div>
        <button
          onClick={() => setLocation("/reports")}
          className="flex items-center gap-2 bg-card border border-border text-foreground px-4 py-2 rounded-2xl text-sm font-medium shadow-sm hover:bg-muted transition-colors"
        >
          Export Report <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════
         HERO KPI CARDS — Auto-generated from scoring agent
         ═══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Top Expansion State"
          value={d?.topState ?? "—"}
          subtitle={d?.topDistrict ? `District: ${d.topDistrict}` : undefined}
          icon={Globe}
          color="emerald"
          trend="up"
          trendLabel={d?.bestTown ? `Best: ${d.bestTown}` : undefined}
          delay={0}
        />
        <KPICard
          title="Expansion Score"
          value={d?.expansionScore ?? "—"}
          subtitle="Out of 100"
          icon={Target}
          color="blue"
          trend={(d?.expansionScore ?? 0) >= 70 ? "up" : "neutral"}
          delay={1}
        />
        <KPICard
          title="Expected ROI"
          value={d?.expectedRoiMonths ? `${d.expectedRoiMonths} Months` : "—"}
          subtitle="Break-even timeline"
          icon={TrendingUp}
          color="purple"
          trend={(d?.expectedRoiMonths ?? 99) <= 18 ? "up" : "neutral"}
          delay={2}
        />
        <KPICard
          title="Investment Required"
          value={d?.investment ?? "—"}
          subtitle={d?.competition ? `Competition: ${d.competition}` : undefined}
          icon={DollarSign}
          color="amber"
          delay={3}
        />
      </div>

      {/* ═══════════════════════════════════════════════════
         SECOND ROW — Quick Status Cards
         ═══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Locations Analyzed"
          value={d?.topLocations?.length ?? 0}
          icon={MapPin}
          color="emerald"
          delay={4}
          onClick={() => setLocation("/locations")}
        />
        <KPICard
          title="Competitors Tracked"
          value={d?.competitorSummary?.length ?? 0}
          icon={Users}
          color="red"
          delay={5}
          onClick={() => setLocation("/competitors")}
        />
        <KPICard
          title="Delivery Ready"
          value={d?.deliveryReady ? "YES" : "NO"}
          icon={Truck}
          color={d?.deliveryReady ? "emerald" : "amber"}
          delay={6}
        />
        <KPICard
          title="Risk Level"
          value={d?.competition ?? "Medium"}
          icon={ShieldCheck}
          color={(d?.competition ?? "").toLowerCase() === "low" ? "emerald" : (d?.competition ?? "").toLowerCase() === "high" ? "red" : "amber"}
          delay={7}
        />
      </div>

      {/* ═══════════════════════════════════════════════════
         MAP + SCORES ROW
         ═══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IndiaMap
          stateScores={mapStateScores}
          highlightStates={d?.topState ? [d.topState] : []}
          onStateClick={(state) => console.log("Clicked state:", state)}
        />
        <ScoreRadar
          scores={{
            expansion: (scores?.overallExpansionScore as number) ?? 0,
            demand: (scores?.demandScore as number) ?? 0,
            competition: (scores?.competitionScore as number) ?? 0,
            growth: (scores?.growthScore as number) ?? 0,
            risk: (scores?.riskScore as number) ?? 0,
            delivery: (scores?.deliveryScore as number) ?? 0,
            financial: (scores?.financialScore as number) ?? 0,
            accessibility: (scores?.accessibilityScore as number) ?? 0,
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════
         AI INSIGHTS — Auto-generated from Report Generator
         ═══════════════════════════════════════════════════ */}
      {(opportunities.length > 0 || warnings.length > 0) && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Insights
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {opportunities.slice(0, 3).map((o, i) => (
              <AIInsightCard
                key={`opp-${i}`}
                title={o.title}
                content={o.description}
                agentName="Report Agent"
                severity="success"
                confidence={0.88}
                delay={i}
              />
            ))}
            {warnings.slice(0, 2).map((w, i) => (
              <AIInsightCard
                key={`warn-${i}`}
                title={w.title}
                content={w.description}
                agentName="Risk Analysis"
                severity={w.severity === "high" ? "danger" : "warning"}
                confidence={0.82}
                delay={i + 3}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
         FINANCIAL + LOCATIONS ROW
         ═══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Financial Projection Chart */}
        {yearlyProjection.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-card-border rounded-[20px] p-5 card-float"
          >
            <h3 className="text-base font-semibold text-foreground mb-1">Revenue Projection</h3>
            <p className="text-xs text-muted-foreground mb-4">
              {yearlyProjection.length}-year financial forecast
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={yearlyProjection}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `Y${v}`}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                  width={48}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12, fontSize: 12,
                  }}
                  formatter={(v: number) => [`₹${(v / 100000).toFixed(1)}L`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(160, 84%, 39%)"
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
            {/* Unit economics summary */}
            <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-border/50">
              {unitEconomics.grossMarginPct !== undefined && (
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">{unitEconomics.grossMarginPct}%</div>
                  <div className="text-[10px] text-muted-foreground">Gross Margin</div>
                </div>
              )}
              {unitEconomics.roiPct !== undefined && (
                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{unitEconomics.roiPct}%</div>
                  <div className="text-[10px] text-muted-foreground">ROI</div>
                </div>
              )}
              {unitEconomics.breakEvenMonths !== undefined && (
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">{unitEconomics.breakEvenMonths}m</div>
                  <div className="text-[10px] text-muted-foreground">Break-even</div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Top Locations Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-card-border rounded-[20px] p-5 card-float"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">Top Scored Locations</h3>
              <p className="text-xs text-muted-foreground">Ranked by expansion potential</p>
            </div>
            <button
              onClick={() => setLocation("/locations")}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2">
            {(d?.topLocations ?? []).slice(0, 6).map((loc, i) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/40 cursor-pointer transition-colors"
                onClick={() => setLocation(`/locations/${loc.id}`)}
              >
                <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                  {loc.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground truncate">{loc.name}</div>
                  <div className="text-xs text-muted-foreground">{loc.city}, {loc.state}</div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  loc.overallScore >= 80 ? "score-excellent" :
                  loc.overallScore >= 65 ? "score-good" :
                  loc.overallScore >= 50 ? "score-fair" : "score-poor"
                }`}>
                  {loc.overallScore?.toFixed(1)}
                </span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                  loc.riskLevel === "low" ? "score-excellent" :
                  loc.riskLevel === "medium" ? "score-fair" : "score-poor"
                }`}>
                  {loc.riskLevel}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════
         LOGISTICS + ONLINE COMMERCE ROW
         ═══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SupplyChainFlow
          optimizations={logistics ? {
            routeEfficiency: (logistics as Record<string, unknown>).routeEfficiency as string,
            costSaving: (logistics as Record<string, unknown>).costSaving as string,
            spoilageReduction: (logistics as Record<string, unknown>).spoilageReduction as string,
            warehouseSuggestion: (logistics as Record<string, unknown>).warehouseSuggestion as string,
          } : undefined}
        />
        <OnlineCommerceGrid
          platforms={onlinePlatforms as Array<{ platform: string; coverage?: string; peakHour?: string; avgRating?: number; available?: boolean }>}
        />
      </div>

      {/* ═══════════════════════════════════════════════════
         COMPETITOR DOMINANCE
         ═══════════════════════════════════════════════════ */}
      {competitorSummary && competitorSummary.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-card-border rounded-[20px] p-5 card-float"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">Competitor Market Share</h3>
              <p className="text-xs text-muted-foreground">Brand dominance in target markets</p>
            </div>
            <button
              onClick={() => setLocation("/competitors")}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Full analysis <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={competitorSummary.slice(0, 8)} barSize={28}>
              <XAxis
                dataKey="brand"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12, fontSize: 12,
                }}
                formatter={(v: number) => [`${v}%`, "Share"]}
              />
              <Bar dataKey="overallShare" radius={[8, 8, 0, 0]}>
                {competitorSummary.slice(0, 8).map((_: unknown, i: number) => (
                  <Cell key={i} fill={i === 0 ? "#10B981" : i === 1 ? "#3B82F6" : i === 2 ? "#8B5CF6" : "#94A3B8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════
         EXECUTIVE SUMMARY
         ═══════════════════════════════════════════════════ */}
      {!!report?.executiveSummary && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-card-border rounded-[20px] p-6 card-float"
        >
          <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Executive Summary
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {report.executiveSummary as string}
          </p>
          {(report?.nextSteps as string[])?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Recommended Next Steps</h4>
              <div className="space-y-1.5">
                {(report.nextSteps as string[]).map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
