import React from "react";
import { motion } from "framer-motion";
import { Factory, Warehouse, Snowflake, Truck, Store, User } from "lucide-react";

interface SupplyChainFlowProps {
  optimizations?: {
    routeEfficiency?: string;
    costSaving?: string;
    spoilageReduction?: string;
    warehouseSuggestion?: string;
  };
}

const NODES = [
  { icon: Factory, label: "Factory", sublabel: "Production Hub", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
  { icon: Warehouse, label: "Warehouse", sublabel: "Central Storage", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
  { icon: Snowflake, label: "Cold Storage", sublabel: "Temperature Ctrl", color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400" },
  { icon: Truck, label: "Distributor", sublabel: "Route Network", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
  { icon: Store, label: "Outlet", sublabel: "Retail Point", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
  { icon: User, label: "Customer", sublabel: "End Consumer", color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" },
];

export function SupplyChainFlow({ optimizations }: SupplyChainFlowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-card-border rounded-[20px] p-5 card-float"
    >
      <h3 className="text-base font-semibold text-foreground mb-1">Supply Chain Flow</h3>
      <p className="text-xs text-muted-foreground mb-5">Optimized logistics pipeline</p>

      {/* Flow diagram */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
        {NODES.map((node, i) => (
          <React.Fragment key={node.label}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="flex flex-col items-center gap-1.5 min-w-[72px]"
            >
              <div className={`h-12 w-12 rounded-2xl ${node.color} flex items-center justify-center`}>
                <node.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-foreground whitespace-nowrap">{node.label}</span>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{node.sublabel}</span>
            </motion.div>
            {i < NODES.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, delay: i * 0.08 + 0.15 }}
                className="flex-1 min-w-[16px] max-w-[40px]"
              >
                <div className="h-0.5 bg-gradient-to-r from-border to-primary/40 rounded-full" />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Optimizations */}
      {optimizations && (
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/50">
          {optimizations.routeEfficiency && (
            <div className="bg-muted/50 rounded-xl px-3 py-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Route Efficiency</div>
              <div className="text-sm font-semibold text-foreground mt-0.5">{optimizations.routeEfficiency}</div>
            </div>
          )}
          {optimizations.costSaving && (
            <div className="bg-muted/50 rounded-xl px-3 py-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Cost Saving</div>
              <div className="text-sm font-semibold text-foreground mt-0.5">{optimizations.costSaving}</div>
            </div>
          )}
          {optimizations.spoilageReduction && (
            <div className="bg-muted/50 rounded-xl px-3 py-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Spoilage Reduction</div>
              <div className="text-sm font-semibold text-foreground mt-0.5">{optimizations.spoilageReduction}</div>
            </div>
          )}
          {optimizations.warehouseSuggestion && (
            <div className="bg-muted/50 rounded-xl px-3 py-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Warehouse</div>
              <div className="text-sm font-semibold text-foreground mt-0.5">{optimizations.warehouseSuggestion}</div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
