import React, { useState } from "react";
import { useOnboardingStore } from "@/shared/stores/onboardingStore";
import { INDIAN_STATES, TIMELINES, OUTLET_SIZES, CUSTOMER_SEGMENTS } from "@/shared/lib/mockData";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export default function ExpansionGoalsStep() {
  const { expansionGoals, updateExpansionGoals } = useOnboardingStore();
  const [cityInput, setCityInput] = useState("");
  const [marketInput, setMarketInput] = useState("");

  const handleStateToggle = (stateName: string) => {
    const currentList = expansionGoals.targetStates || [];
    if (currentList.includes(stateName)) {
      updateExpansionGoals({ targetStates: currentList.filter(s => s !== stateName) });
    } else {
      updateExpansionGoals({ targetStates: [...currentList, stateName] });
    }
  };

  const handleAddCity = () => {
    const val = cityInput.trim();
    if (val && !(expansionGoals.targetCities || []).includes(val)) {
      updateExpansionGoals({ targetCities: [...(expansionGoals.targetCities || []), val] });
      setCityInput("");
    }
  };

  const handleRemoveCity = (val: string) => {
    updateExpansionGoals({ targetCities: (expansionGoals.targetCities || []).filter(c => c !== val) });
  };

  const handleAddPriorityMarket = () => {
    const val = marketInput.trim();
    if (val && !(expansionGoals.priorityMarkets || []).includes(val)) {
      updateExpansionGoals({ priorityMarkets: [...(expansionGoals.priorityMarkets || []), val] });
      setMarketInput("");
    }
  };

  const handleRemovePriorityMarket = (val: string) => {
    updateExpansionGoals({ priorityMarkets: (expansionGoals.priorityMarkets || []).filter(m => m !== val) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground">Step 2 — Expansion Goals</h3>
        <p className="text-xs text-muted-foreground">Define your target markets, timeline, and investment profile for AI modeling.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Expansion Timeline */}
        <div className="space-y-1">
          <Label htmlFor="exp-timeline">Expansion Timeline</Label>
          <select
            id="exp-timeline"
            value={expansionGoals.expansionTimeline}
            onChange={(e) => updateExpansionGoals({ expansionTimeline: e.target.value })}
            className="w-full border border-input rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {TIMELINES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Investment Budget */}
        <div className="space-y-1">
          <Label htmlFor="exp-budget">Investment Budget</Label>
          <Input
            id="exp-budget"
            value={expansionGoals.investmentBudget || ""}
            onChange={(e) => updateExpansionGoals({ investmentBudget: e.target.value })}
            placeholder="e.g. ₹50 Crore"
            className="rounded-xl"
          />
        </div>

        {/* Preferred Outlet Size */}
        <div className="space-y-1">
          <Label htmlFor="exp-size">Preferred Outlet Size</Label>
          <select
            id="exp-size"
            value={expansionGoals.preferredOutletSize}
            onChange={(e) => updateExpansionGoals({ preferredOutletSize: e.target.value })}
            className="w-full border border-input rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">Select outlet size...</option>
            {OUTLET_SIZES.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* Preferred Customer Segment */}
        <div className="space-y-1">
          <Label htmlFor="exp-segment">Preferred Customer Segment</Label>
          <select
            id="exp-segment"
            value={expansionGoals.preferredCustomerSegment}
            onChange={(e) => updateExpansionGoals({ preferredCustomerSegment: e.target.value })}
            className="w-full border border-input rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">Select customer segment...</option>
            {CUSTOMER_SEGMENTS.map((seg) => (
              <option key={seg} value={seg}>{seg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Target States */}
      <div className="border-t border-border pt-4">
        <Label className="text-sm font-bold text-foreground block mb-2">Target States for Expansion</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto custom-scrollbar p-1 border border-border rounded-xl bg-muted/20">
          {INDIAN_STATES.map((state) => (
            <div key={state} className="flex items-center gap-2 px-2 py-1">
              <Checkbox
                id={`target-state-${state}`}
                checked={(expansionGoals.targetStates || []).includes(state)}
                onCheckedChange={() => handleStateToggle(state)}
              />
              <Label htmlFor={`target-state-${state}`} className="text-xs cursor-pointer select-none font-normal">
                {state}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Target Cities */}
      <div className="border-t border-border pt-4">
        <Label className="text-sm font-bold text-foreground block mb-1">Target Cities</Label>
        <p className="text-xs text-muted-foreground mb-3">Add cities where you are looking to open new outlets.</p>
        <div className="flex gap-2 mb-3">
          <Input
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Type a city name (e.g. Pune, Jaipur)"
            className="rounded-xl flex-1"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCity())}
          />
          <Button onClick={handleAddCity} className="rounded-xl px-4 flex gap-1 cursor-pointer">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
        {(expansionGoals.targetCities || []).length > 0 && (
          <div className="flex flex-wrap gap-2 p-2.5 border border-border rounded-xl bg-muted/20">
            {expansionGoals.targetCities?.map((city) => (
              <span
                key={city}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold"
              >
                {city}
                <button onClick={() => handleRemoveCity(city)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Priority Markets */}
      <div className="border-t border-border pt-4">
        <Label className="text-sm font-bold text-foreground block mb-1">Priority Markets & Catchment Areas</Label>
        <p className="text-xs text-muted-foreground mb-3">Add custom market clusters or priority specifications.</p>
        <div className="flex gap-2 mb-3">
          <Input
            value={marketInput}
            onChange={(e) => setMarketInput(e.target.value)}
            placeholder="e.g. High Footfall Tech Parks, Mall Food Courts"
            className="rounded-xl flex-1"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPriorityMarket())}
          />
          <Button onClick={handleAddPriorityMarket} className="rounded-xl px-4 flex gap-1 cursor-pointer">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
        {(expansionGoals.priorityMarkets || []).length > 0 && (
          <div className="flex flex-wrap gap-2 p-2.5 border border-border rounded-xl bg-muted/20">
            {expansionGoals.priorityMarkets?.map((market) => (
              <span
                key={market}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent-foreground rounded-full text-xs font-semibold"
              >
                {market}
                <button onClick={() => handleRemovePriorityMarket(market)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
