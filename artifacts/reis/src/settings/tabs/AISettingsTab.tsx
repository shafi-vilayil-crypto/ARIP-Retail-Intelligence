import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AISettingsTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="ai-model">Primary Intelligence Model</Label>
          <select id="ai-model" className="w-full border border-input rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>Gemini 2.5 Flash (Recommended)</option>
            <option>Gemini 2.5 Pro</option>
            <option>Claude 3.5 Sonnet</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="ai-conf">Confidence Threshold (%)</Label>
          <select id="ai-conf" className="w-full border border-input rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>85% (High Accuracy)</option>
            <option>80% (Moderate Accuracy)</option>
            <option>70% (Exploratory)</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="ai-freq">Live Crawl Research Frequency</Label>
          <select id="ai-freq" className="w-full border border-input rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>Weekly Scan (Scheduled)</option>
            <option>Daily Scrapes</option>
            <option>On Demand Only</option>
          </select>
        </div>
      </div>
      <Button className="bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl cursor-pointer">
        Save AI Model Policies
      </Button>
    </div>
  );
}
