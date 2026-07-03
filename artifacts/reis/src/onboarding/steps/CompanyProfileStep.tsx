import React from "react";
import { useOnboardingStore } from "@/shared/stores/onboardingStore";
import { INDUSTRIES, BUSINESS_MODELS, INDIAN_STATES } from "@/shared/lib/mockData";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function CompanyProfileStep() {
  const { companyProfile, updateCompanyProfile } = useOnboardingStore();

  const handleStateToggle = (stateName: string) => {
    const currentList = companyProfile.currentStates || [];
    if (currentList.includes(stateName)) {
      updateCompanyProfile({ currentStates: currentList.filter(s => s !== stateName) });
    } else {
      updateCompanyProfile({ currentStates: [...currentList, stateName] });
    }
  };

  const handleTextChange = (field: string, value: any) => {
    updateCompanyProfile({ [field]: value });
  };

  const handleNumberChange = (field: string, val: string) => {
    const parsed = parseInt(val) || 0;
    updateCompanyProfile({ [field]: parsed });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground">Step 1 — Company Profile</h3>
        <p className="text-xs text-muted-foreground">Provide basic business details to initialize the operating system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1">
          <Label htmlFor="comp-name">Company Name *</Label>
          <Input
            id="comp-name"
            value={companyProfile.name || ""}
            onChange={(e) => handleTextChange("name", e.target.value)}
            placeholder="e.g. FreshMart India"
            className="rounded-xl"
          />
        </div>

        {/* Industry */}
        <div className="space-y-1">
          <Label htmlFor="comp-industry">Industry *</Label>
          <select
            id="comp-industry"
            value={companyProfile.industry}
            onChange={(e) => handleTextChange("industry", e.target.value)}
            className="w-full border border-input rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* Business Category */}
        <div className="space-y-1">
          <Label htmlFor="comp-cat">Business Category</Label>
          <Input
            id="comp-cat"
            value={companyProfile.businessCategory || ""}
            onChange={(e) => handleTextChange("businessCategory", e.target.value)}
            placeholder="e.g. Grocery & Fresh Produce"
            className="rounded-xl"
          />
        </div>

        {/* Website */}
        <div className="space-y-1">
          <Label htmlFor="comp-web">Website</Label>
          <Input
            id="comp-web"
            value={companyProfile.website || ""}
            onChange={(e) => handleTextChange("website", e.target.value)}
            placeholder="e.g. https://freshmart.in"
            className="rounded-xl"
          />
        </div>

        {/* HQ */}
        <div className="space-y-1">
          <Label htmlFor="comp-hq">Headquarters *</Label>
          <Input
            id="comp-hq"
            value={companyProfile.headquarters || ""}
            onChange={(e) => handleTextChange("headquarters", e.target.value)}
            placeholder="e.g. Mumbai, Maharashtra"
            className="rounded-xl"
          />
        </div>

        {/* Business Model */}
        <div className="space-y-1">
          <Label htmlFor="comp-model">Business Model</Label>
          <select
            id="comp-model"
            value={companyProfile.businessModel}
            onChange={(e) => handleTextChange("businessModel", e.target.value)}
            className="w-full border border-input rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {BUSINESS_MODELS.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        {/* Franchise / Owned */}
        <div className="space-y-1">
          <Label htmlFor="comp-fo">Operational Type</Label>
          <select
            id="comp-fo"
            value={companyProfile.franchiseOrOwned}
            onChange={(e) => handleTextChange("franchiseOrOwned", e.target.value)}
            className="w-full border border-input rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="Owned">Owned Outlets</option>
            <option value="Franchise">Franchise Outlets</option>
            <option value="Mixed">Mixed (Owned + Franchise)</option>
          </select>
        </div>

        {/* Brand Colors Picker (Simulated) */}
        <div className="space-y-1">
          <Label>Brand Identity Theme</Label>
          <div className="flex gap-2.5 items-center">
            <div className="flex flex-col items-center">
              <input
                type="color"
                value={companyProfile.brandColors?.primary || "#10B981"}
                onChange={(e) => updateCompanyProfile({
                  brandColors: { ...(companyProfile.brandColors || { primary: "#10B981", secondary: "#3B82F6", accent: "#F59E0B" }), primary: e.target.value }
                })}
                className="h-8 w-8 rounded-lg cursor-pointer border border-border"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5">Primary</span>
            </div>
            <div className="flex flex-col items-center">
              <input
                type="color"
                value={companyProfile.brandColors?.secondary || "#3B82F6"}
                onChange={(e) => updateCompanyProfile({
                  brandColors: { ...(companyProfile.brandColors || { primary: "#10B981", secondary: "#3B82F6", accent: "#F59E0B" }), secondary: e.target.value }
                })}
                className="h-8 w-8 rounded-lg cursor-pointer border border-border"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5">Secondary</span>
            </div>
            <div className="flex flex-col items-center">
              <input
                type="color"
                value={companyProfile.brandColors?.accent || "#F59E0B"}
                onChange={(e) => updateCompanyProfile({
                  brandColors: { ...(companyProfile.brandColors || { primary: "#10B981", secondary: "#3B82F6", accent: "#F59E0B" }), accent: e.target.value }
                })}
                className="h-8 w-8 rounded-lg cursor-pointer border border-border"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5">Accent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure Counts */}
      <div className="border-t border-border pt-4 mt-4">
        <Label className="text-sm font-bold text-foreground block mb-3">Infrastructure Counts</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <Label htmlFor="count-outlets" className="text-xs">Outlets</Label>
            <Input
              id="count-outlets"
              type="number"
              value={companyProfile.outletCount || 0}
              onChange={(e) => handleNumberChange("outletCount", e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="count-warehouses" className="text-xs">Warehouses</Label>
            <Input
              id="count-warehouses"
              type="number"
              value={companyProfile.warehouseCount || 0}
              onChange={(e) => handleNumberChange("warehouseCount", e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="count-manufacturing" className="text-xs">Mfg Units</Label>
            <Input
              id="count-manufacturing"
              type="number"
              value={companyProfile.manufacturingUnits || 0}
              onChange={(e) => handleNumberChange("manufacturingUnits", e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="count-dc" className="text-xs">Dist Centers</Label>
            <Input
              id="count-dc"
              type="number"
              value={companyProfile.distributionCenters || 0}
              onChange={(e) => handleNumberChange("distributionCenters", e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Current States Selection */}
      <div className="border-t border-border pt-4">
        <Label className="text-sm font-bold text-foreground block mb-2">Current States of Operation</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto custom-scrollbar p-1 border border-border rounded-xl bg-muted/20">
          {INDIAN_STATES.map((state) => (
            <div key={state} className="flex items-center gap-2 px-2 py-1">
              <Checkbox
                id={`state-${state}`}
                checked={(companyProfile.currentStates || []).includes(state)}
                onCheckedChange={() => handleStateToggle(state)}
              />
              <Label htmlFor={`state-${state}`} className="text-xs cursor-pointer select-none font-normal">
                {state}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
