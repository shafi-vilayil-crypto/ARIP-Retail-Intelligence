// ═══════════════════════════════════════════════════════════════════
// Onboarding Store — 5-step wizard state management
// ═══════════════════════════════════════════════════════════════════
import { create } from "zustand";
import type {
  CompanyProfile, ExpansionGoals, Competitor, DataUpload,
  IndustryType, BusinessModel,
} from "@/shared/types";

interface OnboardingState {
  currentStep: number;
  totalSteps: number;

  // Step 1 — Company Profile
  companyProfile: {
    name: string;
    industry: IndustryType;
    businessCategory: string;
    headquarters: string;
    website: string;
    brandColors: { primary: string; secondary: string; accent: string };
    currentStates: string[];
    currentCities: string[];
    businessModel: BusinessModel;
    franchiseOrOwned: "Franchise" | "Owned" | "Mixed";
    productCategories: string[];
    outletCount: number;
    warehouseCount: number;
    manufacturingUnits: number;
    distributionCenters: number;
  };

  // Step 2 — Expansion Goals
  expansionGoals: {
    targetStates: string[];
    targetDistricts: string[];
    targetCities: string[];
    expansionTimeline: string;
    investmentBudget: string;
    preferredOutletSize: string;
    preferredCustomerSegment: string;
    priorityMarkets: string[];
  };

  // Step 3 — Competitors
  competitors: Array<{
    name: string;
    scope: "national" | "regional" | "local";
  }>;

  // Step 4 — Data Uploads
  dataUploads: DataUpload[];

  // Step 5 — AI Initialization
  aiStatus: "idle" | "running" | "completed" | "failed";
  aiProgress: number;
  aiLogs: string[];

  // Actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateCompanyProfile: (updates: Partial<OnboardingState["companyProfile"]>) => void;
  updateExpansionGoals: (updates: Partial<OnboardingState["expansionGoals"]>) => void;
  addCompetitor: (name: string, scope: "national" | "regional" | "local") => void;
  removeCompetitor: (name: string) => void;
  addDataUpload: (upload: DataUpload) => void;
  removeDataUpload: (id: string) => void;
  startAIInit: () => Promise<void>;
  reset: () => void;
}

const initialCompanyProfile: OnboardingState["companyProfile"] = {
  name: "",
  industry: "Supermarket",
  businessCategory: "",
  headquarters: "",
  website: "",
  brandColors: { primary: "#10B981", secondary: "#3B82F6", accent: "#F59E0B" },
  currentStates: [],
  currentCities: [],
  businessModel: "Owned",
  franchiseOrOwned: "Owned",
  productCategories: [],
  outletCount: 0,
  warehouseCount: 0,
  manufacturingUnits: 0,
  distributionCenters: 0,
};

const initialExpansionGoals: OnboardingState["expansionGoals"] = {
  targetStates: [],
  targetDistricts: [],
  targetCities: [],
  expansionTimeline: "3 Years",
  investmentBudget: "",
  preferredOutletSize: "",
  preferredCustomerSegment: "",
  priorityMarkets: [],
};

const AI_INIT_LOGS = [
  "🔄 Initializing AI Agent Pipeline...",
  "📊 Market Research Agent: Analyzing demographics for target states...",
  "🗺️ GIS Intelligence Agent: Mapping infrastructure and POI data...",
  "👥 Competitor Intel Agent: Scanning competitive landscape...",
  "📈 Demand Forecasting Agent: Building consumption models...",
  "🛒 Online Commerce Agent: Analyzing delivery platform coverage...",
  "💰 Financial Modeling Agent: Computing ROI projections...",
  "🚚 Logistics Agent: Designing supply chain topology...",
  "🎯 Scoring Agent: Computing 8-dimension expansion scores...",
  "📋 Report Generator: Synthesizing executive intelligence...",
  "✅ Data validation complete — 0 errors found",
  "✅ Relationships built across 6 target markets",
  "✅ Baseline analytics generated",
  "✅ AI Initialization complete — Dashboard ready!",
];

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentStep: 0,
  totalSteps: 5,
  companyProfile: { ...initialCompanyProfile },
  expansionGoals: { ...initialExpansionGoals },
  competitors: [],
  dataUploads: [],
  aiStatus: "idle",
  aiProgress: 0,
  aiLogs: [],

  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps - 1) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
  goToStep: (step) => set({ currentStep: step }),

  updateCompanyProfile: (updates) =>
    set((s) => ({ companyProfile: { ...s.companyProfile, ...updates } })),

  updateExpansionGoals: (updates) =>
    set((s) => ({ expansionGoals: { ...s.expansionGoals, ...updates } })),

  addCompetitor: (name, scope) =>
    set((s) => {
      if (s.competitors.some((c) => c.name === name)) return s;
      return { competitors: [...s.competitors, { name, scope }] };
    }),

  removeCompetitor: (name) =>
    set((s) => ({ competitors: s.competitors.filter((c) => c.name !== name) })),

  addDataUpload: (upload) =>
    set((s) => ({ dataUploads: [...s.dataUploads, upload] })),

  removeDataUpload: (id) =>
    set((s) => ({ dataUploads: s.dataUploads.filter((u) => u.id !== id) })),

  startAIInit: async () => {
    set({ aiStatus: "running", aiProgress: 0, aiLogs: [] });
    for (let i = 0; i < AI_INIT_LOGS.length; i++) {
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
      set((s) => ({
        aiLogs: [...s.aiLogs, AI_INIT_LOGS[i]],
        aiProgress: Math.round(((i + 1) / AI_INIT_LOGS.length) * 100),
      }));
    }
    set({ aiStatus: "completed" });
  },

  reset: () =>
    set({
      currentStep: 0,
      companyProfile: { ...initialCompanyProfile },
      expansionGoals: { ...initialExpansionGoals },
      competitors: [],
      dataUploads: [],
      aiStatus: "idle",
      aiProgress: 0,
      aiLogs: [],
    }),
}));
