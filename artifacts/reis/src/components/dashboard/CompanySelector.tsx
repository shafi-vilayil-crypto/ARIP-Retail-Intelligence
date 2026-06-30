import React from "react";
import { motion } from "framer-motion";
import { useCompany } from "@/context/CompanyContext";
import { ChevronDown, Building2, CheckCircle2, Loader2, Clock } from "lucide-react";

export function CompanySelector() {
  const { companies, activeCompany, setActiveCompanyId } = useCompany();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (companies.length === 0) return null;

  const statusIcon = (s: string) => {
    if (s === "completed") return <CheckCircle2 className="h-3 w-3 text-emerald-500" />;
    if (s === "running") return <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />;
    return <Clock className="h-3 w-3 text-muted-foreground" />;
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-2xl bg-muted/60 hover:bg-muted transition-colors text-left"
      >
        <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Building2 className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-foreground truncate">
            {activeCompany?.name ?? "Select Company"}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {activeCompany?.industry ?? "No company selected"}
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.15 }}
          className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-2xl shadow-lg z-50 overflow-hidden"
        >
          <div className="py-1.5 max-h-64 overflow-y-auto custom-scrollbar">
            {companies.map((c) => (
              <button
                key={c.id}
                onClick={() => { setActiveCompanyId(c.id); setOpen(false); }}
                className={`flex items-center gap-2.5 w-full px-3 py-2 text-left hover:bg-muted/60 transition-colors ${
                  c.id === activeCompany?.id ? "bg-primary/5" : ""
                }`}
              >
                {statusIcon(c.analysisStatus)}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.industry}</div>
                </div>
                {c.id === activeCompany?.id && (
                  <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
