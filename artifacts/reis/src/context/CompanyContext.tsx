import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useListCompanies, type Company } from "@workspace/api-client-react";

export type CompanyProfile = Company;

export interface CompanyDashboardData {
  companyId: number;
  companyName: string;
  analysisStatus: string;
  topState: string | null;
  topDistrict: string | null;
  bestTown: string | null;
  expansionScore: number | null;
  expectedRoiMonths: number | null;
  competition: string | null;
  investment: string | null;
  deliveryReady: boolean | null;
  topLocations: Array<{
    id: number; name: string; city: string; state: string;
    overallScore: number; recommendation: string; riskLevel: string;
    confidenceLevel: string; demandScore: number | null;
    competitionScore: number | null; logisticsScore: number | null; rank: number;
  }>;
  marketInsights: string[];
  competitorSummary: Array<Record<string, unknown>>;
  financialHighlights: Record<string, unknown>;
  agentResults: Array<{
    id: number; companyId: number; agentName: string;
    resultType: string; data: Record<string, unknown>;
    summary: string | null; confidence: number | null; createdAt: string;
  }>;
}

interface CompanyContextValue {
  companies: CompanyProfile[];
  activeCompany: CompanyProfile | null;
  activeCompanyId: number | null;
  setActiveCompanyId: (id: number | null) => void;
  dashboardData: CompanyDashboardData | null;
  dashboardLoading: boolean;
  refetchCompanies: () => void;
  isLoading: boolean;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { data: companies = [], isLoading, refetch: refetchCompanies } = useListCompanies();
  const [activeCompanyId, setActiveCompanyId] = useState<number | null>(null);
  const [dashboardData, setDashboardData] = useState<CompanyDashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Auto-select first completed company
  useEffect(() => {
    const list = Array.isArray(companies) ? (companies as CompanyProfile[]) : [];
    if (!activeCompanyId && list.length > 0) {
      const completed = list.find((c: CompanyProfile) => c.analysisStatus === "completed");
      if (completed) {
        setActiveCompanyId(completed.id);
      } else {
        setActiveCompanyId(list[0].id);
      }
    }
  }, [companies, activeCompanyId]);

  // Fetch dashboard data when active company changes
  useEffect(() => {
    if (!activeCompanyId) {
      setDashboardData(null);
      return;
    }
    let cancelled = false;
    setDashboardLoading(true);
    fetch(`/api/companies/${activeCompanyId}/dashboard`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!cancelled) {
          setDashboardData(data);
          setDashboardLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDashboardData(null);
          setDashboardLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [activeCompanyId]);

  const list = Array.isArray(companies) ? (companies as CompanyProfile[]) : [];
  const activeCompany = list.find((c: CompanyProfile) => c.id === activeCompanyId) ?? null;

  const handleRefetch = useCallback(() => {
    refetchCompanies();
  }, [refetchCompanies]);

  return (
    <CompanyContext.Provider value={{
      companies: list,
      activeCompany,
      activeCompanyId,
      setActiveCompanyId,
      dashboardData,
      dashboardLoading,
      refetchCompanies: handleRefetch,
      isLoading,
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
}
