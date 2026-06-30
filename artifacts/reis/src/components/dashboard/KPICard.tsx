import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  color?: string;
  delay?: number;
  onClick?: () => void;
}

const COLORS: Record<string, { bg: string; text: string; glow: string }> = {
  emerald: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400", glow: "glow-emerald" },
  blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", glow: "glow-blue" },
  amber: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400", glow: "glow-amber" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", glow: "" },
  red: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400", glow: "" },
};

export function KPICard({ title, value, subtitle, icon: Icon, trend, trendLabel, color = "emerald", delay = 0, onClick }: KPICardProps) {
  const c = COLORS[color] ?? COLORS.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08 }}
      onClick={onClick}
      className={`bg-card border border-card-border rounded-[20px] p-5 card-float card-hover ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={`h-11 w-11 rounded-2xl ${c.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`h-5 w-5 ${c.text}`} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/50">
          {trend === "up" && <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />}
          {trend === "down" && <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />}
          {trend === "neutral" && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
          <span className={`text-xs font-medium ${
            trend === "up" ? "text-emerald-600 dark:text-emerald-400" :
            trend === "down" ? "text-red-600 dark:text-red-400" :
            "text-muted-foreground"
          }`}>
            {trendLabel ?? (trend === "up" ? "Trending up" : trend === "down" ? "Trending down" : "Stable")}
          </span>
        </div>
      )}
    </motion.div>
  );
}
