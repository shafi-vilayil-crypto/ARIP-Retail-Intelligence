import React from "react";
import { Building2, Globe, Users, Upload, Sparkles, CheckCircle2 } from "lucide-react";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

const STEPS = [
  { label: "Company Profile", icon: Building2, desc: "Brand profile & outlets" },
  { label: "Expansion Goals", icon: Globe, desc: "Target areas & budgets" },
  { label: "Competitors", icon: Users, desc: "National & local rivals" },
  { label: "Existing Data", icon: Upload, desc: "Import datasets (optional)" },
  { label: "AI Initialization", icon: Sparkles, desc: "Launch auto agent pipeline" },
];

export default function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  const progressPct = Math.round((currentStep / (totalSteps - 1)) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Guided Onboarding</h2>
          <p className="text-xs text-muted-foreground">Setup your brand profile in minutes</p>
        </div>
        <span className="text-sm font-semibold text-primary">{progressPct}% Complete</span>
      </div>

      <div className="relative">
        {/* Track Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 z-0 rounded-full" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-300 rounded-full"
          style={{ width: `${progressPct}%` }}
        />

        {/* Step Nodes */}
        <div className="relative flex justify-between z-10">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;

            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : isActive
                      ? "bg-primary border-primary text-primary-foreground shadow-md glow-blue scale-110"
                      : "bg-card border-border text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span
                  className={`hidden md:block text-xs font-semibold mt-2 ${
                    isActive ? "text-primary" : isCompleted ? "text-emerald-500" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
                <span className="hidden md:block text-[10px] text-muted-foreground">{s.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
