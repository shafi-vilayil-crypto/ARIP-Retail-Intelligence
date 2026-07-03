import React from "react";
import { useCompanyStore } from "@/shared/stores/companyStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

export default function CompetitorsTab() {
  const { competitors } = useCompanyStore();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rivals Monitor Fleet</Label>
        <Button size="sm" className="rounded-xl flex gap-1 cursor-pointer">
          <Plus className="h-3.5 w-3.5" /> Add Competitor
        </Button>
      </div>

      <div className="space-y-2">
        {competitors.map((comp) => (
          <div key={comp.id} className="flex justify-between items-center p-3 border border-border/80 rounded-2xl bg-muted/10">
            <div>
              <span className="text-xs font-bold text-foreground block">{comp.name}</span>
              <span className="text-[10px] text-muted-foreground">{comp.scope} scope</span>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
