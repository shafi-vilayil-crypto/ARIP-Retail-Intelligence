import React, { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useCompanyStore } from "@/shared/stores/companyStore";
import { Building2, Plus, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CompanySelectPage() {
  const [, setLocation] = useLocation();
  const { companies, loadCompanies, activeCompany, setActiveCompany, isLoading } = useCompanyStore();

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const handleSelect = (company: any) => {
    setActiveCompany(company);
    if (!company.onboardingCompleted) {
      setLocation("/onboarding");
    } else {
      setLocation("/app");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background gradient-landing">
      <Card className="w-full max-w-2xl bg-card/85 backdrop-blur-xl border border-border/80 shadow-2xl rounded-3xl p-6">
        <CardHeader className="flex flex-col items-center text-center pb-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Select Company Profile</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Choose a retail brand dashboard to access or initialize a new company profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Loading brand profiles...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {companies.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => handleSelect(comp)}
                  className="flex flex-col justify-between p-5 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 cursor-pointer shadow-sm hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: comp.brandColors?.primary || "#3B82F6" }}
                      >
                        {comp.name.charAt(0)}
                      </div>
                      <span className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {comp.name}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-4">
                      {comp.industry} · {comp.headquarters}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                        comp.onboardingCompleted
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {comp.onboardingCompleted ? "Active" : "Setup Required"}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}

              {/* Add New Brand Card */}
              <Link href="/onboarding">
                <div className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer text-center group h-full min-h-[140px] transition-all">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-foreground">Add New Company</span>
                  <span className="text-xs text-muted-foreground mt-1">Start guided onboarding</span>
                </div>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
