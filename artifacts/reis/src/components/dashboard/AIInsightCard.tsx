import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface AIInsightCardProps {
  title: string;
  content: string;
  agentName?: string;
  confidence?: number;
  severity?: "info" | "success" | "warning" | "danger";
  delay?: number;
}

const SEVERITY_STYLES = {
  info: { border: "border-blue-200 dark:border-blue-800/50", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", dot: "bg-blue-500" },
  success: { border: "border-emerald-200 dark:border-emerald-800/50", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", dot: "bg-emerald-500" },
  warning: { border: "border-amber-200 dark:border-amber-800/50", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", dot: "bg-amber-500" },
  danger: { border: "border-red-200 dark:border-red-800/50", badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", dot: "bg-red-500" },
};

export function AIInsightCard({ title, content, agentName, confidence, severity = "info", delay = 0 }: AIInsightCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const style = SEVERITY_STYLES[severity];
  const isLong = content.length > 180;
  const displayContent = isLong && !expanded ? content.slice(0, 180) + "…" : content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: delay * 0.06 }}
      className={`bg-card border ${style.border} rounded-[20px] p-5 card-hover`}
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            {agentName && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${style.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                {agentName}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {displayContent}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-primary hover:underline mt-2"
            >
              {expanded ? <><ChevronUp className="h-3 w-3" /> Show less</> : <><ChevronDown className="h-3 w-3" /> Read more</>}
            </button>
          )}
          {confidence !== undefined && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence * 100}%` }}
                  transition={{ duration: 0.8, delay: delay * 0.06 + 0.3 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">{Math.round(confidence * 100)}% confidence</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
