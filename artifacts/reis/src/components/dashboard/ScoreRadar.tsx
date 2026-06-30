import React from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

interface ScoreRadarProps {
  scores: {
    expansion?: number;
    demand?: number;
    competition?: number;
    growth?: number;
    risk?: number;
    delivery?: number;
    financial?: number;
    accessibility?: number;
  };
}

export function ScoreRadar({ scores }: ScoreRadarProps) {
  const data = [
    { metric: "Expansion", value: scores.expansion ?? 0, fullMark: 100 },
    { metric: "Demand", value: scores.demand ?? 0, fullMark: 100 },
    { metric: "Competition", value: scores.competition ?? 0, fullMark: 100 },
    { metric: "Growth", value: scores.growth ?? 0, fullMark: 100 },
    { metric: "Risk", value: scores.risk ?? 0, fullMark: 100 },
    { metric: "Delivery", value: scores.delivery ?? 0, fullMark: 100 },
    { metric: "Financial", value: scores.financial ?? 0, fullMark: 100 },
    { metric: "Accessibility", value: scores.accessibility ?? 0, fullMark: 100 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-card-border rounded-[20px] p-5 card-float"
    >
      <h3 className="text-base font-semibold text-foreground mb-1">Intelligence Scores</h3>
      <p className="text-xs text-muted-foreground mb-4">8-dimension analysis overview</p>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
          />
          <Radar
            dataKey="value"
            stroke="hsl(160, 84%, 39%)"
            fill="hsl(160, 84%, 39%)"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 12,
              fontSize: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            formatter={(value: number) => [`${value}/100`, "Score"]}
          />
        </RadarChart>
      </ResponsiveContainer>
      {/* Score summary row */}
      <div className="grid grid-cols-4 gap-2 mt-2">
        {data.slice(0, 4).map(d => (
          <div key={d.metric} className="text-center">
            <div className={`text-lg font-bold ${d.value >= 80 ? "text-emerald-600 dark:text-emerald-400" : d.value >= 60 ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-400"}`}>
              {d.value}
            </div>
            <div className="text-[10px] text-muted-foreground">{d.metric}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
