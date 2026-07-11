import React from "react";
import { useLocation } from "wouter";
import { useOnboardingStore } from "@/shared/stores/onboardingStore";
import { useCompanyStore } from "@/shared/stores/companyStore";
import { useCreateCompany } from "@workspace/api-client-react";
import WizardProgress from "../components/WizardProgress";
import CompanyProfileStep from "../steps/CompanyProfileStep";
import ExpansionGoalsStep from "../steps/ExpansionGoalsStep";
import CompetitorsStep from "../steps/CompetitorsStep";
import DataUploadStep from "../steps/DataUploadStep";
import AIInitializationStep from "../steps/AIInitializationStep";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2, Zap } from "lucide-react";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    companyProfile,
    expansionGoals,
    competitors,
    dataUploads,
    aiStatus,
    reset
  } = useOnboardingStore();

  const { addCompany, setActiveCompany } = useCompanyStore();

  const { mutateAsync: createCompany } = useCreateCompany();
  const handleFinish = async () => {
    try {
      let calculatedScope = "India";
      if (expansionGoals.targetStates && expansionGoals.targetStates.length > 1) {
        calculatedScope = "Multiple States";
      } else if (expansionGoals.targetStates && expansionGoals.targetStates.length === 1) {
        calculatedScope = "Single State";
      } else if (expansionGoals.targetCities && expansionGoals.targetCities.length > 0) {
        calculatedScope = "City";
      }

      // 1. Create company in the real backend database
      const res = await createCompany({
        data: {
          name: companyProfile.name || "My Retail Company",
          industry: companyProfile.industry || "Supermarket",
          headquarters: companyProfile.headquarters || "Mumbai, Maharashtra",
          businessModel: companyProfile.businessModel || "Owned",
          currentStates: companyProfile.currentStates || [],
          products: companyProfile.productCategories || [],
          competitors: competitors.map(c => c.name) || [],
          expansionScope: calculatedScope,
          expansionGoal: expansionGoals.priorityMarkets && expansionGoals.priorityMarkets.length > 0
            ? `Expand footprint focusing on: ${expansionGoals.priorityMarkets.join(", ")}`
            : "National expansion and market penetration",
          timeline: expansionGoals.expansionTimeline || "3 Years",
          budget: expansionGoals.investmentBudget || "",
          expansionStates: expansionGoals.targetStates || [],
        }
      });

      // 2. Trigger the AI analysis asynchronously in the background
      fetch(`/api/companies/${res.id}/analyze`, { method: "POST" }).catch(console.error);

      // 3. Keep local UI state in sync (optional, for immediate UI feedback before refresh)
      setActiveCompany({ ...companyProfile, id: String(res.id) } as any);
      reset();

      // 4. Go to dashboard
      setLocation("/app");
    } catch (err) {
      console.error("Failed to create company:", err);
      alert("Failed to create company. Check the console.");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <CompanyProfileStep />;
      case 1:
        return <ExpansionGoalsStep />;
      case 2:
        return <CompetitorsStep />;
      case 3:
        return <DataUploadStep />;
      case 4:
        return <AIInitializationStep />;
      default:
        return null;
    }
  };

  const isStepValid = () => {
    if (currentStep === 0) {
      return !!companyProfile.name && !!companyProfile.headquarters;
    }
    if (currentStep === 4) {
      return aiStatus === "completed";
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-background text-foreground gradient-landing flex flex-col p-4 md:p-8">
      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col gap-6 justify-center">
        {/* Top brand header */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <Zap className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground tracking-tight">RetailIQ OS</div>
              <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Enterprise OS</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="rounded-xl cursor-pointer" onClick={() => setLocation("/companies")}>
            Exit Wizard
          </Button>
        </div>

        {/* Wizard Main Card */}
        <Card className="flex-1 flex flex-col bg-card/85 backdrop-blur-xl border border-border/80 shadow-2xl rounded-3xl overflow-hidden min-h-[500px]">
          <div className="p-6 border-b border-border/80 bg-muted/10">
            <WizardProgress currentStep={currentStep} totalSteps={totalSteps} />
          </div>
          <CardContent className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
            {renderStepContent()}
          </CardContent>

          {/* Footer action bar */}
          <div className="p-6 border-t border-border/80 flex items-center justify-between bg-muted/10">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0 || currentStep === totalSteps - 1}
              className="rounded-xl flex gap-1.5 items-center cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            {currentStep < totalSteps - 1 ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl px-5 flex gap-1.5 items-center cursor-pointer"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={!isStepValid()}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-95 text-white rounded-xl px-6 flex gap-1.5 items-center cursor-pointer shadow-md"
              >
                <CheckCircle2 className="h-4 w-4" /> Go to Dashboard
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
