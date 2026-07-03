import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Database } from "lucide-react";

export default function DataManagementTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tenant Dataset Hub</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-border/80 rounded-2xl p-4 bg-muted/10 space-y-3">
          <div className="flex gap-2 items-center text-xs font-bold text-foreground">
            <Database className="h-4.5 w-4.5 text-primary" /> Active Datasets
          </div>
          <p className="text-[11px] text-muted-foreground leading-normal">
            Modify or wipe stored outlet coordinates, sales historical files, or product catalogs.
          </p>
          <Button size="sm" variant="outline" className="rounded-xl cursor-pointer">Manage Data Profiles</Button>
        </div>

        <div className="border border-border/80 rounded-2xl p-4 bg-muted/10 space-y-3">
          <div className="flex gap-2 items-center text-xs font-bold text-foreground">
            <Upload className="h-4.5 w-4.5 text-primary" /> Bulk Import
          </div>
          <p className="text-[11px] text-muted-foreground leading-normal">
            Upload CSV or Excel sheets containing pricing, campaigns, or suppliers lists.
          </p>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl cursor-pointer shadow-sm">
            Launch Importer
          </Button>
        </div>
      </div>
    </div>
  );
}
