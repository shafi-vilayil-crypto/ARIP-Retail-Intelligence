import React from "react";
import { useCompanyStore } from "@/shared/stores/companyStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BusinessTab() {
  const { activeCompany, updateCompany } = useCompanyStore();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="b-outlets">Outlet count</Label>
          <Input
            id="b-outlets"
            type="number"
            value={activeCompany?.outletCount || 0}
            onChange={(e) => updateCompany({ outletCount: parseInt(e.target.value) || 0 })}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="b-warehouses">Warehouses</Label>
          <Input
            id="b-warehouses"
            type="number"
            value={activeCompany?.warehouseCount || 0}
            onChange={(e) => updateCompany({ warehouseCount: parseInt(e.target.value) || 0 })}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="b-mfg">Manufacturing Units</Label>
          <Input
            id="b-mfg"
            type="number"
            value={activeCompany?.manufacturingUnits || 0}
            onChange={(e) => updateCompany({ manufacturingUnits: parseInt(e.target.value) || 0 })}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="b-dc">Distribution Centers</Label>
          <Input
            id="b-dc"
            type="number"
            value={activeCompany?.distributionCenters || 0}
            onChange={(e) => updateCompany({ distributionCenters: parseInt(e.target.value) || 0 })}
            className="rounded-xl"
          />
        </div>
      </div>
      <Button className="bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl cursor-pointer">
        Save Infrastructure Configuration
      </Button>
    </div>
  );
}
