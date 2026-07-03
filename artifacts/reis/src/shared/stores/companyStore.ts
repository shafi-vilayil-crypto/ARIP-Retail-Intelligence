// ═══════════════════════════════════════════════════════════════════
// Company Store — Active company and company list management
// ═══════════════════════════════════════════════════════════════════
import { create } from "zustand";
import type { CompanyProfile, ExpansionGoals, Competitor } from "@/shared/types";
import { mockCompanies, mockExpansionGoals, mockCompetitors } from "@/shared/lib/mockData";

interface CompanyState {
  companies: CompanyProfile[];
  activeCompany: CompanyProfile | null;
  expansionGoals: ExpansionGoals | null;
  competitors: Competitor[];
  isLoading: boolean;

  setActiveCompany: (company: CompanyProfile) => void;
  setActiveCompanyById: (id: string) => void;
  loadCompanies: () => Promise<void>;
  updateCompany: (updates: Partial<CompanyProfile>) => void;
  addCompany: (company: CompanyProfile) => void;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  activeCompany: null,
  expansionGoals: null,
  competitors: [],
  isLoading: false,

  setActiveCompany: (company) => {
    set({
      activeCompany: company,
      expansionGoals: mockExpansionGoals,
      competitors: mockCompetitors.filter((c) => c.companyId === company.id),
    });
  },

  setActiveCompanyById: (id) => {
    const company = get().companies.find((c) => c.id === id);
    if (company) {
      get().setActiveCompany(company);
    }
  },

  loadCompanies: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 500));
    set({
      companies: mockCompanies,
      activeCompany: mockCompanies[0],
      expansionGoals: mockExpansionGoals,
      competitors: mockCompetitors,
      isLoading: false,
    });
  },

  updateCompany: (updates) => {
    const { activeCompany, companies } = get();
    if (!activeCompany) return;
    const updated = { ...activeCompany, ...updates, updatedAt: new Date().toISOString() };
    set({
      activeCompany: updated,
      companies: companies.map((c) => (c.id === updated.id ? updated : c)),
    });
  },

  addCompany: (company) => {
    set((s) => ({ companies: [...s.companies, company] }));
  },
}));
