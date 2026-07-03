import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCompanyStore } from "@/shared/stores/companyStore";
import { useAuthStore } from "@/shared/stores/authStore";
import PlatformSidebar from "./PlatformSidebar";
import PlatformTopBar from "./PlatformTopBar";
import { Loader2 } from "lucide-react";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const { activeCompany, loadCompanies, isLoading } = useCompanyStore();
  const { isAuthenticated } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }
    loadCompanies();
  }, [isAuthenticated, loadCompanies]);

  useEffect(() => {
    // If onboarding is incomplete, redirect there
    if (activeCompany && !activeCompany.onboardingCompleted) {
      setLocation("/onboarding");
    }
  }, [activeCompany]);

  const toggleDark = () => {
    setDark((d) => {
      document.documentElement.classList.toggle("dark", !d);
      return !d;
    });
  };

  if (isLoading || !activeCompany) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-3">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="text-sm text-muted-foreground font-semibold">Initializing RetailIQ OS...</span>
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden bg-background text-foreground ${dark ? "dark" : ""}`}>
      <PlatformSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        dark={dark}
        toggleDark={toggleDark}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <PlatformTopBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-7xl mx-auto page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
