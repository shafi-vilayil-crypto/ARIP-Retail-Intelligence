import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListCompanies, useCreateCompany, useDeleteCompany } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useCompany } from "@/context/CompanyContext";
import {
  Sparkles, Building2, Plus, ChevronRight, Trash2, Play,
  CheckCircle2, XCircle, Clock, Loader2, MapPin, Target,
  TrendingUp, Users, Globe, Calendar, DollarSign, BarChart3,
  ArrowRight, ArrowLeft, Zap, Truck, ShoppingCart, FileText,
  X, Tag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  { label: "Company", icon: Building2, desc: "Basic company profile" },
  { label: "Competitors", icon: Users, desc: "Known market rivals" },
  { label: "Expansion Scope", icon: Globe, desc: "Target geography" },
  { label: "Generate", icon: Sparkles, desc: "Launch AI analysis" },
] as const;

const INDUSTRIES = [
  "Beverage Retail", "Food & Beverage", "Quick Service Restaurant",
  "Retail Chain", "FMCG", "Pharmacy", "Apparel", "Electronics",
  "Grocery", "Coffee & Café", "Ice Cream & Desserts", "Other",
];

const BUSINESS_MODELS = ["Owned", "Franchise", "Owned + Franchise", "License", "Cooperative", "Hybrid"];
const TIMELINES = ["1 Year", "2 Years", "3 Years", "5 Years", "10 Years"];

const EXPANSION_SCOPES = [
  { value: "India", label: "Pan India", desc: "All states and territories", icon: Globe },
  { value: "Multiple States", label: "Multiple States", desc: "Select specific states", icon: Map },
  { value: "Single State", label: "Single State", desc: "One state focus", icon: MapPin },
  { value: "District", label: "District", desc: "District-level analysis", icon: Target },
  { value: "City", label: "City", desc: "Single city deep-dive", icon: Building2 },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Delhi", "Chandigarh", "Puducherry", "Jammu & Kashmir", "Ladakh",
];

const AGENT_PIPELINE = [
  { icon: Globe, label: "Market Research", desc: "Demographics, income, urbanization", color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30" },
  { icon: MapPin, label: "GIS Intelligence", desc: "Roads, transit, POI mapping", color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30" },
  { icon: Users, label: "Competitor Intel", desc: "Rival brand mapping & gaps", color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30" },
  { icon: BarChart3, label: "Demand Intel", desc: "Consumption potential", color: "text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30" },
  { icon: ShoppingCart, label: "Online Commerce", desc: "Delivery platform coverage", color: "text-orange-500 bg-orange-100 dark:bg-orange-900/30" },
  { icon: TrendingUp, label: "Financial Model", desc: "ROI & projections", color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30" },
  { icon: Truck, label: "Logistics", desc: "Supply chain design", color: "text-pink-500 bg-pink-100 dark:bg-pink-900/30" },
  { icon: Target, label: "Scoring Agent", desc: "8-dimension scoring", color: "text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30" },
  { icon: FileText, label: "Report Generator", desc: "Executive synthesis", color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" },
];

function Map(props: { className?: string }) {
  return <Globe {...props} />;
}

export default function Analysis() {
  const [, setLocation] = useLocation();
  const { setActiveCompanyId, refetchCompanies } = useCompany();
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", industry: "Beverage Retail", headquarters: "",
    businessModel: "Owned + Franchise", currentStates: [] as string[],
    products: [] as string[], productInput: "",
    competitors: [] as string[], competitorInput: "",
    expansionGoal: "National expansion with maximum market penetration",
    expansionScope: "India", expansionStates: [] as string[],
    timeline: "3 Years", budget: "",
  });
  const [analyzing, setAnalyzing] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const { data: companiesRaw, isLoading } = useListCompanies();
  const companies = Array.isArray(companiesRaw) ? companiesRaw : [];
  const createMutation = useCreateCompany();
  const deleteMutation = useDeleteCompany();
  const queryClient = useQueryClient();

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const f = (k: keyof typeof form, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const addTag = (field: "products" | "competitors", inputField: "productInput" | "competitorInput") => {
    const val = form[inputField].trim();
    if (val && !form[field].includes(val)) {
      f(field, [...form[field], val]);
      f(inputField, "");
    }
  };

  const removeTag = (field: "products" | "competitors", val: string) => {
    f(field, form[field].filter(t => t !== val));
  };

  const handleCreate = async () => {
    const res = await createMutation.mutateAsync({
      data: {
        name: form.name, industry: form.industry, headquarters: form.headquarters,
        businessModel: form.businessModel, currentStates: form.currentStates,
        products: form.products, competitors: form.competitors,
        expansionGoal: form.expansionGoal, expansionScope: form.expansionScope,
        expansionStates: form.expansionStates, timeline: form.timeline,
        budget: form.budget || undefined,
      }
    });
    setShowWizard(false);
    setStep(0);
    setActiveCompanyId(res.id);
    startAnalysis(res.id);
  };

  const startAnalysis = async (id: number) => {
    setAnalyzing(id);
    setProgress(0);
    setLogs([]);
    setDone(false);

    try {
      const res = await fetch(`/api/companies/${id}/analyze`, { method: "POST" });
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";
        for (const part of parts) {
          const line = part.replace(/^data:\s*/, "");
          if (!line) continue;
          try {
            const evt = JSON.parse(line);
            if (evt.type === "progress") setProgress(evt.progress);
            if (evt.type === "log") setLogs(p => [...p, evt.message]);
            if (evt.type === "done") { setDone(true); refetchCompanies(); }
            if (evt.type === "error") setLogs(p => [...p, `❌ Error: ${evt.message}`]);
          } catch {}
        }
      }
    } finally {
      setAnalyzing(null);
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
    }
  };

  const statusColor = (s: string) => {
    if (s === "completed") return "score-excellent";
    if (s === "running") return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400";
    if (s === "failed") return "score-poor";
    return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  };

  const statusIcon = (s: string) => {
    if (s === "completed") return <CheckCircle2 className="h-3.5 w-3.5" />;
    if (s === "running") return <Loader2 className="h-3.5 w-3.5 animate-spin" />;
    if (s === "failed") return <XCircle className="h-3.5 w-3.5" />;
    return <Clock className="h-3.5 w-3.5" />;
  };

  const canProceed = () => {
    if (step === 0) return form.name.trim().length > 0 && form.headquarters.trim().length > 0;
    if (step === 1) return true; // competitors are optional
    if (step === 2) return true;
    return true;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">AI Agent Analysis</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure your company profile and let 9 autonomous AI agents generate full market intelligence.
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { setShowWizard(true); setStep(0); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-md hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          New Company
        </motion.button>
      </div>

      {/* Agent Pipeline Overview */}
      <div className="bg-card border border-card-border rounded-[20px] p-5 card-float">
        <h3 className="text-sm font-semibold text-foreground mb-3">9-Agent Intelligence Pipeline</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          {AGENT_PIPELINE.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex flex-col items-center gap-1.5 text-center"
            >
              <div className={`h-10 w-10 rounded-xl ${a.color} flex items-center justify-center`}>
                <a.icon className="h-4.5 w-4.5" />
              </div>
              <div className="text-[10px] font-semibold text-foreground leading-tight">{a.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Companies List */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Company Profiles</h2>
        {isLoading && (
          <div className="grid gap-3">
            {[1, 2].map(i => <div key={i} className="h-24 rounded-[20px] bg-muted animate-pulse" />)}
          </div>
        )}
        {!isLoading && (!companies || companies.length === 0) && (
          <Card className="rounded-[20px] border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground text-lg">No companies yet</div>
                <div className="text-sm text-muted-foreground mt-1">Create your first company profile to begin AI analysis</div>
              </div>
              <button
                onClick={() => setShowWizard(true)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-md ai-pulse"
              >
                <Sparkles className="h-4 w-4" />
                Get Started
              </button>
            </CardContent>
          </Card>
        )}

        {companies?.map(c => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-card-border rounded-[20px] p-5 card-float card-hover"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground truncate">{c.name}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(c.analysisStatus)}`}>
                      {statusIcon(c.analysisStatus)}
                      {c.analysisStatus.charAt(0).toUpperCase() + c.analysisStatus.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {c.industry} · {c.headquarters} · {c.expansionScope}
                  </div>
                  {c.products && (c.products as string[]).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(c.products as string[]).slice(0, 5).map((p: string) => (
                        <span key={p} className="px-2 py-0.5 bg-muted rounded-lg text-xs text-muted-foreground">{p}</span>
                      ))}
                    </div>
                  )}
                  {/* Analysis progress */}
                  {analyzing === c.id && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>9 Agents running…</span>
                        <span className="font-mono">{progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <div className="h-24 overflow-y-auto bg-muted/40 rounded-xl p-2.5 space-y-1 custom-scrollbar">
                        {logs.map((l, i) => (
                          <div key={i} className="text-xs text-muted-foreground font-mono leading-relaxed">{l}</div>
                        ))}
                        <div ref={logsEndRef} />
                      </div>
                    </div>
                  )}
                  {/* Done message */}
                  {done && analyzing === null && c.analysisStatus === "completed" && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      Analysis complete — dashboard ready
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {c.analysisStatus === "completed" && (
                  <button
                    onClick={() => { setActiveCompanyId(c.id); setLocation("/"); }}
                    className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-xl font-medium hover:bg-primary/20 transition-colors"
                  >
                    View Dashboard <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
                {(c.analysisStatus === "idle" || c.analysisStatus === "failed") && analyzing !== c.id && (
                  <button
                    onClick={() => startAnalysis(c.id)}
                    className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-xl font-medium shadow-sm"
                  >
                    <Play className="h-3.5 w-3.5" />
                    {c.analysisStatus === "failed" ? "Retry" : "Analyze"}
                  </button>
                )}
                <button
                  onClick={() => deleteMutation.mutate({ id: c.id })}
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════
         4-STEP WIZARD MODAL
         ═══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showWizard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-[24px] shadow-2xl w-full max-w-xl overflow-hidden"
            >
              {/* Wizard Header */}
              <div className="px-6 pt-6 pb-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-bold text-foreground">New Company Profile</span>
                  </div>
                  <button onClick={() => setShowWizard(false)} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                {/* Step indicators */}
                <div className="flex items-center gap-1">
                  {STEPS.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <React.Fragment key={s.label}>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                          i === step ? "bg-primary/10 text-primary" :
                          i < step ? "text-emerald-600 dark:text-emerald-400" :
                          "text-muted-foreground"
                        }`}>
                          {i < step ? <CheckCircle2 className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                          <span className="hidden sm:inline">{s.label}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 rounded-full ${i < step ? "bg-primary" : "bg-muted"}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Wizard Body */}
              <div className="px-6 py-5 space-y-4 max-h-[55vh] overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                  {/* ── STEP 1: Company Setup ── */}
                  {step === 0 && (
                    <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Company Name *</label>
                        <input
                          value={form.name} onChange={e => f("name", e.target.value)}
                          placeholder="e.g. Mouzy, Milma, Third Wave Coffee"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">Industry</label>
                          <select value={form.industry} onChange={e => f("industry", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground">
                            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">Business Model</label>
                          <select value={form.businessModel} onChange={e => f("businessModel", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground">
                            {BUSINESS_MODELS.map(m => <option key={m}>{m}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Headquarters *</label>
                        <input
                          value={form.headquarters} onChange={e => f("headquarters", e.target.value)}
                          placeholder="e.g. Kochi, Kerala"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Products / Offerings</label>
                        <div className="flex gap-2">
                          <input
                            value={form.productInput} onChange={e => f("productInput", e.target.value)}
                            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag("products", "productInput"))}
                            placeholder="Type a product and press Enter"
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                          />
                          <button onClick={() => addTag("products", "productInput")}
                            className="px-3 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        {form.products.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {form.products.map(p => (
                              <span key={p} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium">
                                {p}
                                <button onClick={() => removeTag("products", p)} className="hover:text-destructive">
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">Timeline</label>
                          <select value={form.timeline} onChange={e => f("timeline", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground">
                            {TIMELINES.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">Budget (optional)</label>
                          <input
                            value={form.budget} onChange={e => f("budget", e.target.value)}
                            placeholder="e.g. ₹30 Crore"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 2: Competitors ── */}
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Known Competitors</label>
                        <p className="text-xs text-muted-foreground mb-3">Add brands that compete in your market. The AI will discover more.</p>
                        <div className="flex gap-2">
                          <input
                            value={form.competitorInput} onChange={e => f("competitorInput", e.target.value)}
                            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag("competitors", "competitorInput"))}
                            placeholder="Type a competitor name and press Enter"
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                          />
                          <button onClick={() => addTag("competitors", "competitorInput")}
                            className="px-3 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        {form.competitors.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {form.competitors.map(c => (
                              <span key={c} className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium">
                                <Users className="h-3 w-3" />
                                {c}
                                <button onClick={() => removeTag("competitors", c)} className="hover:text-destructive">
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Quick-add suggestions based on industry */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Quick Add Suggestions</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(form.industry === "Beverage Retail"
                            ? ["Milma", "Amul", "Naturals", "Juice Lounge", "Frozen Bottle", "Cafe Coffee Day", "Starbucks"]
                            : form.industry === "Quick Service Restaurant"
                            ? ["McDonald's", "KFC", "Burger King", "Subway", "Domino's", "Pizza Hut"]
                            : form.industry === "Coffee & Café"
                            ? ["Starbucks", "Third Wave Coffee", "Blue Tokai", "Cafe Coffee Day", "Tim Hortons"]
                            : ["Brand A", "Brand B", "Brand C"]
                          ).filter(s => !form.competitors.includes(s)).map(s => (
                            <button
                              key={s}
                              onClick={() => f("competitors", [...form.competitors, s])}
                              className="px-2.5 py-1 bg-muted/60 hover:bg-muted rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors border border-border/50"
                            >
                              + {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 3: Expansion Scope ── */}
                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">Expansion Scope</label>
                        <div className="grid grid-cols-1 gap-2">
                          {EXPANSION_SCOPES.map(scope => {
                            const Icon = scope.icon;
                            const isSelected = form.expansionScope === scope.value;
                            return (
                              <button
                                key={scope.value}
                                onClick={() => f("expansionScope", scope.value)}
                                className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-border hover:border-primary/30 hover:bg-muted/30"
                                }`}
                              >
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                                  isSelected ? "bg-primary/10" : "bg-muted"
                                }`}>
                                  <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                                </div>
                                <div>
                                  <div className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>{scope.label}</div>
                                  <div className="text-xs text-muted-foreground">{scope.desc}</div>
                                </div>
                                {isSelected && <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      {/* State selector for Multiple States / Single State */}
                      {(form.expansionScope === "Multiple States" || form.expansionScope === "Single State") && (
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">
                            Select {form.expansionScope === "Single State" ? "State" : "States"}
                          </label>
                          <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto custom-scrollbar p-1">
                            {INDIAN_STATES.map(state => {
                              const selected = form.expansionStates.includes(state);
                              return (
                                <button
                                  key={state}
                                  onClick={() => {
                                    if (form.expansionScope === "Single State") {
                                      f("expansionStates", [state]);
                                    } else {
                                      f("expansionStates", selected
                                        ? form.expansionStates.filter(s => s !== state)
                                        : [...form.expansionStates, state]
                                      );
                                    }
                                  }}
                                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium text-left transition-all ${
                                    selected ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted/60 text-muted-foreground hover:bg-muted border border-transparent"
                                  }`}
                                >
                                  {state}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Expansion Goal</label>
                        <textarea
                          value={form.expansionGoal} onChange={e => f("expansionGoal", e.target.value)}
                          rows={2}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 4: Generate ── */}
                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 py-4">
                      {/* Summary */}
                      <div className="bg-muted/40 rounded-2xl p-4 space-y-2">
                        <h4 className="text-sm font-semibold text-foreground">Profile Summary</h4>
                        <div className="grid grid-cols-2 gap-y-2 text-xs">
                          <div className="text-muted-foreground">Company</div>
                          <div className="text-foreground font-medium">{form.name}</div>
                          <div className="text-muted-foreground">Industry</div>
                          <div className="text-foreground font-medium">{form.industry}</div>
                          <div className="text-muted-foreground">HQ</div>
                          <div className="text-foreground font-medium">{form.headquarters}</div>
                          <div className="text-muted-foreground">Model</div>
                          <div className="text-foreground font-medium">{form.businessModel}</div>
                          <div className="text-muted-foreground">Scope</div>
                          <div className="text-foreground font-medium">{form.expansionScope}</div>
                          <div className="text-muted-foreground">Timeline</div>
                          <div className="text-foreground font-medium">{form.timeline}</div>
                          {form.budget && <>
                            <div className="text-muted-foreground">Budget</div>
                            <div className="text-foreground font-medium">{form.budget}</div>
                          </>}
                        </div>
                        {form.products.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {form.products.map(p => (
                              <span key={p} className="px-2 py-0.5 bg-primary/10 text-primary rounded-lg text-[10px] font-medium">{p}</span>
                            ))}
                          </div>
                        )}
                        {form.competitors.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {form.competitors.map(c => (
                              <span key={c} className="px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-medium">{c}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Generate Button */}
                      <div className="flex flex-col items-center gap-3 py-4">
                        <div className="text-center">
                          <h3 className="text-lg font-bold text-foreground">Ready to analyze</h3>
                          <p className="text-xs text-muted-foreground mt-1">9 AI agents will generate your complete expansion intelligence</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wizard Footer */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
                <button
                  onClick={() => { if (step === 0) setShowWizard(false); else setStep(s => s - 1); }}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-xl"
                >
                  {step > 0 && <ArrowLeft className="h-3.5 w-3.5" />}
                  {step === 0 ? "Cancel" : "Back"}
                </button>
                <button
                  onClick={() => {
                    if (step < STEPS.length - 1) setStep(s => s + 1);
                    else handleCreate();
                  }}
                  disabled={!canProceed() || createMutation.isPending}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold disabled:opacity-50 transition-all ${
                    step === STEPS.length - 1
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg ai-pulse"
                      : "bg-primary text-primary-foreground shadow-sm"
                  }`}
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {step < STEPS.length - 1 ? (
                    <>Continue <ArrowRight className="h-3.5 w-3.5" /></>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Generate Expansion Intelligence
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
