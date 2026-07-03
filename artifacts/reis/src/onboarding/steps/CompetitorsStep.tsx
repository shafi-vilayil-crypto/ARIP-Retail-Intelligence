import React, { useState } from "react";
import { useOnboardingStore } from "@/shared/stores/onboardingStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Users, Globe, MapPin } from "lucide-react";

export default function CompetitorsStep() {
  const { competitors, addCompetitor, removeCompetitor } = useOnboardingStore();
  const [compName, setCompName] = useState("");
  const [compScope, setCompScope] = useState<"national" | "regional" | "local">("national");

  const handleAdd = () => {
    const name = compName.trim();
    if (name) {
      addCompetitor(name, compScope);
      setCompName("");
    }
  };

  const getScopeIcon = (scope: string) => {
    if (scope === "national") return Globe;
    if (scope === "regional") return Users;
    return MapPin;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground">Step 3 — Competitors</h3>
        <p className="text-xs text-muted-foreground">List known competitor brands. AI will use this to trace direct and indirect overlap metrics.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
        <Label className="text-sm font-bold">Add Competitor Brand</Label>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={compName}
            onChange={(e) => setCompName(e.target.value)}
            placeholder="Competitor Name (e.g. DMart, Milma, Blue Tokai)"
            className="rounded-xl flex-1"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
          />
          <div className="flex gap-2">
            <select
              value={compScope}
              onChange={(e: any) => setCompScope(e.target.value)}
              className="border border-input rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="national">National</option>
              <option value="regional">Regional</option>
              <option value="local">Local</option>
            </select>
            <Button onClick={handleAdd} className="rounded-xl cursor-pointer">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>

      {/* Competitors List by Scope */}
      <div className="space-y-4">
        {["national", "regional", "local"].map((scope) => {
          const list = competitors.filter((c) => c.scope === scope);
          return (
            <div key={scope} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {scope} Competitors
                </span>
                <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">
                  {list.length}
                </span>
              </div>

              {list.length === 0 ? (
                <div className="text-xs text-muted-foreground italic border border-dashed border-border p-4 rounded-xl text-center bg-muted/5">
                  No {scope} competitors listed yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {list.map((c) => {
                    const Icon = getScopeIcon(c.scope);
                    return (
                      <div
                        key={c.name}
                        className="flex items-center justify-between p-3.5 border border-border rounded-xl bg-card hover:bg-muted/30 transition-colors shadow-sm"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <span className="text-sm font-semibold text-foreground truncate">{c.name}</span>
                        </div>
                        <button
                          onClick={() => removeCompetitor(c.name)}
                          className="p-1 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
