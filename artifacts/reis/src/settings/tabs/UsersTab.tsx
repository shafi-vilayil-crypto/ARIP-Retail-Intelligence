import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function UsersTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Team Members</Label>
        <Button size="sm" className="rounded-xl flex gap-1 cursor-pointer">
          <Plus className="h-3.5 w-3.5" /> Invite User
        </Button>
      </div>

      <div className="space-y-2">
        {[
          { name: "Shafi Vilayil", email: "admin@retailiq.com", role: "Owner" },
          { name: "John Doe", email: "john@retailiq.com", role: "Analyst" }
        ].map((teamUser, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 border border-border/80 rounded-2xl bg-muted/10">
            <div>
              <span className="text-xs font-bold text-foreground block">{teamUser.name}</span>
              <span className="text-[10px] text-muted-foreground">{teamUser.email}</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase">
              {teamUser.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
