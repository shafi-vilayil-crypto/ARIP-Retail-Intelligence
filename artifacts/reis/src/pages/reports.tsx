import React from "react";
import { useCompany } from "@/context/CompanyContext";
import { motion } from "framer-motion";
import { FileText, Download, Sparkles, ArrowRight, BarChart3, Map, Target } from "lucide-react";

export default function Reports() {
  const { activeCompany, dashboardData } = useCompany();
  const report = dashboardData?.agentResults?.find(r => r.resultType === "report")?.data as Record<string, unknown> | undefined;
  const scores = dashboardData?.agentResults?.find(r => r.resultType === "scores")?.data as Record<string, unknown> | undefined;

  if (!activeCompany || activeCompany.analysisStatus !== "completed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
          <FileText className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">No Reports Available</h2>
          <p className="text-sm text-muted-foreground mt-1">Complete an AI analysis to generate reports.</p>
        </div>
      </div>
    );
  }

  const executiveSummary = report?.executiveSummary as string ?? "";
  const opportunities = (report?.topOpportunities ?? []) as Array<{ title: string; description: string; impact: string }>;
  const warnings = (report?.warnings ?? []) as Array<{ title: string; description: string; severity: string }>;
  const nextSteps = (report?.nextSteps ?? []) as string[];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            AI-generated reports for <span className="text-primary font-semibold">{activeCompany.name}</span>
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-md hover:opacity-90 transition-opacity">
          <Download className="h-4 w-4" />
          Export PDF
        </button>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: FileText, label: "Executive Brief", desc: "One-page summary", active: true },
          { icon: BarChart3, label: "Full Analysis", desc: "Detailed report", active: false },
          { icon: Map, label: "Heatmap Report", desc: "Geographic view", active: false },
        ].map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`bg-card border rounded-[20px] p-4 cursor-pointer transition-all ${
              r.active ? "border-primary shadow-md" : "border-border card-hover"
            }`}
          >
            <r.icon className={`h-5 w-5 mb-2 ${r.active ? "text-primary" : "text-muted-foreground"}`} />
            <div className="text-sm font-semibold text-foreground">{r.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Executive Summary */}
      {executiveSummary && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-card-border rounded-[20px] p-6 card-float">
          <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Executive Summary
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{executiveSummary}</p>
        </motion.div>
      )}

      {/* Key Scores */}
      {scores && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Expansion", value: scores.overallExpansionScore },
            { label: "Demand", value: scores.demandScore },
            { label: "Financial", value: scores.financialScore },
            { label: "Growth", value: scores.growthScore },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-card-border rounded-[20px] p-4 text-center card-float">
              <div className={`text-2xl font-bold ${(s.value as number ?? 0) >= 70 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                {(s.value as number)?.toFixed?.(0) ?? "—"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{s.label} Score</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-card-border rounded-[20px] p-6 card-float">
          <h3 className="text-base font-semibold text-foreground mb-4">Top Opportunities</h3>
          <div className="space-y-3">
            {opportunities.map((o, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-foreground">{o.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{o.description}</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">Impact: {o.impact}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Next Steps */}
      {nextSteps.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-card-border rounded-[20px] p-6 card-float">
          <h3 className="text-base font-semibold text-foreground mb-3">Recommended Next Steps</h3>
          <div className="space-y-2">
            {nextSteps.map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                <span className="text-sm text-muted-foreground">{s}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
